import { createClient } from '@supabase/supabase-js';

// Ensure fixProfile is available globally for debugging
declare global {
  interface Window {
    fixProfile: () => Promise<void>;
    resetOnboarding: () => Promise<void>;
    debugAuth: () => void;
  }
}

window.fixProfile = async () => {
  console.log('🔧 Starting profile fix...');
  
  try {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      console.log('❌ Supabase not configured. Skipping profile fix.');
      return;
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.log('❌ No authenticated user found');
      return;
    }
    
    console.log('✅ Found user:', user.id);
    
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
      console.log('📝 Creating missing profile...');
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
        console.log('✅ Profile created successfully');
      }
    } else {
      console.log('✅ Profile already exists:', profile);
    }
    
  } catch (error) {
    console.error('❌ Error in fixProfile:', error);
  }
};

window.resetOnboarding = async () => {
  console.log('🔄 Resetting onboarding status...');
  
  try {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      console.log('❌ Supabase not configured');
      return;
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.log('❌ No authenticated user found');
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
      console.log('✅ Onboarding reset successfully! Refresh the page to see onboarding flow.');
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
  console.log('🐛 Current Auth Debug Info:');
  console.log('  - LocalStorage onboarding_complete:', localStorage.getItem('onboarding_complete'));
  console.log('  - LocalStorage onboarding_data:', localStorage.getItem('onboarding_data'));
  console.log('  - LocalStorage user:', localStorage.getItem('user'));
  
  // Check if there are any auth tokens
  const keys = Object.keys(localStorage).filter(key => key.includes('supabase') || key.includes('auth'));
  console.log('  - Auth-related localStorage keys:', keys);
};

// Wait for DOM to be ready before announcing utilities
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    console.log('🔧 Profile fix utilities loaded! Available commands:');
    console.log('  - fixProfile() - Create missing profile');
    console.log('  - resetOnboarding() - Reset onboarding status to see flow again');
    console.log('  - debugAuth() - Show current auth state');
  });
} else {
  console.log('🔧 Profile fix utilities loaded! Available commands:');
  console.log('  - fixProfile() - Create missing profile');
  console.log('  - resetOnboarding() - Reset onboarding status to see flow again');
  console.log('  - debugAuth() - Show current auth state');
} 