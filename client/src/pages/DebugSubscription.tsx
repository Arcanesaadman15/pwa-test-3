import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { LemonSqueezyService } from "@/lib/lemonsqueezy";
import { Loader2, RefreshCw, CheckCircle, XCircle, AlertCircle } from "lucide-react";

export default function DebugSubscription() {
  const { user, userProfile, subscription, refreshSubscription } = useAuth();
  const [loading, setLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>(null);

  const handleRefresh = async () => {
    setLoading(true);
    try {
      await refreshSubscription();
      setLastRefresh(new Date());
      
      // Also fetch additional debug info
      if (user) {
        const result = await LemonSqueezyService.getSubscriptionStatus(user.id);
        setDebugInfo(result);
      }
    } catch (error) {
      console.error('Refresh error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: boolean | string) => {
    if (status === true || status === 'active') {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    } else if (status === false || status === 'inactive' || status === 'canceled') {
      return <XCircle className="w-5 h-5 text-red-500" />;
    } else {
      return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    }
  };

  const formatJSON = (obj: any) => {
    return JSON.stringify(obj, null, 2);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-3xl font-bold mb-2">Subscription Debug</h1>
          <p className="text-gray-400">Monitor subscription status and troubleshoot payment flow</p>
          {lastRefresh && (
            <p className="text-sm text-gray-500 mt-2">
              Last refreshed: {lastRefresh.toLocaleTimeString()}
            </p>
          )}
        </motion.div>

        {/* Refresh Button */}
        <div className="flex justify-center">
          <Button
            onClick={handleRefresh}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Refresh Status
          </Button>
        </div>

        {/* User Info */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getStatusIcon(!!user)}
              User Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-400">Authenticated</label>
                <Badge variant={user ? "default" : "destructive"}>
                  {user ? "Yes" : "No"}
                </Badge>
              </div>
              <div>
                <label className="text-sm text-gray-400">User ID</label>
                <p className="text-sm font-mono">{user?.id || "N/A"}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400">Email</label>
                <p className="text-sm">{user?.email || "N/A"}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400">Onboarding Complete</label>
                <Badge variant={userProfile?.onboarding_complete ? "default" : "destructive"}>
                  {userProfile?.onboarding_complete ? "Yes" : "No"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subscription Status */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getStatusIcon(subscription.isSubscribed)}
              Subscription Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-400">Is Subscribed</label>
                <Badge variant={subscription.isSubscribed ? "default" : "destructive"}>
                  {subscription.isSubscribed ? "Yes" : "No"}
                </Badge>
              </div>
              <div>
                <label className="text-sm text-gray-400">Plan</label>
                <p className="text-sm">{subscription.plan || "N/A"}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400">Status</label>
                <Badge variant={subscription.status === 'active' ? "default" : "secondary"}>
                  {subscription.status || "N/A"}
                </Badge>
              </div>
              <div>
                <label className="text-sm text-gray-400">Cancel at Period End</label>
                <Badge variant={subscription.cancelAtPeriodEnd ? "destructive" : "default"}>
                  {subscription.cancelAtPeriodEnd ? "Yes" : "No"}
                </Badge>
              </div>
            </div>
            {subscription.currentPeriodEnd && (
              <div>
                <label className="text-sm text-gray-400">Current Period End</label>
                <p className="text-sm">{new Date(subscription.currentPeriodEnd).toLocaleString()}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Debug API Response */}
        {debugInfo && (
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle>API Debug Info</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-xs bg-gray-900 p-4 rounded overflow-auto max-h-96">
                {formatJSON(debugInfo)}
              </pre>
            </CardContent>
          </Card>
        )}

        {/* Current Path */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle>Navigation Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <label className="text-sm text-gray-400">Current Path</label>
              <p className="text-sm font-mono">{window.location.pathname}</p>
            </div>
            <div>
              <label className="text-sm text-gray-400">Search Params</label>
              <p className="text-sm font-mono">{window.location.search || "N/A"}</p>
            </div>
            <div>
              <label className="text-sm text-gray-400">Hash</label>
              <p className="text-sm font-mono">{window.location.hash || "N/A"}</p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.href = '/subscription/success'}
              >
                Test Success Page
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.href = '/subscription/cancel'}
              >
                Test Cancel Page
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.href = '/pricing'}
              >
                Go to Pricing
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.href = '/home'}
              >
                Go to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 