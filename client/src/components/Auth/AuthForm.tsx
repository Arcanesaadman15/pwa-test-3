import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertCircle, Eye, EyeOff, Mail, Lock, User, Flame, RefreshCw } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface AuthFormProps {
  onComplete: () => void;
  initialData?: {
    name: string;
    program: 'beginner' | 'intermediate' | 'advanced';
  };
}

export function AuthForm({ onComplete, initialData }: AuthFormProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Password reset modal state
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);
  const [resetSuccess, setResetSuccess] = useState(false);

  const { signUp, signIn, resetPassword } = useAuth();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError(null);
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError('Please fill in all required fields');
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }

    if (isSignUp) {
      if (!formData.name.trim()) {
        setError('Please enter your name');
        return false;
      }

      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🔐 AUTH FORM SUBMIT:', { 
      isSignUp, 
      email: formData.email, 
      hasName: !!formData.name,
      program: initialData?.program 
    });
    
    if (!validateForm()) return;

    setLoading(true);
    setError(null);

    try {
      let result;
      
      if (isSignUp) {
        console.log('🔐 Starting signup process...');
        result = await signUp(formData.email, formData.password, {
          name: formData.name,
          program: (initialData?.program || 'beginner') as 'beginner' | 'intermediate' | 'advanced'
        });
      } else {
        console.log('🔐 Starting signin process...');
        result = await signIn(formData.email, formData.password);
      }

      if (result.error) {
        console.error('🚨 Auth failed:', result.error);
        
        // Provide specific error messages for common cases
        let errorMessage = 'An error occurred';
        
        if (result.error.message) {
          // Handle specific Supabase error codes
          if (result.error.message.includes('already registered') || 
              result.error.message.includes('already exists') ||
              result.error.message.includes('already been registered')) {
            errorMessage = 'This email is already registered. Please sign in instead.';
          } else if (result.error.message.includes('Invalid login credentials')) {
            errorMessage = 'Invalid email or password. Please try again.';
          } else if (result.error.message.includes('Email not confirmed')) {
            errorMessage = 'Please check your email and click the confirmation link to continue.';
          } else if (result.error.message.includes('Password should be at least')) {
            errorMessage = 'Password must be at least 6 characters long.';
          } else if (result.error.message.includes('Invalid email')) {
            errorMessage = 'Please enter a valid email address.';
          } else {
            // Use the original error message if it's user-friendly
            errorMessage = result.error.message;
          }
        }
        
        setError(errorMessage);
      } else {
        console.log('✅ Auth completed successfully, calling onComplete...');
        onComplete();
      }
    } catch (err) {
      console.error('🚨 Auth form exception:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!resetEmail) {
      setResetError('Please enter your email address');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(resetEmail)) {
      setResetError('Please enter a valid email address');
      return;
    }

    setResetLoading(true);
    setResetError(null);

    try {
      const result = await resetPassword(resetEmail);
      
      if (result.error) {
        console.error('🚨 Password reset failed:', result.error);
        setResetError('Failed to send reset email. Please try again.');
      } else {
        setResetSuccess(true);
      }
    } catch (err) {
      console.error('🚨 Password reset exception:', err);
      setResetError('An unexpected error occurred');
    } finally {
      setResetLoading(false);
    }
  };

  const handleResetModalOpen = () => {
    setResetEmail(formData.email); // Pre-fill with current email if available
    setResetError(null);
    setResetSuccess(false);
    setShowResetModal(true);
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
            <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center">
              <Flame className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2">
            {isSignUp ? 'Join the Brotherhood' : 'Welcome Back, Warrior'}
          </h1>
          <p className="text-gray-300">
            {isSignUp 
              ? 'Start your transformation journey today'
              : 'Continue your path to peak performance'
            }
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gray-900 border border-gray-700 shadow-2xl">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {isSignUp && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2"
                  >
                    <Label htmlFor="name" className="text-sm font-medium text-white">
                      Full Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="Enter your name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="pl-10 h-12 bg-gray-800 text-white border-gray-600 focus:border-orange-500 focus:ring-orange-500 placeholder:text-gray-400"
                        disabled={loading}
                      />
                    </div>
                  </motion.div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-white">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="pl-10 h-12 bg-gray-800 text-white border-gray-600 focus:border-orange-500 focus:ring-orange-500 placeholder:text-gray-400"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-white">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className="pl-10 pr-10 h-12 bg-gray-800 text-white border-gray-600 focus:border-orange-500 focus:ring-orange-500 placeholder:text-gray-400"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                      disabled={loading}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {isSignUp && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2"
                  >
                    <Label htmlFor="confirmPassword" className="text-sm font-medium text-white">
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="confirmPassword"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        className="pl-10 pr-10 h-12 bg-gray-800 text-white border-gray-600 focus:border-orange-500 focus:ring-orange-500 placeholder:text-gray-400"
                        disabled={loading}
                      />
                    </div>
                  </motion.div>
                )}

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center space-x-2 text-red-400 bg-red-900/20 border border-red-500/30 p-3 rounded-lg"
                  >
                    <AlertCircle className="w-4 h-4" />
                    <div className="flex-1">
                      <span className="text-sm">{error}</span>
                      {error.includes('already registered') && (
                        <div className="mt-2 text-xs text-red-300">
                          Click "Already a member? Sign in" below to access your account.
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                <Button
                  type="submit"
                  className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>{isSignUp ? 'Creating Account...' : 'Signing In...'}</span>
                    </div>
                  ) : (
                    isSignUp ? 'Join the Brotherhood' : 'Continue Journey'
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center space-y-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setError(null);
                    setFormData(prev => ({ ...prev, confirmPassword: '' }));
                  }}
                  className="text-orange-400 hover:text-orange-300 font-medium text-sm transition-colors block w-full"
                  disabled={loading}
                >
                  {isSignUp 
                    ? 'Already a member? Sign in' 
                    : "New here? Join the brotherhood"
                  }
                </button>

                {!isSignUp && (
                  <Dialog open={showResetModal} onOpenChange={setShowResetModal}>
                    <DialogTrigger asChild>
                      <button
                        type="button"
                        onClick={handleResetModalOpen}
                        className="text-gray-400 hover:text-gray-300 text-sm transition-colors"
                        disabled={loading}
                      >
                        Forgot your password?
                      </button>
                    </DialogTrigger>
                    <DialogContent className="bg-gray-900 border-gray-700 text-white">
                      <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-white">
                          Reset Your Password
                        </DialogTitle>
                        <DialogDescription className="text-gray-300">
                          Enter your email address and we'll send you a link to reset your password.
                        </DialogDescription>
                      </DialogHeader>

                      {resetSuccess ? (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-center py-6"
                        >
                          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Mail className="w-8 h-8 text-white" />
                          </div>
                          <h3 className="text-lg font-semibold text-green-400 mb-2">
                            Reset Email Sent!
                          </h3>
                          <p className="text-gray-300 text-sm mb-4">
                            We've sent a password reset link to <span className="font-medium">{resetEmail}</span>
                          </p>
                          <p className="text-gray-400 text-xs">
                            Check your email and click the link to reset your password. The link will expire in 1 hour.
                          </p>
                          <Button
                            onClick={() => setShowResetModal(false)}
                            className="mt-6 bg-orange-500 hover:bg-orange-600"
                          >
                            Got it
                          </Button>
                        </motion.div>
                      ) : (
                        <form onSubmit={handlePasswordReset} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="resetEmail" className="text-sm font-medium text-white">
                              Email Address
                            </Label>
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                              <Input
                                id="resetEmail"
                                type="email"
                                placeholder="Enter your email"
                                value={resetEmail}
                                onChange={(e) => {
                                  setResetEmail(e.target.value);
                                  if (resetError) setResetError(null);
                                }}
                                className="pl-10 h-12 bg-gray-800 text-white border-gray-600 focus:border-orange-500 focus:ring-orange-500 placeholder:text-gray-400"
                                disabled={resetLoading}
                              />
                            </div>
                          </div>

                          {resetError && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="flex items-center space-x-2 text-red-400 bg-red-900/20 border border-red-500/30 p-3 rounded-lg"
                            >
                              <AlertCircle className="w-4 h-4" />
                              <span className="text-sm">{resetError}</span>
                            </motion.div>
                          )}

                          <div className="flex gap-3 pt-2">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setShowResetModal(false)}
                              className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800"
                              disabled={resetLoading}
                            >
                              Cancel
                            </Button>
                            <Button
                              type="submit"
                              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
                              disabled={resetLoading}
                            >
                              {resetLoading ? (
                                <div className="flex items-center space-x-2">
                                  <RefreshCw className="w-4 h-4 animate-spin" />
                                  <span>Sending...</span>
                                </div>
                              ) : (
                                'Send Reset Link'
                              )}
                            </Button>
                          </div>
                        </form>
                      )}
                    </DialogContent>
                  </Dialog>
                )}
              </div>

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