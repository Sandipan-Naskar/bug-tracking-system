
import { Filter, SortAsc, SortDesc, Calendar } from 'lucide-react';
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

  const clearFilters = () => {
    onFilterChange({
      status: 'all',
      severity: 'all',
      assignedTo: 'all',
      sortBy: 'created',
      sortOrder: 'desc'
    });
  };

  const hasActiveFilters = filterOptions.status !== 'all' || 
                          filterOptions.severity !== 'all' || 
                          filterOptions.assignedTo !== 'all';

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-500" />
          <h3 className="font-semibold text-gray-900">Filters & Sorting</h3>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-500">{bugCount} bugs found</span>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
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

        {/* Priority Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
          <select
            value={filterOptions.priority || 'all'}
            onChange={(e) => updateFilter('priority', e.target.value === 'all' ? undefined : e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
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
            <option value="priority">Priority</option>
            <option value="status">Status</option>
            <option value="title">Title</option>
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

      {/* Quick Filter Buttons */}
      <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200">
        <span className="text-sm font-medium text-gray-700">Quick filters:</span>
        <button
          onClick={() => updateFilter('status', 'open')}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
            filterOptions.status === 'open' 
              ? 'bg-blue-100 text-blue-800' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Open Bugs
        </button>
        <button
          onClick={() => updateFilter('severity', 'critical')}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
            filterOptions.severity === 'critical' 
              ? 'bg-red-100 text-red-800' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Critical
        </button>
        <button
          onClick={() => updateFilter('assignedTo', '')}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
            filterOptions.assignedTo === '' 
              ? 'bg-orange-100 text-orange-800' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Unassigned
        </button>
      </div>
    </div>
  );
};
