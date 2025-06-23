export default async function handler(req, res) {
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  
  // Test if the Supabase URL is reachable
  let supabaseReachable = false;
  let supabaseError = null;
  
  if (supabaseUrl) {
    try {
      const response = await fetch(supabaseUrl);
      supabaseReachable = response.ok;
    } catch (error) {
      supabaseError = error.message;
    }
  }

  res.status(200).json({
    message: "Frontend Debug Information",
    environment: {
      VITE_SUPABASE_URL: supabaseUrl || 'NOT SET',
      VITE_SUPABASE_ANON_KEY: process.env.VITE_SUPABASE_ANON_KEY ? 'SET (length: ' + process.env.VITE_SUPABASE_ANON_KEY.length + ')' : 'NOT SET',
      VITE_APP_URL: process.env.VITE_APP_URL || 'NOT SET',
      NODE_ENV: process.env.NODE_ENV || 'NOT SET'
    },
    supabaseTest: {
      url: supabaseUrl,
      reachable: supabaseReachable,
      error: supabaseError
    },
    timestamp: new Date().toISOString()
  });
} 