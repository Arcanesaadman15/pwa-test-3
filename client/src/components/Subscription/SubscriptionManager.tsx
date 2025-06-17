import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { LemonSqueezyService } from "@/lib/lemonsqueezy";
import { Calendar, CreditCard, Crown, Settings, AlertTriangle, CheckCircle } from "lucide-react";

interface Subscription {
  id: string;
  plan_id: string;
  status: string;
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  subscription_plans: {
    name: string;
    price: number;
    interval: string;
  };
}

export function SubscriptionManager() {
  const { user, userProfile, subscription } = useAuth();
  const [loading, setLoading] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [subscriptionData, setSubscriptionData] = useState<Subscription | null>(null);

  useEffect(() => {
    if (subscription.isSubscribed && user) {
      fetchSubscriptionDetails();
    }
  }, [subscription.isSubscribed, user]);

  const fetchSubscriptionDetails = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const result = await LemonSqueezyService.getSubscriptionStatus(user.id);
      
      if (result.subscription) {
        setSubscriptionData(result.subscription);
      }
    } catch (error) {
      console.error('Failed to fetch subscription details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!subscriptionData) return;

    setCancelling(true);
    try {
      const result = await LemonSqueezyService.cancelSubscription(subscriptionData.id);
      
      if (result.success) {
        // Refresh subscription data
        await fetchSubscriptionDetails();
        // You might want to show a success toast here
      } else {
        console.error('Failed to cancel subscription:', result.error);
        // Show error toast
      }
    } catch (error) {
      console.error('Cancel subscription error:', error);
    } finally {
      setCancelling(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status: string, cancelAtPeriodEnd: boolean) => {
    if (cancelAtPeriodEnd) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
          <AlertTriangle className="w-4 h-4 mr-1" />
          Cancelling
        </span>
      );
    }

    switch (status.toLowerCase()) {
      case 'active':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-4 h-4 mr-1" />
            Active
          </span>
        );
      case 'canceled':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
            Canceled
          </span>
        );
      case 'past_due':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
            <AlertTriangle className="w-4 h-4 mr-1" />
            Past Due
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50">
          <div className="flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3" />
            <span className="text-white">Loading subscription details...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!subscription.isSubscribed || !subscriptionData) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-gray-500 to-gray-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <CreditCard className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">No Active Subscription</h2>
          <p className="text-gray-400 mb-8">
            You don't have an active subscription. Upgrade to unlock premium features!
          </p>
          <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
            View Pricing Plans
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Header */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold text-white mb-2">Subscription Management</h1>
        <p className="text-gray-400">Manage your PeakForge premium subscription</p>
      </motion.div>

      {/* Subscription Overview */}
      <motion.div
        className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-4">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{subscriptionData.subscription_plans.name} Plan</h2>
              <p className="text-gray-400">Premium wellness features unlocked</p>
            </div>
          </div>
          {getStatusBadge(subscriptionData.status, subscriptionData.cancel_at_period_end)}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Price */}
          <div className="text-center p-4 bg-gray-700/30 rounded-xl">
            <div className="text-2xl font-bold text-white mb-1">
              {LemonSqueezyService.formatPrice(subscriptionData.subscription_plans.price)}
            </div>
            <div className="text-gray-400 text-sm">per {subscriptionData.subscription_plans.interval}</div>
          </div>

          {/* Current Period */}
          <div className="text-center p-4 bg-gray-700/30 rounded-xl">
            <div className="flex items-center justify-center mb-2">
              <Calendar className="w-5 h-5 text-blue-400 mr-2" />
              <span className="text-white font-medium">Current Period</span>
            </div>
            <div className="text-gray-400 text-sm">
              {formatDate(subscriptionData.current_period_start)} - {formatDate(subscriptionData.current_period_end)}
            </div>
          </div>

          {/* Next Billing */}
          <div className="text-center p-4 bg-gray-700/30 rounded-xl">
            <div className="flex items-center justify-center mb-2">
              <CreditCard className="w-5 h-5 text-green-400 mr-2" />
              <span className="text-white font-medium">
                {subscriptionData.cancel_at_period_end ? 'Expires' : 'Next Billing'}
              </span>
            </div>
            <div className="text-gray-400 text-sm">
              {formatDate(subscriptionData.current_period_end)}
            </div>
          </div>
        </div>

        {/* Cancellation Warning */}
        {subscriptionData.cancel_at_period_end && (
          <div className="mt-6 p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl">
            <div className="flex items-start">
              <AlertTriangle className="w-5 h-5 text-orange-400 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-orange-400 font-medium mb-1">Subscription Cancelling</h4>
                <p className="text-orange-300/80 text-sm">
                  Your subscription will expire on {formatDate(subscriptionData.current_period_end)}. 
                  You'll continue to have access to premium features until then.
                </p>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Actions */}
      <motion.div
        className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <h3 className="text-xl font-bold text-white mb-6">Subscription Actions</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Cancel Subscription */}
          {!subscriptionData.cancel_at_period_end && (
            <Button
              onClick={handleCancelSubscription}
              disabled={cancelling}
              variant="outline"
              className="justify-start p-4 h-auto border-red-500/20 hover:border-red-500/40 hover:bg-red-500/10"
            >
              <div className="flex items-center">
                {cancelling ? (
                  <div className="w-5 h-5 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin mr-3" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-red-400 mr-3" />
                )}
                <div className="text-left">
                  <div className="text-red-400 font-medium">Cancel Subscription</div>
                  <div className="text-red-400/70 text-sm">Cancel at the end of current period</div>
                </div>
              </div>
            </Button>
          )}

          {/* Manage Billing */}
          <Button
            variant="outline"
            className="justify-start p-4 h-auto border-gray-600 hover:border-gray-500 hover:bg-gray-700/50"
          >
            <div className="flex items-center">
              <Settings className="w-5 h-5 text-gray-400 mr-3" />
              <div className="text-left">
                <div className="text-gray-300 font-medium">Manage Billing</div>
                <div className="text-gray-400 text-sm">Update payment method & billing info</div>
              </div>
            </div>
          </Button>
        </div>
      </motion.div>
    </div>
  );
} 