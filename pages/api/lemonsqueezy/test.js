// Test endpoint to verify LemonSqueezy configuration
export default async function handler(req, res) {
  const LEMONSQUEEZY_API_KEY = process.env.VITE_LEMONSQUEEZY_API_KEY || process.env.LEMONSQUEEZY_API_KEY;
  const LEMONSQUEEZY_STORE_ID = process.env.VITE_LEMONSQUEEZY_STORE_ID || process.env.LEMONSQUEEZY_STORE_ID;
  const LEMONSQUEEZY_WEBHOOK_SECRET = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;

  const config = {
    hasApiKey: !!LEMONSQUEEZY_API_KEY,
    hasStoreId: !!LEMONSQUEEZY_STORE_ID,
    hasWebhookSecret: !!LEMONSQUEEZY_WEBHOOK_SECRET,
    storeId: LEMONSQUEEZY_STORE_ID,
    apiKeyPrefix: LEMONSQUEEZY_API_KEY ? LEMONSQUEEZY_API_KEY.substring(0, 8) + '...' : 'Not found',
    webhookSecretPrefix: LEMONSQUEEZY_WEBHOOK_SECRET ? LEMONSQUEEZY_WEBHOOK_SECRET.substring(0, 8) + '...' : 'Not configured',
    environment: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL_ENV,
    availableEnvVars: Object.keys(process.env).filter(key => 
      key.includes('LEMONSQUEEZY') || key.includes('VERCEL')
    )
  };

  const fullyConfigured = config.hasApiKey && config.hasStoreId;
  const webhookReady = fullyConfigured && config.hasWebhookSecret;

  res.json({
    status: 'LemonSqueezy Configuration Test',
    configured: fullyConfigured,
    webhookReady: webhookReady,
    config,
    timestamp: new Date().toISOString(),
    notes: {
      payment: fullyConfigured ? '✅ Ready for payments' : '❌ Missing API key or Store ID',
      webhooks: webhookReady ? '✅ Webhooks secured' : '⚠️ Webhook secret not set (optional for testing)'
    }
  });
} 