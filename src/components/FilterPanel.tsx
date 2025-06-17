
import { Filter, SortAsc, SortDesc } from 'lucide-react';
import { FilterOptions, User } from '@/types';

interface FilterPanelProps {
  filterOptions: FilterOptions;
  onFilterChange: (options: FilterOptions) => void;
  users: User[];
  bugCount: number;
}

export const FilterPanel = ({ filterOptions, onFilterChange, users, bugCount }: FilterPanelProps) => {
  const updateFilter = (key: keyof FilterOptions, value: any) => {
    onFilterChange({ ...filterOptions, [key]: value });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-500" />
          <h3 className="font-semibold text-gray-900">Filters & Sorting</h3>
        </div>
        <span className="text-sm text-gray-500">{bugCount} bugs found</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select
            value={filterOptions.status}
            onChange={(e) => updateFilter('status', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            <option value="all">All Statuses</option>
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        {/* Severity Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Severity</label>
          <select
            value={filterOptions.severity}
            onChange={(e) => updateFilter('severity', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        {/* Assigned To Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Assigned To</label>
          <select
            value={filterOptions.assignedTo}
            onChange={(e) => updateFilter('assignedTo', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            <option value="all">All Users</option>
            <option value="">Unassigned</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>

        {/* Sort By */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
          <select
            value={filterOptions.sortBy}
            onChange={(e) => updateFilter('sortBy', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            <option value="created">Date Created</option>
            <option value="updated">Last Updated</option>
            <option value="severity">Severity</option>
            <option value="status">Status</option>
          </select>
        </div>

        {/* Sort Order */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
          <button
            onClick={() => updateFilter('sortOrder', filterOptions.sortOrder === 'asc' ? 'desc' : 'asc')}
            className="w-full flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
          >
            {filterOptions.sortOrder === 'asc' ? (
              <>
                <SortAsc className="w-4 h-4 mr-2" />
                Ascending
              </>
            ) : (
              <>
                <SortDesc className="w-4 h-4 mr-2" />
                Descending
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
