
import { useState } from 'react';
import { Settings } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { User } from '@/types';

interface SettingsDialogProps {
  user: User;
  collapsed: boolean;
  onUserUpdate?: (user: User) => void;
}

export const SettingsDialog = ({ user, collapsed, onUserUpdate }: SettingsDialogProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    notifications: true,
    theme: 'light',
  });

  const handleSave = () => {
    // In a real app, this would update the user data
    if (onUserUpdate) {
      onUserUpdate({
        ...user,
        name: formData.name,
        email: formData.email,
      });
    }
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className={`w-full flex items-center text-gray-700 hover:bg-gray-50 rounded-lg transition-colors ${
          collapsed ? 'p-3 justify-center' : 'px-4 py-3'
        }`}>
          <Settings className="w-5 h-5" />
          {!collapsed && <span className="ml-3">Settings</span>}
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Manage your account settings and preferences.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center space-x-2">
            <input
              id="notifications"
              type="checkbox"
              checked={formData.notifications}
              onChange={(e) => setFormData({ ...formData, notifications: e.target.checked })}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="notifications" className="text-sm font-medium">
              Enable notifications
            </label>
          </div>
          <div className="space-y-2">
            <label htmlFor="theme" className="text-sm font-medium">
              Theme
            </label>
            <select
              id="theme"
              value={formData.theme}
              onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => setOpen(false)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
          >
            Save
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
