
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'developer' | 'tester' | 'manager';
  avatar?: string;
}

export interface Bug {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  assignedTo?: string;
  reportedBy: string;
  tags: string[];
  stepsToReproduce?: string;
  expectedBehavior?: string;
  actualBehavior?: string;
  environment?: string;
  attachments?: string[];
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
}

export interface FilterOptions {
  status: 'all' | 'open' | 'in-progress' | 'resolved' | 'closed';
  severity: 'all' | 'low' | 'medium' | 'high' | 'critical';
  assignedTo: 'all' | string;
  priority?: 'all' | 'low' | 'medium' | 'high' | 'urgent';
  sortBy: 'created' | 'updated' | 'severity' | 'status' | 'priority' | 'title';
  sortOrder: 'asc' | 'desc';
}

export interface Notification {
  id: string;
  type: 'assignment' | 'status_change' | 'due_date' | 'comment';
  title: string;
  message: string;
  bugId?: string;
  userId: string;
  read: boolean;
  createdAt: string;
}
