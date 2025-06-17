import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { XCircle, ArrowLeft, HelpCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function SubscriptionCancel() {
  const navigate = useNavigate();

  const handleRetry = () => {
    navigate('/pricing');
  };

  const handleGoHome = () => {
    navigate('/home');
  };

  const handleContactSupport = () => {
    window.open('mailto:support@peakforge.com?subject=Subscription Issue', '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
      <motion.div
        className="max-w-md w-full text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="w-20 h-20 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-8"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <XCircle className="w-10 h-10 text-white" />
        </motion.div>

        <motion.h1
          className="text-3xl font-bold text-white mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          Subscription Cancelled
        </motion.h1>

        <motion.p
          className="text-lg text-gray-300 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Your subscription purchase was cancelled. No charges have been made.
        </motion.p>

        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Button
            onClick={handleRetry}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 rounded-xl font-medium"
          >
            Try Again
          </Button>
          
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={handleGoHome}
              variant="outline"
              className="border-gray-600 hover:border-gray-500 hover:bg-gray-700/50 text-gray-300 py-3 rounded-xl"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Home
            </Button>
            
            <Button
              onClick={handleContactSupport}
              variant="outline"
              className="border-gray-600 hover:border-gray-500 hover:bg-gray-700/50 text-gray-300 py-3 rounded-xl"
            >
              <HelpCircle className="w-4 h-4 mr-2" />
              Support
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
} 