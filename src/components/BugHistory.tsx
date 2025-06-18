
import { Bug } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, User, AlertTriangle } from 'lucide-react';

interface BugHistoryProps {
  bug: Bug;
}

export const BugHistory = ({ bug }: BugHistoryProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-red-100 text-red-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          Bug Tracking Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium">Created:</span>
              <span className="text-sm text-gray-600">{formatDate(bug.createdAt)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium">Last Updated:</span>
              <span className="text-sm text-gray-600">{formatDate(bug.updatedAt)}</span>
            </div>
            {bug.dueDate && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-red-500" />
                <span className="text-sm font-medium">Due Date:</span>
                <span className="text-sm text-red-600">{formatDate(bug.dueDate)}</span>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium">Reported By:</span>
              <span className="text-sm text-gray-600">{bug.reportedBy}</span>
            </div>
            {bug.assignedTo && (
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium">Assigned To:</span>
                <span className="text-sm text-blue-600">{bug.assignedTo}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Status:</span>
            <Badge className={getStatusColor(bug.status)}>
              {bug.status.replace('-', ' ').toUpperCase()}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Severity:</span>
            <div className={`w-3 h-3 rounded-full ${getSeverityColor(bug.severity)}`}></div>
            <span className="text-sm capitalize">{bug.severity}</span>
          </div>
          {bug.priority && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Priority:</span>
              <Badge variant="outline" className="capitalize">
                {bug.priority}
              </Badge>
            </div>
          )}
        </div>

        {bug.tags && bug.tags.length > 0 && (
          <div>
            <span className="text-sm font-medium">Tags:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {bug.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {bug.environment && (
          <div>
            <span className="text-sm font-medium">Environment:</span>
            <p className="text-sm text-gray-600 mt-1">{bug.environment}</p>
          </div>
        )}

        {bug.stepsToReproduce && (
          <div>
            <span className="text-sm font-medium">Steps to Reproduce:</span>
            <p className="text-sm text-gray-600 mt-1 whitespace-pre-wrap">{bug.stepsToReproduce}</p>
          </div>
        )}

        {bug.expectedBehavior && (
          <div>
            <span className="text-sm font-medium">Expected Behavior:</span>
            <p className="text-sm text-gray-600 mt-1">{bug.expectedBehavior}</p>
          </div>
        )}

        {bug.actualBehavior && (
          <div>
            <span className="text-sm font-medium">Actual Behavior:</span>
            <p className="text-sm text-gray-600 mt-1">{bug.actualBehavior}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
