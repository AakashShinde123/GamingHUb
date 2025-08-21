import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckInDialog } from "@/components/check-in-dialog";
import { Plus, LogOut } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { ActiveSession } from "@shared/schema";

export function ActiveCustomers() {
  const [showCheckIn, setShowCheckIn] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: activeSessions, isLoading } = useQuery<ActiveSession[]>({
    queryKey: ['/api/sessions/active'],
    refetchInterval: 30000,
  });

  const checkOutMutation = useMutation({
    mutationFn: (sessionId: string) =>
      apiRequest('PATCH', `/api/sessions/${sessionId}/end`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/sessions/active'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/metrics'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/utilization'] });
      queryClient.invalidateQueries({ queryKey: ['/api/activities'] });
      toast({
        title: "Success",
        description: "Customer checked out successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to check out customer",
        variant: "destructive",
      });
    }
  });

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const calculateRevenue = (session: ActiveSession) => {
    const hours = session.duration / 60;
    const rate = parseFloat(session.hourlyRate);
    return Math.round(hours * rate);
  };

  const getInitials = (name: string) => {
    if (!name || name.trim() === '') return '??';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getInitialsColor = (name: string) => {
    const colors = ['bg-gaming-blue', 'bg-gaming-purple', 'bg-gaming-green', 'bg-gaming-orange'];
    const index = name?.length ? name.length % colors.length : 0;
    return colors[index];
  };

  return (
    <>
      <Card className="card-shadow">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3">
            <h3 className="text-lg font-semibold text-gray-900">Active Sessions</h3>
            <Button
              onClick={() => setShowCheckIn(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 text-base shadow-lg hover:shadow-xl transition-all duration-200 w-full sm:w-auto"
              data-testid="button-checkin"
            >
              <Plus className="w-5 h-5 mr-2" />
              New Check-in
            </Button>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse border-b border-gray-200 pb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : activeSessions?.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No active sessions</p>
              <p className="text-sm text-gray-400 mt-1">Click "New Check-in" to start a session</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">Customer</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">Station</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">Start Time</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">Duration</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">Revenue</th>
                    <th className="text-center py-3 px-2 text-sm font-medium text-gray-600">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {activeSessions?.map((session) => (
                    <tr key={session.id} className="hover:bg-blue-50 transition-colors group">
                      <td className="py-3 px-2">
                        <div className="flex items-center">
                          <div className={`w-8 h-8 ${getInitialsColor(session.customerName || '')} rounded-full flex items-center justify-center mr-3`}>
                            <span className="text-white text-xs font-medium">
                              {getInitials(session.customerName || 'Unknown')}
                            </span>
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            {session.customerName || 'Unknown Customer'}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-2 text-sm text-gray-600">{session.stationName || 'Unknown Station'}</td>
                      <td className="py-3 px-2 text-sm text-gray-600">
                        {formatTime(session.startTime!)}
                      </td>
                      <td className="py-3 px-2 text-sm text-gray-600">
                        {formatDuration(session.duration)}
                      </td>
                      <td className="py-3 px-2 text-sm font-medium text-gaming-green">
                        ₹{calculateRevenue(session)}
                      </td>
                      <td className="py-3 px-2 text-center">
                        <Button
                          size="sm"
                          onClick={() => checkOutMutation.mutate(session.id)}
                          disabled={checkOutMutation.isPending}
                          className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 opacity-75 group-hover:opacity-100 group-hover:scale-105 transition-all duration-200 shadow-lg"
                          data-testid="button-checkout"
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Check Out
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <CheckInDialog open={showCheckIn} onOpenChange={setShowCheckIn} />
    </>
  );
}
