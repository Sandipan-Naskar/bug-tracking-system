
import { useState, useEffect } from 'react';
import { User } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { Mail, ArrowLeft } from 'lucide-react';

interface AuthModalProps {
  onLogin: (user: User) => void;
  onClose?: () => void;
  initialMode?: 'login' | 'register';
}

export const AuthModal = ({ onLogin, onClose, initialMode = 'login' }: AuthModalProps) => {
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const [isOtpMode, setIsOtpMode] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    role: 'developer' as const
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!validateEmail(formData.email)) {
        toast({
          title: "Invalid Email",
          description: "Please enter a valid email address.",
          variant: "destructive"
        });
        return;
      }

      if (isLogin) {
        // Send OTP for login
        const { error } = await supabase.auth.signInWithOtp({
          email: formData.email,
          options: {
            shouldCreateUser: false,
            emailRedirectTo: `${window.location.origin}/`
          }
        });

        if (error) {
          toast({
            title: "Login Failed",
            description: error.message,
            variant: "destructive"
          });
        } else {
          setIsOtpMode(true);
          toast({
            title: "Check Your Email",
            description: "We've sent you a magic link to sign in. Please check your inbox.",
          });
        }
      } else {
        // Signup logic
        if (!formData.name.trim()) {
          toast({
            title: "Missing Name",
            description: "Please enter your full name.",
            variant: "destructive"
          });
          return;
        }

        const { error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              full_name: formData.name.trim(),
              role: formData.role
            }
          }
        });

        if (error) {
          toast({
            title: "Signup Failed",
            description: error.message,
            variant: "destructive"
          });
        } else {
          toast({
            title: "Account Created",
            description: "Please check your email to confirm your account.",
          });
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Listen for auth state changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          // Get user profile data
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (!error && profile) {
            const user: User = {
              id: profile.id,
              email: profile.email,
              name: profile.full_name,
              role: profile.role as 'developer' | 'admin' | 'tester' | 'manager',
              password: '' // Not needed for Supabase auth
            };
            onLogin(user);
            toast({
              title: "Login Successful",
              description: `Welcome back, ${profile.full_name}!`,
            });
          }
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [onLogin, toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      name: '',
      role: 'developer'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </CardTitle>
          <p className="text-center text-gray-600">
            {isLogin 
              ? 'Sign in to your Bug Tracker account' 
              : 'Join Bug Tracker to start managing bugs'
            }
          </p>
        </CardHeader>
        <CardContent>
{isOtpMode ? (
            <div className="space-y-4">
              <div className="text-center">
                <Mail className="mx-auto h-12 w-12 text-blue-500 mb-4" />
                <h3 className="text-lg font-medium">Check your email</h3>
                <p className="text-sm text-gray-600 mt-2">
                  We've sent a magic link to <strong>{formData.email}</strong>
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Click the link in your email to sign in.
                </p>
              </div>
              
              <Button 
                type="button" 
                variant="outline"
                className="w-full" 
                onClick={() => {
                  setIsOtpMode(false);
                  setFormData(prev => ({ ...prev, email: '' }));
                }}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to login
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className="w-full"
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  className="w-full"
                />
              </div>
              
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Create a password (min 6 chars)"
                    className="w-full"
                  />
                </div>
              )}

              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="role">Role *</Label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    required
                  >
                    <option value="developer">Developer</option>
                    <option value="tester">Tester</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              )}
              
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm your password"
                    className="w-full"
                  />
                </div>
              )}
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading 
                  ? (isLogin ? 'Sending Magic Link...' : 'Creating Account...') 
                  : (isLogin ? 'Send Magic Link' : 'Create Account')
                }
              </Button>
            </form>
          )}
          
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={toggleAuthMode}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              {isLogin 
                ? "Don't have an account? Create one here" 
                : 'Already have an account? Sign in here'
              }
            </button>
          </div>

          {!isOtpMode && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-700 text-center">
                {isLogin 
                  ? "💡 Enter your email to receive a magic link for secure login"
                  : "💡 Create an account with email verification for security"
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
