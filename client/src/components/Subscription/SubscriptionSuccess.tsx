import { useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle, Crown, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function SubscriptionSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    // You could refresh user subscription status here
    // or trigger a context refresh
  }, []);

  const handleContinue = () => {
    navigate('/home');
  };

  const handleManageSubscription = () => {
    navigate('/subscription');
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
          Welcome to Premium! 🎉
        </motion.h1>

        {/* Description */}
        <motion.p
          className="text-lg text-gray-300 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Your subscription has been activated successfully. You now have access to all premium features!
        </motion.p>

        {/* Premium Features List */}
        <motion.div
          className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="flex items-center justify-center mb-4">
            <Crown className="w-6 h-6 text-yellow-400 mr-2" />
            <h3 className="text-xl font-semibold text-white">Premium Features Unlocked</h3>
          </div>
          
          <ul className="text-left space-y-2 text-gray-300">
            <li className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-400 mr-3 flex-shrink-0" />
              Advanced analytics and insights
            </li>
            <li className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-400 mr-3 flex-shrink-0" />
              Personalized wellness programs
            </li>
            <li className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-400 mr-3 flex-shrink-0" />
              Priority customer support
            </li>
            <li className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-400 mr-3 flex-shrink-0" />
              Exclusive premium content
            </li>
          </ul>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Button
            onClick={handleContinue}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 rounded-xl font-medium"
          >
            Start Your Journey
            <ArrowRight className="w-5 h-5 ml-2" />
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
            Need help? Contact our support team at{" "}
            <a href="mailto:support@peakforge.com" className="text-blue-400 hover:underline">
              support@peakforge.com
            </a>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
} 