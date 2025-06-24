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
import Onboarding from "@/pages/Onboarding";
import { useEffect } from "react";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/pricing" component={PricingPage} />
      <Route path="/subscription" component={SubscriptionPage} />
      <Route path="/subscription/success" component={SubscriptionSuccessPage} />
      <Route path="/subscription/cancel" component={SubscriptionCancelPage} />
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

  // DEBUG: Log the current state
  useEffect(() => {
    console.log('🎯 AuthenticatedApp Debug:');
    console.log('  - user:', !!user);
    console.log('  - userProfile:', userProfile);
    console.log('  - onboarding_complete:', userProfile?.onboarding_complete);
    console.log('  - subscription.isSubscribed:', subscription.isSubscribed);
    console.log('  - subscription:', subscription);
    console.log('  - loading:', loading);
  }, [user, userProfile, subscription, loading]);

  if (loading) {
    console.log('🎯 App: Still loading...');

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🏔️</span>
          </div>
          <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>
          <p className="text-white/70 mt-4">Loading PeakForge...</p>
          <p className="text-white/50 text-sm mt-2">Connecting to services...</p>
        </div>
      </div>
    );
  }

  // STEP 1: Check if user is authenticated
  if (!user) {
    console.log('🎯 App: User not authenticated, showing login/signup');
    return <AuthForm onComplete={() => {
      console.log('🎯 App: Authentication completed, will recheck auth state');
      // After auth completion, the useAuth hook will update and this component will re-render
      // If it's a returning user with completed onboarding, they'll go straight to main app
      // If it's a new user or incomplete onboarding, they'll go to onboarding
    }} />;
  }

  // STEP 2: User is authenticated, check if onboarding is complete
  // For existing users logging in: userProfile.onboarding_complete should be true -> skip onboarding
  // For new users signing up: userProfile.onboarding_complete should be false -> show onboarding
  if (!userProfile?.onboarding_complete) {
    console.log('🎯 App: User authenticated but onboarding not complete, showing onboarding');
    return <Onboarding onComplete={async (data) => {
      console.log('🎯 App: Onboarding completed successfully');
      // The onboarding component already handles updating the profile with onboarding_complete: true
      // React will re-render this component when userProfile updates
    }} />;
  }

  // STEP 3: User is authenticated and onboarded, check subscription status
  if (!subscription.isSubscribed) {
    console.log('🎯 App: User authenticated and onboarded but no active subscription, showing pricing');
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

  // STEP 4: User is authenticated, onboarded, and has active subscription - show main app
  console.log('🎯 App: User fully authenticated with active subscription, showing main app');
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
          console.log('Update dismissed temporarily');
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
