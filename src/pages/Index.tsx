
import { useState, useEffect } from 'react';
import { BugReport } from '@/components/BugReport';
import { BugList } from '@/components/BugList';
import { AuthModal } from '@/components/AuthModal';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { FilterPanel } from '@/components/FilterPanel';
import { NotificationToast } from '@/components/NotificationToast';
import { Bug, User, FilterOptions } from '@/types';
import { mockBugs, mockUsers } from '@/data/mockData';

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [bugs, setBugs] = useState<Bug[]>(mockBugs);
  const [filteredBugs, setFilteredBugs] = useState<Bug[]>(mockBugs);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showBugForm, setShowBugForm] = useState(false);
  const [editingBug, setEditingBug] = useState<Bug | null>(null);
  const [currentView, setCurrentView] = useState<'all' | 'my-bugs' | 'assigned'>('all');
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    status: 'all',
    severity: 'all',
    assignedTo: 'all',
    sortBy: 'created',
    sortOrder: 'desc'
  });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    // Simulate user session check
    const savedUser = localStorage.getItem('bugTracker_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  useEffect(() => {
    // Apply filters and sorting
    let filtered = [...bugs];

    // Filter by view
    if (currentView === 'my-bugs' && user) {
      filtered = filtered.filter(bug => bug.reportedBy === user.id);
    } else if (currentView === 'assigned' && user) {
      filtered = filtered.filter(bug => bug.assignedTo === user.id);
    }

    // Apply filters
    if (filterOptions.status !== 'all') {
      filtered = filtered.filter(bug => bug.status === filterOptions.status);
    }
    if (filterOptions.severity !== 'all') {
      filtered = filtered.filter(bug => bug.severity === filterOptions.severity);
    }
    if (filterOptions.assignedTo !== 'all') {
      filtered = filtered.filter(bug => bug.assignedTo === filterOptions.assignedTo);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue;
      switch (filterOptions.sortBy) {
        case 'severity':
          const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
          aValue = severityOrder[a.severity];
          bValue = severityOrder[b.severity];
          break;
        case 'status':
          const statusOrder = { open: 4, 'in-progress': 3, resolved: 2, closed: 1 };
          aValue = statusOrder[a.status];
          bValue = statusOrder[b.status];
          break;
        case 'updated':
          aValue = new Date(a.updatedAt).getTime();
          bValue = new Date(b.updatedAt).getTime();
          break;
        default:
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
      }
      
      return filterOptions.sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    });

    setFilteredBugs(filtered);
  }, [bugs, filterOptions, currentView, user]);

  const handleLogin = (userData: User) => {
    setUser(userData);
    localStorage.setItem('bugTracker_user', JSON.stringify(userData));
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('bugTracker_user');
    setCurrentView('all');
  };

  const handleBugSubmit = (bugData: Partial<Bug>) => {
    if (editingBug) {
      // Update existing bug
      const updatedBugs = bugs.map(bug => 
        bug.id === editingBug.id 
          ? { ...bug, ...bugData, updatedAt: new Date().toISOString() }
          : bug
      );
      setBugs(updatedBugs);
    } else {
      // Create new bug
      const newBug: Bug = {
        id: Date.now().toString(),
        ...bugData as Bug,
        reportedBy: user!.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setBugs([newBug, ...bugs]);
    }
    setShowBugForm(false);
    setEditingBug(null);
  };

  const handleBugDelete = (bugId: string) => {
    setBugs(bugs.filter(bug => bug.id !== bugId));
  };

  const handleBugEdit = (bug: Bug) => {
    setEditingBug(bug);
    setShowBugForm(true);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center space-y-8 p-8">
          <div className="space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-4">
              <span className="text-2xl">🐛</span>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Bug Tracker Pro
            </h1>
            <p className="text-xl text-slate-600 max-w-md mx-auto">
              Professional bug tracking with AI-powered insights and team collaboration
            </p>
          </div>
          <button
            onClick={() => setShowAuthModal(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            Get Started
          </button>
        </div>
        
        {showAuthModal && (
          <AuthModal
            onClose={() => setShowAuthModal(false)}
            onLogin={handleLogin}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar
        user={user}
        currentView={currentView}
        onViewChange={setCurrentView}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        onLogout={handleLogout}
        onNewBug={() => setShowBugForm(true)}
      />
      
      <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
        <Header
          user={user}
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
          sidebarCollapsed={sidebarCollapsed}
        />
        
        <main className="p-6 space-y-6">
          <div className="flex flex-col lg:flex-row gap-6">
            <FilterPanel
              filterOptions={filterOptions}
              onFilterChange={setFilterOptions}
              users={mockUsers}
              bugCount={filteredBugs.length}
            />
          </div>
          
          <BugList
            bugs={filteredBugs}
            users={mockUsers}
            currentUser={user}
            onEdit={handleBugEdit}
            onDelete={handleBugDelete}
          />
        </main>
      </div>

      {showBugForm && (
        <BugReport
          users={mockUsers}
          currentUser={user}
          editingBug={editingBug}
          onSubmit={handleBugSubmit}
          onClose={() => {
            setShowBugForm(false);
            setEditingBug(null);
          }}
        />
      )}

      <NotificationToast />
    </div>
  );
};

export default Index;
