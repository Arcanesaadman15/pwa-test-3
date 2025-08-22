import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster, ToastProvider } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { AuthForm } from "@/components/Auth/AuthForm";
import { usePWA } from "@/hooks/usePWA";
import { InstallPrompt } from "@/components/Modals/InstallPrompt";
import { UpdateNotification } from "@/components/Modals/UpdateNotification";
import { Button } from "@/components/ui/button";
import "@/utils/fixProfile"; // Import to make fixProfile available globally
import Home from "@/pages/Home";
import NotFound from "@/pages/not-found";
import PricingPage from "@/pages/PricingPage";
import SubscriptionPage from "@/pages/SubscriptionPage";
import SubscriptionSuccessPage from "@/pages/SubscriptionSuccessPage";
import SubscriptionCancelPage from "@/pages/SubscriptionCancelPage";
import LemonSqueezySetup from "@/pages/LemonSqueezySetup";
import DebugSubscription from "@/pages/DebugSubscription";
import Onboarding from "@/pages/Onboarding";
import ResetPassword from "@/pages/ResetPassword";
import { useEffect, useState } from "react";
import { Icon } from "./lib/iconUtils";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/home" component={Home} />
      <Route path="/pricing" component={PricingPage} />
      <Route path="/subscription" component={SubscriptionPage} />
      <Route path="/subscription/success" component={SubscriptionSuccessPage} />
      <Route path="/subscription/cancel" component={SubscriptionCancelPage} />
      <Route path="/reset-password" component={ResetPassword} />
      {process.env.NODE_ENV === 'development' && (
        <Route path="/debug" component={DebugSubscription} />
      )}
      <Route path="/lemonsqueezy-setup" component={LemonSqueezySetup} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AuthenticatedApp() {
  const { user, userProfile, subscription, loading, profileError, signOut, retryProfileCreation } = useAuth();
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [isInOnboarding, setIsInOnboarding] = useState(false);
  const { 
    isInstallable, 
    promptInstall, 
    dismissInstall, 
    dismissInstallPermanently,
    isIOS, 
    updateInfo,
    showInstallBanner,
    installPromptDismissed
  } = usePWA();
  
  // Check if current path is subscription-related or password reset (allow access even without active subscription)
  const currentPath = window.location.pathname;
  const isSubscriptionPath = currentPath.startsWith('/subscription');
  const isResetPasswordPath = currentPath === '/reset-password';

  // Debug logging for the skipping issue
  useEffect(() => {
    console.log('🔄 App state changed:', {
      hasUser: !!user,
      onboardingComplete: userProfile?.onboarding_complete,
      isSubscribed: subscription.isSubscribed,
      isInOnboarding,
      currentPath,
      isSubscriptionPath,
      isResetPasswordPath
    });
  }, [user, userProfile?.onboarding_complete, subscription.isSubscribed, isInOnboarding, currentPath, isSubscriptionPath, isResetPasswordPath]);

  // Minimal loading delay since we now use localStorage caching
  useEffect(() => {
    if (!loading) {
      // Very short delay for smooth transition, cache makes this fast
      const timer = setTimeout(() => {
        setInitialLoadComplete(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  // Show loading screen until both auth loading and initial transition are complete
  if (loading || !initialLoadComplete) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center relative">
          {/* Subtle background glow */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
          </div>
          
          <div className="relative z-10">
            <div className="w-20 h-20 flex items-center justify-center mx-auto mb-6">
              <img src="/icon-192x192.png" alt="PeakForge Logo" className="w-20 h-20" />
            </div>
            
            {/* Clean loading spinner */}
            <div className="mb-6">
              <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-2">PeakForge</h2>
            <p className="text-white/80 text-lg mb-1">Loading your wellness journey...</p>
            <p className="text-white/60 text-sm">Setting up your account</p>
            
            {/* Add fallback after extended loading */}
            {loading && (
              <div className="mt-8">
                <p className="text-white/40 text-xs mb-4">Taking longer than expected?</p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.location.reload()}
                  className="bg-white/10 text-white border-white/20 hover:bg-white/20"
                >
                  Refresh Page
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }



  // STEP 1: Check if user is authenticated
  if (!user) {
    return <AuthForm onComplete={() => {
      // After auth completion, the useAuth hook will update and this component will re-render
      // If it's a returning user with completed onboarding, they'll go straight to main app
      // If it's a new user or incomplete onboarding, they'll go to onboarding
    }} />;
  }

  // STEP 2: Allow access to subscription success/cancel pages and password reset even without onboarding completion
  // This handles the case where user completes payment but returns to app, or needs to reset password
  if (isSubscriptionPath || isResetPasswordPath) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#111827' }}>
        <Router />
        
        {/* Install Prompt */}
        {isInstallable && !installPromptDismissed && (
          <InstallPrompt 
            onInstall={promptInstall} 
            onDismiss={dismissInstall}
            onDismissPermanently={dismissInstallPermanently}
            isIOS={isIOS}
            showBanner={showInstallBanner}
          />
        )}
        
        {/* Update Notification */}
        <UpdateNotification
          isVisible={updateInfo.isUpdateAvailable}
          onUpdate={updateInfo.updateServiceWorker}
          onDismiss={() => {
            // Dismiss update notification temporarily
          }}
        />
        
        <Toaster />
      </div>
    );
  }

  // STEP 3: Handle users currently in onboarding flow
  if (isInOnboarding) {
    return <Onboarding onComplete={async (data) => {
      console.log('🎯 Onboarding completed, marking as not in onboarding');
      setIsInOnboarding(false);
    }} />;
  }

  // STEP 4: Handle profile error state
  if (profileError && !loading) {
    console.log('❌ Profile error state:', profileError);
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 19c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          
          <h2 className="text-xl font-semibold text-white mb-4">Profile Setup Failed</h2>
          <p className="text-white/70 mb-6 text-sm leading-relaxed">{profileError}</p>
          
          <div className="space-y-3">
            <Button 
              onClick={retryProfileCreation}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  Retrying...
                </>
              ) : (
                'Try Again'
              )}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={async () => await signOut()}
              className="w-full bg-white/10 text-white border-white/20 hover:bg-white/20"
              disabled={loading}
            >
              Sign Out & Try Different Account
            </Button>
          </div>
          
          <p className="text-white/40 text-xs mt-6">
            If this issue persists, please contact support
          </p>
        </div>
      </div>
    );
  }

  // STEP 5: User is authenticated, check subscription status and onboarding
  // Wait for profile data to load to prevent race conditions
  if (userProfile === null && loading) {
    console.log('⏳ Waiting for profile data to load...');
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/80 mb-6">Setting up your profile...</p>
          <p className="text-white/50 text-sm">This should only take a moment</p>
        </div>
      </div>
    );
  }

  // If user has completed onboarding but has no subscription, show pricing page
  // If user hasn't completed onboarding and has no subscription, they should be in onboarding flow
  if (!subscription.isSubscribed && !isSubscriptionPath && !isResetPasswordPath && userProfile) {
    // If user has completed onboarding, send them to pricing page
    if (userProfile.onboarding_complete && !isInOnboarding) {
      console.log('🚨 User completed onboarding but no subscription - redirecting to pricing page');
      return (
        <div>
          <PricingPage />
          {/* Debug: Add logout option */}
          <div className="fixed top-4 right-4 z-50">
            <Button 
              variant="outline" 
              size="sm"
              onClick={async () => {
                await signOut();
              }}
              className="bg-white/10 text-white border-white/20 hover:bg-white/20"
            >
              Sign Out
            </Button>
          </div>
        </div>
      );
    }
    
    // If user hasn't completed onboarding and isn't already in onboarding, start onboarding
    if (!userProfile.onboarding_complete && !isInOnboarding) {
      console.log('🎯 User needs onboarding and subscription - starting onboarding flow');
      setIsInOnboarding(true);
      return <Onboarding onComplete={async (data) => {
        console.log('🎯 Onboarding completed, marking as not in onboarding');
        setIsInOnboarding(false);
      }} />;
    }
  }

  // STEP 5: User is authenticated, onboarded, and has active subscription - show main app
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#111827' }}>
      <Router />
      
      {/* Install Prompt */}
      {isInstallable && !installPromptDismissed && (
        <InstallPrompt 
          onInstall={promptInstall} 
          onDismiss={dismissInstall}
          onDismissPermanently={dismissInstallPermanently}
          isIOS={isIOS}
          showBanner={showInstallBanner}
        />
      )}
      
      {/* Update Notification */}
      <UpdateNotification
        isVisible={updateInfo.isUpdateAvailable}
        onUpdate={updateInfo.updateServiceWorker}
        onDismiss={() => {
          // Dismiss update notification temporarily
        }}
      />
      
      <Toaster />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <TooltipProvider>
          <AuthProvider>
            <AuthenticatedApp />
          </AuthProvider>
        </TooltipProvider>
      </ToastProvider>
    </QueryClientProvider>
  );
}

export default App;
