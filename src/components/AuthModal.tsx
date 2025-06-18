
import { useState } from 'react';
import { X } from 'lucide-react';
import { User } from '@/types';
import { mockUsers } from '@/data/mockData';

interface AuthModalProps {
  onClose: () => void;
  onLogin: (user: User) => void;
}

export const AuthModal = ({ onClose, onLogin }: AuthModalProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<User['role']>('developer');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Mock database of registered users (in real app, this would be in backend)
  const [registeredUsers, setRegisteredUsers] = useState<User[]>([
    ...mockUsers,
    // Additional users can be added here
  ]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!validateEmail(email)) {
        throw new Error('Please enter a valid email address');
      }

      if (!validatePassword(password)) {
        throw new Error('Password must be at least 6 characters long');
      }

      if (isLogin) {
        // Login logic
        const user = registeredUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (!user) {
          throw new Error('No account found with this email address. Please sign up first.');
        }
        
        // In a real app, you'd verify the password hash here
        // For demo purposes, we'll just check if user exists
        onLogin(user);
      } else {
        // Registration logic
        if (!name.trim()) {
          throw new Error('Please enter your full name');
        }

        if (password !== confirmPassword) {
          throw new Error('Passwords do not match');
        }

        // Check if user already exists
        const existingUser = registeredUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (existingUser) {
          throw new Error('An account with this email already exists. Please sign in instead.');
        }

        // Create new user
        const newUser: User = {
          id: Date.now().toString(),
          email: email.toLowerCase(),
          name: name.trim(),
          role
        };

        // Add to registered users (in real app, this would be saved to backend)
        setRegisteredUsers(prev => [...prev, newUser]);
        
        onLogin(newUser);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">
            {isLogin ? 'Welcome back' : 'Create account'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {!isLogin && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your full name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role *
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as User['role'])}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="developer">Developer</option>
                  <option value="tester">Tester</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your email address"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password *
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your password"
              required
            />
            {!isLogin && (
              <p className="text-xs text-gray-500 mt-1">Password must be at least 6 characters long</p>
            )}
          </div>

          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password *
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Confirm your password"
                required
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <div className="px-6 pb-6">
          <p className="text-center text-gray-600">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setEmail('');
                setPassword('');
                setConfirmPassword('');
                setName('');
              }}
              className="ml-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>
          
          {isLogin && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                💡 New here? Create an account to start tracking bugs and collaborate with your team!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
