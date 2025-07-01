
import { Bug, Search, User, Plus, Menu, LogOut } from 'lucide-react';
import { User as UserType } from '@/types';
import { SettingsDialog } from './SettingsDialog';

interface SidebarProps {
  user: UserType;
  currentView: 'all' | 'my-bugs' | 'assigned';
  onViewChange: (view: 'all' | 'my-bugs' | 'assigned') => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onLogout: () => void;
  onNewBug: () => void;
}

export const Sidebar = ({ 
  user, 
  currentView, 
  onViewChange, 
  collapsed, 
  onToggleCollapse,
  onLogout,
  onNewBug 
}: SidebarProps) => {
  const menuItems = [
    { id: 'all', label: 'All Bugs', icon: Bug, count: 0 },
    { id: 'my-bugs', label: 'My Reports', icon: User, count: 0 },
    { id: 'assigned', label: 'Assigned to Me', icon: Search, count: 0 },
  ];

  // Add null check for user
  if (!user) {
    return null;
  }

  return (
    <div className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200 transition-all duration-300 z-40 ${
      collapsed ? 'w-16' : 'w-64'
    }`}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {!collapsed && (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-bold">🐛</span>
                </div>
                <span className="font-bold text-gray-900">Bug Tracker</span>
              </div>
            )}
            <button
              onClick={onToggleCollapse}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* User Info */}
        {!collapsed && (
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              {user.avatar ? (
                <img 
                  src={user.avatar} 
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user.name}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {user.role}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* New Bug Button */}
        <div className="p-4">
          <button
            onClick={onNewBug}
            className={`w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 ${
              collapsed ? 'p-3' : 'px-4 py-3'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <Plus className="w-5 h-5" />
              {!collapsed && <span>New Bug</span>}
            </div>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id as any)}
              className={`w-full flex items-center rounded-lg transition-all duration-200 ${
                collapsed ? 'p-3 justify-center' : 'px-4 py-3'
              } ${
                currentView === item.id 
                  ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {!collapsed && (
                <>
                  <span className="ml-3 flex-1 text-left">{item.label}</span>
                  {item.count > 0 && (
                    <span className="ml-2 px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded-full">
                      {item.count}
                    </span>
                  )}
                </>
              )}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 space-y-2">
          <SettingsDialog user={user} collapsed={collapsed} />
          
          <button 
            onClick={onLogout}
            className={`w-full flex items-center text-red-600 hover:bg-red-50 rounded-lg transition-colors ${
              collapsed ? 'p-3 justify-center' : 'px-4 py-3'
            }`}
          >
            <LogOut className="w-5 h-5" />
            {!collapsed && <span className="ml-3">Sign Out</span>}
          </button>
        </div>
      </div>
    </div>
  );
};
