import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle, Crown, ArrowRight, Loader2, RefreshCw } from "lucide-react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";

export function SubscriptionSuccess() {
  const [, setLocation] = useLocation();
  const [countdown, setCountdown] = useState(10);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);
  const [statusChecked, setStatusChecked] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const { user, userProfile, subscription, refreshSubscription } = useAuth();

  // Check subscription status with retry logic
  useEffect(() => {
    let mounted = true;
    
    const checkSubscriptionStatus = async () => {
      if (!user) return;
      
      try {
        setIsCheckingStatus(true);
        await refreshSubscription();
        
        if (mounted) {
          setStatusChecked(true);
          setIsCheckingStatus(false);
        }
      } catch (error) {
        console.error('Failed to check subscription status:', error);
        
        if (mounted && retryCount < 3) {
          // Retry after a delay
          setTimeout(() => {
            setRetryCount(prev => prev + 1);
          }, 2000);
        } else if (mounted) {
          setIsCheckingStatus(false);
          setStatusChecked(true);
        }
      }
    };

    if (user && !statusChecked) {
      checkSubscriptionStatus();
    }

    return () => {
      mounted = false;
    };
  }, [user, retryCount, statusChecked, refreshSubscription]);

  // Countdown timer for auto-redirect
  useEffect(() => {
    if (!statusChecked || isCheckingStatus) return;

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleContinue();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [statusChecked, isCheckingStatus]);

  const handleContinue = () => {
    if (subscription.isSubscribed) {
      // User has active subscription, go to main app
      setLocation('/home');
    } else if (userProfile?.onboarding_complete) {
      // User completed onboarding but subscription not detected yet, go to home anyway
      setLocation('/home');
    } else {
      // User needs to complete onboarding first
      setLocation('/');
    }
  };

  const handleManageSubscription = () => {
    setLocation('/subscription');
  };

  const handleRetryCheck = async () => {
    setRetryCount(0);
    setStatusChecked(false);
    setIsCheckingStatus(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
      <motion.div
        className="max-w-md w-full text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Success Icon */}
        <motion.div
          className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <CheckCircle className="w-10 h-10 text-white" />
        </motion.div>

        {/* Title */}
        <motion.h1
          className="text-3xl font-bold text-white mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          Payment Successful! 🎉
        </motion.h1>

        {/* Dynamic Description based on status */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {isCheckingStatus ? (
            <div className="flex items-center justify-center space-x-3 text-lg text-gray-300">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Activating your premium access...</span>
            </div>
          ) : subscription.isSubscribed ? (
            <p className="text-lg text-green-300">
              ✅ Premium access activated! You're all set to unlock your potential.
            </p>
          ) : (
            <div className="text-lg text-gray-300">
              <p className="mb-2">Thank you for your purchase!</p>
              <p className="text-sm text-gray-400">
                Your subscription is being processed and will be active within a few minutes.
              </p>
            </div>
          )}
        </motion.div>

        {/* Subscription Status Indicator */}
        {statusChecked && (
          <motion.div
            className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 border border-gray-700/50 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <div className="flex items-center justify-center space-x-3">
              <Crown className="w-5 h-5 text-yellow-400" />
              <span className="text-white font-medium">
                {subscription.isSubscribed ? 'Premium Active' : 'Activating Premium...'}
              </span>
              {subscription.isSubscribed ? (
                <CheckCircle className="w-5 h-5 text-green-400" />
              ) : (
                <Loader2 className="w-5 h-5 animate-spin text-yellow-400" />
              )}
            </div>
            
            {!subscription.isSubscribed && (
              <Button
                onClick={handleRetryCheck}
                variant="ghost"
                size="sm"
                className="mt-3 text-gray-400 hover:text-white"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh Status
              </Button>
            )}
          </motion.div>
        )}

        {/* Premium Features List */}
        <motion.div
          className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="flex items-center justify-center mb-4">
            <Crown className="w-6 h-6 text-yellow-400 mr-2" />
            <h3 className="text-xl font-semibold text-white">What You've Unlocked</h3>
          </div>
          
          <ul className="text-left space-y-2 text-gray-300">
            <li className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-400 mr-3 flex-shrink-0" />
              Complete 63-day vitality and energy program
            </li>
            <li className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-400 mr-3 flex-shrink-0" />
              Daily wellness habits & confidence building
            </li>
            <li className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-400 mr-3 flex-shrink-0" />
              Personalized nutrition & workout plans
            </li>
            <li className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-400 mr-3 flex-shrink-0" />
              Advanced progress tracking & insights
            </li>
          </ul>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <Button
            onClick={handleContinue}
            disabled={isCheckingStatus}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-4 rounded-xl font-medium text-lg"
          >
            {isCheckingStatus ? (
              <div className="flex items-center justify-center">
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Setting up your account...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                Start Your Transformation
                {countdown > 0 && ` (${countdown}s)`}
                <ArrowRight className="w-5 h-5 ml-2" />
              </div>
            )}
          </Button>
          
          <Button
            onClick={handleManageSubscription}
            variant="outline"
            className="w-full border-gray-600 hover:border-gray-500 hover:bg-gray-700/50 text-gray-300 py-3 rounded-xl"
          >
            Manage Subscription
          </Button>
        </motion.div>

        {/* Support Info */}
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <p className="text-gray-400 text-sm">
            Having issues? Contact{" "}
            <a href="mailto:support@peakforge.club" className="text-orange-400 hover:underline">
              support@peakforge.club
            </a>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
} 