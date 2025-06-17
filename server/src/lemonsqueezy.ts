import express, { Request, Response } from 'express';
import { lemonSqueezySetup, createCheckout, getSubscription, updateSubscription, cancelSubscription } from '@lemonsqueezy/lemonsqueezy.js';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const router = express.Router();

// Initialize LemonSqueezy
const LEMONSQUEEZY_API_KEY = process.env.LEMONSQUEEZY_API_KEY;
const LEMONSQUEEZY_STORE_ID = process.env.LEMONSQUEEZY_STORE_ID;
const LEMONSQUEEZY_WEBHOOK_SECRET = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;

if (LEMONSQUEEZY_API_KEY) {
  lemonSqueezySetup({
    apiKey: LEMONSQUEEZY_API_KEY,
    onError: (error) => {
      console.error('LemonSqueezy Setup Error:', error);
    },
  });
}

// Initialize Supabase with service role key
let supabase: any = null;
if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
  supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
} else {
  console.warn('Supabase environment variables not configured');
}

// Middleware to verify LemonSqueezy webhook signature
const verifyWebhookSignature = (req: Request, res: Response, next: any) => {
  if (!LEMONSQUEEZY_WEBHOOK_SECRET) {
    console.warn('Webhook secret not configured, skipping signature verification');
    return next();
  }

  const signature = req.headers['x-signature'] as string;
  if (!signature) {
    return res.status(401).json({ error: 'Missing signature header' });
  }

  const hmac = crypto.createHmac('sha256', LEMONSQUEEZY_WEBHOOK_SECRET);
  hmac.update(req.body, 'utf8');
  const computedSignature = hmac.digest('hex');

  if (signature !== computedSignature) {
    console.error('Invalid webhook signature');
    return res.status(401).json({ error: 'Invalid signature' });
  }

  next();
};

// POST /api/lemonsqueezy/checkout - Create a checkout session
router.post('/checkout', async (req: Request, res: Response) => {
  try {
    const { variantId, userId, userEmail, userName, successUrl, cancelUrl } = req.body;

    if (!variantId || !userId || !userEmail) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    console.log('Creating checkout for:', { variantId, userId, userEmail });

    const checkout = await createCheckout(LEMONSQUEEZY_STORE_ID!, variantId, {
      productOptions: {
        name: 'PeakForge Subscription',
        description: 'Premium wellness program access',
      },
      checkoutOptions: {
        embed: false,
        media: false,
        logo: true,
      },
      checkoutData: {
        email: userEmail,
        name: userName,
        custom: {
          user_id: userId,
        },
      },
      expiresAt: null,
      preview: false,
      testMode: process.env.NODE_ENV === 'development',
    });

    if ((checkout as any).error) {
      console.error('Checkout creation error:', (checkout as any).error);
      return res.status(400).json({ error: (checkout as any).error.message || 'Failed to create checkout' });
    }

    console.log('Checkout created successfully:', (checkout as any).data.id);

    res.json({
      checkoutUrl: (checkout as any).data.attributes.url,
      checkoutId: (checkout as any).data.id,
    });
  } catch (error) {
    console.error('Checkout endpoint error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/lemonsqueezy/subscription/:userId - Get user's subscription status
router.get('/subscription/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    if (!supabase) {
      return res.status(500).json({ error: 'Database not configured' });
    }

    // Get subscription from Supabase
    const { data: subscription, error } = await supabase
      .from('user_subscriptions')
      .select(`
        *,
        subscription_plans (
          name,
          price,
          interval
        )
      `)
      .eq('user_id', userId)
      .eq('status', 'active')
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Database error:', error);
      return res.status(500).json({ error: 'Database error' });
    }

    if (!subscription) {
      return res.status(404).json({ error: 'No active subscription found' });
    }

    res.json({ subscription });
  } catch (error) {
    console.error('Subscription status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/lemonsqueezy/subscription/:subscriptionId/cancel - Cancel a subscription
router.post('/subscription/:subscriptionId/cancel', async (req: Request, res: Response) => {
  try {
    const { subscriptionId } = req.params;

    // Cancel subscription in LemonSqueezy
    const result = await cancelSubscription(subscriptionId);

    if ((result as any).error) {
      console.error('Subscription cancellation error:', (result as any).error);
      return res.status(400).json({ error: (result as any).error.message || 'Failed to cancel subscription' });
    }

    // Update subscription status in Supabase
    const { error: updateError } = await supabase
      .from('user_subscriptions')
      .update({
        status: 'canceled',
        cancel_at_period_end: true,
        updated_at: new Date().toISOString(),
      })
      .eq('stripe_subscription_id', subscriptionId);

    if (updateError) {
      console.error('Database update error:', updateError);
      // Don't fail the request if DB update fails, as LemonSqueezy cancellation succeeded
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/lemonsqueezy/webhooks - Handle LemonSqueezy webhooks
router.post('/webhooks', express.raw({ type: 'application/json' }), verifyWebhookSignature, async (req: Request, res: Response) => {
  try {
    const payload = JSON.parse(req.body.toString());
    const { event_name, data } = payload;

    console.log('Received webhook:', event_name, data.id);

    switch (event_name) {
      case 'subscription_created':
        await handleSubscriptionCreated(data);
        break;
      case 'subscription_updated':
        await handleSubscriptionUpdated(data);
        break;
      case 'subscription_cancelled':
        await handleSubscriptionCancelled(data);
        break;
      case 'subscription_resumed':
        await handleSubscriptionResumed(data);
        break;
      case 'subscription_expired':
        await handleSubscriptionExpired(data);
        break;
      case 'subscription_paused':
        await handleSubscriptionPaused(data);
        break;
      case 'subscription_unpaused':
        await handleSubscriptionUnpaused(data);
        break;
      default:
        console.log('Unhandled webhook event:', event_name);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// Webhook handler functions
async function handleSubscriptionCreated(data: any) {
  try {
    const userId = data.attributes.custom_data?.user_id;
    if (!userId) {
      console.error('No user_id in subscription created webhook');
      return;
    }

    // Get plan details from Supabase
    const { data: plan, error: planError } = await supabase
      .from('subscription_plans')
      .select('id, name')
      .eq('name', 'Basic') // Default to Basic plan, you might want to map this differently
      .single();

    if (planError || !plan) {
      console.error('Failed to find subscription plan:', planError);
      return;
    }

    // Create subscription record
    const { error } = await supabase
      .from('user_subscriptions')
      .insert({
        user_id: userId,
        plan_id: plan.id,
        status: data.attributes.status,
        stripe_subscription_id: data.id,
        stripe_customer_id: data.attributes.customer_id,
        current_period_start: new Date(data.attributes.current_period_start),
        current_period_end: new Date(data.attributes.current_period_end),
        cancel_at_period_end: false,
      });

    if (error) {
      console.error('Failed to create subscription record:', error);
    } else {
      console.log('Subscription created for user:', userId);
    }
  } catch (error) {
    console.error('Error handling subscription created:', error);
  }
}

async function handleSubscriptionUpdated(data: any) {
  try {
    const { error } = await supabase
      .from('user_subscriptions')
      .update({
        status: data.attributes.status,
        current_period_start: new Date(data.attributes.current_period_start),
        current_period_end: new Date(data.attributes.current_period_end),
        cancel_at_period_end: data.attributes.cancelled,
        updated_at: new Date().toISOString(),
      })
      .eq('stripe_subscription_id', data.id);

    if (error) {
      console.error('Failed to update subscription:', error);
    } else {
      console.log('Subscription updated:', data.id);
    }
  } catch (error) {
    console.error('Error handling subscription updated:', error);
  }
}

async function handleSubscriptionCancelled(data: any) {
  try {
    const { error } = await supabase
      .from('user_subscriptions')
      .update({
        status: 'canceled',
        cancel_at_period_end: true,
        updated_at: new Date().toISOString(),
      })
      .eq('stripe_subscription_id', data.id);

    if (error) {
      console.error('Failed to cancel subscription:', error);
    } else {
      console.log('Subscription cancelled:', data.id);
    }
  } catch (error) {
    console.error('Error handling subscription cancelled:', error);
  }
}

async function handleSubscriptionResumed(data: any) {
  try {
    const { error } = await supabase
      .from('user_subscriptions')
      .update({
        status: 'active',
        cancel_at_period_end: false,
        updated_at: new Date().toISOString(),
      })
      .eq('stripe_subscription_id', data.id);

    if (error) {
      console.error('Failed to resume subscription:', error);
    } else {
      console.log('Subscription resumed:', data.id);
    }
  } catch (error) {
    console.error('Error handling subscription resumed:', error);
  }
}

async function handleSubscriptionExpired(data: any) {
  try {
    const { error } = await supabase
      .from('user_subscriptions')
      .update({
        status: 'expired',
        updated_at: new Date().toISOString(),
      })
      .eq('stripe_subscription_id', data.id);

    if (error) {
      console.error('Failed to expire subscription:', error);
    } else {
      console.log('Subscription expired:', data.id);
    }
  } catch (error) {
    console.error('Error handling subscription expired:', error);
  }
}

async function handleSubscriptionPaused(data: any) {
  try {
    const { error } = await supabase
      .from('user_subscriptions')
      .update({
        status: 'paused',
        updated_at: new Date().toISOString(),
      })
      .eq('stripe_subscription_id', data.id);

    if (error) {
      console.error('Failed to pause subscription:', error);
    } else {
      console.log('Subscription paused:', data.id);
    }
  } catch (error) {
    console.error('Error handling subscription paused:', error);
  }
}

async function handleSubscriptionUnpaused(data: any) {
  try {
    const { error } = await supabase
      .from('user_subscriptions')
      .update({
        status: 'active',
        updated_at: new Date().toISOString(),
      })
      .eq('stripe_subscription_id', data.id);

    if (error) {
      console.error('Failed to unpause subscription:', error);
    } else {
      console.log('Subscription unpaused:', data.id);
    }
  } catch (error) {
    console.error('Error handling subscription unpaused:', error);
  }
}

export { router as lemonsqueezyRouter }; 