import { storage } from '@/lib/storage';

export async function testLemonSqueezyConfig() {
  console.log('🍋 Testing LemonSqueezy Configuration...');
  
  // Test environment variables
  const getApiBaseUrl = () => {
    if (typeof window !== 'undefined') {
      return ''; // Always use relative URLs in browser
    }
    return import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
  };
  
  const apiBaseUrl = getApiBaseUrl();
  console.log('🔗 API Base URL:', apiBaseUrl || 'relative URLs (browser mode)');
  
  // Test checkout creation
  try {
    const testData = {
      variantId: '821326',
      userId: 'test-user-123',
      userEmail: 'test@example.com',
      userName: 'Test User'
    };
    
    console.log('🛒 Testing checkout creation with:', testData);
    
    const response = await fetch(`${apiBaseUrl}/api/lemonsqueezy/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Checkout created successfully:', result);
      console.log('🔗 Checkout URL:', result.checkoutUrl);
    } else {
      console.error('❌ Checkout creation failed:', result);
    }
    
    return result;
  } catch (error) {
    console.error('❌ Network error:', error);
    return { error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function resetOnboardingForTesting() {
  console.log('🔄 Resetting onboarding for testing...');
  try {
    await storage.resetOnboarding();
    console.log('✅ Onboarding reset! Refresh the page to see the onboarding flow again.');
    return true;
  } catch (error) {
    console.error('❌ Reset failed:', error);
    return false;
  }
}

// Add complete reset function that also resets user profile
export async function resetOnboardingAndProfile() {
  console.log('🔄 Resetting onboarding AND user profile for testing...');
  try {
    // Reset localStorage
    await storage.resetOnboardingAndAuth();
    
    // Reset user profile onboarding status if we have access to the auth context
    // This will be handled by the storage reset and page reload
    
    console.log('✅ Complete reset complete! Refresh the page to start fresh.');
    
    // Force reload after a short delay
    setTimeout(() => {
      console.log('🔄 Auto-reloading page...');
      window.location.reload();
    }, 1000);
    
    return true;
  } catch (error) {
    console.error('❌ Reset failed:', error);
    return false;
  }
}

export async function debugOnboardingStatus() {
  console.log('🔍 Debugging onboarding status...');
  try {
    const status = await storage.getOnboardingStatus();
    const data = await storage.getOnboardingData();
    
    console.log('📊 Onboarding Status:', status);
    console.log('📋 Onboarding Data:', data);
    
    return { status, data };
  } catch (error) {
    console.error('❌ Debug failed:', error);
    return { error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Complete reset function for testing - clears everything
export async function completeReset() {
  console.log('🔄 COMPLETE RESET - Clearing everything...');
  try {
    // Clear localStorage completely
    localStorage.clear();
    
    // Clear sessionStorage too
    sessionStorage.clear();
    
    // Clear any IndexedDB data
    if ('indexedDB' in window) {
      try {
        const databases = await indexedDB.databases();
        await Promise.all(
          databases.map(db => {
            if (db.name) {
              return new Promise((resolve, reject) => {
                const deleteReq = indexedDB.deleteDatabase(db.name!);
                deleteReq.onsuccess = () => resolve(true);
                deleteReq.onerror = () => reject(deleteReq.error);
              });
            }
          })
        );
      } catch (e) {
        console.log('IndexedDB clear failed:', e);
      }
    }
    
    console.log('✅ Complete reset finished! Refreshing page...');
    
    // Force reload after clearing everything
    setTimeout(() => {
      window.location.reload();
    }, 500);
    
    return true;
  } catch (error) {
    console.error('❌ Complete reset failed:', error);
    return false;
  }
}

// Attach all functions to window for global access
if (typeof window !== 'undefined') {
  (window as any).testLemonSqueezy = testLemonSqueezyConfig;
  (window as any).resetOnboarding = resetOnboardingForTesting;
  (window as any).resetOnboardingAndAuth = resetOnboardingAndProfile;
  (window as any).debugOnboardingStatus = debugOnboardingStatus;
  (window as any).completeReset = completeReset;

  console.log('🔧 Global functions loaded:', {
    testLemonSqueezy: typeof (window as any).testLemonSqueezy,
    resetOnboarding: typeof (window as any).resetOnboarding,
    resetOnboardingAndAuth: typeof (window as any).resetOnboardingAndAuth,
    debugOnboardingStatus: typeof (window as any).debugOnboardingStatus,
    completeReset: typeof (window as any).completeReset
  });
} 