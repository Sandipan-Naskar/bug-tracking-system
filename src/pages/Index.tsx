import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Bug, User, FilterOptions } from '@/types';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { BugList } from '@/components/BugList';
import { BugReport } from '@/components/BugReport';
import { FilterPanel } from '@/components/FilterPanel';
import { AuthModal } from '@/components/AuthModal';
import { BugHistoryList } from '@/components/BugHistoryList';
import { BugTracker } from '@/components/BugTracker';
import { SearchBar } from '@/components/SearchBar';
import { mockBugs, mockUsers } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [bugs, setBugs] = useState<Bug[]>(mockBugs);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeView, setActiveView] = useState<'dashboard' | 'bugs' | 'report' | 'history'>('dashboard');
  const [currentView, setCurrentView] = useState<'all' | 'my-bugs' | 'assigned'>('all');
  const [editingBug, setEditingBug] = useState<Bug | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentFilters, setCurrentFilters] = useState<FilterOptions>({
    status: 'all',
    severity: 'all',
    assignedTo: 'all',
    priority: 'all',
    sortBy: 'created',
    sortOrder: 'desc'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [showAuthModal, setShowAuthModal] = useState(true);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const { toast } = useToast();

  // Handle URL parameters for specific views
  useEffect(() => {
    const view = searchParams.get('view');
    if (view) {
      if (view === 'login') {
        setAuthModalMode('login');
        setShowAuthModal(true);
      } else if (view === 'register') {
        setAuthModalMode('register');
        setShowAuthModal(true);
      } else if (['dashboard', 'bugs', 'report', 'history'].includes(view)) {
        setActiveView(view as 'dashboard' | 'bugs' | 'report' | 'history');
        // Clear the URL parameter after setting the view
        setSearchParams({});
      }
    }
  }, [searchParams, setSearchParams]);

  const bugsPerPage = 10;

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setShowAuthModal(false);
    toast({
      title: "Login Successful",
      description: `Welcome ${user.name}!`,
    });
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setShowAuthModal(true);
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  const handleToggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleAddBug = (newBugData: Partial<Bug>) => {
    if (editingBug) {
      // Update existing bug
      const updatedBug: Bug = {
        ...editingBug,
        ...newBugData,
        updatedAt: new Date().toISOString(),
        reportedBy: editingBug.reportedBy // Keep original reporter
      };
      setBugs(prev => prev.map(bug => 
        bug.id === editingBug.id ? updatedBug : bug
      ));
      setEditingBug(null);
      setActiveView('dashboard');
      toast({
        title: "Bug Updated",
        description: "Bug has been successfully updated.",
      });
    } else {
      // Create new bug
      const bug: Bug = {
        ...newBugData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        reportedBy: currentUser?.id || 'unknown'
      } as Bug;
      setBugs(prev => [bug, ...prev]);
      setActiveView('dashboard');
      toast({
        title: "Bug Created",
        description: "Bug report has been successfully created.",
      });
    }
  };

  const handleEditBug = (bug: Bug) => {
    setEditingBug(bug);
    setActiveView('report');
  };

  const handleDeleteBug = (bugId: string) => {
    setBugs(prev => prev.filter(bug => bug.id !== bugId));
    toast({
      title: "Bug Deleted",
      description: "Bug has been successfully deleted.",
    });
  };

  const handleCloseReport = () => {
    setEditingBug(null);
    setActiveView(editingBug ? 'dashboard' : 'bugs');
  };

  // Filter bugs based on current filters, view, and search query
  const filteredBugs = bugs.filter(bug => {
    // Search functionality
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        bug.title.toLowerCase().includes(query) ||
        bug.description.toLowerCase().includes(query) ||
        bug.stepsToReproduce.toLowerCase().includes(query) ||
        (bug.tags && bug.tags.some(tag => tag.toLowerCase().includes(query)));
      
      if (!matchesSearch) return false;
    }

    // View-based filtering - Fixed logic
    if (currentView === 'my-bugs') {
      // Only show bugs reported BY the current user
      if (bug.reportedBy !== currentUser?.id) return false;
    } else if (currentView === 'assigned') {
      // Only show bugs assigned TO the current user
      if (bug.assignedTo !== currentUser?.id) return false;
    }
    // 'all' view shows all bugs (no additional filtering needed)
    
    // Filter-based filtering
    if (currentFilters.status !== 'all' && bug.status !== currentFilters.status) return false;
    if (currentFilters.severity !== 'all' && bug.severity !== currentFilters.severity) return false;
    if (currentFilters.assignedTo !== 'all' && bug.assignedTo !== currentFilters.assignedTo) return false;
    if (currentFilters.priority !== 'all' && bug.priority !== currentFilters.priority) return false;
    return true;
  });

  // Sort bugs
  const sortedBugs = [...filteredBugs].sort((a, b) => {
    const { sortBy, sortOrder } = currentFilters;
    let aValue: any, bValue: any;

    switch (sortBy) {
      case 'created':
        aValue = new Date(a.createdAt);
        bValue = new Date(b.createdAt);
        break;
      case 'updated':
        aValue = new Date(a.updatedAt);
        bValue = new Date(b.updatedAt);
        break;
      case 'severity':
        const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        aValue = severityOrder[a.severity];
        bValue = severityOrder[b.severity];
        break;
      case 'priority':
        const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
        aValue = priorityOrder[a.priority || 'low'];
        bValue = priorityOrder[b.priority || 'low'];
        break;
      case 'status':
        const statusOrder = { open: 1, 'in-progress': 2, resolved: 3, closed: 4 };
        aValue = statusOrder[a.status];
        bValue = statusOrder[b.status];
        break;
      case 'title':
        aValue = a.title.toLowerCase();
        bValue = b.title.toLowerCase();
        break;
      default:
        return 0;
    }

    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  // Paginate bugs
  const totalPages = Math.ceil(sortedBugs.length / bugsPerPage);
  const paginatedBugs = sortedBugs.slice(
    (currentPage - 1) * bugsPerPage,
    currentPage * bugsPerPage
  );

  const handleViewChange = (view: 'all' | 'my-bugs' | 'assigned') => {
    setCurrentView(view);
    setCurrentPage(1); // Reset to first page when changing view
  };

  const handleNewBug = () => {
    setEditingBug(null);
    setActiveView('report');
  };

  if (!currentUser) {
    return <AuthModal onLogin={handleLogin} initialMode={authModalMode} />;
  }

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <SearchBar 
              onSearch={handleSearch}
              searchQuery={searchQuery}
              placeholder="Search bugs in dashboard..."
            />
            {searchQuery && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800">
                  Showing results for: <span className="font-semibold">"{searchQuery}"</span>
                  {filteredBugs.length === 0 && " - No bugs found"}
                </p>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-blue-600 hover:text-blue-800 text-sm mt-1"
                  >
                    Clear search
                  </button>
                )}
              </div>
            )}
            <BugTracker 
              bugs={filteredBugs}
              onEditBug={handleEditBug}
              onDeleteBug={handleDeleteBug}
            />
          </div>
        );
      case 'bugs':
        return (
          <div className="space-y-6">
            <SearchBar 
              onSearch={handleSearch}
              searchQuery={searchQuery}
              placeholder="Search bugs..."
            />
            {searchQuery && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800">
                  Showing results for: <span className="font-semibold">"{searchQuery}"</span>
                  {filteredBugs.length === 0 && " - No bugs found"}
                </p>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-blue-600 hover:text-blue-800 text-sm mt-1"
                  >
                    Clear search
                  </button>
                )}
              </div>
            )}
            <FilterPanel 
              currentFilters={currentFilters}
              onFilterChange={setCurrentFilters}
            />
            <BugList 
              bugs={paginatedBugs}
              users={mockUsers}
              onEdit={handleEditBug}
              onDelete={handleDeleteBug}
              currentUser={currentUser}
            />
            {totalPages > 1 && (
              <div className="flex justify-center space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 bg-blue-600 text-white rounded disabled:bg-gray-300"
                >
                  Previous
                </button>
                <span className="px-3 py-2">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 bg-blue-600 text-white rounded disabled:bg-gray-300"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        );
      case 'report':
        return (
          <BugReport 
            onSubmit={handleAddBug}
            users={mockUsers}
            currentUser={currentUser}
            editingBug={editingBug}
            onClose={handleCloseReport}
          />
        );
      case 'history':
        return (
          <div className="space-y-6">
            <SearchBar 
              onSearch={handleSearch}
              searchQuery={searchQuery}
              placeholder="Search bug history..."
            />
            <BugHistoryList currentUser={currentUser} bugs={searchQuery ? filteredBugs : bugs} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        user={currentUser}
        onToggleSidebar={handleToggleSidebar}
        sidebarCollapsed={sidebarCollapsed}
        onLogout={handleLogout}
      />
      
      <div className="flex">
        <Sidebar 
          user={currentUser}
          collapsed={sidebarCollapsed}
          currentView={currentView}
          onViewChange={handleViewChange}
          onToggleCollapse={handleToggleSidebar}
          onLogout={handleLogout}
          onNewBug={handleNewBug}
        />
        
        <main className={`flex-1 p-6 transition-all duration-300 ${
          sidebarCollapsed ? 'ml-16' : 'ml-64'
        }`}>
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Index;
