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
    <PricingPlans 
      key={`pricing-${Date.now()}`} // Force remount
      onPlanSelect={handlePlanSelect}
      currentPlan={subscription.plan || undefined}
    />
  );
} 