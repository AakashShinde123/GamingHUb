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
      <Card className="border-l-4 border-green-500 bg-white shadow-lg hover:shadow-xl transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Today's Revenue</p>
              <p className="text-3xl font-bold text-gray-900">
                {formatCurrency(metrics?.todayRevenue || 0)}
              </p>
              <p className="text-xs text-green-600 mt-1 flex items-center font-medium">
                <TrendingUp className="w-3 h-3 mr-1" />
                +{metrics?.revenueGrowth || 0}% from yesterday
              </p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-lg">
              <DollarSign className="text-white text-xl" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Customers */}
      <Card className="border-l-4 border-blue-500 bg-white shadow-lg hover:shadow-xl transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Customers</p>
              <p className="text-3xl font-bold text-gray-900">
                {metrics?.activeCustomers || 0}
              </p>
              <p className="text-xs text-gray-500 mt-1 font-medium">
                {metrics?.totalCustomersToday || 0} total today
              </p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
              <Users className="text-white text-xl" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gaming Stations */}
      <Card className="border-l-4 border-purple-500 bg-white shadow-lg hover:shadow-xl transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Station Occupancy</p>
              <p className="text-3xl font-bold text-gray-900">
                {metrics?.occupiedStations || 0}/{metrics?.totalStations || 25}
              </p>
              <p className="text-xs text-purple-600 mt-1 font-medium">
                {metrics?.occupancyRate || 0}% utilization rate
              </p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
              <Monitor className="text-white text-xl" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Average Session */}
      <Card className="border-l-4 border-orange-500 bg-white shadow-lg hover:shadow-xl transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Session Time</p>
              <p className="text-3xl font-bold text-gray-900">
                {formatTime(metrics?.avgSessionTime || 0)}
              </p>
              <p className="text-xs text-orange-600 mt-1 flex items-center font-medium">
                <Clock className="w-3 h-3 mr-1" />
                +{metrics?.sessionGrowth || 0}% vs last week
              </p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-lg">
              <Clock className="text-white text-xl" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
