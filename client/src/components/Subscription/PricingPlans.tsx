import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { LemonSqueezyService, SUBSCRIPTION_PLANS } from "@/lib/lemonsqueezy";
import { Check, AlertTriangle, Flame, Target, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { analytics } from '@/lib/analytics';

interface PricingPlansProps {
  onPlanSelect?: (plan: any) => void;
  currentPlan?: string;
}

export function PricingPlans({ onPlanSelect }: PricingPlansProps) {
  const { user, userProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Force component refresh timestamp

  const proplan = SUBSCRIPTION_PLANS.find(p => p.id === 'pro');

  const handleUpgrade = async () => {
    if (!user || !userProfile) {
      setError('Please sign in first');
      return;
    }

    if (!proplan) {
      setError('Plan not available');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      analytics.track('plan_selected', { planId: proplan.id, variantId: proplan.variantId, price: proplan.price });
      analytics.track('checkout_started', { variantId: proplan.variantId, userId: user.id });
      const result = await LemonSqueezyService.createCheckout({
        variantId: proplan.variantId,
        userId: user.id,
        userEmail: userProfile.email,
        userName: userProfile.name,
      });

      if (result.error) {
        setError(`Payment error: ${result.error}`);
        return;
      }

      if (result.checkoutUrl) {
        window.location.href = result.checkoutUrl;
      } else {
        setError('Unable to start checkout. Try again.');
      }
    } catch (error) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }

    onPlanSelect?.(proplan);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Error Display */}
      {error && (
        <div className="max-w-2xl mx-auto px-4 pt-8">
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-8">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-red-400 mr-3" />
              <p className="text-red-300">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        
        {/* Hero Section */}
        <div className="mb-16">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center">
              <Flame className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Unlock Your Peak
            <br />
            <span className="text-orange-500">Performance</span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            The complete system used by 10,000+ men to naturally optimize energy, 
            strength, and vitality in just 63 days.
          </p>
        </div>

        {/* Trust indicators with testimonial images */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center items-center space-x-3 mb-3">
            {[
              { name: "Marcus", image: "/images/marcus.png" },
              { name: "Jake", image: "/images/jake.png" },
              { name: "Carlos", image: "/images/carlos.png" }
            ].map((user, i) => (
              <motion.div 
                key={user.name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + i * 0.1, duration: 0.3 }}
                className="relative"
              >
                <img 
                  src={user.image}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-orange-500/30"
                />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900"></div>
              </motion.div>
            ))}
          </div>
          <p className="text-sm text-gray-400">
            Join 50,000+ men who've transformed their lives
          </p>
        </motion.div>

        {/* Pricing Card */}
        <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8 mb-8">
          <div className="mb-6">
            <div className="text-orange-500 text-sm font-medium mb-2">LIMITED TIME</div>
            <div className="text-5xl font-bold mb-2">$4.99<span className="text-2xl text-gray-400">/mo</span></div>
            <div className="text-gray-400">Get started today, cancel anytime</div>
          </div>

          {/* What's Included */}
          <div className="space-y-4 mb-8 text-left">
            <div className="flex items-center">
              <Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
              <span>Complete 63-day transformation program</span>
            </div>
            <div className="flex items-center">
              <Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
              <span>Daily habits that support natural energy and vitality</span>
            </div>
            <div className="flex items-center">
              <Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
              <span>Nutrition guides & workout routines</span>
            </div>
            <div className="flex items-center">
              <Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
              <span>Progress tracking & milestone rewards</span>
            </div>
            <div className="flex items-center">
              <Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
              <span>24/7 access on all devices</span>
            </div>
          </div>

          <Button
            onClick={handleUpgrade}
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 text-lg rounded-xl transition-all duration-200 hover:scale-105"
          >
            {loading ? 'Processing...' : 'Start Your Transformation'}
          </Button>

          <p className="text-xs text-gray-400 mt-4">
            30-day money-back guarantee • Secure payment via LemonSqueezy
          </p>
        </div>

        {/* Results Section */}
        <div className="grid grid-cols-3 gap-6 mb-16">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Target className="w-6 h-6 text-blue-400" />
            </div>
            <div className="text-2xl font-bold mb-1">+300%</div>
            <div className="text-sm text-gray-400">Energy Increase</div>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Zap className="w-6 h-6 text-green-400" />
            </div>
            <div className="text-2xl font-bold mb-1">63</div>
            <div className="text-sm text-gray-400">Days to Transform</div>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Flame className="w-6 h-6 text-purple-400" />
            </div>
            <div className="text-2xl font-bold mb-1">10k+</div>
            <div className="text-sm text-gray-400">Men Transformed</div>
          </div>
        </div>

        {/* FAQ */}
        <div className="text-left">
          <h3 className="text-xl font-bold mb-6 text-center">Common Questions</h3>
          <div className="space-y-4">
            <div>
              <div className="font-medium mb-2">Is this actually natural?</div>
              <div className="text-gray-400 text-sm">100%. No supplements, no shortcuts. Just proven lifestyle changes that work.</div>
            </div>
            <div>
              <div className="font-medium mb-2">How fast will I see results?</div>
              <div className="text-gray-400 text-sm">Most men notice increased energy within 7-14 days. Full transformation takes 63 days.</div>
            </div>
            <div>
              <div className="font-medium mb-2">Can I cancel anytime?</div>
              <div className="text-gray-400 text-sm">Yes, cancel with one click. No questions asked.</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
} 