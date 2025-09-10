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
      subscription.unsubscribe();
      clearTimeout(fallbackTimeout);
    };
  }, []);

  const fetchUserProfile = async (supabaseUserId: string, userEmail?: string) => {
    if (!isSupabaseConfigured) {
      console.error('🚨 Supabase not configured, cannot fetch profile');
      setProfileError('Database configuration error. Please check your setup.');
      setLoading(false);
      return;
    }
    
    console.log(`🚀 PROPER PROFILE FETCH:`, { userId: supabaseUserId, email: userEmail });
    
    // Add timeout to prevent infinite loading with proper cleanup
    let profileTimeoutCleared = false;
    const profileTimeout = setTimeout(() => {
      if (!profileTimeoutCleared) {
        console.error('⏰ Profile fetch timeout after 15 seconds');
        setProfileError('Profile loading timed out. Please refresh the page or try again.');
        setLoading(false);
        profileTimeoutCleared = true;
      }
    }, 15000); // Reduced from 30s to 15s for faster feedback
    
    const clearProfileTimeout = () => {
      if (!profileTimeoutCleared) {
        clearTimeout(profileTimeout);
        profileTimeoutCleared = true;
      }
    };
    
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
            clearProfileTimeout();
            // Continue with fresh fetch in background
            fetchProfileAndSubscriptionInBackground(supabaseUserId);
            return;
          }
        } catch (e) {
          console.warn('🗑️ Invalid cached profile, clearing');
          localStorage.removeItem('peakforge-user');
        }
      }
      
      // 2. Try to fetch existing profile with a single attempt and proper timeout
      console.log('📥 Fetching existing profile...');
      let profile = null;
      let profileError = null;
      
      console.log(`📥 Profile fetch for user: ${supabaseUserId}`);
      
      try {
        // Create a race between the query and a timeout to prevent hanging
        const queryPromise = supabase
          .from('users')
          .select('*')
          .eq('id', supabaseUserId)
          .single();
          
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Query timeout after 10 seconds')), 10000);
        });
        
        const result = await Promise.race([queryPromise, timeoutPromise]) as any;
        
        profile = result.data;
        profileError = result.error;
        
        console.log(`📥 Profile fetch result:`, { 
          hasProfile: !!profile, 
          errorCode: profileError?.code,
          errorMessage: profileError?.message 
        });
          
        if (profile && !profileError) {
          console.log('✅ Profile found:', profile.name);
        } else if (profileError?.code === 'PGRST116') {
          console.log('ℹ️ No profile exists (PGRST116) - will create new profile');
        } else {
          console.error(`❌ Profile fetch failed:`, profileError);
        }
        
      } catch (fetchException) {
        console.error(`❌ Profile fetch exception:`, fetchException);
        profileError = { 
          message: fetchException instanceof Error ? fetchException.message : 'Unknown error', 
          code: 'EXCEPTION' 
        };
        
        // Treat any exception as no profile found to proceed with creation
        if (fetchException instanceof Error && 
            (fetchException.message.includes('timeout') || fetchException.message.includes('Query timeout'))) {
          console.log('⏰ Query timeout - treating as no profile found');
          profileError = { code: 'PGRST116', message: 'No rows returned' };
        }
      }
      
      if (profile && !profileError) {
        // Profile exists - normalize undefined onboarding_complete to false
        const normalizedProfile = {
          ...profile,
          onboarding_complete: profile.onboarding_complete === true ? true : false
        };
        
        console.log('✅ Profile loaded successfully:', normalizedProfile.name, {
          originalOnboarding: profile.onboarding_complete,
          normalizedOnboarding: normalizedProfile.onboarding_complete
        });
        
        setUserProfile(normalizedProfile);
        setProfileError(null); // Clear any previous errors
        localStorage.setItem('peakforge-user', JSON.stringify(normalizedProfile));
        
        // Update analytics
        analytics.setPerson({
          name: normalizedProfile.name,
          program: normalizedProfile.program,
          onboarding_complete: normalizedProfile.onboarding_complete,
        });
        
        // Fetch subscription in background
        fetchSubscriptionInBackground(supabaseUserId);
        setLoading(false);
        clearProfileTimeout();
        return;
      }
      
      // 4. No profile found by ID - check if one exists by email (ID mismatch case)
      if (profileError?.code === 'PGRST116' || (profileError && profileError.message?.includes('timeout'))) {
        console.log('👤 No profile found by ID, checking by email for ID mismatch...');
        
        try {
          const { data: emailProfile, error: emailError } = await supabase
            .from('users')
            .select('*')
            .eq('email', userEmail)
            .single();
          
          if (emailProfile && !emailError) {
            console.log('🔍 Found existing profile by email with different ID:', {
              authId: supabaseUserId,
              profileId: emailProfile.id,
              email: emailProfile.email
            });
            
            // Update the existing profile to use the current auth ID
            const { data: updatedProfile, error: updateError } = await supabase
              .from('users')
              .update({ id: supabaseUserId })
              .eq('email', userEmail)
              .select()
              .single();
            
            if (updatedProfile && !updateError) {
              console.log('✅ Profile ID updated successfully:', updatedProfile.name);
              
              // Normalize undefined onboarding_complete to false
              const normalizedUpdatedProfile = {
                ...updatedProfile,
                onboarding_complete: updatedProfile.onboarding_complete === true ? true : false
              };
              
              setUserProfile(normalizedUpdatedProfile);
              setProfileError(null);
              localStorage.setItem('peakforge-user', JSON.stringify(normalizedUpdatedProfile));
              
              // Update analytics
              analytics.setPerson({
                name: normalizedUpdatedProfile.name,
                program: normalizedUpdatedProfile.program,
                onboarding_complete: normalizedUpdatedProfile.onboarding_complete,
              });
              
              fetchSubscriptionInBackground(supabaseUserId);
              setLoading(false);
              clearProfileTimeout();
              return;
            } else {
              console.error('❌ Failed to update profile ID:', updateError);
              // Fall through to create new profile
            }
          } else if (emailError?.code !== 'PGRST116') {
            console.error('❌ Error checking profile by email:', emailError);
          }
        } catch (emailCheckError) {
          console.error('❌ Exception checking profile by email:', emailCheckError);
        }
        
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
            
            // Create profile (RLS optimized for fast execution)
            await createUserProfile(supabaseUserId, profileData);
            console.log(`✅ Profile creation ${attempt} completed`);
            
                        // Immediately fetch the created profile (RLS optimized for fast execution)
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
              console.error(`❌ Profile fetch after creation attempt ${attempt} failed:`, fetchError);
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
          // Normalize undefined onboarding_complete to false
          const normalizedCreatedProfile = {
            ...createdProfile,
            onboarding_complete: createdProfile.onboarding_complete === true ? true : false
          };
          
          setUserProfile(normalizedCreatedProfile);
          setProfileError(null); // Clear any previous errors
          localStorage.setItem('peakforge-user', JSON.stringify(normalizedCreatedProfile));
          
          // Update analytics
          analytics.setPerson({
            name: normalizedCreatedProfile.name,
            program: normalizedCreatedProfile.program,
            onboarding_complete: normalizedCreatedProfile.onboarding_complete,
          });
          
          // Fetch subscription in background
          fetchSubscriptionInBackground(supabaseUserId);
          setLoading(false);
          clearProfileTimeout();
          return;
        } else {
          console.error('❌ Failed to create profile after 3 attempts');
          console.log('🚨 EMERGENCY: Attempting direct profile fix for ID mismatch...');
          
          // Emergency fix: Try to update existing profile with current auth ID
          try {
            const { data: emergencyProfile, error: emergencyError } = await supabase
              .from('users')
              .update({ id: supabaseUserId })
              .eq('email', userEmail)
              .select()
            .single();
            
            if (emergencyProfile && !emergencyError) {
              console.log('✅ EMERGENCY: Profile ID fixed successfully!', emergencyProfile.name);
              
              // Normalize undefined onboarding_complete to false
              const normalizedEmergencyProfile = {
                ...emergencyProfile,
                onboarding_complete: emergencyProfile.onboarding_complete === true ? true : false
              };
              
              setUserProfile(normalizedEmergencyProfile);
              setProfileError(null);
              localStorage.setItem('peakforge-user', JSON.stringify(normalizedEmergencyProfile));
              
              // Update analytics
              analytics.setPerson({
                name: normalizedEmergencyProfile.name,
                program: normalizedEmergencyProfile.program,
                onboarding_complete: normalizedEmergencyProfile.onboarding_complete,
              });
              
              fetchSubscriptionInBackground(supabaseUserId);
              setLoading(false);
              clearProfileTimeout();
              return;
            } else {
              console.error('❌ EMERGENCY: Profile fix failed:', emergencyError);
            }
          } catch (emergencyException) {
            console.error('❌ EMERGENCY: Profile fix exception:', emergencyException);
          }
          
          setProfileError('Failed to create your profile. This might be a database permission issue. Please try again or contact support.');
          setUserProfile(null);
          setLoading(false);
          clearProfileTimeout();
          return;
        }
      }
      
      // 4. Unknown error - don't create fake profile
      console.error('❌ Profile fetch failed with unknown error:', profileError);
      setProfileError(`Profile access failed: ${profileError?.message || 'Unknown database error'}`);
      setUserProfile(null);
      setLoading(false);
      clearProfileTimeout();
      
    } catch (error) {
      console.error('🚨 Critical error in profile fetch:', error);
      setProfileError(`Critical error during profile setup: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setUserProfile(null);
      setLoading(false);
      clearProfileTimeout();
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

      // Use UPSERT to handle ID mismatches and existing emails
      const { data, error } = await supabase
        .from('users')
        .upsert(profileData, { 
          onConflict: 'email',
          ignoreDuplicates: false 
        })
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