import React, { createContext, useContext, useEffect, useState } from 'react';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured, type User } from '@/lib/supabase';

interface SubscriptionStatus {
  isSubscribed: boolean;
  plan: string | null;
  status: string | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
}

interface AuthContextType {
  user: SupabaseUser | null;
  userProfile: User | null;
  subscription: SubscriptionStatus;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, userData: { name: string; program: 'beginner' | 'intermediate' | 'advanced' }) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  createUserProfile: (supabaseUserId: string, userData: { name: string; program: 'beginner' | 'intermediate' | 'advanced'; email: string }) => Promise<void>;
  isLocalMode: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionStatus>({
    isSubscribed: false,
    plan: null,
    status: null,
    currentPeriodEnd: null,
    cancelAtPeriodEnd: false
  });
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fast timeout for production (1 second)
    const loadingTimeout = setTimeout(() => {
      console.log('Auth loading complete - no session found');
      setLoading(false);
    }, 1000);

    // Get current session
    supabase.auth.getSession()
      .then(({ data: { session } }: any) => {
        clearTimeout(loadingTimeout);
        console.log('Auth session retrieved:', !!session);
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchUserProfile(session.user.id, session.user.email);
        } else {
          setLoading(false);
        }
      })
      .catch((error: any) => {
        clearTimeout(loadingTimeout);
        console.error('Error getting auth session:', error);
        setLoading(false);
      });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event: any, session: any) => {
      console.log('Auth state changed:', event, !!session);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await fetchUserProfile(session.user.id, session.user.email);
      } else {
        setUserProfile(null);
        setSubscription({
          isSubscribed: false,
          plan: null,
          status: null,
          currentPeriodEnd: null,
          cancelAtPeriodEnd: false
        });
      }
      setLoading(false);
    });

    return () => {
      clearTimeout(loadingTimeout);
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (supabaseUserId: string, userEmail?: string) => {
    if (!isSupabaseConfigured) return;
    
    try {
      console.log('🔍 Fetching user profile for:', supabaseUserId);
      
      // Simple, fast profile fetch with 3-second timeout
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Profile fetch timeout')), 3000);
      });
      
      const fetchPromise = supabase
        .from('users')
        .select('*')
        .eq('id', supabaseUserId)
        .single();
      
      let profile = null;
      let error = null;
      
      try {
        const result = await Promise.race([fetchPromise, timeoutPromise]) as any;
        profile = result.data;
        error = result.error;
      } catch (timeoutError) {
        console.warn('Profile fetch timed out');
        setLoading(false);
        return;
      }

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error fetching user profile:', error);
        setLoading(false);
        return;
      }

      if (profile) {
        console.log('User profile found:', profile.name);
        setUserProfile(profile);
        // Save user to localStorage for faster restoration
        localStorage.setItem('peakforge-user', JSON.stringify(profile));
        await fetchSubscriptionStatus(profile.id);
      } else {
        console.log('No user profile found, user needs to complete signup flow');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      setLoading(false);
    }
  };

  const fetchSubscriptionStatus = async (userId: string) => {
    if (!isSupabaseConfigured) return;
    
    try {
      console.log('Fetching subscription status for:', userId);
      
      // Create a timeout promise to prevent hanging (increased from 5 to 10 seconds)
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Subscription fetch timeout')), 10000);
      });
      
      const fetchPromise = supabase
        .from('user_subscriptions')
        .select(`
          *,
          subscription_plans (
            name,
            price,
            interval
          )
        `)
        .eq('user_id', userId)
        .eq('status', 'active')
        .single();
      
      const { data: subscription, error } = await Promise.race([fetchPromise, timeoutPromise]) as any;

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching subscription:', error);
        return;
      }

      if (subscription) {
        console.log('Active subscription found');
        setSubscription({
          isSubscribed: true,
          plan: subscription.subscription_plans?.name || null,
          status: subscription.status,
          currentPeriodEnd: subscription.current_period_end,
          cancelAtPeriodEnd: subscription.cancel_at_period_end
        });
      } else {
        console.log('No active subscription found');
        setSubscription({
          isSubscribed: false,
          plan: null,
          status: null,
          currentPeriodEnd: null,
          cancelAtPeriodEnd: false
        });
      }
    } catch (error) {
      console.error('Error in fetchSubscriptionStatus:', error);
      // Set default subscription state on error
      setSubscription({
        isSubscribed: false,
        plan: null,
        status: null,
        currentPeriodEnd: null,
        cancelAtPeriodEnd: false
      });
    }
  };

  const signUp = async (email: string, password: string, userData: { name: string; program: 'beginner' | 'intermediate' | 'advanced' }) => {
    try {
      console.log('🎯 Starting signup process for:', email);
      
      // Step 1: Create the auth user with metadata
      const signUpResult = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: userData.name,
            program: userData.program,
            onboarding_complete: false // New users need onboarding
          }
        }
      });

      if (signUpResult.error) {
        console.error('🚨 Auth signup failed:', signUpResult.error);
        return { error: signUpResult.error };
      }

      if (!signUpResult.data.user) {
        console.error('🚨 No user returned from signup');
        return { error: new Error('No user returned from signup') };
      }

      console.log('✅ Auth user created:', signUpResult.data.user.id);
      
      // Step 2: Create the profile
      try {
        await createUserProfile(signUpResult.data.user.id, {
          name: userData.name,
          program: userData.program,
          email
        });
        console.log('✅ Profile creation completed');
      } catch (profileError) {
        console.warn('⚠️ Profile creation failed, but auth user exists:', profileError);
      }

      return { error: null };
    } catch (error) {
      console.error('🚨 Exception in signUp:', error);
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signOut = async () => {
    try {
      console.log('🚪 Signing out user...');
      
      // Clear all local state immediately
      setUser(null);
      setUserProfile(null);
      setSession(null);
      setSubscription({
        isSubscribed: false,
        plan: null,
        status: null,
        currentPeriodEnd: null,
        cancelAtPeriodEnd: false
      });
      
      // Sign out from Supabase
      await supabase.auth.signOut();
      
      console.log('✅ Sign out completed');
    } catch (error) {
      console.error('❌ Sign out error:', error);
      
      // Even if Supabase signOut fails, clear local state
      setUser(null);
      setUserProfile(null);
      setSession(null);
      setSubscription({
        isSubscribed: false,
        plan: null,
        status: null,
        currentPeriodEnd: null,
        cancelAtPeriodEnd: false
      });
    }
  };

  const createUserProfile = async (supabaseUserId: string, userData: { name: string; program: 'beginner' | 'intermediate' | 'advanced'; email: string }) => {
    try {
      console.log('🎯 Creating user profile in Supabase:', userData);
      
      // Create profile directly with correct onboarding status
      const profileData = {
        id: supabaseUserId,
        name: userData.name,
        email: userData.email,
        program: userData.program,
        current_day: 1,
        current_streak: 0,
        longest_streak: 0,
        completed_days: 0,
        start_date: new Date().toISOString(),
        achievements: 0,
        level: 1,
        onboarding_complete: false, // CRITICAL: New users must see onboarding
        preferences: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('users')
        .insert(profileData)
        .select()
        .single();

      if (error) {
        console.error('🚨 Error creating user profile:', error);
        throw error;
      }

      console.log('🎯 User profile created successfully with onboarding_complete:', data.onboarding_complete);
      setUserProfile(data);
      return;
    } catch (error) {
      console.error('🚨 Exception in createUserProfile:', error);
      throw error;
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!userProfile) return;

    try {
      const { data, error } = await supabase
        .from('users')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', userProfile.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating profile:', error);
        return;
      }

      setUserProfile(data);
    } catch (error) {
      console.error('Error in updateProfile:', error);
    }
  };

  const value = {
    user,
    userProfile,
    subscription,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
    createUserProfile,
    isLocalMode: false
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 