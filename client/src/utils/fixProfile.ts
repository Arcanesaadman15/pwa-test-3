import { createClient } from '@supabase/supabase-js';

// Only enable debug utilities in development
const isDevelopment = import.meta.env.DEV || import.meta.env.MODE === 'development';

// Ensure fixProfile is available globally for debugging (dev only)
declare global {
  interface Window {
    fixProfile?: () => Promise<void>;
    resetOnboarding?: () => Promise<void>;
    debugAuth?: () => void;
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
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (profileError && profileError.code !== 'PGRST116') {
        console.error('❌ Error checking profile:', profileError);
        return;
      }
      
      if (!profile) {
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            email: user.email,
            name: user.user_metadata?.name || 'User',
            program: user.user_metadata?.program || 'beginner',
            onboarding_complete: user.user_metadata?.onboarding_complete === true || user.user_metadata?.onboarding_complete === 'true',
            created_at: new Date().toISOString()
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
        .from('profiles')
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
    
    // Check if there are any auth tokens
    const keys = Object.keys(localStorage).filter(key => key.includes('supabase') || key.includes('auth'));
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