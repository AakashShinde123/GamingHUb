import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogIn, LogOut, AlertTriangle } from "lucide-react";
import type { Activity } from "@shared/schema";

export function RecentActivity() {
  const { data: activities, isLoading } = useQuery<Activity[]>({
    queryKey: ['/api/activities'],
    refetchInterval: 30000,
  });

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'check_in':
        return <LogIn className="w-4 h-4 text-white" />;
      case 'check_out':
        return <LogOut className="w-4 h-4 text-white" />;
      case 'alert':
        return <AlertTriangle className="w-4 h-4 text-white" />;
      default:
        return <LogIn className="w-4 h-4 text-white" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'check_in':
        return 'bg-gaming-green';
      case 'check_out':
        return 'bg-gaming-orange';
      case 'alert':
        return 'bg-gaming-yellow';
      default:
        return 'bg-gaming-blue';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - new Date(date).getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    return new Date(date).toLocaleDateString();
  };

  return (
    <Card className="card-shadow">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-start space-x-3 animate-pulse">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div className="min-w-0 flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : activities?.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No recent activity</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities?.slice(0, 5).map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className={`w-8 h-8 ${getActivityColor(activity.type)} rounded-full flex items-center justify-center flex-shrink-0`}>
                  {getActivityIcon(activity.type)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-900">{activity.description}</p>
                  <p className="text-xs text-gray-500">
                    {formatTimeAgo(activity.createdAt!)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <Button
          variant="ghost"
          className="w-full mt-4 text-gaming-blue hover:bg-gaming-blue/5"
        >
          View All Activity
        </Button>
      </CardContent>
    </Card>
  );
}
