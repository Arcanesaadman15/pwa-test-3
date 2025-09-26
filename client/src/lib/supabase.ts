import { createClient } from '@supabase/supabase-js';
import type { User, SubscriptionPlan, UserSubscription } from '../../../shared/schema';

// Use environment variables without fallbacks for better error detection
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://vkczvtgtbzcqempgampj.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZrY3p2dGd0YnpjcWVtcGdhbXBqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyOTMzNjksImV4cCI6MjA2Mzg2OTM2OX0.isSm2oZeGUZEtoxUWQQMdSoT5t7pAQwvvtgBbNETh8Q';

// Log configuration status for debugging
if (typeof window !== 'undefined') {
  console.log('🔧 Supabase Config:', {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseAnonKey,
    url: supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : 'Missing'
  });
}



// Create a mock client for development when Supabase isn't configured yet
const createMockClient = () => ({
  auth: {
    signUp: async () => ({ data: null, error: new Error('Supabase not configured') }),
    signInWithPassword: async () => ({ data: null, error: new Error('Supabase not configured') }),
    signInWithOAuth: async () => ({ data: null, error: new Error('Supabase not configured') }),
    signOut: async () => ({ error: null }),
    getSession: async () => ({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
  },
  from: () => ({
    select: () => ({ data: null, error: new Error('Supabase not configured') }),
    insert: () => ({ data: null, error: new Error('Supabase not configured') }),
    update: () => ({ data: null, error: new Error('Supabase not configured') }),
    upsert: () => ({ data: null, error: new Error('Supabase not configured') }),
    eq: function() { return this; },
    single: function() { return this; }
  })
});

export const supabase = (!supabaseUrl || !supabaseAnonKey) 
  ? createMockClient() as any
  : createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        flowType: 'pkce',
        // Optimize for faster session detection
        storageKey: 'sb-auth-token',
        debug: import.meta.env.DEV
      },
      global: {
        headers: {
          'x-client-info': 'supabase-js-web',
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      },
      db: {
        schema: 'public'
      },
      realtime: {
        params: {
          eventsPerSecond: 10
        }
      }
    });

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

// Utility for robust Supabase query execution with retry logic
export async function executeSupabaseQuery<T>(
  queryFn: () => Promise<{ data: T | null; error: any }>,
  options: {
    retries?: number;
    timeoutMs?: number;
    description?: string;
  } = {}
): Promise<{ data: T | null; error: any }> {
  const { retries = 2, timeoutMs = 5000, description = 'Supabase query' } = options;
  
  for (let attempt = 1; attempt <= retries + 1; attempt++) {
    try {
      console.log(`🔄 ${description} - Attempt ${attempt}/${retries + 1}`);
      
      // Add timeout to prevent hanging
      const queryPromise = queryFn();
      const timeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error(`${description} timeout after ${timeoutMs}ms`)), timeoutMs)
      );
      
      const result = await Promise.race([queryPromise, timeoutPromise]);
      
      // Check for specific errors that indicate we should retry
      if (result.error) {
        const shouldRetry = (
          result.error.code === 'PGRST116' || // No rows found (might be temporary)
          result.error.message?.includes('timeout') ||
          result.error.message?.includes('network') ||
          result.error.message?.includes('502') ||
          result.error.message?.includes('503') ||
          result.error.message?.includes('406')
        );
        
        if (shouldRetry && attempt <= retries) {
          console.log(`⚠️ ${description} failed (${result.error.code || result.error.message}), retrying in ${attempt * 1000}ms...`);
          await new Promise(resolve => setTimeout(resolve, attempt * 1000)); // Progressive delay
          continue;
        }
      }
      
      if (result.data || !result.error) {
        console.log(`✅ ${description} succeeded on attempt ${attempt}`);
      }
      
      return result;
    } catch (error: any) {
      if (attempt <= retries) {
        console.log(`⚠️ ${description} error: ${error.message}, retrying in ${attempt * 1000}ms...`);
        await new Promise(resolve => setTimeout(resolve, attempt * 1000));
        continue;
      }
      
      console.error(`❌ ${description} failed after ${retries + 1} attempts:`, error);
      return { data: null, error };
    }
  }
  
  return { data: null, error: new Error(`${description} failed after all retries`) };
}

// Export types for use in components
export type { User, SubscriptionPlan, UserSubscription }; 