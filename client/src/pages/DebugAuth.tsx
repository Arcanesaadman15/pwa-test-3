import React, { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

export default function DebugAuth() {
  const [debugInfo, setDebugInfo] = useState<any>({});
  const { user, userProfile, loading, profileError, signOut } = useAuth();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        const { data: { user: authUser }, error: userError } = await supabase.auth.getUser();
        
        setDebugInfo({
          isSupabaseConfigured,
          session: session ? {
            access_token: session.access_token ? 'Present' : 'Missing',
            refresh_token: session.refresh_token ? 'Present' : 'Missing',
            user_id: session.user?.id,
            user_email: session.user?.email,
            expires_at: session.expires_at
          } : null,
          authUser: authUser ? {
            id: authUser.id,
            email: authUser.email,
            user_metadata: authUser.user_metadata
          } : null,
          errors: {
            session: error?.message,
            user: userError?.message
          },
          localStorage: {
            cachedProfile: localStorage.getItem('peakforge-user') ? 'Present' : 'None'
          }
        });
      } catch (err) {
        setDebugInfo({
          error: err instanceof Error ? err.message : 'Unknown error'
        });
      }
    };

    checkAuth();
  }, []);

  const handleSignOut = async () => {
    await signOut();
    window.location.href = '/';
  };

  const clearCache = () => {
    localStorage.removeItem('peakforge-user');
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Authentication Debug</h1>
        
        <div className="grid gap-6">
          <div className="bg-gray-800 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-3">Auth Context Status</h2>
            <div className="space-y-2 text-sm">
              <div>User: {user ? `${user.email} (${user.id})` : 'None'}</div>
              <div>Profile: {userProfile ? `${userProfile.name} (${userProfile.email})` : 'None'}</div>
              <div>Loading: {loading ? 'True' : 'False'}</div>
              <div>Error: {profileError || 'None'}</div>
            </div>
          </div>

          <div className="bg-gray-800 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-3">Supabase Debug Info</h2>
            <pre className="text-xs bg-gray-900 p-3 rounded overflow-auto">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </div>

          <div className="bg-gray-800 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-3">Actions</h2>
            <div className="space-x-4">
              <Button onClick={handleSignOut} variant="outline">
                Sign Out
              </Button>
              <Button onClick={clearCache} variant="outline">
                Clear Cache & Reload
              </Button>
              <Button onClick={() => window.location.href = '/'} variant="outline">
                Back to App
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


