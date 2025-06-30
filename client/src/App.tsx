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
      {process.env.NODE_ENV === 'development' && (
        <Route path="/debug" component={DebugSubscription} />
      )}
      <Route path="/lemonsqueezy-setup" component={LemonSqueezySetup} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AuthenticatedApp() {
  const { user, userProfile, subscription, loading, signOut } = useAuth();
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
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
  
  // Check if current path is subscription-related (allow access even without active subscription)
  const currentPath = window.location.pathname;
  const isSubscriptionPath = currentPath.startsWith('/subscription');

  // Extended loading to prevent flashing between states
  useEffect(() => {
    if (!loading) {
      // Add a small delay after auth loading completes to ensure smooth transition
      const timer = setTimeout(() => {
        setInitialLoadComplete(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  // Show loading screen until both auth loading and initial transition are complete
  if (loading || !initialLoadComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-600 via-orange-500 to-red-600 flex items-center justify-center">
        <div className="text-center relative">
          {/* Background glow effect */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-orange-300/20 rounded-full blur-3xl animate-pulse"></div>
          </div>
          
          <div className="relative z-10">
            <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
              <Icon name="Mountain" size={36} className="text-white" />
            </div>
            
            {/* Enhanced loading spinner */}
            <div className="relative mb-6">
              <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 border-2 border-orange-200/40 border-t-orange-200 rounded-full animate-spin"></div>
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-2">PeakForge</h2>
            <p className="text-white/80 text-lg mb-1">Loading your wellness journey...</p>
            <p className="text-white/60 text-sm">Preparing your transformation</p>
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

  // STEP 2: Allow access to subscription success/cancel pages even without onboarding completion
  // This handles the case where user completes payment but returns to app
  if (isSubscriptionPath) {
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

  // STEP 3: User is authenticated, check if onboarding is complete
  // For existing users logging in: userProfile.onboarding_complete should be true -> skip onboarding
  // For new users signing up: userProfile.onboarding_complete should be false -> show onboarding
  if (!userProfile?.onboarding_complete) {
    return <Onboarding onComplete={async (data) => {
      // The onboarding component already handles updating the profile with onboarding_complete: true
      // React will re-render this component when userProfile updates
    }} />;
  }

  // STEP 4: User is authenticated and onboarded, check subscription status
  // Allow access to subscription pages even without active subscription (for success/cancel/manage pages)
  if (!subscription.isSubscribed) {
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
