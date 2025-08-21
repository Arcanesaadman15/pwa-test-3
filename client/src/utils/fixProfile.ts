import { createClient } from '@supabase/supabase-js';

// Only enable debug utilities in development
const isDevelopment = import.meta.env.DEV || import.meta.env.MODE === 'development';

// Ensure fixProfile is available globally for debugging (dev only)
declare global {
  interface Window {
    fixProfile?: () => Promise<void>;
    resetOnboarding?: () => Promise<void>;
    debugAuth?: () => void;
    forceCreateProfile?: () => Promise<void>;
  }
}

// Only expose debug functions in development
if (isDevelopment) {
  window.fixProfile = async () => {
    
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseKey) {
        return;
      }
      
      const supabase = createClient(supabaseUrl, supabaseKey);
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        return;
      }
      
      
      // Check if profile exists
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (profileError && profileError.code !== 'PGRST116') {
        console.error('❌ Error checking profile:', profileError);
        return;
      }
      
      if (!profile) {
        const { error: insertError } = await supabase
          .from('users')
          .insert({
            id: user.id,
            email: user.email,
            name: user.user_metadata?.name || 'User',
            program: user.user_metadata?.program || 'beginner',
            current_day: 1,
            current_streak: 0,
            longest_streak: 0,
            completed_days: 0,
            start_date: new Date().toISOString(),
            achievements: 0,
            level: 1,
            onboarding_complete: user.user_metadata?.onboarding_complete === true || user.user_metadata?.onboarding_complete === 'true',
            preferences: {},
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        
        if (insertError) {
          console.error('❌ Failed to create profile:', insertError);
        } else {
        }
      } else {
      }
      
    } catch (error) {
      console.error('❌ Error in fixProfile:', error);
    }
  };

  window.resetOnboarding = async () => {
    
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseKey) {
        return;
      }
      
      const supabase = createClient(supabaseUrl, supabaseKey);
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        return;
      }
      
      // Update profile to mark onboarding as incomplete
      const { error } = await supabase
        .from('users')
        .update({ onboarding_complete: false })
        .eq('id', user.id);
      
      if (error) {
        console.error('❌ Failed to reset onboarding:', error);
      } else {
        // Also clear localStorage
        localStorage.removeItem('onboarding_complete');
        localStorage.removeItem('onboarding_data');
        
        // Force page refresh after a moment
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
      
    } catch (error) {
      console.error('❌ Error resetting onboarding:', error);
    }
  };

  window.debugAuth = () => {
    console.log('🔍 Debug Auth Info:');
    // Check if there are any auth tokens
    const keys = Object.keys(localStorage).filter(key => key.includes('supabase') || key.includes('auth'));
    console.log('Auth keys in localStorage:', keys);
  };

  // Emergency function to force create profile for stuck users
  window.forceCreateProfile = async () => {
    console.log('🚨 FORCE CREATING PROFILE...');
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseKey) {
        console.error('❌ Supabase not configured');
        return;
      }
      
      const supabase = createClient(supabaseUrl, supabaseKey);
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        console.error('❌ No authenticated user found');
        return;
      }
      
      console.log('👤 Creating profile for user:', user.id, user.email);
      
      // Force create profile with all required fields
      const { data, error } = await supabase
        .from('users')
        .upsert({
          id: user.id,
          email: user.email || '',
          name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'User',
          program: 'beginner',
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
        })
        .select()
        .single();
      
      if (error) {
        console.error('❌ Failed to force create profile:', error);
      } else {
        console.log('✅ Profile force created successfully:', data);
        localStorage.setItem('peakforge-user', JSON.stringify(data));
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
      
    } catch (error) {
      console.error('❌ Error in forceCreateProfile:', error);
    }
  };
}

// Only announce utilities in development
if (isDevelopment) {
  // Wait for DOM to be ready before announcing utilities
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
    });
  } else {
  }
} else {
} 