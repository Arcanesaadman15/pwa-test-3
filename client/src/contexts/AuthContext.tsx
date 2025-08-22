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
  profileError: string | null;
  signInWithGoogle: () => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  createUserProfile: (supabaseUserId: string, userData: { name: string; program: 'beginner' | 'intermediate' | 'advanced'; email: string }) => Promise<void>;
  refreshSubscription: () => Promise<void>;
  retryProfileCreation: () => Promise<void>;
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
  const [profileError, setProfileError] = useState<string | null>(null);

  useEffect(() => {
    // Extended timeout for profile creation process (15 seconds)
    const loadingTimeout = setTimeout(() => {
      console.warn('⚠️ Loading timeout reached after 15 seconds - this might indicate a database issue');
      if (!userProfile && !profileError) {
        setProfileError('Profile setup is taking too long. This might be a connection issue. Please try again.');
      }
      setLoading(false);
    }, 15000);

    // Get current session
    supabase.auth.getSession()
      .then(({ data: { session } }: any) => {
        clearTimeout(loadingTimeout);
        console.log('🔐 Initial session check:', { hasSession: !!session, hasUser: !!session?.user, email: session?.user?.email });
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchUserProfile(session.user.id, session.user.email);
        } else {
          console.log('🔐 No initial session found, waiting for auth state changes...');
          setLoading(false);
        }
      })
      .catch((error: any) => {
        clearTimeout(loadingTimeout);
        console.error('Error getting initial auth session:', error);
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

        // Clear any previous errors
        setProfileError(null);

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
    
    console.log(`🚀 PROPER PROFILE FETCH:`, { userId: supabaseUserId, email: userEmail });
    
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
      
      // 2. Wait for auth session to be established (shorter wait, faster failure)
      console.log('🔐 Waiting for auth session...');
      let sessionReady = false;
      for (let i = 0; i < 6; i++) {
        try {
          const { data: { session }, error } = await supabase.auth.getSession();
          console.log(`🔐 Session check attempt ${i + 1}/6:`, { 
            hasSession: !!session, 
            hasAccessToken: !!session?.access_token,
            hasUser: !!session?.user,
            error: error?.message 
          });
          
          if (session?.access_token && session?.user) {
            console.log('✅ Auth session ready with user:', session.user.email);
            sessionReady = true;
            break;
          }
          
          if (error) {
            console.error('❌ Session check error:', error);
          }
        } catch (sessionError) {
          console.error('❌ Session check exception:', sessionError);
        }
        
        if (i < 5) { // Don't wait after the last attempt
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
      
      if (!sessionReady) {
        console.warn('⚠️ Auth session not ready after 3 seconds - but user is authenticated, proceeding anyway');
        // Don't return here - let's try to proceed since we know user is authenticated from auth state change
      }
      
      // 3. Try to fetch existing profile with retries
      console.log('📥 Fetching existing profile...');
      let profile = null;
      let profileError = null;
      
      for (let attempt = 1; attempt <= 3; attempt++) {
        console.log(`📥 Profile fetch attempt ${attempt}/3 for user: ${supabaseUserId}`);
        
        try {
          const result = await supabase
            .from('users')
            .select('*')
            .eq('id', supabaseUserId)
            .single();
          
          profile = result.data;
          profileError = result.error;
          
          console.log(`📥 Attempt ${attempt} result:`, { 
            hasProfile: !!profile, 
            errorCode: profileError?.code,
            errorMessage: profileError?.message 
          });
          
          if (profile && !profileError) {
            console.log('✅ Profile found on attempt', attempt, ':', profile.name);
            break;
          }
          
          if (profileError?.code === 'PGRST116') {
            console.log('ℹ️ No profile exists (PGRST116) - will create new profile');
            break;
          }
          
          console.error(`❌ Profile fetch attempt ${attempt} failed:`, profileError);
          
        } catch (fetchException) {
          console.error(`❌ Profile fetch attempt ${attempt} exception:`, fetchException);
          profileError = { message: fetchException instanceof Error ? fetchException.message : 'Unknown error', code: 'EXCEPTION' };
        }
        
        if (attempt < 3) {
          console.log(`⏳ Retrying in ${attempt}s...`);
          await new Promise(resolve => setTimeout(resolve, attempt * 1000));
        }
      }
      
      if (profile && !profileError) {
        // Profile exists - use it
        console.log('✅ Profile loaded successfully:', profile.name);
        setUserProfile(profile);
        setProfileError(null); // Clear any previous errors
        localStorage.setItem('peakforge-user', JSON.stringify(profile));
        
        // Update analytics
        analytics.setPerson({
          name: profile.name,
          program: profile.program,
          onboarding_complete: !!profile.onboarding_complete,
        });
        
        // Fetch subscription in background
        fetchSubscriptionInBackground(supabaseUserId);
        setLoading(false);
        return;
      }
      
      // 4. No profile exists - create one with proper user data
      if (profileError?.code === 'PGRST116') {
        console.log('👤 Creating new profile with user data...');
        
        // Get actual user metadata from auth
        const { data: { user } } = await supabase.auth.getUser();
        
        const realUserName = user?.user_metadata?.full_name 
          || user?.user_metadata?.name 
          || userEmail?.split('@')[0] 
          || 'User';
        
        const profileData = {
          name: realUserName,
          program: 'beginner' as const,
          email: userEmail || user?.email || ''
        };
        
        console.log('👤 Creating profile with data:', { name: profileData.name, email: profileData.email });
        
        // Retry profile creation up to 3 times
        let createdProfile = null;
        for (let attempt = 1; attempt <= 3; attempt++) {
          try {
            console.log(`👤 Profile creation attempt ${attempt}/3`);
            await createUserProfile(supabaseUserId, profileData);
            
            // Immediately fetch the created profile
            const { data: newProfile, error: fetchError } = await supabase
              .from('users')
              .select('*')
              .eq('id', supabaseUserId)
              .single();
              
            if (newProfile && !fetchError) {
              createdProfile = newProfile;
              console.log('✅ Profile created and fetched successfully:', newProfile.name);
              break;
            } else {
              console.error(`❌ Profile creation attempt ${attempt} failed:`, fetchError);
              if (attempt < 3) {
                await new Promise(resolve => setTimeout(resolve, attempt * 1000));
              }
            }
          } catch (createError) {
            console.error(`❌ Profile creation attempt ${attempt} exception:`, createError);
            if (attempt < 3) {
              await new Promise(resolve => setTimeout(resolve, attempt * 1000));
            }
          }
        }
        
        if (createdProfile) {
          setUserProfile(createdProfile);
          setProfileError(null); // Clear any previous errors
          localStorage.setItem('peakforge-user', JSON.stringify(createdProfile));
          
          // Update analytics
          analytics.setPerson({
            name: createdProfile.name,
            program: createdProfile.program,
            onboarding_complete: !!createdProfile.onboarding_complete,
          });
          
          // Fetch subscription in background
          fetchSubscriptionInBackground(supabaseUserId);
          setLoading(false);
          return;
        } else {
          console.error('❌ Failed to create profile after 3 attempts');
          setProfileError('Failed to create your profile. This might be a database permission issue. Please try again or contact support.');
          setUserProfile(null);
          setLoading(false);
          return;
        }
      }
      
      // 5. Unknown error - don't create fake profile
      console.error('❌ Profile fetch failed with unknown error:', profileError);
      setProfileError(`Profile access failed: ${profileError?.message || 'Unknown database error'}`);
      setUserProfile(null);
      setLoading(false);
      
    } catch (error) {
      console.error('🚨 Critical error in profile fetch:', error);
      setProfileError(`Critical error during profile setup: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setUserProfile(null);
      setLoading(false);
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

  const retryProfileCreation = async () => {
    if (!user) return;
    
    console.log('🔄 Retrying profile creation...');
    setProfileError(null);
    setLoading(true);
    
    try {
      await fetchUserProfile(user.id, user.email);
    } catch (error) {
      console.error('Error in retryProfileCreation:', error);
    }
  };

  const value = {
    user,
    userProfile,
    subscription,
    session,
    loading,
    profileError,
    signInWithGoogle,
    signOut,
    updateProfile,
    createUserProfile,
    refreshSubscription,
    retryProfileCreation,
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