// User profile interface for Supabase
export interface User {
  id: string;
  name: string;
  email: string;
  program: 'beginner' | 'intermediate' | 'advanced';
  current_day: number;
  current_streak: number;
  longest_streak: number;
  completed_days: number;
  start_date: string;
  achievements: number;
  level: number;
  onboarding_complete: boolean;
  preferences?: any;
  created_at: string;
  updated_at: string;
}

// Subscription plan interface
export interface SubscriptionPlan {
  id: string;
  name: string;
  description?: string;
  price: number; // Price in cents
  interval: 'month' | 'year' | 'lifetime';
  features: string[];
  stripe_product_id?: string;
  stripe_price_id?: string;
  active: boolean;
  created_at: string;
}

// User subscription interface
export interface UserSubscription {
  id: string;
  user_id: string;
  plan_id: string;
  status: 'active' | 'canceled' | 'past_due' | 'trialing';
  stripe_subscription_id?: string;
  stripe_customer_id?: string;
  current_period_start?: string;
  current_period_end?: string;
  cancel_at_period_end: boolean;
  trial_start?: string;
  trial_end?: string;
  created_at: string;
  updated_at: string;
}

// Insert types for creating new records
export type InsertUser = Omit<User, 'id' | 'created_at' | 'updated_at'>;
export type InsertSubscriptionPlan = Omit<SubscriptionPlan, 'id' | 'created_at'>;
export type InsertUserSubscription = Omit<UserSubscription, 'id' | 'created_at' | 'updated_at'>;
