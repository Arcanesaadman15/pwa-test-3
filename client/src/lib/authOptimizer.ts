/**
 * Authentication Optimizer
 * Handles cache management and session optimization for better auth performance
 */

// Clear any stale auth data that might cause issues
export function clearStaleAuthData() {
  try {
    // Clear any old/corrupted auth tokens
    const authKeys = Object.keys(localStorage).filter(key => 
      key.includes('supabase') || 
      key.includes('sb-') || 
      key.includes('auth')
    );
    
    authKeys.forEach(key => {
      try {
        const value = localStorage.getItem(key);
        if (value) {
          // Check if the token is expired or malformed
          const data = JSON.parse(value);
          if (data.expires_at && Date.now() / 1000 > data.expires_at) {
            console.log('🧹 Removing expired auth token:', key);
            localStorage.removeItem(key);
          }
        }
      } catch (e) {
        // If parsing fails, the token is corrupted
        console.log('🧹 Removing corrupted auth token:', key);
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.warn('Error clearing stale auth data:', error);
  }
}

// Optimize localStorage for auth performance
export function optimizeAuthStorage() {
  try {
    // Clear old cached profiles if they're too old
    const cachedProfile = localStorage.getItem('cached_profile_timestamp');
    if (cachedProfile) {
      const age = Date.now() - parseInt(cachedProfile, 10);
      const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days
      
      if (age > maxAge) {
        localStorage.removeItem('cached_profile');
        localStorage.removeItem('cached_profile_timestamp');
        localStorage.removeItem('cached_subscription');
        localStorage.removeItem('cached_subscription_timestamp');
        console.log('🧹 Cleared old profile cache');
      }
    }
  } catch (error) {
    console.warn('Error optimizing auth storage:', error);
  }
}

// Pre-warm auth session detection
export function preWarmAuthSession() {
  // This function can be called early in the app lifecycle
  // to prepare the auth system before it's actually needed
  try {
    clearStaleAuthData();
    optimizeAuthStorage();
    
    // Pre-check if we have valid auth tokens
    const authToken = localStorage.getItem('sb-auth-token');
    if (authToken) {
      console.log('📡 Pre-warming: Found existing auth token');
      return true;
    }
    
    console.log('📡 Pre-warming: No existing auth token found');
    return false;
  } catch (error) {
    console.warn('Error pre-warming auth session:', error);
    return false;
  }
}
