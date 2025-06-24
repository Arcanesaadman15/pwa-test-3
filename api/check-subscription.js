import { createClient } from '@supabase/supabase-js';

// Initialize Supabase
const supabase = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, userId } = req.query;

    if (!email && !userId) {
      return res.status(400).json({ error: 'Email or userId required' });
    }

    let user;
    if (userId) {
      // Query by user ID
      const { data, error } = await supabase
        .from('users')
        .select('id, email')
        .eq('id', userId)
        .single();
      
      if (error || !data) {
        return res.status(404).json({ error: 'User not found' });
      }
      user = data;
    } else {
      // Query by email
      const { data, error } = await supabase
        .from('users')
        .select('id, email')
        .ilike('email', email)
        .single();
      
      if (error || !data) {
        return res.status(404).json({ error: 'User not found' });
      }
      user = data;
    }

    // Get user's subscription
    const { data: subscription, error: subError } = await supabase
      .from('user_subscriptions')
      .select(`
        *,
        subscription_plans (
          name,
          price,
          interval
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1);

    if (subError) {
      console.error('Subscription query error:', subError);
      return res.status(500).json({ error: 'Database error' });
    }

    const activeSubscription = subscription?.find(sub => sub.status === 'active');

    res.json({
      user: {
        id: user.id,
        email: user.email
      },
      subscription: activeSubscription || null,
      allSubscriptions: subscription || [],
      hasActiveSubscription: !!activeSubscription
    });

  } catch (error) {
    console.error('Check subscription error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
} 