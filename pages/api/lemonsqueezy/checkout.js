import { lemonSqueezySetup, createCheckout } from '@lemonsqueezy/lemonsqueezy.js';

// Initialize LemonSqueezy - Prioritize VITE_ variables for Vercel
const LEMONSQUEEZY_API_KEY = process.env.VITE_LEMONSQUEEZY_API_KEY || process.env.LEMONSQUEEZY_API_KEY;
const LEMONSQUEEZY_STORE_ID = process.env.VITE_LEMONSQUEEZY_STORE_ID || process.env.LEMONSQUEEZY_STORE_ID;

console.log('🍋 LemonSqueezy Configuration Check:');
console.log('  API Key exists:', !!LEMONSQUEEZY_API_KEY);
console.log('  Store ID exists:', !!LEMONSQUEEZY_STORE_ID);
console.log('  Store ID value:', LEMONSQUEEZY_STORE_ID);
console.log('  Available env vars:', Object.keys(process.env).filter(k => k.includes('LEMONSQUEEZY')));

if (LEMONSQUEEZY_API_KEY) {
  lemonSqueezySetup({
    apiKey: LEMONSQUEEZY_API_KEY,
    onError: (error) => {
      console.error('LemonSqueezy Setup Error:', error);
    },
  });
  console.log('🍋 LemonSqueezy setup completed');
} else {
  console.error('❌ LemonSqueezy API key not found!');
}

export default async function handler(req, res) {
  console.log('🛒 Checkout endpoint called:', req.method);
  
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
      return res.status(500).json({ error: 'Store ID not configured. Please set LEMONSQUEEZY_STORE_ID environment variable.' });
    }

    if (!LEMONSQUEEZY_API_KEY) {
      console.error('❌ LEMONSQUEEZY_API_KEY not configured');
      return res.status(500).json({ error: 'API Key not configured. Please set LEMONSQUEEZY_API_KEY environment variable.' });
    }

    console.log('🍋 Creating LemonSqueezy checkout...');

    const storeId = process.env.LEMONSQUEEZY_STORE_ID;
    const webUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'https://peakforge.club';
    
    if (!storeId) {
      return new Response(JSON.stringify({ error: "LEMONSQUEEZY_STORE_ID is not set in env" }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    const redirectSuccessUrl = successUrl || `${webUrl}/subscription/success`;
    const redirectCancelUrl = cancelUrl || `${webUrl}/subscription/cancel`;

    console.log('🔗 Redirect URLs:', { success: redirectSuccessUrl, cancel: redirectCancelUrl });

    const checkout = await createCheckout(LEMONSQUEEZY_STORE_ID, variantId, {
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
        },
      },
      productOptions: {
        name: 'PeakForge Pro Subscription',
        description: 'Premium wellness program with all features unlocked',
        redirectUrl: redirectSuccessUrl,
        receiptButtonText: 'Go to PeakForge',
        receiptThankYouNote: 'Thank you for subscribing to PeakForge Pro! Click the button below to return to your dashboard.',
        enabledVariants: [variantId],
      },
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