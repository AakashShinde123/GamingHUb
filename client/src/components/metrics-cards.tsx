import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, Users, Monitor, Clock, TrendingUp } from "lucide-react";
import type { DashboardMetrics } from "@shared/schema";

export function MetricsCards() {
  const { data: metrics, isLoading } = useQuery<DashboardMetrics>({
    queryKey: ['/api/dashboard/metrics'],
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-16 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const formatCurrency = (amount: number) => `₹${amount.toLocaleString()}`;
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Today's Revenue */}
      <Card className="border-l-4 border-gaming-green card-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Today's Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(metrics?.todayRevenue || 0)}
              </p>
              <p className="text-xs text-gaming-green mt-1 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                +{metrics?.revenueGrowth || 0}% from yesterday
              </p>
            </div>
            <div className="w-12 h-12 bg-gaming-green/10 rounded-lg flex items-center justify-center">
              <DollarSign className="text-gaming-green text-xl" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Customers */}
      <Card className="border-l-4 border-gaming-blue card-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Customers</p>
              <p className="text-2xl font-bold text-gray-900">
                {metrics?.activeCustomers || 0}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {metrics?.totalCustomersToday || 0} total today
              </p>
            </div>
            <div className="w-12 h-12 bg-gaming-blue/10 rounded-lg flex items-center justify-center">
              <Users className="text-gaming-blue text-xl" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gaming Stations */}
      <Card className="border-l-4 border-gaming-purple card-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Station Occupancy</p>
              <p className="text-2xl font-bold text-gray-900">
                {metrics?.occupiedStations || 0}/{metrics?.totalStations || 0}
              </p>
              <p className="text-xs text-gaming-purple mt-1">
                {metrics?.occupancyRate || 0}% utilization rate
              </p>
            </div>
            <div className="w-12 h-12 bg-gaming-purple/10 rounded-lg flex items-center justify-center">
              <Monitor className="text-gaming-purple text-xl" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Average Session */}
      <Card className="border-l-4 border-gaming-orange card-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Session Time</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatTime(metrics?.avgSessionTime || 0)}
              </p>
              <p className="text-xs text-gaming-orange mt-1 flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                +{metrics?.sessionGrowth || 0}% vs last week
              </p>
            </div>
            <div className="w-12 h-12 bg-gaming-orange/10 rounded-lg flex items-center justify-center">
              <Clock className="text-gaming-orange text-xl" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
