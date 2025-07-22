import { lemonSqueezySetup, createCheckout, getSubscription, updateSubscription, cancelSubscription } from '@lemonsqueezy/lemonsqueezy.js';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

// Initialize LemonSqueezy - Prioritize VITE_ prefixed variables for Vercel
const LEMONSQUEEZY_API_KEY = process.env.VITE_LEMONSQUEEZY_API_KEY || process.env.LEMONSQUEEZY_API_KEY;
const LEMONSQUEEZY_STORE_ID = process.env.VITE_LEMONSQUEEZY_STORE_ID || process.env.LEMONSQUEEZY_STORE_ID;
const LEMONSQUEEZY_WEBHOOK_SECRET = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;

console.log('🍋 LemonSqueezy Webhook Configuration:');
console.log('  API Key exists:', !!LEMONSQUEEZY_API_KEY);
console.log('  Store ID exists:', !!LEMONSQUEEZY_STORE_ID);
console.log('  Webhook Secret exists:', !!LEMONSQUEEZY_WEBHOOK_SECRET);

if (LEMONSQUEEZY_API_KEY) {
  lemonSqueezySetup({
    apiKey: LEMONSQUEEZY_API_KEY,
    onError: (error) => {
      console.error('LemonSqueezy Setup Error:', error);
    },
  });
}

// Initialize Supabase with service role key
const supabase = createClient(
  process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY  // Use service role key to bypass RLS
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



// Webhook handler functions
async function handleSubscriptionCreated(data, meta) {
  try {
    console.log('🔍 Processing subscription_created webhook...');
    console.log('  Data received:', JSON.stringify(data, null, 2));
    console.log('  Meta received:', JSON.stringify(meta, null, 2));
    
    // LemonSqueezy structure: data.attributes contains subscription info
    const attributes = data.attributes;
    const userEmail = attributes.user_email;
    const variantId = attributes.variant_id?.toString();
    
    // Try to get user_id from custom_data first, fallback to email lookup
    let userId = meta?.custom_data?.user_id;
    
    if (userId) {
      console.log('✅ User ID found in custom_data:', userId);
    } else if (userEmail) {
      console.log('🔍 No user_id in custom_data, looking up by email:', userEmail);
      
      // Find user by email in our database (case-insensitive)
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('id')
        .ilike('email', userEmail) // Case-insensitive email lookup
        .single();

      if (userError || !user) {
        console.error('❌ Failed to find user with email:', userEmail, userError);
        return;
      }

      userId = user.id;
      console.log('✅ User found with ID:', userId);
    } else {
      console.error('❌ No user_id in custom_data and no user_email in subscription webhook');
      return;
    }

    console.log('🔍 Variant ID:', variantId);

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
      stripe_subscription_id: data.id, // Using stripe field names for compatibility
      stripe_customer_id: attributes.customer_id?.toString(),
      current_period_start: new Date(attributes.created_at),
      current_period_end: new Date(attributes.renews_at),
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

// Vercel serverless function handler
export default async function handler(req, res) {
  console.log('🔔 Webhook request received:', req.method, req.url);
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Parse JSON from raw body
    let payload;
    if (typeof req.body === 'string') {
      payload = JSON.parse(req.body);
    } else if (Buffer.isBuffer(req.body)) {
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
        await handleSubscriptionCreated(eventData, payload.meta);
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
    console.error('Error stack:', error.stack);
    res.status(500).json({ error: 'Webhook processing failed: ' + error.message });
  }
} 