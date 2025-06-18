
import { useState, useEffect } from 'react';
import { Bug, FilterOptions, User } from '@/types';
import { AuthModal } from '@/components/AuthModal';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { BugList } from '@/components/BugList';
import { BugReport } from '@/components/BugReport';
import { FilterPanel } from '@/components/FilterPanel';
import { BugTracker } from '@/components/BugTracker';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

// Mock data for demonstration
const mockBugs: Bug[] = [
  {
    id: '1',
    title: 'Login button not responsive on mobile',
    description: 'Users are unable to tap the login button in the mobile view on iPhone 13. This only occurs in Safari.',
    severity: 'high',
    status: 'open',
    assignedTo: 'john.doe@example.com',
    reportedBy: 'jane.smith@example.com',
    tags: ['UI', 'Mobile', 'Safari'],
    stepsToReproduce: '1. Open app on iPhone 13\n2. Navigate to login page\n3. Try to tap login button\n4. Button does not respond',
    expectedBehavior: 'Login button should be clickable and responsive',
    actualBehavior: 'Button appears but does not respond to touch',
    environment: 'iOS 15.1, Safari, iPhone 13',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
    dueDate: '2024-01-20T23:59:59Z',
    priority: 'high'
  },
  {
    id: '2',
    title: 'Database connection timeout',
    description: 'Random database connection timeouts occurring during peak hours',
    severity: 'critical',
    status: 'in-progress',
    assignedTo: 'mike.wilson@example.com',
    reportedBy: 'admin@example.com',
    tags: ['Database', 'Performance', 'Backend'],
    stepsToReproduce: 'Occurs randomly during high traffic periods',
    expectedBehavior: 'Database should maintain stable connections',
    actualBehavior: 'Connections timeout randomly causing 500 errors',
    environment: 'Production server, PostgreSQL 13',
    createdAt: '2024-01-14T08:15:00Z',
    updatedAt: '2024-01-16T14:22:00Z',
    dueDate: '2024-01-18T17:00:00Z',
    priority: 'urgent'
  },
  {
    id: '3',
    title: 'Email notifications not being sent',
    description: 'Users are not receiving email notifications for password resets',
    severity: 'medium',
    status: 'resolved',
    assignedTo: 'sarah.jones@example.com',
    reportedBy: 'support@example.com',
    tags: ['Email', 'Authentication', 'Backend'],
    stepsToReproduce: '1. Request password reset\n2. Check email\n3. No email received',
    expectedBehavior: 'Password reset email should be delivered within 5 minutes',
    actualBehavior: 'No email is sent',
    environment: 'Production, SendGrid email service',
    createdAt: '2024-01-10T12:00:00Z',
    updatedAt: '2024-01-15T16:45:00Z',
    priority: 'medium'
  }
];

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [bugs, setBugs] = useState<Bug[]>(mockBugs);
  const [filteredBugs, setFilteredBugs] = useState<Bug[]>(mockBugs);
  const [filters, setFilters] = useState<FilterOptions>({
    status: 'all',
    severity: 'all',
    assignedTo: 'all',
    priority: 'all',
    sortBy: 'created',
    sortOrder: 'desc'
  });
  const [activeView, setActiveView] = useState<'dashboard' | 'bugs' | 'report'>('dashboard');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { toast } = useToast();

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...bugs];

    // Apply filters
    if (filters.status !== 'all') {
      filtered = filtered.filter(bug => bug.status === filters.status);
    }
    if (filters.severity !== 'all') {
      filtered = filtered.filter(bug => bug.severity === filters.severity);
    }
    if (filters.assignedTo !== 'all') {
      filtered = filtered.filter(bug => bug.assignedTo === filters.assignedTo);
    }
    if (filters.priority !== 'all') {
      filtered = filtered.filter(bug => bug.priority === filters.priority);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (filters.sortBy) {
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'severity':
          const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
          aValue = severityOrder[a.severity as keyof typeof severityOrder];
          bValue = severityOrder[b.severity as keyof typeof severityOrder];
          break;
        case 'status':
          const statusOrder = { open: 1, 'in-progress': 2, resolved: 3, closed: 4 };
          aValue = statusOrder[a.status as keyof typeof statusOrder];
          bValue = statusOrder[b.status as keyof typeof statusOrder];
          break;
        case 'priority':
          const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
          aValue = priorityOrder[(a.priority || 'low') as keyof typeof priorityOrder];
          bValue = priorityOrder[(b.priority || 'low') as keyof typeof priorityOrder];
          break;
        case 'updated':
          aValue = new Date(a.updatedAt);
          bValue = new Date(b.updatedAt);
          break;
        default: // 'created'
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
      }

      if (filters.sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    setFilteredBugs(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [bugs, filters]);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    toast({
      title: "Login Successful",
      description: `Welcome back, ${user.name}!`,
    });
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    setActiveView('dashboard');
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  const handleCreateBug = (bugData: Omit<Bug, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newBug: Bug = {
      ...bugData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setBugs(prev => [newBug, ...prev]);
    toast({
      title: "Bug Created",
      description: "Bug report has been successfully created.",
    });
  };

  const handleUpdateBug = (updatedBug: Bug) => {
    setBugs(prev => prev.map(bug => 
      bug.id === updatedBug.id 
        ? { ...updatedBug, updatedAt: new Date().toISOString() }
        : bug
    ));
    toast({
      title: "Bug Updated",
      description: "Bug has been successfully updated.",
    });
  };

  const handleDeleteBug = (bugId: string) => {
    setBugs(prev => prev.filter(bug => bug.id !== bugId));
    toast({
      title: "Bug Deleted",
      description: "Bug has been successfully deleted.",
    });
  };

  const handleSidebarViewChange = (view: 'all' | 'my-bugs' | 'assigned') => {
    if (view === 'all') setActiveView('bugs');
    else if (view === 'my-bugs') setActiveView('bugs');
    else if (view === 'assigned') setActiveView('bugs');
  };

  // Pagination
  const totalPages = Math.ceil(filteredBugs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBugs = filteredBugs.slice(startIndex, startIndex + itemsPerPage);

  if (!isAuthenticated || !currentUser) {
    return <AuthModal onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        user={currentUser} 
        onLogout={handleLogout}
        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        sidebarCollapsed={sidebarCollapsed}
      />
      
      <div className="flex">
        <Sidebar 
          activeView={activeView === 'bugs' ? 'all' : activeView === 'dashboard' ? 'all' : 'all'}
          onViewChange={handleSidebarViewChange}
        />
        
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <Tabs value={activeView} onValueChange={(value) => setActiveView(value as any)}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="bugs">Bug List</TabsTrigger>
                <TabsTrigger value="report">Report Bug</TabsTrigger>
              </TabsList>

              <TabsContent value="dashboard" className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">Bug Tracker Dashboard</h1>
                  <p className="text-gray-600">Monitor and track all bugs in your system</p>
                </div>
                <BugTracker bugs={bugs} />
              </TabsContent>

              <TabsContent value="bugs" className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">Bug Management</h1>
                  <p className="text-gray-600">View and manage all reported bugs</p>
                </div>
                
                <FilterPanel 
                  bugs={bugs}
                  currentFilters={filters}
                  onFilterChange={setFilters}
                />
                
                <BugList 
                  bugs={paginatedBugs}
                  onEdit={handleUpdateBug}
                  onDelete={handleDeleteBug}
                  currentUser={currentUser}
                  totalBugs={filteredBugs.length}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </TabsContent>

              <TabsContent value="report" className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">Report New Bug</h1>
                  <p className="text-gray-600">Create a detailed bug report</p>
                </div>
                
                <BugReport 
                  onSubmit={handleCreateBug}
                  currentUser={currentUser}
                  users={[currentUser]}
                  onClose={() => setActiveView('dashboard')}
                />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
