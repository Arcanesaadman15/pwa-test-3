import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Clock, Users, Zap, ArrowLeft, Star, Shield, Award, Flame, Target } from "lucide-react";
import { AuthForm } from "@/components/Auth/AuthForm";
import { PricingPlans } from "@/components/Subscription/PricingPlans";
import { useAuth } from "@/contexts/AuthContext";
import { Icon } from '@/lib/iconUtils';

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
      <div className="fixed inset-0 bg-black text-white">
        <motion.div 
          className="absolute top-4 left-4 z-10"
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
      <div className="fixed inset-0 bg-black text-white overflow-y-auto">
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
    <div className="min-h-screen bg-black text-white overflow-y-auto">
      <div className="max-w-2xl mx-auto px-4 py-16">
        
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center">
              <Flame className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <motion.h1 
            className="text-4xl md:text-6xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Ready to Transform
            <br />
            <span className="text-orange-500">Your Life?</span>
          </motion.h1>
          
          <motion.p 
            className="text-xl text-gray-300 mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            You've seen the problem. You know the solution. Time to take action.
          </motion.p>
        </div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-900 border border-gray-700 rounded-2xl p-8 mb-16"
        >
          <div className="text-center mb-8">
            <div className="flex items-center text-blue-400 mb-4">
              <Icon name="Rocket" size={20} className="mr-2" />
              <span className="text-sm font-medium">PREMIUM UPGRADE</span>
            </div>
            <h2 className="text-2xl font-bold mb-2">The Masculine Revival System</h2>
            <p className="text-gray-300">Everything you need to reclaim your masculine power</p>
          </div>

          <div className="space-y-4">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.05 }}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800/50 transition-colors"
              >
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span className="text-gray-300">{feature}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-3 gap-6 mb-16"
        >
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Target className="w-6 h-6 text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-blue-400 mb-1">50K+</div>
            <div className="text-sm text-gray-300">Men Transformed</div>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Zap className="w-6 h-6 text-green-400" />
            </div>
            <div className="text-2xl font-bold text-green-400 mb-1">63</div>
            <div className="text-sm text-gray-300">Days to Peak</div>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6 text-purple-400" />
            </div>
            <div className="text-2xl font-bold text-purple-400 mb-1">94%</div>
            <div className="text-sm text-gray-300">Success Rate</div>
          </div>
        </motion.div>

        {/* Social Proof */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gray-900 border border-gray-700 rounded-2xl p-6 mb-16 text-center"
        >
          <div className="flex justify-center items-center space-x-4 mb-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-8 h-8 bg-gray-700 rounded-full"></div>
            ))}
          </div>
          <p className="text-gray-300 text-sm italic mb-2">
            "Increased my energy by 300% in 30 days"
          </p>
          <p className="text-gray-400 text-xs">- Jake, 32</p>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center"
        >
          <motion.button
            onClick={handleGetStarted}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 text-lg rounded-xl transition-all duration-200 hover:scale-105 shadow-xl hover:shadow-2xl relative overflow-hidden"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0"
              animate={{ 
                opacity: [0, 0.5, 0],
                x: [-100, 300]
              }}
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
                <Icon name="Rocket" size={20} className="text-white" />
              </motion.span>
              Get Started Now
            </span>
          </motion.button>
          
          <motion.p 
            className="text-xs text-gray-400 mt-4 flex items-center justify-center"
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
              <Icon name="CheckCircle" size={16} className="text-green-400" />
            </motion.span>
            30-day money-back guarantee
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}