import React, { createContext, useContext, useEffect, useState } from 'react';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured, type User } from '@/lib/supabase';
import { analytics } from '@/lib/analytics';

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
  signInWithGoogle: () => Promise<{ error: any }>;
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
    // Aggressive timeout for faster mobile experience (3 seconds max for new users)
    const loadingTimeout = setTimeout(() => {
      console.warn('⚠️ Loading timeout reached - forcing load completion to prevent infinite loading');
      setLoading(false);
    }, 3000);

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
        // Simple delay for session establishment
        if (event === 'SIGNED_UP' || event === 'SIGNED_IN') {
          await new Promise(resolve => setTimeout(resolve, 200));
        }

        // Fetch user profile (with built-in creation fallback)
        await fetchUserProfile(session.user.id, session.user.email);

        // Identify user for analytics
        analytics.identify(session.user.id, {
          email: session.user.email,
        });
      } else {
        setUserProfile(null);
        setSubscription({
          isSubscribed: false,
          plan: null,
          status: null,
          currentPeriodEnd: null,
          cancelAtPeriodEnd: false
        });
        analytics.reset();
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
    
    console.log(`🚀 SIMPLIFIED PROFILE FETCH:`, { userId: supabaseUserId, email: userEmail });
    
    try {
      // 1. Try cached profile first for instant UX
      const cachedProfile = localStorage.getItem('peakforge-user');
      if (cachedProfile) {
        try {
          const parsed = JSON.parse(cachedProfile);
          if (parsed.id === supabaseUserId) {
            console.log('⚡ Profile restored from cache:', parsed.name);
            setUserProfile(parsed);
            setLoading(false);
            // Continue with fresh fetch in background
            fetchProfileAndSubscriptionInBackground(supabaseUserId);
            return;
          }
        } catch (e) {
          console.warn('🗑️ Invalid cached profile, clearing');
          localStorage.removeItem('peakforge-user');
        }
      }
      
      // 2. Simple wait for auth session
      console.log('🔐 Waiting for auth session...');
      for (let i = 0; i < 5; i++) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.access_token) {
          console.log('✅ Auth session ready');
          break;
        }
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      // 3. Simple profile fetch with fallback creation
      console.log('📥 Fetching profile...');
      
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', supabaseUserId)
        .single();
      
      if (profile && !profileError) {
        // Profile exists - success!
        console.log('✅ Profile loaded:', profile.name);
        setUserProfile(profile);
        localStorage.setItem('peakforge-user', JSON.stringify(profile));
        
        // Update analytics
        analytics.setPerson({
          name: profile.name,
          program: profile.program,
          onboarding_complete: !!profile.onboarding_complete,
        });
      } else if (profileError?.code === 'PGRST116') {
        // No profile exists - create one
        console.log('👤 No profile found, creating new profile...');
        
        const fallbackProfile = {
          name: userEmail?.split('@')[0] || 'User',
          program: 'beginner' as const,
          email: userEmail || ''
        };
        
        try {
          await createUserProfile(supabaseUserId, fallbackProfile);
          console.log('✅ Profile created successfully');
          
          // Fetch the newly created profile
          const { data: newProfile, error: fetchError } = await supabase
            .from('users')
            .select('*')
            .eq('id', supabaseUserId)
            .single();
            
          if (newProfile && !fetchError) {
            setUserProfile(newProfile);
            localStorage.setItem('peakforge-user', JSON.stringify(newProfile));
            console.log('✅ New profile loaded:', newProfile.name);
          } else {
            console.error('❌ Failed to fetch newly created profile:', fetchError);
            // Set a minimal profile to unblock the UI
            const minimalProfile = {
              id: supabaseUserId,
              name: fallbackProfile.name,
              email: fallbackProfile.email,
              program: fallbackProfile.program,
              current_day: 1,
              current_streak: 0,
              longest_streak: 0,
              completed_days: 0,
              start_date: new Date().toISOString(),
              achievements: 0,
              level: 1,
              onboarding_complete: false,
              preferences: {},
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            };
            setUserProfile(minimalProfile);
            localStorage.setItem('peakforge-user', JSON.stringify(minimalProfile));
            console.log('⚠️ Using minimal profile to unblock UI');
          }
        } catch (createError) {
          console.error('❌ Profile creation failed:', createError);
          // Set a minimal profile to unblock the UI anyway
          const minimalProfile = {
            id: supabaseUserId,
            name: userEmail?.split('@')[0] || 'User',
            email: userEmail || '',
            program: 'beginner' as const,
            current_day: 1,
            current_streak: 0,
            longest_streak: 0,
            completed_days: 0,
            start_date: new Date().toISOString(),
            achievements: 0,
            level: 1,
            onboarding_complete: false,
            preferences: {},
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          setUserProfile(minimalProfile);
          localStorage.setItem('peakforge-user', JSON.stringify(minimalProfile));
          console.log('⚠️ Using minimal profile due to creation failure');
        }
      } else {
        console.error('❌ Profile fetch error:', profileError);
        setUserProfile(null);
      }
      
      // 4. Fetch subscription in background
      fetchSubscriptionInBackground(supabaseUserId);
      
      setLoading(false);
      
    } catch (error) {
      console.error('🚨 Critical error in profile fetch:', error);
      
      // Create minimal profile to unblock UI
      const minimalProfile = {
        id: supabaseUserId,
        name: userEmail?.split('@')[0] || 'User',
        email: userEmail || '',
        program: 'beginner' as const,
        current_day: 1,
        current_streak: 0,
        longest_streak: 0,
        completed_days: 0,
        start_date: new Date().toISOString(),
        achievements: 0,
        level: 1,
        onboarding_complete: false,
        preferences: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      setUserProfile(minimalProfile);
      localStorage.setItem('peakforge-user', JSON.stringify(minimalProfile));
      
      setSubscription({
        isSubscribed: false,
        plan: null,
        status: null,
        currentPeriodEnd: null,
        cancelAtPeriodEnd: false
      });
      setLoading(false);
      console.log('⚠️ Using minimal profile due to critical error');
    }
  };
  
  // Background refresh function for profile cache updates
  const fetchProfileAndSubscriptionInBackground = async (supabaseUserId: string) => {
    try {
      console.log('🔄 Background profile refresh...');
      
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', supabaseUserId)
        .single();
      
      if (profile && !profileError) {
        console.log('🔄 Background profile updated');
        setUserProfile(profile);
        localStorage.setItem('peakforge-user', JSON.stringify(profile));
      } else if (profileError?.code !== 'PGRST116') {
        console.warn('🔄 Background profile fetch error:', profileError);
      }
    } catch (error) {
      console.warn('🔄 Background profile refresh failed:', error);
    }
  };

  // Separate function for subscription fetch
  const fetchSubscriptionInBackground = async (supabaseUserId: string) => {
    try {
      console.log('🔄 Background subscription fetch...');
      
      const { data: subscription, error: subError } = await supabase
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
      
      if (subscription && !subError) {
        console.log('🔄 Background subscription updated');
        setSubscription({
          isSubscribed: true,
          plan: subscription.subscription_plans?.name || null,
          status: subscription.status,
          currentPeriodEnd: subscription.current_period_end,
          cancelAtPeriodEnd: subscription.cancel_at_period_end
        });
        analytics.registerSuper({
          subscribed: true,
          plan: subscription.subscription_plans?.name || null,
          subscription_status: subscription.status,
        });
      } else {
        // No active subscription
        setSubscription({
          isSubscribed: false,
          plan: null,
          status: null,
          currentPeriodEnd: null,
          cancelAtPeriodEnd: false
        });
        analytics.registerSuper({
          subscribed: false,
          plan: null,
          subscription_status: null,
        });
        if (subError?.code !== 'PGRST116') {
          console.warn('🔄 Background subscription fetch error:', subError);
        }
      }
    } catch (error) {
      console.warn('🔄 Background subscription fetch failed:', error);
    }
  };





  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent'
        }
      }
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
      await fetchSubscriptionInBackground(user.id);
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
    signInWithGoogle,
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