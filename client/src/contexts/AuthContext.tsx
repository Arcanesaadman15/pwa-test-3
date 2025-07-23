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
  refreshSubscription: () => Promise<void>;
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
    // Extended timeout to ensure smooth loading experience (2.5 seconds)
    const loadingTimeout = setTimeout(() => {
      setLoading(false);
    }, 2500);

    // Get current session
    supabase.auth.getSession()
      .then(({ data: { session } }: any) => {
        clearTimeout(loadingTimeout);
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
      console.log('🔐 Auth state change:', event, session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        // Give a moment for the session to fully establish, especially for new signups
        if (event === 'SIGNED_UP' || event === 'SIGNED_IN') {
          await new Promise(resolve => setTimeout(resolve, 800));
        }
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
    
    console.log(`🚀 FAST PROFILE FETCH:`, { userId: supabaseUserId, email: userEmail });
    
    try {
      // 1. IMMEDIATE: Try to restore from localStorage for instant UX
      const cachedProfile = localStorage.getItem('peakforge-user');
      if (cachedProfile) {
        try {
          const parsed = JSON.parse(cachedProfile);
          if (parsed.id === supabaseUserId) {
            console.log('⚡ Profile restored from cache:', parsed);
            setUserProfile(parsed);
            // Continue with fresh fetch in background but don't block UI
            fetchProfileAndSubscriptionInBackground(supabaseUserId);
            setLoading(false);
            return;
          }
        } catch (e) {
          console.warn('🗑️ Invalid cached profile, clearing');
          localStorage.removeItem('peakforge-user');
        }
      }
      
      // 2. FAST: Parallel fetch profile + subscription data with short timeout
      console.log('📥 Fetching fresh profile + subscription data...');
      
      const profilePromise = supabase
        .from('users')
        .select('*')
        .eq('id', supabaseUserId)
        .single();
      
      const subscriptionPromise = supabase
        .from('user_subscriptions')
        .select(`
          *,
          subscription_plans (
            name,
            price,
            interval
          )
        `)
        .eq('user_id', supabaseUserId)
        .eq('status', 'active')
        .single();
      
      // Use Promise.allSettled to get both results even if one fails
      const results = await Promise.allSettled([
        Promise.race([profilePromise, new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Profile timeout')), 3000)
        )]),
        Promise.race([subscriptionPromise, new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Subscription timeout')), 3000)
        )])
      ]);
      
      const profileResult = results[0];
      const subscriptionResult = results[1];
      
      // Handle profile result
      if (profileResult.status === 'fulfilled') {
        const { data: profile, error: profileError } = profileResult.value as any;
        
        if (profile && !profileError) {
          console.log('✅ Profile loaded successfully:', { 
            userId: profile.id, 
            onboardingComplete: profile.onboarding_complete,
            program: profile.program 
          });
          setUserProfile(profile);
          localStorage.setItem('peakforge-user', JSON.stringify(profile));
        } else if (profileError?.code === 'PGRST116') {
          console.log('👤 New user - no profile found');
          setUserProfile(null);
        } else {
          console.error('❌ Profile fetch error:', profileError);
          setUserProfile(null);
        }
      } else {
        console.warn('⏰ Profile fetch timed out, treating as new user');
        setUserProfile(null);
      }
      
      // Handle subscription result
      if (subscriptionResult.status === 'fulfilled') {
        const { data: subscription, error: subError } = subscriptionResult.value as any;
        
        if (subscription && !subError) {
          console.log('✅ Active subscription found:', { 
            plan: subscription.subscription_plans?.name, 
            price: subscription.subscription_plans?.price,
            status: subscription.status,
            periodEnd: subscription.current_period_end 
          });
          setSubscription({
            isSubscribed: true,
            plan: subscription.subscription_plans?.name || null,
            status: subscription.status,
            currentPeriodEnd: subscription.current_period_end,
            cancelAtPeriodEnd: subscription.cancel_at_period_end
          });
        } else {
          console.log('💳 No active subscription found');
          setSubscription({
            isSubscribed: false,
            plan: null,
            status: null,
            currentPeriodEnd: null,
            cancelAtPeriodEnd: false
          });
        }
      } else {
        console.warn('⏰ Subscription fetch timed out');
        setSubscription({
          isSubscribed: false,
          plan: null,
          status: null,
          currentPeriodEnd: null,
          cancelAtPeriodEnd: false
        });
      }
      
      setLoading(false);
      
    } catch (error) {
      console.error('🚨 Critical error in profile fetch:', error);
      setUserProfile(null);
      setSubscription({
        isSubscribed: false,
        plan: null,
        status: null,
        currentPeriodEnd: null,
        cancelAtPeriodEnd: false
      });
      setLoading(false);
    }
  };
  
  // Background refresh function for cache updates
  const fetchProfileAndSubscriptionInBackground = async (supabaseUserId: string) => {
    try {
      console.log('🔄 Background refresh of profile + subscription...');
      
      const [profileResult, subscriptionResult] = await Promise.allSettled([
        supabase.from('users').select('*').eq('id', supabaseUserId).single(),
        supabase.from('user_subscriptions')
          .select('*, subscription_plans(name, price, interval)')
          .eq('user_id', supabaseUserId)
          .eq('status', 'active')
          .single()
      ]);
      
      if (profileResult.status === 'fulfilled' && profileResult.value.data) {
        const profile = profileResult.value.data;
        setUserProfile(profile);
        localStorage.setItem('peakforge-user', JSON.stringify(profile));
      }
      
      if (subscriptionResult.status === 'fulfilled' && subscriptionResult.value.data) {
        const subscription = subscriptionResult.value.data;
        setSubscription({
          isSubscribed: true,
          plan: subscription.subscription_plans?.name || null,
          status: subscription.status,
          currentPeriodEnd: subscription.current_period_end,
          cancelAtPeriodEnd: subscription.cancel_at_period_end
        });
      }
      
    } catch (error) {
      console.warn('🔄 Background refresh failed:', error);
    }
  };



  const signUp = async (email: string, password: string, userData: { name: string; program: 'beginner' | 'intermediate' | 'advanced' }) => {
    console.log('🔐 SIGNUP FLOW START:', { email, name: userData.name, program: userData.program });
    
    try {
      // Step 1: Create the auth user with metadata
      console.log('🔐 Step 1: Creating Supabase auth user...');
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
        console.error('🚨 Error details:', { code: signUpResult.error.code, message: signUpResult.error.message });
        return { error: signUpResult.error };
      }

      if (!signUpResult.data.user) {
        console.error('🚨 No user returned from signup');
        return { error: new Error('No user returned from signup') };
      }

      console.log('✅ Step 1: Auth user created successfully:', {
        userId: signUpResult.data.user.id,
        email: signUpResult.data.user.email,
        emailConfirmed: signUpResult.data.user.email_confirmed_at,
        sessionExists: !!signUpResult.data.session
      });

      // Step 2: Create the profile
      console.log('🔐 Step 2: Creating user profile in database...');
      try {
        await createUserProfile(signUpResult.data.user.id, {
          name: userData.name,
          program: userData.program,
          email
        });
        console.log('✅ Step 2: User profile created successfully');
      } catch (profileError) {
        console.error('🚨 Step 2: Profile creation failed:', profileError);
        console.warn('⚠️ Profile creation failed, but auth user exists - user can retry login');
      }

      console.log('🎉 SIGNUP FLOW COMPLETE: User can now login');
      return { error: null };
    } catch (error) {
      console.error('🚨 Exception in signUp:', error);
      console.error('🚨 Exception stack:', error instanceof Error ? error.stack : 'No stack trace');
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
    console.log('👤 PROFILE CREATION START:', { userId: supabaseUserId, email: userData.email, program: userData.program });
    
    try {
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

      console.log('👤 Inserting profile data:', { 
        userId: profileData.id, 
        program: profileData.program, 
        onboardingComplete: profileData.onboarding_complete 
      });

      const { data, error } = await supabase
        .from('users')
        .insert(profileData)
        .select()
        .single();

      if (error) {
        console.error('🚨 Error creating user profile:', error);
        console.error('🚨 Profile error details:', { 
          code: error.code, 
          message: error.message, 
          details: error.details,
          hint: error.hint 
        });
        throw error;
      }

      console.log('✅ Profile created successfully:', { 
        userId: data.id, 
        onboardingComplete: data.onboarding_complete,
        program: data.program 
      });

      
      // CRITICAL CHECK: If onboarding_complete is still true, something is wrong
      if (data.onboarding_complete === true) {
        console.error('🚨 CRITICAL: Profile created with onboarding_complete=true despite setting false!');
        console.error('🚨 This indicates a database trigger or constraint is overriding our value');
        
        // Force it to false immediately
        const { data: fixedData, error: fixError } = await supabase
          .from('users')
          .update({ onboarding_complete: false })
          .eq('id', supabaseUserId)
          .select()
          .single();
          
        if (fixError) {
          console.error('🚨 Failed to force-fix onboarding_complete:', fixError);
          setUserProfile(data); // Use original data even if fix failed
        } else {
          setUserProfile(fixedData);
        }
      } else {
        setUserProfile(data);
      }
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

  const refreshSubscription = async () => {
    if (!user) return;

    try {
      await fetchProfileAndSubscriptionInBackground(user.id);
    } catch (error) {
      console.error('Error in refreshSubscription:', error);
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
    refreshSubscription,
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