export default function handler(req, res) {
  console.log('🩺 Health check endpoint called:', req.method);
  
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    message: 'API is working correctly',
    environment: process.env.NODE_ENV || 'unknown',
    hasLemonSqueezyApiKey: !!process.env.VITE_LEMONSQUEEZY_API_KEY,
    hasLemonSqueezyStoreId: !!process.env.VITE_LEMONSQUEEZY_STORE_ID,
  });
} 