
import { Calendar, Clock, Edit, Trash2, User, AlertTriangle } from 'lucide-react';
import { Bug, User as UserType } from '@/types';
import { formatDistanceToNow } from 'date-fns';

interface BugCardProps {
  bug: Bug;
  users: UserType[];
  currentUser: UserType;
  onEdit: (bug: Bug) => void;
  onDelete: (bugId: string) => void;
  viewMode: 'grid' | 'list';
}

export const BugCard = ({ bug, users, currentUser, onEdit, onDelete, viewMode }: BugCardProps) => {
  const assignedUser = users.find(u => u.id === bug.assignedTo);
  const reportedByUser = users.find(u => u.id === bug.reportedBy);
  
  const severityColors = {
    low: 'bg-green-100 text-green-800 border-green-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    high: 'bg-orange-100 text-orange-800 border-orange-200',
    critical: 'bg-red-100 text-red-800 border-red-200'
  };

  const statusColors = {
    open: 'bg-blue-100 text-blue-800 border-blue-200',
    'in-progress': 'bg-purple-100 text-purple-800 border-purple-200',
    resolved: 'bg-green-100 text-green-800 border-green-200',
    closed: 'bg-gray-100 text-gray-800 border-gray-200'
  };

  if (viewMode === 'list') {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="text-lg font-semibold text-gray-900 truncate">{bug.title}</h3>
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${severityColors[bug.severity]}`}>
                {bug.severity}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[bug.status]}`}>
                {bug.status.replace('-', ' ')}
              </span>
            </div>
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{bug.description}</p>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <User className="w-4 h-4" />
                <span>{reportedByUser?.name}</span>
              </div>
              {assignedUser && (
                <div className="flex items-center space-x-1">
                  <span>→</span>
                  <span>{assignedUser.name}</span>
                </div>
              )}
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{formatDistanceToNow(new Date(bug.createdAt), { addSuffix: true })}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2 ml-4">
            <button
              onClick={() => onEdit(bug)}
              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(bug.id)}
              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 hover:border-gray-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${severityColors[bug.severity]}`}>
            {bug.severity}
          </span>
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[bug.status]}`}>
            {bug.status.replace('-', ' ')}
          </span>
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => onEdit(bug)}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(bug.id)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{bug.title}</h3>
      <p className="text-gray-600 text-sm mb-4 line-clamp-3">{bug.description}</p>

      {bug.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {bug.tags.slice(0, 3).map((tag, index) => (
            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs">
              {tag}
            </span>
          ))}
          {bug.tags.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded-md text-xs">
              +{bug.tags.length - 3} more
            </span>
          )}
        </div>
      )}

      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1">
            <User className="w-4 h-4" />
            <span>{reportedByUser?.name}</span>
          </div>
          {assignedUser && (
            <div className="flex items-center space-x-1">
              <span>→</span>
              <span className="font-medium">{assignedUser.name}</span>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-1">
          <Clock className="w-4 h-4" />
          <span>{formatDistanceToNow(new Date(bug.createdAt), { addSuffix: true })}</span>
        </div>
      </div>

      {bug.dueDate && (
        <div className="mt-3 flex items-center space-x-1 text-sm">
          <Calendar className="w-4 h-4 text-orange-500" />
          <span className="text-orange-600">
            Due {formatDistanceToNow(new Date(bug.dueDate), { addSuffix: true })}
          </span>
        </div>
      )}
    </div>
  );
};
