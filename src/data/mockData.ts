
import { User, Bug } from '@/types';

export const mockUsers: User[] = [
  {
    id: '1',
    email: 'john.doe@company.com',
    name: 'John Doe',
    role: 'developer',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
  },
  {
    id: '2',
    email: 'jane.smith@company.com',
    name: 'Jane Smith',
    role: 'tester',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face'
  },
  {
    id: '3',
    email: 'mike.johnson@company.com',
    name: 'Mike Johnson',
    role: 'manager',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
  },
  {
    id: '4',
    email: 'sarah.wilson@company.com',
    name: 'Sarah Wilson',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
  }
];

export const mockBugs: Bug[] = [
  {
    id: '1',
    title: 'Login button not responsive on mobile devices',
    description: 'Users are unable to tap the login button in the mobile view on iPhone 13. This only occurs in Safari browser.',
    severity: 'high',
    status: 'open',
    assignedTo: '1',
    reportedBy: '2',
    tags: ['UI', 'Mobile', 'Safari', 'Authentication'],
    stepsToReproduce: '1. Open app on iPhone 13 Safari\n2. Navigate to login page\n3. Try to tap login button',
    expectedBehavior: 'Login button should respond to touch and submit form',
    actualBehavior: 'Button appears unresponsive to touch events',
    environment: 'iOS 17.1, Safari, iPhone 13',
    createdAt: '2024-06-15T10:30:00Z',
    updatedAt: '2024-06-15T10:30:00Z',
    dueDate: '2024-06-20T23:59:59Z',
    priority: 'high'
  },
  {
    id: '2',
    title: 'Data export feature causing memory leak',
    description: 'When exporting large datasets (>10MB), the application consumes excessive memory and eventually crashes.',
    severity: 'critical',
    status: 'in-progress',
    assignedTo: '1',
    reportedBy: '3',
    tags: ['Performance', 'Memory', 'Export', 'Backend'],
    stepsToReproduce: '1. Navigate to export page\n2. Select large dataset\n3. Click export\n4. Monitor memory usage',
    expectedBehavior: 'Export should complete without memory issues',
    actualBehavior: 'Memory usage increases continuously until crash',
    environment: 'Chrome 119, Windows 11, 16GB RAM',
    createdAt: '2024-06-14T14:20:00Z',
    updatedAt: '2024-06-16T09:15:00Z',
    dueDate: '2024-06-18T23:59:59Z',
    priority: 'urgent'
  },
  {
    id: '3',
    title: 'Email notifications not sending for new assignments',
    description: 'Team members are not receiving email notifications when bugs are assigned to them.',
    severity: 'medium',
    status: 'resolved',
    assignedTo: '4',
    reportedBy: '1',
    tags: ['Email', 'Notifications', 'Backend', 'SMTP'],
    stepsToReproduce: '1. Assign bug to team member\n2. Check if email is sent\n3. Verify email in recipient inbox',
    expectedBehavior: 'Email notification should be sent immediately',
    actualBehavior: 'No email notification is received',
    environment: 'Production server, SendGrid SMTP',
    createdAt: '2024-06-13T16:45:00Z',
    updatedAt: '2024-06-16T11:30:00Z',
    priority: 'medium'
  },
  {
    id: '4',
    title: 'Dark mode toggle not persisting user preference',
    description: 'When users enable dark mode, the preference is not saved and resets to light mode on page refresh.',
    severity: 'low',
    status: 'open',
    assignedTo: '2',
    reportedBy: '4',
    tags: ['UI', 'LocalStorage', 'Theme', 'Frontend'],
    stepsToReproduce: '1. Toggle dark mode\n2. Refresh page\n3. Observe theme reset',
    expectedBehavior: 'Dark mode preference should persist across sessions',
    actualBehavior: 'Theme resets to light mode after refresh',
    environment: 'All browsers, all platforms',
    createdAt: '2024-06-16T08:15:00Z',
    updatedAt: '2024-06-16T08:15:00Z',
    priority: 'low'
  },
  {
    id: '5',
    title: 'API rate limiting causing timeout errors',
    description: 'Multiple concurrent requests to the API are being rate limited, causing timeout errors in the frontend.',
    severity: 'high',
    status: 'open',
    reportedBy: '2',
    tags: ['API', 'Rate Limiting', 'Backend', 'Performance'],
    stepsToReproduce: '1. Make multiple API calls quickly\n2. Observe rate limiting responses\n3. Check for timeout errors',
    expectedBehavior: 'API should handle requests gracefully',
    actualBehavior: 'Requests fail with timeout errors',
    environment: 'Production API, all endpoints',
    createdAt: '2024-06-16T12:00:00Z',
    updatedAt: '2024-06-16T12:00:00Z',
    dueDate: '2024-06-22T23:59:59Z',
    priority: 'high'
  }
];
