
import { useState } from 'react';
import { Bug } from '@/types';
import { BugHistory } from './BugHistory';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, Clock, User, AlertTriangle, CheckCircle } from 'lucide-react';

interface BugTrackerProps {
  bugs: Bug[];
}

export const BugTracker = ({ bugs }: BugTrackerProps) => {
  const [selectedBug, setSelectedBug] = useState<Bug | null>(null);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'in-progress': return <Clock className="w-4 h-4 text-blue-500" />;
      case 'resolved': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'closed': return <CheckCircle className="w-4 h-4 text-gray-500" />;
      default: return <AlertTriangle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'border-l-red-500 bg-red-50';
      case 'high': return 'border-l-orange-500 bg-orange-50';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50';
      case 'low': return 'border-l-green-500 bg-green-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  const getTrackingStats = () => {
    const total = bugs.length;
    const open = bugs.filter(bug => bug.status === 'open').length;
    const inProgress = bugs.filter(bug => bug.status === 'in-progress').length;
    const resolved = bugs.filter(bug => bug.status === 'resolved').length;
    const critical = bugs.filter(bug => bug.severity === 'critical').length;
    
    return { total, open, inProgress, resolved, critical };
  };

  const stats = getTrackingStats();

  return (
    <div className="space-y-6">
      {/* Bug Tracking Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Total Bugs</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-600">{stats.open}</div>
            <p className="text-xs text-muted-foreground">Open</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
            <p className="text-xs text-muted-foreground">In Progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{stats.resolved}</div>
            <p className="text-xs text-muted-foreground">Resolved</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-500">{stats.critical}</div>
            <p className="text-xs text-muted-foreground">Critical</p>
          </CardContent>
        </Card>
      </div>

      {/* Bug List with Tracking */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Bug Tracking List</h3>
        {bugs.map((bug) => (
          <Card key={bug.id} className={`border-l-4 ${getSeverityColor(bug.severity)}`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{bug.title}</CardTitle>
                <div className="flex items-center gap-2">
                  {getStatusIcon(bug.status)}
                  <Badge variant="outline" className="capitalize">
                    {bug.status.replace('-', ' ')}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">{bug.description}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {bug.reportedBy}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {new Date(bug.createdAt).toLocaleDateString()}
                  </span>
                  <Badge 
                    className={`capitalize ${
                      bug.severity === 'critical' ? 'bg-red-500' :
                      bug.severity === 'high' ? 'bg-orange-500' :
                      bug.severity === 'medium' ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`}
                  >
                    {bug.severity}
                  </Badge>
                </div>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setSelectedBug(bug)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Track Details
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Bug Tracking Details - {bug.title}</DialogTitle>
                    </DialogHeader>
                    {selectedBug && <BugHistory bug={selectedBug} />}
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
