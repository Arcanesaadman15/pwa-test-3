// Simple test to debug mobile connectivity issues
export async function testConnection() {
  console.log('🔍 Testing connection...');
  
  try {
    // Test 1: API endpoint through proxy
    console.log('📡 Testing API endpoint...');
    const apiResponse = await fetch('/api/test');
    const apiData = await apiResponse.json();
    console.log('✅ API test successful:', apiData);
    
    // Test 2: Supabase connectivity
    console.log('📡 Testing Supabase connectivity...');
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    if (supabaseUrl) {
      const supabaseResponse = await fetch(`${supabaseUrl}/rest/v1/`, {
        headers: {
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY || '',
          'Content-Type': 'application/json'
        }
      });
      console.log('✅ Supabase connectivity:', supabaseResponse.status, supabaseResponse.statusText);
    } else {
      console.log('⚠️ Supabase URL not configured');
    }
    
    // Test 3: Network info
    console.log('🌐 Network info:', {
      userAgent: navigator.userAgent,
      onLine: navigator.onLine,
      hostname: window.location.hostname,
      protocol: window.location.protocol,
      port: window.location.port
    });
    
    return { success: true, api: apiData };
  } catch (error) {
    console.error('❌ Connection test failed:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error 
    };
  }
}

// Attach to window for easy access in browser console
if (typeof window !== 'undefined') {
  (window as any).testConnection = testConnection;
  console.log('🔧 testConnection() function available in console');
} 