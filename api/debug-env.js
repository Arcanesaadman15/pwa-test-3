export default function handler(req, res) {
  // Only allow this in development or for testing
  const envVars = {
    VITE_SUPABASE_URL: process.env.VITE_SUPABASE_URL ? 'SET' : 'NOT SET',
    VITE_SUPABASE_ANON_KEY: process.env.VITE_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET',
    VITE_LEMONSQUEEZY_STORE_ID: process.env.VITE_LEMONSQUEEZY_STORE_ID ? 'SET' : 'NOT SET',
    VITE_LEMONSQUEEZY_API_KEY: process.env.VITE_LEMONSQUEEZY_API_KEY ? 'SET' : 'NOT SET',
    VITE_APP_URL: process.env.VITE_APP_URL || 'NOT SET',
    NODE_ENV: process.env.NODE_ENV || 'NOT SET'
  };

  res.status(200).json({
    message: "Environment variables check",
    environmentVariables: envVars,
    timestamp: new Date().toISOString()
  });
} 