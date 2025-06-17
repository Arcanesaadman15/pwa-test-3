import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { LemonSqueezyService, SUBSCRIPTION_PLANS, type SubscriptionPlan } from "@/lib/lemonsqueezy";
import { Check, Crown, Sparkles, Star, AlertTriangle } from "lucide-react";

interface PricingPlansProps {
  onPlanSelect?: (plan: SubscriptionPlan) => void;
  currentPlan?: string;
}

export function PricingPlans({ onPlanSelect, currentPlan }: PricingPlansProps) {
  const { user, userProfile } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSelectPlan = async (plan: SubscriptionPlan) => {
    if (!user || !userProfile) {
      setError('Please sign in to purchase a subscription');
      return;
    }

    // Check if LemonSqueezy is configured
    if (!LemonSqueezyService.isConfigured()) {
      setError('Payment system is not configured. Please contact support.');
      console.error('LemonSqueezy not configured:', {
        hasApiKey: !!import.meta.env.VITE_LEMONSQUEEZY_API_KEY,
        hasStoreId: !!import.meta.env.VITE_LEMONSQUEEZY_STORE_ID,
        storeId: import.meta.env.VITE_LEMONSQUEEZY_STORE_ID,
        variantId: plan.variantId
      });
      return;
    }

    // Check if variant ID is configured
    if (!plan.variantId || plan.variantId.includes('your_') || plan.variantId.includes('variant_id')) {
      setError(`${plan.name} plan is not configured yet. Please contact support.`);
      console.error('Invalid variant ID for plan:', plan);
      return;
    }

    setLoading(plan.id);
    setError(null);

    try {
      console.log('Creating checkout for plan:', plan);
      console.log('User info:', { userId: user.id, email: userProfile.email, name: userProfile.name });

      const result = await LemonSqueezyService.createCheckout({
        variantId: plan.variantId,
        userId: user.id,
        userEmail: userProfile.email,
        userName: userProfile.name,
      });

      console.log('Checkout result:', result);

      if (result.error) {
        setError(`Failed to create checkout: ${result.error}`);
        console.error('Checkout creation failed:', result.error);
        return;
      }

      if (result.checkoutUrl) {
        console.log('Redirecting to checkout:', result.checkoutUrl);
        // Redirect to LemonSqueezy checkout
        window.location.href = result.checkoutUrl;
      } else {
        setError('No checkout URL received. Please try again.');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(`Error: ${errorMessage}`);
      console.error('Plan selection error:', error);
    } finally {
      setLoading(null);
    }

    onPlanSelect?.(plan);
  };

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case 'basic':
        return <Star className="w-6 h-6" />;
      case 'pro':
        return <Crown className="w-6 h-6" />;
      case 'lifetime':
        return <Sparkles className="w-6 h-6" />;
      default:
        return <Star className="w-6 h-6" />;
    }
  };

  const getPlanGradient = (planId: string) => {
    switch (planId) {
      case 'basic':
        return 'from-blue-500 to-cyan-500';
      case 'pro':
        return 'from-purple-500 to-pink-500';
      case 'lifetime':
        return 'from-amber-500 to-orange-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
      {/* Configuration Status & Error Display */}
      {error && (
        <motion.div
          className="mb-8 bg-red-500/10 border border-red-500/20 rounded-xl p-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-start">
            <AlertTriangle className="w-5 h-5 text-red-400 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-red-400 font-medium mb-1">Payment Error</h4>
              <p className="text-red-300/80 text-sm">{error}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Configuration Warning */}
      {!LemonSqueezyService.isConfigured() && (
        <motion.div
          className="mb-8 bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-start">
            <AlertTriangle className="w-5 h-5 text-yellow-400 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-yellow-400 font-medium mb-1">Payment System Not Configured</h4>
              <p className="text-yellow-300/80 text-sm">
                LemonSqueezy integration needs to be set up. Please check the LEMONSQUEEZY_SETUP.md guide.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Header */}
      <div className="text-center mb-8 sm:mb-12">
        <motion.h1
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Choose Your{" "}
          <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Wellness Journey
          </span>
        </motion.h1>
        <motion.p
          className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Unlock your full potential with our premium wellness programs designed to transform your life
        </motion.p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12">
        {SUBSCRIPTION_PLANS.map((plan, index) => (
          <motion.div
            key={plan.id}
            className={`relative bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border transition-all duration-300 hover:scale-105 ${
              plan.popular
                ? 'border-purple-500/50 shadow-lg shadow-purple-500/20'
                : 'border-gray-700/50 hover:border-gray-600/50'
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            {/* Popular Badge */}
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>
            )}

            {/* Plan Icon */}
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${getPlanGradient(plan.id)} flex items-center justify-center mb-6`}>
              {getPlanIcon(plan.id)}
            </div>

            {/* Plan Name */}
            <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
            
            {/* Plan Description */}
            <p className="text-gray-400 mb-6">{plan.description}</p>

            {/* Price */}
            <div className="mb-8">
              <div className="flex items-baseline">
                <span className="text-4xl font-bold text-white">
                  {LemonSqueezyService.formatPrice(plan.price)}
                </span>
                {plan.interval !== 'lifetime' && (
                  <span className="text-gray-400 ml-2">/{plan.interval}</span>
                )}
              </div>
              {plan.interval === 'lifetime' && (
                <p className="text-green-400 text-sm mt-1">One-time payment</p>
              )}
            </div>

            {/* Features */}
            <ul className="space-y-3 mb-8">
              {plan.features.map((feature, featureIndex) => (
                <li key={featureIndex} className="flex items-center text-gray-300">
                  <Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            {/* CTA Button */}
            <Button
              onClick={() => handleSelectPlan(plan)}
              disabled={loading === plan.id || currentPlan === plan.id}
              className={`w-full py-3 rounded-xl font-medium transition-all duration-300 ${
                plan.popular
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg shadow-purple-500/25'
                  : currentPlan === plan.id
                  ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                  : 'bg-gray-700 hover:bg-gray-600 text-white border border-gray-600 hover:border-gray-500'
              }`}
            >
              {loading === plan.id ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Processing...
                </div>
              ) : currentPlan === plan.id ? (
                'Current Plan'
              ) : (
                `Get ${plan.name}`
              )}
            </Button>
          </motion.div>
        ))}
      </div>

      {/* Features Comparison */}
      <motion.div
        className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <h3 className="text-2xl font-bold text-white text-center mb-8">
          Why Choose PeakForge Premium?
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🎯</span>
            </div>
            <h4 className="text-xl font-semibold text-white mb-2">Personalized Programs</h4>
            <p className="text-gray-400">
              AI-powered wellness programs tailored to your specific goals and lifestyle
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📊</span>
            </div>
            <h4 className="text-xl font-semibold text-white mb-2">Advanced Analytics</h4>
            <p className="text-gray-400">
              Deep insights into your progress with detailed charts and personalized recommendations
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🏆</span>
            </div>
            <h4 className="text-xl font-semibold text-white mb-2">Expert Support</h4>
            <p className="text-gray-400">
              Direct access to wellness experts and priority customer support
            </p>
          </div>
        </div>
      </motion.div>

      {/* Money Back Guarantee */}
      <motion.div
        className="text-center mt-6 sm:mt-8 pb-8 sm:pb-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <p className="text-gray-400 text-sm sm:text-base px-4">
          <span className="text-green-400 font-medium">30-day money-back guarantee</span> • 
          Cancel anytime • Secure payments powered by LemonSqueezy
        </p>
      </motion.div>
    </div>
  );
} 