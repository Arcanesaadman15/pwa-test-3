import React, { createContext, useContext, useEffect, useState } from 'react';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { supabase, type User } from '@/lib/supabase';
import { analytics } from '@/lib/analytics';
import { clearStaleAuthData, optimizeAuthStorage, preWarmAuthSession } from '@/lib/authOptimizer';

// Add cache TTL constants at the top after imports
const PROFILE_CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours
const SUBSCRIPTION_CACHE_TTL = 60 * 60 * 1000; // 1 hour

// Extended subscription type with joined plan data
// interface SubscriptionWithPlan extends UserSubscription {
//   subscription_plans?: {
//     name: string;
//     price: number;
//     interval: string;
//   };
// }

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
  profileCreating: boolean; // New state for creation-specific loading
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
  const [profileCreating, setProfileCreating] = useState(false); // New state for creation-specific loading
  const [profileFetching, setProfileFetching] = useState(false); // Prevent concurrent fetches

  useEffect(() => {
    // Optimize auth initialization for faster Google OAuth experience
    console.log('🚀 Initializing auth with optimizations...');
    
    // Pre-warm the auth system
    preWarmAuthSession();
    
    // Clear any stale data that might interfere
    clearStaleAuthData();
    optimizeAuthStorage();

    // Get current session
    supabase.auth.getSession()
      .then(({ data: { session } }: any) => {
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
        console.error('Error getting initial auth session:', error);
        setLoading(false);
      });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event: any, session: any) => {
      console.log('🔐 Auth state change:', event, session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        // Clear any previous errors
        setProfileError(null);

        // Handle profile fetch based on event type
        if (event === 'SIGNED_IN' || event === 'SIGNED_UP') {
          console.log(`🔐 User authenticated via ${event}, scheduling profile fetch...`);
          
          // Identify user for analytics immediately
          analytics.identify(session.user.id, {
            email: session.user.email,
          });
          
          // For faster UI response, set loading to false immediately
          // and fetch profile in background
          setLoading(false);
          
          // Fetch profile with minimal delay
          setTimeout(() => {
            fetchUserProfile(session.user.id, session.user.email, true);
          }, 100);
          
        } else if (event === 'INITIAL_SESSION') {
          console.log('🔐 Initial session detected, fetching profile...');
          await fetchUserProfile(session.user.id, session.user.email, false);
          
          // Identify user for analytics
          analytics.identify(session.user.id, {
            email: session.user.email,
          });
        } else {
          console.log(`🔐 Skipping profile fetch for event: ${event}`);
        }
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
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Helper function to create initial profile data
  const createInitialProfileData = (supabaseUserId: string, userEmail?: string) => {
    const realUserName = userEmail?.split('@')[0] || 'User';
    return {
      id: supabaseUserId,
      name: realUserName,
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
  };

  // Optimized profile fetching - fast and reliable
  const fetchUserProfile = async (supabaseUserId: string, userEmail?: string, forceRefresh = false) => {
     // Prevent concurrent profile fetches
     if (profileFetching) {
       console.log('🔄 Profile fetch already in progress, skipping...');
       return;
     }
     
     setProfileFetching(true);
     setProfileError(null); // Clear any previous errors
     console.log('🚀 STARTING profile fetch for:', supabaseUserId, 'email:', userEmail);
     
     // Reduced emergency timeout for faster failure detection
     const emergencyTimeout = setTimeout(() => {
       console.error('🚨 EMERGENCY: Profile fetch taking too long, forcing completion');
       setProfileError('Profile loading is taking too long. Please try refreshing the page.');
       setUserProfile(null);
       setLoading(false);
       setProfileFetching(false);
     }, 8000); // Reduced to 8 seconds
     
     try {
       
      // Check cache first if not forcing refresh
      if (!forceRefresh) {
        const cachedProfile = localStorage.getItem('cached_profile');
        const cachedTimestamp = localStorage.getItem('cached_profile_timestamp');
        
        if (cachedProfile && cachedTimestamp) {
          const age = Date.now() - parseInt(cachedTimestamp, 10);
          if (age < PROFILE_CACHE_TTL) {
            console.log('📥 Loading profile from cache (age: ' + age + 'ms)');
            setUserProfile(JSON.parse(cachedProfile));
            fetchSubscriptionInBackground(supabaseUserId, false);
            setProfileFetching(false);
            return;
          } else {
            console.log('🗑️ Profile cache stale (age: ' + age + 'ms), fetching fresh');
          }
        } else {
          console.log('❌ No profile cache found, fetching fresh');
        }
      }

      // Minimal delay to ensure auth session is fully established
      await new Promise(resolve => setTimeout(resolve, 50));
      
      // Direct Supabase query - no timeouts, no retries (RLS optimized for speed)
      console.log('🔍 About to query users table for:', supabaseUserId);
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', supabaseUserId)
        .single();
      
      console.log('🔍 Query result:', { hasData: !!data, hasError: !!error, errorCode: error?.code, errorMessage: error?.message });
      
       if (error) {
         if (error.code === 'PGRST116') { 
           // No rows found - create new user instantly
           console.log('🆕 No profile found, creating new one...');
           setProfileCreating(true);
           
           try {
             const profileData = createInitialProfileData(supabaseUserId, userEmail);
             
           // Optimized profile creation with proper conflict handling
           const { data: newProfile, error: insertError } = await supabase
            .from('users')
            .upsert(profileData, { onConflict: 'id', ignoreDuplicates: false })
            .select()
            .single();
            
            if (insertError) throw insertError;
            
            if (!newProfile) {
              throw new Error('Profile creation returned null data');
            }
            
            console.log('✅ Profile created successfully:', newProfile.id);
            setUserProfile(newProfile);
            localStorage.setItem('cached_profile', JSON.stringify(newProfile));
            localStorage.setItem('cached_profile_timestamp', Date.now().toString());
            await fetchSubscriptionInBackground(supabaseUserId, false);
            
           } catch (insertError: any) {
             console.error('❌ Profile creation failed:', insertError);
             setProfileError('Unable to create your profile. Please try again.');
             setUserProfile(null);
           } finally {
             setProfileCreating(false);
           }
          
        } else {
          console.error('❌ Profile fetch error:', error);
          setProfileError('Unable to load your profile. Please try again.');
          setUserProfile(null);
        }
        } else if (data) {
          console.log('✅ Profile loaded:', data.id, 'onboarding_complete:', data.onboarding_complete);
          
          // Normalize undefined onboarding_complete to false (critical for new users)
          const normalizedProfile = {
            ...data,
            onboarding_complete: data.onboarding_complete === true ? true : false
          };
          
           setUserProfile(normalizedProfile);
           localStorage.setItem('cached_profile', JSON.stringify(normalizedProfile));
           localStorage.setItem('cached_profile_timestamp', Date.now().toString());
           console.log('🔄 Starting background subscription fetch...');
           await fetchSubscriptionInBackground(supabaseUserId, false);
           console.log('✅ Background subscription fetch completed');
         } else {
           setProfileError('Profile data not found.');
           setUserProfile(null);
         }
      } catch (error) {
        console.error('❌ Critical error in fetchUserProfile:', error);
        setProfileError('Unable to load your account. Please check your internet connection and try again.');
        setUserProfile(null); // Force proper account loading - no shortcuts
      } finally {
        clearTimeout(emergencyTimeout);
        setLoading(false);
        setProfileFetching(false);
        console.log('🏁 Profile fetch finally block completed');
      }
  };
  

   // Separate function for subscription fetch
   const fetchSubscriptionInBackground = async (supabaseUserId: string, forceRefresh = false) => {
     try {
       console.log('🔄 Background subscription fetch for user:', supabaseUserId);
       console.log('🔄 Subscription forceRefresh:', forceRefresh);
       
      // Add cache check for subscription
      if (!forceRefresh) {
        const cachedSub = localStorage.getItem('cached_subscription');
        const cachedTimestamp = localStorage.getItem('cached_subscription_timestamp');
        
        if (cachedSub && cachedTimestamp) {
          const age = Date.now() - parseInt(cachedTimestamp, 10);
          if (age < SUBSCRIPTION_CACHE_TTL) {
            console.log('📥 Loading subscription from cache (age: ' + age + 'ms)');
            setSubscription(JSON.parse(cachedSub));
            return;
          } else {
            console.log('🗑️ Subscription cache stale (age: ' + age + 'ms), fetching fresh');
          }
        } else {
          console.log('❌ No subscription cache found, fetching fresh');
        }
      }

      // Direct subscription query - no timeouts (RLS optimized)
      console.log('🔍 About to query user_subscriptions for:', supabaseUserId);
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
      
      console.log('🔍 Subscription query result:', { hasData: !!subscription, hasError: !!subError, errorCode: subError?.code });
      
      if (subscription && !subError) {
        console.log('🔄 Background subscription updated - ACTIVE SUBSCRIPTION FOUND:', {
          status: subscription.status,
          plan: subscription.subscription_plans?.name,
          periodEnd: subscription.current_period_end
        });
        const subscriptionState = {
          isSubscribed: true,
          plan: subscription.subscription_plans?.name ?? null,
          status: subscription.status,
          currentPeriodEnd: subscription.current_period_end ?? null,
          cancelAtPeriodEnd: subscription.cancel_at_period_end
        };
        setSubscription(subscriptionState);
        localStorage.setItem('cached_subscription', JSON.stringify(subscriptionState));
        localStorage.setItem('cached_subscription_timestamp', Date.now().toString());
        analytics.registerSuper({
          subscribed: true,
          plan: subscription.subscription_plans?.name ?? null,
          subscription_status: subscription.status,
        });
      } else {
        // No active subscription
        console.log('🔄 Background subscription - NO ACTIVE SUBSCRIPTION:', {
          hasData: !!subscription,
          error: subError?.message,
          errorCode: subError?.code
        });
        const subscriptionState = {
          isSubscribed: false,
          plan: null,
          status: null,
          currentPeriodEnd: null,
          cancelAtPeriodEnd: false
        };
        setSubscription(subscriptionState);
        localStorage.setItem('cached_subscription', JSON.stringify(subscriptionState));
        localStorage.setItem('cached_subscription_timestamp', Date.now().toString());
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
      // Ensure subscription state is set even on error
      setSubscription({
        isSubscribed: false,
        plan: null,
        status: null,
        currentPeriodEnd: null,
        cancelAtPeriodEnd: false
      });
    } finally {
      console.log('🏁 Subscription fetch completed');
    }
  };





  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        // Use more reliable redirect URL
        redirectTo: `${window.location.protocol}//${window.location.host}`,
        scopes: 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
        queryParams: {
          access_type: 'offline',
          prompt: 'select_account' // Changed from 'consent' to allow faster re-auth
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
    } finally {
      // Clear cache on sign out
      localStorage.removeItem('cached_profile');
      localStorage.removeItem('cached_profile_timestamp');
      localStorage.removeItem('cached_subscription');
      localStorage.removeItem('cached_subscription_timestamp');
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
        preferences: {}, // CRITICAL: Always use empty object, never null
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      console.log('👤 Inserting profile data:', { 
        userId: profileData.id, 
        program: profileData.program, 
        onboardingComplete: profileData.onboarding_complete,
        preferences: profileData.preferences // Log to ensure it's always {}
      });

       // Direct profile creation - no timeouts
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

      if (!data) {
        throw new Error('Profile creation returned null data');
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
        } else if (fixedData) {
          console.log('✅ Force-fixed onboarding_complete to false');
          setUserProfile(fixedData);
        } else {
          setUserProfile(data); // Fallback to original data
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
      setLoading(false);
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
    isLocalMode: false,
    profileCreating,
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