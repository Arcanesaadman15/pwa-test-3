import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Clock, Users, Zap, ArrowLeft, Star, Shield, Award } from "lucide-react";
import { AuthForm } from "@/components/Auth/AuthForm";
import { PricingPlans } from "@/components/Subscription/PricingPlans";
import { useAuth } from "@/contexts/AuthContext";

interface PaywallProps {
  onComplete: () => void;
  onboardingData?: any;
}

export function Paywall({ onComplete, onboardingData }: PaywallProps) {
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [showPricing, setShowPricing] = useState(false);
  const { user } = useAuth();

  const features = [
    "63-day testosterone revival program that actually works",
    "Daily masculine habits that build real confidence",
    "Proven fat-loss protocols that target belly fat",
    "Sleep optimization for morning wood recovery",
    "Stress elimination techniques for peak performance",
    "Nutrition secrets that boost T naturally", 
    "Track your transformation from weak to warrior",
    "Brotherhood of 50,000+ men supporting your journey"
  ];

  const handleGetStarted = () => {
    if (!user) {
      // If not authenticated, show auth form first
    setShowAuthForm(true);
    } else {
      // If authenticated, go directly to pricing
      setShowPricing(true);
    }
  };

  const handleAuthComplete = () => {
    console.log('✅ Auth completed, showing pricing...');
    setShowAuthForm(false);
    setShowPricing(true);
  };

  const handlePricingSuccess = () => {
    console.log('✅ Payment successful, completing onboarding...');
    onComplete();
  };

  // Show authentication form if user needs to sign up/in
  if (showAuthForm) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white">
        <motion.div 
          className="absolute top-4 left-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.button
            onClick={() => setShowAuthForm(false)}
            className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm border border-white/20"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.button>
        </motion.div>
      <AuthForm 
        onComplete={handleAuthComplete}
        initialData={{
          name: onboardingData?.name || 'Wellness Warrior',
          program: determineProgramType(onboardingData)
        }}
      />
      </div>
    );
  }

  // Show pricing plans after authentication
  if (showPricing) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white overflow-y-auto">
        <motion.div 
          className="absolute top-4 left-4 z-10"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.button
            onClick={() => setShowPricing(false)}
            className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm border border-white/20"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.button>
        </motion.div>
        <div className="pt-16 pb-8 min-h-full">
          <PricingPlans onPlanSelect={handlePricingSuccess} />
        </div>
      </div>
    );
  }

  // Helper function to determine program type from onboarding data
  function determineProgramType(data: any): 'beginner' | 'intermediate' | 'advanced' {
    if (!data) return 'beginner';
    
    if (data.exerciseFrequency === '0' || data.exerciseFrequency === '1-2') {
      return 'beginner';
    } else if (data.exerciseFrequency === '5+' && data.urgencyLevel === 'yesterday') {
      return 'advanced';
    }
    return 'intermediate';
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white overflow-y-auto relative">
      {/* Enhanced background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.3, 0.7, 0.3],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 left-10 w-80 h-80 bg-purple-500/10 rounded-full blur-2xl"
          animate={{
            scale: [0.8, 1.3, 0.8],
            opacity: [0.2, 0.6, 0.2],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-cyan-500/5 rounded-full blur-xl"
          animate={{
            scale: [0.5, 1.2, 0.5],
            opacity: [0.1, 0.4, 0.1],
            x: [-80, 80, -80],
            y: [-40, 40, -40],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>

      <div className="min-h-screen px-4 py-8 relative z-10">
        <div className="container mx-auto max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-8"
        >
          <motion.h1 
            className="text-3xl font-bold mb-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
              Ready to Transform Your Life?
            </span>
          </motion.h1>
          <motion.p 
            className="text-gray-300 text-lg leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            You've seen the problem. You know the solution. Time to take action.
          </motion.p>
        </motion.div>

        {/* Enhanced Value Proposition Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
          className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-3xl p-8 mb-8 backdrop-blur-lg border-2 border-blue-400/30 relative overflow-hidden shadow-2xl"
        >
          {/* Enhanced Background Effects */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0"
            animate={{ 
              opacity: [0, 0.6, 0],
              x: [-100, 500]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          />

          {/* Floating decorative elements */}
          <div className="absolute inset-0 pointer-events-none opacity-10">
            <motion.div
              className="absolute top-4 left-4"
              animate={{ rotate: [0, 360], scale: [0.8, 1.2, 0.8] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            >
              <Star className="w-6 h-6" />
            </motion.div>
            <motion.div
              className="absolute top-4 right-4"
              animate={{ rotate: [360, 0], scale: [1.2, 0.8, 1.2] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            >
              <Award className="w-6 h-6" />
            </motion.div>
            <motion.div
              className="absolute bottom-4 left-4"
              animate={{ y: [-10, 10, -10], rotate: [0, 180, 360] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              <Shield className="w-6 h-6" />
            </motion.div>
          </div>

          {/* Popular Badge */}
          <motion.div 
            className="absolute -top-3 -right-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs font-bold px-4 py-2 rounded-bl-xl rounded-tr-3xl shadow-lg"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.6, type: "spring", stiffness: 200, damping: 15 }}
          >
            <motion.span
              animate={{ scale: [1, 1.1, 1] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              TRANSFORMATION SYSTEM
            </motion.span>
          </motion.div>

          <div className="text-center mb-6 relative z-10">
            <motion.h2 
              className="text-2xl font-bold mb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                The Masculine Revival System
              </span>
            </motion.h2>
            <motion.div 
              className="text-gray-300 mb-4"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.6 }}
            >
              Everything you need to reclaim your masculine power
            </motion.div>
          </div>

          {/* Enhanced Features List */}
          <motion.div 
            className="space-y-3 mb-6 relative z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0, duration: 0.6 }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2 + index * 0.1, duration: 0.5 }}
                className="flex items-center space-x-3 group"
                whileHover={{ x: 5 }}
              >
                <motion.div
                  className="flex-shrink-0"
                  animate={{ rotate: [0, 360] }}
                  transition={{
                    duration: 8 + index,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                >
                  <CheckCircle className="w-5 h-5 text-green-400 group-hover:text-green-300 transition-colors" />
                </motion.div>
                <motion.span 
                  className="text-sm group-hover:text-white transition-colors"
                  animate={{ opacity: [0.9, 1, 0.9] }}
                  transition={{
                    duration: 3 + index * 0.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  {feature}
                </motion.span>
              </motion.div>
            ))}
          </motion.div>

          {/* Enhanced Social Proof */}
          <motion.div 
            className="bg-white/10 rounded-xl p-4 mb-6 backdrop-blur-sm border border-white/20 relative overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 2.0, duration: 0.6 }}
            whileHover={{ scale: 1.02 }}
          >
            {/* Background pattern */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-blue-400/5 to-purple-400/5"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />

            <div className="flex items-center justify-center space-x-6 text-center relative z-10">
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                >
                  <Users className="w-6 h-6 text-blue-400 mx-auto mb-1" />
                </motion.div>
                <motion.div 
                  className="text-sm font-bold"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  50,000+
                </motion.div>
                <div className="text-xs text-gray-400">Active Users</div>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1], rotate: [0, 15, -15, 0] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Zap className="w-6 h-6 text-yellow-400 mx-auto mb-1" />
                </motion.div>
                <motion.div 
                  className="text-sm font-bold"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                  }}
                >
                  40%
                </motion.div>
                <div className="text-xs text-gray-400">Avg T-Boost</div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* Enhanced CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.2, duration: 0.6 }}
          className="space-y-4"
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <motion.button
              onClick={handleGetStarted}
              className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 
                       text-white font-bold py-4 text-lg rounded-xl shadow-xl hover:shadow-2xl 
                       transform transition-all duration-300 relative overflow-hidden group"
              animate={{ 
                boxShadow: [
                  "0 10px 30px rgba(34, 197, 94, 0.3)",
                  "0 15px 40px rgba(59, 130, 246, 0.4)", 
                  "0 10px 30px rgba(34, 197, 94, 0.3)"
                ]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {/* Button background effects */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100"
                animate={{ x: [-100, 400] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              
              {/* Pulsing background */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-blue-400/20 rounded-xl"
                animate={{ opacity: [0, 0.5, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />

              <span className="relative z-10 flex items-center justify-center">
                <motion.span
                  animate={{ rotate: [0, 360] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  className="mr-2"
                >
                  🚀
                </motion.span>
                Get Started Now
              </span>
            </motion.button>
          </motion.div>
          
          {/* Enhanced guarantee section */}
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.4, duration: 0.6 }}
          >
            <motion.p 
              className="text-xs text-gray-400 mb-2 flex items-center justify-center"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="mr-1"
              >
                ✅
              </motion.span>
              30-day money-back guarantee
            </motion.p>
            <motion.p 
              className="text-xs text-gray-400 flex items-center justify-center"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
            >
              <motion.span
                animate={{ rotate: [0, 360] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="mr-1"
              >
                🔒
              </motion.span>
              Secure payment • Cancel anytime
            </motion.p>
          </motion.div>
        </motion.div>

        {/* Enhanced Urgency Elements */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.6, duration: 0.6 }}
          className="text-center mt-6"
        >
          <motion.p 
            className="text-sm text-yellow-300 flex items-center justify-center"
            animate={{ 
              scale: [1, 1.05, 1],
              opacity: [0.8, 1, 0.8]
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <motion.span
              animate={{ scale: [1, 1.3, 1] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="mr-2"
            >
              ⚡
            </motion.span>
            Join thousands transforming their lives
          </motion.p>
        </motion.div>
        </div>
      </div>
    </div>
  );
}