
import { useState } from 'react';
import { User } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface AuthModalProps {
  onLogin: (user: User) => void;
  onClose?: () => void;
}

export const AuthModal = ({ onLogin, onClose }: AuthModalProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'developer' as const
  });
  const [users, setUsers] = useState<User[]>([]);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLogin) {
      // Login logic
      const existingUser = users.find(u => u.email === formData.email && u.password === formData.password);
      if (existingUser) {
        onLogin(existingUser);
        toast({
          title: "Login Successful",
          description: `Welcome back, ${existingUser.name}!`,
        });
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid email or password.",
          variant: "destructive"
        });
      }
    } else {
      // Signup logic
      if (users.find(u => u.email === formData.email)) {
        toast({
          title: "Signup Failed",
          description: "User with this email already exists.",
          variant: "destructive"
        });
        return;
      }
      
      const newUser: User = {
        id: Date.now().toString(),
        email: formData.email,
        name: formData.name,
        role: formData.role,
        password: formData.password
      };
      
      setUsers(prev => [...prev, newUser]);
      onLogin(newUser);
      toast({
        title: "Signup Successful",
        description: `Welcome, ${newUser.name}!`,
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            {isLogin ? 'Login' : 'Sign Up'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
              />
            </div>
            
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="developer">Developer</option>
                  <option value="tester">Tester</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            )}
            
            <Button type="submit" className="w-full">
              {isLogin ? 'Login' : 'Sign Up'}
            </Button>
          </form>
          
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              {isLogin ? 'Need an account? Sign up' : 'Already have an account? Login'}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
