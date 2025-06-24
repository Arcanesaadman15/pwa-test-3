import { PricingPlans } from "@/components/Subscription/PricingPlans";
import { useAuth } from "@/contexts/AuthContext";
import { type SubscriptionPlan } from "@/lib/lemonsqueezy";

export default function PricingPage() {
  const { subscription } = useAuth();

  const handlePlanSelect = (plan: SubscriptionPlan) => {
    // Plan selected
    // Additional logic can be added here if needed
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <PricingPlans 
        onPlanSelect={handlePlanSelect}
        currentPlan={subscription.plan || undefined}
      />
    </div>
  );
} 