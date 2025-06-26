import { lemonSqueezySetup } from '@lemonsqueezy/lemonsqueezy.js';

// LemonSqueezy configuration
const LEMONSQUEEZY_API_KEY = import.meta.env.VITE_LEMONSQUEEZY_API_KEY;
const LEMONSQUEEZY_STORE_ID = import.meta.env.VITE_LEMONSQUEEZY_STORE_ID;
const APP_URL = import.meta.env.VITE_APP_URL || 'http://localhost:3000';

// Use relative URL when in browser (for ngrok and production)
// Only use absolute localhost URL during server-side operations
const getApiBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return ''; // Always use relative URLs in browser
  }
  return import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
};

const API_BASE_URL = getApiBaseUrl();

// Initialize LemonSqueezy
if (LEMONSQUEEZY_API_KEY) {
  lemonSqueezySetup({
    apiKey: LEMONSQUEEZY_API_KEY,
    onError: (error) => {
      console.error('LemonSqueezy Error:', error);
    },
  });
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  interval: 'month' | 'year' | 'lifetime';
  features: string[];
  variantId: string; // LemonSqueezy variant ID
  popular?: boolean;
}

// Subscription plans configuration
export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'pro',
    name: 'Pro',
    description: 'Premium wellness program with all features unlocked',
    price: 1599, // $15.99 in cents
    interval: 'month',
    variantId: '821326', // Your actual LemonSqueezy variant ID
    popular: true,
    features: [
      'Complete wellness program access',
      'Advanced progress tracking',
      'Personalized insights',
      'Priority customer support',
      'Mobile app access',
      'Progress analytics'
    ]
  }
  // Note: You can add more plans here as you create them in LemonSqueezy
  // Example for additional plans:
  // {
  //   id: 'basic',
  //   name: 'Basic',
  //   description: 'Essential features for your wellness journey',
  //   price: 999, // $9.99 in cents
  //   interval: 'month',
  //   variantId: 'YOUR_BASIC_VARIANT_ID',
  //   features: [
  //     'Core wellness tasks',
  //     'Basic progress tracking',
  //     'Email support'
  //   ]
  // },
  // {
  //   id: 'lifetime',
  //   name: 'Lifetime',
  //   description: 'One-time payment for lifetime access',
  //   price: 9999, // $99.99 in cents
  //   interval: 'lifetime',
  //   variantId: 'YOUR_LIFETIME_VARIANT_ID',
  //   features: [
  //     'All Pro features',
  //     'Lifetime updates',
  //     'VIP support'
  //   ]
  // }
];

export interface CheckoutOptions {
  variantId: string;
  userId: string;
  userEmail: string;
  userName: string;
  successUrl?: string;
  cancelUrl?: string;
}

export class LemonSqueezyService {
  static isConfigured(): boolean {
    return !!LEMONSQUEEZY_API_KEY && !!LEMONSQUEEZY_STORE_ID;
  }

  static async createCheckout(options: CheckoutOptions): Promise<{ checkoutUrl?: string; error?: string }> {
    // Mock mode for testing (remove this when LemonSqueezy is fully configured)
    const MOCK_MODE = import.meta.env.VITE_LEMONSQUEEZY_MOCK_MODE === 'true' || !this.isConfigured();
    
    if (MOCK_MODE) {
      console.log('🧪 MOCK MODE: Would create checkout for:', options);
      // Simulate checkout URL - opens a test page
      return { 
        checkoutUrl: `${APP_URL}/subscription/success?mock=true&plan=${options.variantId}`,
        error: undefined 
      };
    }

    if (!this.isConfigured()) {
      return { error: 'LemonSqueezy is not configured' };
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/lemonsqueezy/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          variantId: options.variantId,
          userId: options.userId,
          userEmail: options.userEmail,
          userName: options.userName,
          successUrl: options.successUrl || `${APP_URL}/subscription/success`,
          cancelUrl: options.cancelUrl || `${APP_URL}/subscription/cancel`,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create checkout');
      }

      const data = await response.json();
      return { checkoutUrl: data.checkoutUrl };
    } catch (error) {
      console.error('Checkout creation error:', error);
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  static async getSubscriptionStatus(userId: string): Promise<{ subscription?: any; error?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/lemonsqueezy/subscription/${userId}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          return { subscription: null };
        }
        throw new Error('Failed to fetch subscription status');
      }

      const data = await response.json();
      return { subscription: data.subscription };
    } catch (error) {
      console.error('Subscription status error:', error);
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  static async cancelSubscription(subscriptionId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/lemonsqueezy/subscription/${subscriptionId}/cancel`, {
        method: 'POST',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to cancel subscription');
      }

      return { success: true };
    } catch (error) {
      console.error('Subscription cancellation error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  static async updateSubscription(subscriptionId: string, updates: any): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/lemonsqueezy/subscription/${subscriptionId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update subscription');
      }

      return { success: true };
    } catch (error) {
      console.error('Subscription update error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  static formatPrice(priceInCents: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(priceInCents / 100);
  }

  static getPlanById(planId: string): SubscriptionPlan | undefined {
    return SUBSCRIPTION_PLANS.find(plan => plan.id === planId);
  }

  static getPlanByVariantId(variantId: string): SubscriptionPlan | undefined {
    return SUBSCRIPTION_PLANS.find(plan => plan.variantId === variantId);
  }
} 