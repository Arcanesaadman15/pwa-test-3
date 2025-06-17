import { supabase } from '@/lib/supabase';

// Utility function to manually create a missing user profile
// Can be called from browser console: window.fixProfile()
export async function fixProfile() {
  try {
    // Get current authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error('No authenticated user found:', authError);
      return { success: false, error: 'No authenticated user' };
    }
    
    console.log('🔍 Current user:', user.id, user.email);
    
    // Check if profile already exists
    const { data: existingProfile, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (!fetchError && existingProfile) {
      console.log('✅ Profile already exists:', existingProfile);
      return { success: true, profile: existingProfile, message: 'Profile already exists' };
    }
    
    console.log('🔍 No profile found, creating...');
    
    // Try using the RPC function first
    try {
      const { data: rpcResult, error: rpcError } = await supabase.rpc('create_user_profile', {
        user_id: user.id,
        user_name: 'Saadman',
        user_email: user.email || 'user@peakforge.dev',
        user_program: 'intermediate'
      });
      
      if (!rpcError && rpcResult) {
        console.log('✅ Profile created via RPC:', rpcResult);
        return { success: true, profile: rpcResult, method: 'RPC' };
      } else {
        console.warn('RPC failed:', rpcError);
      }
    } catch (rpcError) {
      console.warn('RPC exception:', rpcError);
    }
    
    // Fallback: try direct insert
    try {
      const { data: insertResult, error: insertError } = await supabase
        .from('users')
        .insert({
          id: user.id,
          name: 'Saadman',
          email: user.email || 'user@peakforge.dev',
          program: 'intermediate',
          current_day: 1,
          current_streak: 0,
          longest_streak: 0,
          completed_days: 0,
          start_date: new Date().toISOString(),
          achievements: 0,
          level: 1,
          onboarding_complete: true,
          preferences: {}
        })
        .select()
        .single();
      
      if (!insertError && insertResult) {
        console.log('✅ Profile created via direct insert:', insertResult);
        return { success: true, profile: insertResult, method: 'INSERT' };
      } else {
        console.error('Direct insert failed:', insertError);
        return { success: false, error: insertError };
      }
    } catch (insertException) {
      console.error('Direct insert exception:', insertException);
      return { success: false, error: insertException };
    }
    
  } catch (error) {
    console.error('Fix profile error:', error);
    return { success: false, error };
  }
}

// Make it available globally for console access
if (typeof window !== 'undefined') {
  (window as any).fixProfile = fixProfile;
} 