import { lemonSqueezySetup, createCheckout } from '@lemonsqueezy/lemonsqueezy.js';

// Initialize LemonSqueezy
const LEMONSQUEEZY_API_KEY = process.env.VITE_LEMONSQUEEZY_API_KEY;
const LEMONSQUEEZY_STORE_ID = process.env.VITE_LEMONSQUEEZY_STORE_ID;

if (LEMONSQUEEZY_API_KEY) {
  lemonSqueezySetup({
    apiKey: LEMONSQUEEZY_API_KEY,
    onError: (error) => {
      console.error('LemonSqueezy Setup Error:', error);
    },
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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
    const baseUrl = process.env.VITE_APP_URL || 'https://pwa-test-4-ten.vercel.app';
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
} 