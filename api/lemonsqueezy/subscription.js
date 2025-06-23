import { cancelSubscription } from '@lemonsqueezy/lemonsqueezy.js';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  const { method } = req;
  const { subscriptionId } = req.query;

  if (method === 'GET') {
    // GET /api/lemonsqueezy/subscription/[userId] - Get user's subscription status
    try {
      const userId = subscriptionId; // In this case, it's actually userId for GET requests

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
  } else if (method === 'POST') {
    // POST /api/lemonsqueezy/subscription/[subscriptionId]/cancel - Cancel a subscription
    try {
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
          status: 'cancelled',
          cancelled_at: new Date().toISOString()
        })
        .eq('lemonsqueezy_subscription_id', subscriptionId);

      if (updateError) {
        console.error('Database update error:', updateError);
        // Don't fail the request since LemonSqueezy cancellation succeeded
      }

      res.json({ success: true, message: 'Subscription cancelled successfully' });
    } catch (error) {
      console.error('Subscription cancellation error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
} 