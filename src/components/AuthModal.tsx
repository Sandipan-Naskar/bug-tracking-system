
import { useState, useEffect } from 'react';
import { User } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff } from 'lucide-react';

interface AuthModalProps {
  onLogin: (user: User) => void;
  onClose?: () => void;
  initialMode?: 'login' | 'register';
}

export const AuthModal = ({ onLogin, onClose, initialMode = 'login' }: AuthModalProps) => {
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    role: 'developer' as const
  });
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Load users from localStorage on mount
  useEffect(() => {
    const savedUsers = localStorage.getItem('bug-tracker-users');
    if (savedUsers) {
      try {
        const parsedUsers = JSON.parse(savedUsers);
        setUsers(parsedUsers);
      } catch (error) {
        console.error('Failed to parse saved users:', error);
      }
    }
  }, []);

  // Save users to localStorage whenever users change
  useEffect(() => {
    localStorage.setItem('bug-tracker-users', JSON.stringify(users));
  }, [users]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
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

      if (!validatePassword(formData.password)) {
        toast({
          title: "Weak Password",
          description: "Password must be at least 6 characters long.",
          variant: "destructive"
        });
        return;
      }

      if (isLogin) {
        // Login logic - first try exact match with role, then try without role
        let existingUser = users.find(u => 
          u.email.toLowerCase() === formData.email.toLowerCase() && 
          u.password === formData.password &&
          u.role === formData.role
        );
        
        // If no exact match found, try matching without role requirement
        if (!existingUser) {
          existingUser = users.find(u => 
            u.email.toLowerCase() === formData.email.toLowerCase() && 
            u.password === formData.password
          );
        }
        
        if (existingUser) {
          onLogin(existingUser);
          toast({
            title: "Login Successful", 
            description: `Welcome back, ${existingUser.name}!`,
          });
        } else {
          toast({
            title: "Login Failed",
            description: "Invalid email or password. Please check your credentials and try again.",
            variant: "destructive"
          });
        }
      } else {
        // Signup logic
        if (formData.password !== formData.confirmPassword) {
          toast({
            title: "Password Mismatch",
            description: "Passwords do not match. Please try again.",
            variant: "destructive"
          });
          return;
        }

        if (!formData.name.trim()) {
          toast({
            title: "Missing Name",
            description: "Please enter your full name.",
            variant: "destructive"
          });
          return;
        }

        const existingUser = users.find(u => 
          u.email.toLowerCase() === formData.email.toLowerCase()
        );

        if (existingUser) {
          toast({
            title: "Account Exists",
            description: "An account with this email already exists. Please login instead.",
            variant: "destructive"
          });
          setIsLogin(true);
          return;
        }
        
        const newUser: User = {
          id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          email: formData.email.toLowerCase(),
          name: formData.name.trim(),
          role: formData.role,
          password: formData.password
        };
        
        const updatedUsers = [...users, newUser];
        setUsers(updatedUsers);
        onLogin(newUser);
        
        toast({
          title: "Account Created",
          description: `Welcome to Bug Tracker, ${newUser.name}!`,
        });
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
            
            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder={isLogin ? "Enter your password" : "Create a password (min 6 chars)"}
                  className="w-full pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Role selection for both login and signup */}
            <div className="space-y-2">
              <Label htmlFor="role">Role {!isLogin ? '*' : ''}</Label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                required={!isLogin}
              >
                <option value="developer">Developer</option>
                <option value="tester">Tester</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
              </select>
            </div>
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
                ? (isLogin ? 'Signing In...' : 'Creating Account...') 
                : (isLogin ? 'Sign In' : 'Create Account')
              }
            </Button>
          </form>
          
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

          {isLogin && users.length > 0 && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-700 text-center">
                💡 Demo: You can create a new account or use any previously registered email
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
