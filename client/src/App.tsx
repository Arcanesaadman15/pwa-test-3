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
import { useEffect } from "react";
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

  // DEBUG: Log the current state
  useEffect(() => {
  }, [user, userProfile, subscription, loading, currentPath]);

  if (loading) {

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Icon name="Mountain" size={32} className="text-white" />
          </div>
          <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/70">Loading your wellness journey...</p>
          <p className="text-white/50 text-sm mt-2">Almost ready...</p>
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
