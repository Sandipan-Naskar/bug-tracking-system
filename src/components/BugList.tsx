
import { useState } from 'react';
import { Bug, User } from '@/types';
import { BugCard } from './BugCard';
import { BugGrouping } from './BugGrouping';
import { LayoutGrid, List } from 'lucide-react';

interface BugListProps {
  bugs: Bug[];
  users: User[];
  currentUser: User;
  onEdit: (bug: Bug) => void;
  onDelete: (bugId: string) => void;
}

export const BugList = ({ bugs, users, currentUser, onEdit, onDelete }: BugListProps) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [groupBy, setGroupBy] = useState<'status' | 'severity' | 'none'>('status');

  if (bugs.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">🐛</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No bugs found</h3>
        <p className="text-gray-500">Try adjusting your filters or create a new bug report.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* View Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Group by:</label>
            <select
              value={groupBy}
              onChange={(e) => setGroupBy(e.target.value as any)}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="none">No grouping</option>
              <option value="status">Status</option>
              <option value="severity">Severity</option>
            </select>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'grid' 
                ? 'bg-blue-100 text-blue-700' 
                : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            <LayoutGrid className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'list' 
                ? 'bg-blue-100 text-blue-700' 
                : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Bug Display */}
      {groupBy === 'none' ? (
        <div className={viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
          : 'space-y-4'
        }>
          {bugs.map((bug) => (
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
      ) : (
        <BugGrouping
          bugs={bugs}
          users={users}
          currentUser={currentUser}
          groupBy={groupBy}
          viewMode={viewMode}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )}
    </div>
  );
};
