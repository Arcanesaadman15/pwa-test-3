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
    // Removed aggressive timeout since RLS performance is now optimized
    // Queries should complete in <100ms with the new RLS policies

    // Add a fallback timeout to prevent infinite loading
    const fallbackTimeout = setTimeout(() => {
      console.warn('⏰ Auth initialization taking too long, forcing loading to false');
      setLoading(false);
    }, 10000); // 10 seconds fallback

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
        clearTimeout(fallbackTimeout);
      })
      .catch((error: any) => {
        console.error('Error getting initial auth session:', error);
                setLoading(false);
        clearTimeout(fallbackTimeout);
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

        // Fetch user profile and subscription in parallel
        await Promise.all([
          fetchUserProfile(session.user.id, session.user.email),
          fetchSubscriptionInBackground(session.user.id)
        ]);

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
      subscription.unsubscribe();
      clearTimeout(fallbackTimeout);
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

   // Update fetchUserProfile to handle creation with feedback
   const fetchUserProfile = async (supabaseUserId: string, userEmail?: string) => {
     // Prevent concurrent profile fetches
     if (profileFetching) {
       console.log('🔄 Profile fetch already in progress, skipping...');
       return;
     }
     
     setProfileFetching(true);
     try {
       console.log('📋 Fetching user profile for:', supabaseUserId, 'email:', userEmail);
       
       // Add aggressive 3-second timeout to prevent hanging
       const profileFetch = Promise.race([
         supabase
           .from('users')
           .select('*')
           .eq('id', supabaseUserId)
           .single(),
         new Promise((_, reject) => 
           setTimeout(() => reject(new Error('Profile fetch timeout')), 3000)
         )
       ]);
       
       const { data, error } = await profileFetch as any;
      
       if (error) {
         if (error.code === 'PGRST116' || error.message === 'Profile fetch timeout') { 
           // No rows found or timeout - create new user
           console.log('🆕 No profile found or fetch timed out, creating new one...');
           setProfileCreating(true); // Show creation-specific loading
           
              try {
                const profileData = createInitialProfileData(supabaseUserId, userEmail);
                
                // Add timeout to profile creation to prevent hanging
                const profileCreation = Promise.race([
                  supabase
                    .from('users')
                    .insert(profileData)
                    .select()
                    .single(),
                  new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('Profile creation timeout')), 5000)
                  )
                ]);
                
                const { data: newProfile, error: insertError } = await profileCreation as any;
            
            if (insertError) throw insertError;
            
            console.log('✅ Profile created successfully:', newProfile.id);
            setUserProfile(newProfile);
            await fetchSubscriptionInBackground(supabaseUserId);
            
           } catch (insertError) {
             console.error('❌ Profile creation failed:', insertError);
             
             // Handle duplicate key error - profile already exists, try to fetch it
             if (insertError.code === '23505') {
               console.log('🔄 Profile already exists, attempting to fetch...');
               try {
                 const { data: existingProfile } = await supabase
                   .from('users')
                   .select('*')
                   .eq('id', supabaseUserId)
                   .single();
                 
                 if (existingProfile) {
                   console.log('✅ Found existing profile after duplicate error');
                   const normalizedProfile = {
                     ...existingProfile,
                     onboarding_complete: existingProfile.onboarding_complete === true ? true : false
                   };
                   setUserProfile(normalizedProfile);
                   await fetchSubscriptionInBackground(supabaseUserId);
                   return; // Success - don't throw
                 }
               } catch (fetchError) {
                 console.error('❌ Failed to fetch existing profile:', fetchError);
               }
             }
             
             setProfileError('Failed to create your account. Please check your connection and try again.');
             setUserProfile(null); // Don't create fallback - force proper account creation
             throw insertError; // Block the user from proceeding
           } finally {
             setProfileCreating(false);
           }
          
        } else {
          console.error('❌ Profile fetch error:', error);
          setProfileError('Failed to load your account. Please check your connection and try again.');
          setUserProfile(null); // Don't create fallback - force proper account loading
          throw error; // Block the user from proceeding
        }
        } else {
          console.log('✅ Profile loaded:', data.id, 'onboarding_complete:', data.onboarding_complete);
          
          // Normalize undefined onboarding_complete to false (critical for new users)
          const normalizedProfile = {
            ...data,
            onboarding_complete: data.onboarding_complete === true ? true : false
          };
          
           setUserProfile(normalizedProfile);
           await fetchSubscriptionInBackground(supabaseUserId);
         }
      } catch (error) {
        console.error('❌ Critical error in fetchUserProfile:', error);
        setProfileError('Unable to load your account. Please check your internet connection and try again.');
        setUserProfile(null); // Force proper account loading - no shortcuts
      } finally {
        setLoading(false);
        setProfileFetching(false);
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
       console.log('🔄 Background subscription fetch for user:', supabaseUserId);
       
       // Add timeout to subscription fetch to prevent hanging
       const subscriptionFetch = Promise.race([
         supabase
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
           .single(),
         new Promise((_, reject) => 
           setTimeout(() => reject(new Error('Subscription fetch timeout')), 3000)
         )
       ]);
       
       const { data: subscription, error: subError } = await subscriptionFetch as any;
      
      if (subscription && !subError) {
        console.log('🔄 Background subscription updated - ACTIVE SUBSCRIPTION FOUND:', {
          status: subscription.status,
          plan: subscription.subscription_plans?.name,
          periodEnd: subscription.current_period_end
        });
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
        console.log('🔄 Background subscription - NO ACTIVE SUBSCRIPTION:', {
          hasData: !!subscription,
          error: subError?.message,
          errorCode: subError?.code
        });
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

       // Use simple INSERT - RLS policies should prevent conflicts
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