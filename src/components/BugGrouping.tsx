
import { Bug, User } from '@/types';
import { BugCard } from './BugCard';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface BugGroupingProps {
  bugs: Bug[];
  users: User[];
  currentUser: User;
  groupBy: 'status' | 'severity';
  viewMode: 'grid' | 'list';
  onEdit: (bug: Bug) => void;
  onDelete: (bugId: string) => void;
}

export const BugGrouping = ({ 
  bugs, 
  users, 
  currentUser, 
  groupBy, 
  viewMode, 
  onEdit, 
  onDelete 
}: BugGroupingProps) => {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const toggleGroup = (groupName: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupName)) {
      newExpanded.delete(groupName);
    } else {
      newExpanded.add(groupName);
    }
    setExpandedGroups(newExpanded);
  };

  const groupBugs = () => {
    const groups: { [key: string]: Bug[] } = {};
    
    if (groupBy === 'status') {
      const statuses = ['open', 'in-progress', 'resolved', 'closed'];
      statuses.forEach(status => {
        groups[status] = bugs.filter(bug => bug.status === status);
      });
    } else if (groupBy === 'severity') {
      const severities = ['critical', 'high', 'medium', 'low'];
      severities.forEach(severity => {
        groups[severity] = bugs.filter(bug => bug.severity === severity);
      });
    }

    return groups;
  };

  const groups = groupBugs();

  const getGroupColor = (groupName: string) => {
    if (groupBy === 'severity') {
      const colors = {
        critical: 'border-red-200 bg-red-50',
        high: 'border-orange-200 bg-orange-50',
        medium: 'border-yellow-200 bg-yellow-50',
        low: 'border-green-200 bg-green-50'
      };
      return colors[groupName as keyof typeof colors] || 'border-gray-200 bg-gray-50';
    } else {
      const colors = {
        open: 'border-blue-200 bg-blue-50',
        'in-progress': 'border-purple-200 bg-purple-50',
        resolved: 'border-green-200 bg-green-50',
        closed: 'border-gray-200 bg-gray-50'
      };
      return colors[groupName as keyof typeof colors] || 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      {Object.entries(groups).map(([groupName, groupBugs]) => {
        if (groupBugs.length === 0) return null;
        
        const isExpanded = expandedGroups.has(groupName);
        
        return (
          <div key={groupName} className={`border rounded-xl ${getGroupColor(groupName)}`}>
            <button
              onClick={() => toggleGroup(groupName)}
              className="w-full p-4 flex items-center justify-between hover:bg-opacity-80 transition-colors"
            >
              <div className="flex items-center space-x-3">
                {isExpanded ? (
                  <ChevronDown className="w-5 h-5" />
                ) : (
                  <ChevronRight className="w-5 h-5" />
                )}
                <h3 className="text-lg font-semibold capitalize">
                  {groupName.replace('-', ' ')} ({groupBugs.length})
                </h3>
              </div>
            </button>
            
            {isExpanded && (
              <div className="p-4 pt-0">
                <div className={viewMode === 'grid' 
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
                  : 'space-y-4'
                }>
                  {groupBugs.map((bug) => (
                    <BugCard
                      key={bug.id}
                      bug={bug}
                      users={users}
                      currentUser={currentUser}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      viewMode={viewMode}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
