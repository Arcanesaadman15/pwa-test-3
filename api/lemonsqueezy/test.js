// Test endpoint to verify LemonSqueezy configuration
export default async function handler(req, res) {
  const LEMONSQUEEZY_API_KEY = process.env.VITE_LEMONSQUEEZY_API_KEY || process.env.LEMONSQUEEZY_API_KEY;
  const LEMONSQUEEZY_STORE_ID = process.env.VITE_LEMONSQUEEZY_STORE_ID || process.env.LEMONSQUEEZY_STORE_ID;

  const config = {
    hasApiKey: !!LEMONSQUEEZY_API_KEY,
    hasStoreId: !!LEMONSQUEEZY_STORE_ID,
    storeId: LEMONSQUEEZY_STORE_ID,
    apiKeyPrefix: LEMONSQUEEZY_API_KEY ? LEMONSQUEEZY_API_KEY.substring(0, 8) + '...' : 'Not found',
    environment: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL_ENV,
    availableEnvVars: Object.keys(process.env).filter(key => 
      key.includes('LEMONSQUEEZY') || key.includes('VERCEL')
    )
  };

  res.json({
    status: 'LemonSqueezy Configuration Test',
    configured: config.hasApiKey && config.hasStoreId,
    config,
    timestamp: new Date().toISOString()
  });
} 