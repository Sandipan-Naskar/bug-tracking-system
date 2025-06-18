
import { useState } from 'react';
import { FilterOptions } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Filter, X, ChevronDown } from 'lucide-react';

interface FilterPanelProps {
  currentFilters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
}

export const FilterPanel = ({ currentFilters, onFilterChange }: FilterPanelProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    onFilterChange({
      ...currentFilters,
      [key]: value
    });
  };

  const clearAllFilters = () => {
    onFilterChange({
      status: 'all',
      severity: 'all',
      assignedTo: 'all',
      priority: 'all',
      sortBy: 'created',
      sortOrder: 'desc'
    });
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (currentFilters.status !== 'all') count++;
    if (currentFilters.severity !== 'all') count++;
    if (currentFilters.assignedTo !== 'all') count++;
    if (currentFilters.priority !== 'all') count++;
    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-blue-600" />
            <CardTitle className="text-lg">Filters & Sort</CardTitle>
            {activeFilterCount > 0 && (
              <Badge variant="secondary">{activeFilterCount} active</Badge>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {activeFilterCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-red-600 hover:text-red-700"
              >
                Clear All
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      {(isExpanded || activeFilterCount > 0) && (
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Quick Filter Buttons */}
            <div className="lg:col-span-3">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Quick Filters</h4>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={currentFilters.status === 'open' ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFilterChange('status', currentFilters.status === 'open' ? 'all' : 'open')}
                >
                  Open Bugs
                </Button>
                <Button
                  variant={currentFilters.severity === 'critical' ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFilterChange('severity', currentFilters.severity === 'critical' ? 'all' : 'critical')}
                >
                  Critical
                </Button>
                <Button
                  variant={currentFilters.priority === 'urgent' ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFilterChange('priority', currentFilters.priority === 'urgent' ? 'all' : 'urgent')}
                >
                  Urgent
                </Button>
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={currentFilters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="all">All Status</option>
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
                value={currentFilters.severity}
                onChange={(e) => handleFilterChange('severity', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="all">All Severities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            {/* Priority Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
              <select
                value={currentFilters.priority || 'all'}
                onChange={(e) => handleFilterChange('priority', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="all">All Priorities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <select
                value={currentFilters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
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
              <select
                value={currentFilters.sortOrder}
                onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>
          </div>

          {/* Active Filters Display */}
          {activeFilterCount > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Active Filters:</h4>
              <div className="flex flex-wrap gap-2">
                {currentFilters.status !== 'all' && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Status: {currentFilters.status}
                    <X 
                      className="w-3 h-3 cursor-pointer" 
                      onClick={() => handleFilterChange('status', 'all')}
                    />
                  </Badge>
                )}
                {currentFilters.severity !== 'all' && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Severity: {currentFilters.severity}
                    <X 
                      className="w-3 h-3 cursor-pointer" 
                      onClick={() => handleFilterChange('severity', 'all')}
                    />
                  </Badge>
                )}
                {currentFilters.priority !== 'all' && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Priority: {currentFilters.priority}
                    <X 
                      className="w-3 h-3 cursor-pointer" 
                      onClick={() => handleFilterChange('priority', 'all')}
                    />
                  </Badge>
                )}
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
};
