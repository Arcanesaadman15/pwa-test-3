import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, Users, Zap } from "lucide-react";

interface PaywallProps {
  onComplete: () => void;
}

export function Paywall({ onComplete }: PaywallProps) {
  const features = [
    "Complete 63-day testosterone optimization program",
    "Personalized daily tasks and routines",
    "Advanced skill tree progression system",
    "Expert-designed nutrition protocols",
    "Sleep optimization techniques",
    "Stress management strategies",
    "Progress tracking and analytics",
    "Exclusive community access"
  ];

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white overflow-y-auto">
      <div className="min-h-screen px-4 py-8">
        <div className="container mx-auto max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold mb-4">Unlock Your Transformation</h1>
          <p className="text-gray-300">Join thousands of men who've already boosted their testosterone naturally</p>
        </motion.div>

        {/* Pricing Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-3xl p-8 mb-8 backdrop-blur-lg border-2 border-blue-400/30 relative overflow-hidden"
        >
          {/* Popular Badge */}
          <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs font-bold px-4 py-2 rounded-bl-xl">
            MOST POPULAR
          </div>

          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">PeakForge Premium</h2>
            <div className="flex items-center justify-center space-x-2 mb-4">
              <span className="text-4xl font-bold">$47</span>
              <div className="text-left">
                <div className="text-sm text-gray-400 line-through">$97</div>
                <div className="text-sm text-green-400">One-time</div>
              </div>
            </div>
            <div className="bg-red-500/20 border border-red-400/30 rounded-lg p-2 mb-4">
              <div className="flex items-center justify-center space-x-2 text-red-300">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-medium">Limited Time: 50% OFF</span>
              </div>
            </div>
          </div>

          {/* Features List */}
          <div className="space-y-3 mb-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="flex items-center space-x-3"
              >
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span className="text-sm">{feature}</span>
              </motion.div>
            ))}
          </div>

          {/* Social Proof */}
          <div className="bg-white/5 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-center space-x-4 text-center">
              <div>
                <Users className="w-6 h-6 text-blue-400 mx-auto mb-1" />
                <div className="text-sm font-bold">50,000+</div>
                <div className="text-xs text-gray-400">Active Users</div>
              </div>
              <div>
                <Zap className="w-6 h-6 text-yellow-400 mx-auto mb-1" />
                <div className="text-sm font-bold">40%</div>
                <div className="text-xs text-gray-400">Avg T-Boost</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="space-y-4"
        >
          <Button
            onClick={onComplete}
            size="lg"
            className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 
                     text-white font-bold py-4 text-lg rounded-xl shadow-xl hover:shadow-2xl 
                     transform hover:scale-105 transition-all duration-200"
          >
            🚀 Start My Transformation Now
          </Button>
          
          <div className="text-center">
            <p className="text-xs text-gray-400 mb-2">
              ✅ 30-day money-back guarantee
            </p>
            <p className="text-xs text-gray-400">
              🔒 Secure payment • Cancel anytime
            </p>
          </div>
        </motion.div>

        {/* Urgency Elements */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
          className="text-center mt-6"
        >
          <p className="text-sm text-yellow-300">
            ⚡ Only 247 spots left at this price
          </p>
        </motion.div>
        </div>
      </div>
    </div>
  );
}