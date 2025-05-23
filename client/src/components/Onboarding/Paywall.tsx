import { useState } from 'react';
import { motion } from 'framer-motion';
import { OnboardingData } from '@/data/onboardingData';
import { Button } from '@/components/ui/button';

interface PaywallProps {
  data: Partial<OnboardingData>;
  onSuccess: () => void;
  isLoading: boolean;
}

export function Paywall({ data, onSuccess, isLoading }: PaywallProps) {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('yearly');

  const handleSubscribe = async () => {
    // Placeholder for Stripe integration
    // For now, just simulate successful payment
    setTimeout(() => {
      onSuccess();
    }, 1000);
  };

  const monthlyPrice = 29.99;
  const yearlyPrice = 199.99;
  const yearlySavings = (monthlyPrice * 12) - yearlyPrice;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black px-6 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">🚀</span>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Ready to Transform Your Life?
        </h1>
        <p className="text-lg text-gray-400">
          Join thousands of men who've unlocked their peak potential
        </p>
      </motion.div>

      {/* Value Propositions */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="mb-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {[
            { icon: '🎯', title: 'Personalized 63-Day Program', desc: 'Custom-built for your testosterone goals' },
            { icon: '🏆', title: 'Skill Tree Progression', desc: 'Unlock achievements as you transform' },
            { icon: '📊', title: 'Progress Tracking', desc: 'See your improvements in real-time' },
            { icon: '🔥', title: 'Proven Results', desc: '89% completion rate, 4.8/5 satisfaction' }
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
              className="bg-gray-800/50 rounded-xl p-4 border border-gray-700"
            >
              <div className="flex items-start space-x-3">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <h3 className="font-semibold text-white mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-400">{item.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Pricing Plans */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="mb-8"
      >
        <h2 className="text-xl font-bold text-white text-center mb-6">Choose Your Plan</h2>
        
        <div className="space-y-4 max-w-md mx-auto">
          {/* Yearly Plan - Recommended */}
          <div
            onClick={() => setSelectedPlan('yearly')}
            className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
              selectedPlan === 'yearly'
                ? 'border-blue-500 bg-blue-500/10 shadow-lg scale-105'
                : 'border-gray-600 bg-gray-800/50 hover:border-gray-500'
            }`}
          >
            {/* Best Value Badge */}
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-1 rounded-full text-sm font-bold">
                BEST VALUE
              </span>
            </div>
            
            <div className="text-center">
              <h3 className="text-xl font-bold text-white mb-2">Yearly Access</h3>
              <div className="mb-2">
                <span className="text-3xl font-bold text-white">${yearlyPrice}</span>
                <span className="text-gray-400">/year</span>
              </div>
              <p className="text-green-400 font-medium mb-2">Save ${yearlySavings.toFixed(0)} per year</p>
              <p className="text-sm text-gray-400">Just $16.67/month</p>
            </div>
          </div>

          {/* Monthly Plan */}
          <div
            onClick={() => setSelectedPlan('monthly')}
            className={`p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
              selectedPlan === 'monthly'
                ? 'border-purple-500 bg-purple-500/10 shadow-lg scale-105'
                : 'border-gray-600 bg-gray-800/50 hover:border-gray-500'
            }`}
          >
            <div className="text-center">
              <h3 className="text-xl font-bold text-white mb-2">Monthly Access</h3>
              <div className="mb-2">
                <span className="text-3xl font-bold text-white">${monthlyPrice}</span>
                <span className="text-gray-400">/month</span>
              </div>
              <p className="text-sm text-gray-400">Cancel anytime</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Trust Indicators */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1, duration: 0.6 }}
        className="mb-8"
      >
        <div className="bg-gray-800/30 rounded-xl p-4 text-center">
          <div className="flex justify-center space-x-6 text-sm text-gray-400">
            <div className="flex items-center">
              <span className="text-green-500 mr-1">🔒</span>
              Secure Payment
            </div>
            <div className="flex items-center">
              <span className="text-blue-500 mr-1">↩️</span>
              30-Day Guarantee
            </div>
            <div className="flex items-center">
              <span className="text-purple-500 mr-1">✖️</span>
              Cancel Anytime
            </div>
          </div>
        </div>
      </motion.div>

      {/* CTA Button */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.6 }}
        className="text-center"
      >
        <Button
          onClick={handleSubscribe}
          disabled={isLoading}
          size="lg"
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 
                   text-white font-bold px-12 py-4 text-lg rounded-xl shadow-xl hover:shadow-2xl 
                   transform hover:scale-105 transition-all duration-200 w-full max-w-md"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Processing...
            </div>
          ) : (
            `Start My Transformation - $${selectedPlan === 'yearly' ? yearlyPrice : monthlyPrice}`
          )}
        </Button>
        
        <p className="text-xs text-gray-500 mt-4 max-w-md mx-auto">
          By continuing, you agree to our Terms of Service and Privacy Policy. 
          Subscription renews automatically. Cancel anytime.
        </p>
      </motion.div>

      {/* Social Proof */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.7, duration: 0.6 }}
        className="mt-8 text-center"
      >
        <p className="text-sm text-gray-400 mb-2">Join 15,000+ men already transforming their lives</p>
        <div className="flex justify-center">
          {[...Array(5)].map((_, i) => (
            <span key={i} className="text-yellow-400 text-lg">⭐</span>
          ))}
          <span className="text-gray-400 ml-2 text-sm">4.8/5 average rating</span>
        </div>
      </motion.div>
    </div>
  );
}