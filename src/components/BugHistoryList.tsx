
import { Bug, User } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, User as UserIcon, AlertTriangle } from 'lucide-react';

interface BugHistoryListProps {
  currentUser: User;
  bugs?: Bug[];
}

export const BugHistoryList = ({ currentUser, bugs = [] }: BugHistoryListProps) => {
  // Filter bugs related to current user (reported by or assigned to)
  const userBugs = bugs.filter(bug => 
    bug.reportedBy === currentUser.id || bug.assignedTo === currentUser.id
  );

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
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <AlertTriangle className="w-6 h-6" />
        <h2 className="text-2xl font-bold">Bug History</h2>
      </div>
      
      <p className="text-gray-600">
        Bugs you've reported or been assigned ({userBugs.length} total)
      </p>

      {userBugs.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500">No bug history found.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {userBugs.map((bug) => (
            <Card key={bug.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{bug.title}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(bug.status)}>
                      {bug.status.replace('-', ' ').toUpperCase()}
                    </Badge>
                    <div className={`w-3 h-3 rounded-full ${getSeverityColor(bug.severity)}`}></div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{bug.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">Created:</span>
                      <span className="text-gray-600">{formatDate(bug.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">Updated:</span>
                      <span className="text-gray-600">{formatDate(bug.updatedAt)}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <UserIcon className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">Reported By:</span>
                      <span className="text-gray-600">{bug.reportedBy}</span>
                    </div>
                    {bug.assignedTo && (
                      <div className="flex items-center gap-2">
                        <UserIcon className="w-4 h-4 text-blue-500" />
                        <span className="font-medium">Assigned To:</span>
                        <span className="text-blue-600">{bug.assignedTo}</span>
                      </div>
                    )}
                  </div>
                </div>

                {bug.tags && bug.tags.length > 0 && (
                  <div className="mt-4">
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
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
