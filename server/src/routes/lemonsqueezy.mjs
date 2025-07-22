import express from 'express';
import { lemonSqueezySetup, createCheckout, getSubscription, updateSubscription, cancelSubscription } from '@lemonsqueezy/lemonsqueezy.js';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const router = express.Router();

// Initialize LemonSqueezy
const LEMONSQUEEZY_API_KEY = process.env.LEMONSQUEEZY_API_KEY;
const LEMONSQUEEZY_STORE_ID = process.env.LEMONSQUEEZY_STORE_ID;
const LEMONSQUEEZY_WEBHOOK_SECRET = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;

// Debug logging
console.log('🍋 LemonSqueezy Configuration:');
console.log('  Store ID:', LEMONSQUEEZY_STORE_ID);
console.log('  Has API Key:', !!LEMONSQUEEZY_API_KEY);
console.log('  API Key prefix:', LEMONSQUEEZY_API_KEY?.substring(0, 20));

if (LEMONSQUEEZY_API_KEY) {
  console.log('🍋 Setting up LemonSqueezy...');
  lemonSqueezySetup({
    apiKey: LEMONSQUEEZY_API_KEY,
    onError: (error) => {
      console.error('LemonSqueezy Setup Error:', error);
    },
  });
  console.log('🍋 LemonSqueezy setup complete');
} else {
  console.error('❌ LemonSqueezy API key not found!');
}

// Initialize Supabase with service role key
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Middleware to verify LemonSqueezy webhook signature
const verifyWebhookSignature = (req, res, next) => {
  if (!LEMONSQUEEZY_WEBHOOK_SECRET) {
    console.warn('⚠️ Webhook secret not configured, skipping signature verification');
    return next();
  }

  const signature = req.headers['x-signature'];
  if (!signature) {
    console.error('❌ Missing X-Signature header');
    return res.status(401).json({ error: 'Missing signature header' });
  }

  // Follow LemonSqueezy documentation exactly
  const secret = LEMONSQUEEZY_WEBHOOK_SECRET;
  const rawBody = req.body.toString('utf8');
  const hmac = crypto.createHmac('sha256', secret);
  const hexDigest = hmac.update(rawBody).digest('hex');
  const digest = Buffer.from(hexDigest, 'utf8');
  const signatureBuffer = Buffer.from(signature, 'utf8');

  if (!crypto.timingSafeEqual(digest, signatureBuffer)) {
    console.error('❌ Invalid signature');
    console.error('  Expected:', hexDigest);
    console.error('  Received:', signature);
    return res.status(401).json({ error: 'Invalid signature' });
  }

  console.log('✅ Webhook signature verified');
  next();
};

// POST /api/lemonsqueezy/checkout - Create a checkout session
router.post('/checkout', async (req, res) => {
  try {
    const { variantId, userId, userEmail, userName, successUrl, cancelUrl } = req.body;

    console.log('🛒 Checkout request received:');
    console.log('  Variant ID:', variantId);
    console.log('  User ID:', userId);
    console.log('  User Email:', userEmail);
    console.log('  Store ID for checkout:', LEMONSQUEEZY_STORE_ID);

    if (!variantId || !userId || !userEmail) {
      console.error('❌ Missing required fields:', { variantId: !!variantId, userId: !!userId, userEmail: !!userEmail });
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!LEMONSQUEEZY_STORE_ID) {
      console.error('❌ LEMONSQUEEZY_STORE_ID not configured');
      return res.status(500).json({ error: 'Store ID not configured' });
    }

    if (!LEMONSQUEEZY_API_KEY) {
      console.error('❌ LEMONSQUEEZY_API_KEY not configured');
      return res.status(500).json({ error: 'API Key not configured' });
    }

    console.log('🍋 Creating LemonSqueezy checkout...');

    // Prepare redirect URLs
    const baseUrl = process.env.VITE_APP_URL || 'https://peakforge.club';
    const redirectSuccessUrl = successUrl || `${baseUrl}/subscription/success`;
    const redirectCancelUrl = cancelUrl || `${baseUrl}/subscription/cancel`;

    console.log('🔗 Redirect URLs:', { success: redirectSuccessUrl, cancel: redirectCancelUrl });

    const checkout = await createCheckout(LEMONSQUEEZY_STORE_ID, variantId, {
      productOptions: {
        name: 'PeakForge Pro Subscription',
        description: 'Premium wellness program with all features unlocked',
      },
      checkoutOptions: {
        embed: false,
        media: false,
        logo: true,
        dark: true,
      },
      checkoutData: {
        email: userEmail,
        name: userName || 'PeakForge User',
        custom: {
          user_id: userId,
          redirect_url: redirectSuccessUrl,
        },
      },
      redirectUrl: redirectSuccessUrl,
      expiresAt: null,
      preview: false,
      testMode: process.env.NODE_ENV === 'development',
    });

    console.log('🍋 LemonSqueezy response:', checkout);

    if (checkout.error) {
      console.error('❌ Checkout creation error:', checkout.error);
      return res.status(400).json({ error: checkout.error.message || 'Failed to create checkout' });
    }

    console.log('✅ Checkout created successfully:', checkout.data?.data?.id);

    res.json({
      checkoutUrl: checkout.data?.data?.attributes?.url,
      checkoutId: checkout.data?.data?.id,
    });
  } catch (error) {
    console.error('❌ Checkout endpoint error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ error: 'Internal server error: ' + error.message });
  }
});

// GET /api/lemonsqueezy/subscription/:userId - Get user's subscription status
router.get('/subscription/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

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
router.post('/subscription/:subscriptionId/cancel', async (req, res) => {
  try {
    const { subscriptionId } = req.params;

    // Cancel subscription in LemonSqueezy
    const result = await cancelSubscription(subscriptionId);

    if (result.error) {
      console.error('Subscription cancellation error:', result.error);
      return res.status(400).json({ error: result.error.message || 'Failed to cancel subscription' });
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
router.post('/webhooks', verifyWebhookSignature, async (req, res) => {
  try {
    // Parse JSON from raw body since we're using express.raw() for this endpoint
    let payload;
    if (Buffer.isBuffer(req.body)) {
      payload = JSON.parse(req.body.toString('utf8'));
    } else {
      payload = req.body;
    }
    
    console.log('🔔 Raw webhook payload received:');
    console.log(JSON.stringify(payload, null, 2));
    
    // LemonSqueezy webhook structure: { meta: { event_name }, data: { ... } }
    const eventName = payload.meta?.event_name;
    const eventData = payload.data;

    console.log('🔔 Extracted event:', eventName, 'data ID:', eventData?.id);

    if (!eventName) {
      console.error('❌ No event_name found in webhook payload');
      console.log('Available keys:', Object.keys(payload));
      console.log('Meta keys:', payload.meta ? Object.keys(payload.meta) : 'No meta object');
      return res.status(400).json({ error: 'Invalid webhook payload - missing event_name' });
    }

    if (!eventData) {
      console.error('❌ No data found in webhook payload');
      return res.status(400).json({ error: 'Invalid webhook payload - missing data' });
    }

    switch (eventName) {
      case 'subscription_created':
        await handleSubscriptionCreated(eventData);
        break;
      case 'subscription_updated':
        await handleSubscriptionUpdated(eventData);
        break;
      case 'subscription_cancelled':
        await handleSubscriptionCancelled(eventData);
        break;
      case 'subscription_resumed':
        await handleSubscriptionResumed(eventData);
        break;
      case 'subscription_expired':
        await handleSubscriptionExpired(eventData);
        break;
      case 'subscription_paused':
        await handleSubscriptionPaused(eventData);
        break;
      case 'subscription_unpaused':
        await handleSubscriptionUnpaused(eventData);
        break;
      default:
        console.log('❓ Unhandled webhook event:', eventName);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('❌ Webhook processing error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// Webhook handler functions
async function handleSubscriptionCreated(data) {
  try {
    console.log('🔍 Processing subscription_created webhook...');
    console.log('  Data received:', JSON.stringify(data, null, 2));
    
    // LemonSqueezy structure: data.attributes contains subscription info
    const attributes = data.attributes;
    const userEmail = attributes.user_email;
    const variantId = attributes.variant_id?.toString();
    
    if (!userEmail) {
      console.error('❌ No user_email in subscription created webhook');
      return;
    }

    console.log('✅ User email found:', userEmail);
    console.log('🔍 Variant ID:', variantId);

    // Find user by email in our database (case-insensitive)
    console.log('🔍 Looking up user by email:', userEmail);
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .ilike('email', userEmail) // Case-insensitive email lookup
      .single();

    if (userError || !user) {
      console.error('❌ Failed to find user with email:', userEmail, userError);
      return;
    }

    const userId = user.id;
    console.log('✅ User found with ID:', userId);

    // Map variant ID to plan name
    let planName = 'Basic'; // Default fallback
    
          if (variantId === '585431') { // $4.99/month Pro plan variant ID
      planName = 'Pro';
    }

    console.log('🔍 Mapping variant ID', variantId, 'to plan:', planName);

    // Get plan details from Supabase
    console.log('🔍 Looking for plan:', planName);
    const { data: plan, error: planError } = await supabase
      .from('subscription_plans')
      .select('id, name')
      .eq('name', planName)
      .single();

    if (planError) {
      console.error('❌ Failed to find subscription plan:', planError);
      // Let's see what plans exist
      const { data: allPlans, error: allPlansError } = await supabase
        .from('subscription_plans')
        .select('id, name');
      
      if (!allPlansError) {
        console.log('📋 Available plans:', allPlans);
      }
      return;
    }

    if (!plan) {
      console.error('❌ No plan found with name:', planName);
      return;
    }

    console.log('✅ Plan found:', plan);

    // Create subscription record
    console.log('💾 Creating subscription record...');
    const subscriptionData = {
      user_id: userId,
      plan_id: plan.id,
      status: attributes.status,
      stripe_subscription_id: data.id,
      stripe_customer_id: attributes.customer_id?.toString(),
      current_period_start: new Date(attributes.renews_at || attributes.created_at),
      current_period_end: new Date(attributes.ends_at || attributes.renews_at),
      cancel_at_period_end: attributes.cancelled || false,
    };
    
    console.log('📋 Subscription data:', subscriptionData);
    
    const { error } = await supabase
      .from('user_subscriptions')
      .insert(subscriptionData);

    if (error) {
      console.error('❌ Failed to create subscription record:', error);
    } else {
      console.log('✅ Subscription created successfully for user:', userId, 'with plan:', planName);
    }
  } catch (error) {
    console.error('❌ Error handling subscription created:', error);
  }
}

async function handleSubscriptionUpdated(data) {
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

async function handleSubscriptionCancelled(data) {
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

async function handleSubscriptionResumed(data) {
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

async function handleSubscriptionExpired(data) {
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

async function handleSubscriptionPaused(data) {
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

async function handleSubscriptionUnpaused(data) {
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

export default router; 