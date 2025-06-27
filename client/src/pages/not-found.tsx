import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Home, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";

export default function NotFound() {
  const [, setLocation] = useLocation();
  const { user, subscription } = useAuth();
  const currentPath = window.location.pathname;

  // Check if this might be a subscription-related redirect issue
  const isSubscriptionRelated = currentPath.includes('subscription') || 
                                window.location.search.includes('subscription') ||
                                window.location.search.includes('checkout');

  const handleGoHome = () => {
    if (user && subscription.isSubscribed) {
      setLocation('/home');
    } else if (user) {
      setLocation('/pricing');
    } else {
      setLocation('/');
    }
  };

  const handleRetrySubscription = () => {
    setLocation('/subscription/success');
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-900 p-4">
      <Card className="w-full max-w-md mx-4 bg-gray-800 border-gray-700">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2">
            <AlertCircle className="h-8 w-8 text-red-500 flex-shrink-0" />
            <div>
              <h1 className="text-2xl font-bold text-white">Page Not Found</h1>
              <p className="text-gray-400 text-sm mt-1">404 Error</p>
            </div>
          </div>

          <p className="mt-4 text-sm text-gray-300 mb-6">
            {isSubscriptionRelated 
              ? "There was an issue with the subscription redirect. This might be a temporary problem."
              : "The page you're looking for doesn't exist or has been moved."
            }
          </p>

          {/* Debug info for subscription issues */}
          {isSubscriptionRelated && (
            <div className="bg-gray-900 rounded-lg p-3 mb-6 text-xs">
              <p className="text-gray-400 mb-2">Debug Info:</p>
              <p className="text-gray-500">Path: {currentPath}</p>
              <p className="text-gray-500">User: {user ? '✓' : '✗'}</p>
              <p className="text-gray-500">Subscription: {subscription.isSubscribed ? '✓' : '✗'}</p>
            </div>
          )}

          <div className="space-y-3">
            {isSubscriptionRelated && (
              <Button
                onClick={handleRetrySubscription}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Check Subscription Status
              </Button>
            )}
            
            <Button
              onClick={handleGoHome}
              variant="outline"
              className="w-full border-gray-600 hover:border-gray-500 hover:bg-gray-700 text-gray-300"
            >
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </div>

          {isSubscriptionRelated && (
            <p className="text-xs text-gray-500 mt-4 text-center">
              If you just completed a purchase, please wait a moment for your subscription to activate.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
