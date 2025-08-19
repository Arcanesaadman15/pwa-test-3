import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

interface AuthFormProps {
  onComplete: () => void;
}

export function AuthForm({ onComplete }: AuthFormProps) {
  const [loading, setLoading] = useState(false);

  const { signInWithGoogle } = useAuth();

  const handleGoogleSignIn = async () => {
    setLoading(true);
    
    try {
      console.log('🔐 Starting Google sign in...');
      const result = await signInWithGoogle();
      
      if (result.error) {
        console.error('🚨 Google auth failed:', result.error);
        // Google auth usually redirects, so errors here are usually technical issues
        // The user will stay on this page if there's an error
        setLoading(false);
      } else {
        // Google auth initiated successfully and will redirect
        console.log('✅ Google auth initiated successfully');
        // Note: onComplete will be called by the auth state change listener
        // when the user returns from Google and is authenticated
      }
    } catch (err) {
      console.error('🚨 Google auth exception:', err);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        
        {/* Hero Section */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 flex items-center justify-center">
              <img src="/icon-192x192.png" alt="PeakForge Logo" className="w-16 h-16" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2">
            Commit to Yourself
          </h1>
          <p className="text-gray-300">
            Start your transformation journey today
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gray-900 border border-gray-700 shadow-2xl">
            <CardContent className="p-8">
              {/* Google OAuth - the only authentication method */}
              <Button
                type="button"
                className="w-full h-12 bg-white text-gray-900 hover:bg-gray-100 border border-gray-300 rounded-xl font-medium flex items-center justify-center gap-3 mb-6"
                onClick={handleGoogleSignIn}
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-gray-900/30 border-t-gray-900 rounded-full animate-spin" />
                    <span>Connecting...</span>
                  </div>
                ) : (
                  <>
                    {/* Google G icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5">
                      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.8 32.4 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.7 3l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.2-.4-3.5z"/>
                      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 16 19 12 24 12c3 0 5.7 1.1 7.7 3l5.7-5.7C34.6 6.1 29.6 4 24 4 16.3 4 9.6 8.3 6.3 14.7z"/>
                      <path fill="#4CAF50" d="M24 44c5.2 0 10-2 13.5-5.2l-6.2-5.2C29.3 36.4 26.8 37.3 24 37.3c-5.2 0-9.7-3.5-11.3-8.3l-6.6 5.1C9.4 39.7 16.1 44 24 44z"/>
                      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-1 3-3.2 5.5-5.9 7.1l.1-.1 6.2 5.2C38.9 37.8 44 31.6 44 24c0-1.3-.1-2.2-.4-3.5z"/>
                    </svg>
                    Continue with Google
                  </>
                )}
              </Button>

              {/* Trust Indicators */}
              <div className="mt-6 text-center">
                <div className="flex justify-center items-center space-x-4 mb-2">
                  {[
                    { name: "Marcus", image: "/images/marcus.png" },
                    { name: "Jake", image: "/images/jake.png" },
                    { name: "Carlos", image: "/images/carlos.png" }
                  ].map((user, i) => (
                    <motion.div 
                      key={user.name}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 + i * 0.1, duration: 0.3 }}
                      className="relative"
                    >
                      <img 
                        src={user.image}
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover border-2 border-orange-500/30"
                      />
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900"></div>
                    </motion.div>
                  ))}
                </div>
                <p className="text-xs text-gray-400">
                  Join 50,000+ men who've transformed their lives
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
} 