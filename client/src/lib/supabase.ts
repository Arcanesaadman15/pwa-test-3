import { createClient } from '@supabase/supabase-js';
import type { User, SubscriptionPlan, UserSubscription } from '../../../shared/schema';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://vkczvtgtbzcqempgampj.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZrY3p2dGd0YnpjcWVtcGdhbXBqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyOTMzNjksImV4cCI6MjA2Mzg2OTM2OX0.isSm2oZeGUZEtoxUWQQMdSoT5t7pAQwvvtgBbNETh8Q';



// Create a mock client for development when Supabase isn't configured yet
const createMockClient = () => ({
  auth: {
    signUp: async () => ({ data: null, error: new Error('Supabase not configured') }),
    signInWithPassword: async () => ({ data: null, error: new Error('Supabase not configured') }),
    signOut: async () => ({ error: null }),
    getSession: async () => ({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
  },
  from: () => ({
    select: () => ({ data: null, error: new Error('Supabase not configured') }),
    insert: () => ({ data: null, error: new Error('Supabase not configured') }),
    update: () => ({ data: null, error: new Error('Supabase not configured') }),
    upsert: () => ({ data: null, error: new Error('Supabase not configured') })
  })
});

export const supabase = (!supabaseUrl || !supabaseAnonKey) 
  ? createMockClient() as any
  : createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        flowType: 'pkce'
      }
    });

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

// Export types for use in components
export type { User, SubscriptionPlan, UserSubscription }; 