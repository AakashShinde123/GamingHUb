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
      <Card className="border-l-4 border-gaming-green card-shadow card-hover gaming-shadow bg-gradient-to-br from-white to-green-50/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Today's Revenue</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-gaming-green to-gaming-blue bg-clip-text text-transparent">
                {formatCurrency(metrics?.todayRevenue || 0)}
              </p>
              <p className="text-xs text-gaming-green mt-1 flex items-center font-medium">
                <TrendingUp className="w-3 h-3 mr-1" />
                +{metrics?.revenueGrowth || 0}% from yesterday
              </p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-r from-gaming-green to-gaming-blue rounded-xl flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110">
              <DollarSign className="text-white text-xl" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Customers */}
      <Card className="border-l-4 border-gaming-blue card-shadow card-hover gaming-shadow bg-gradient-to-br from-white to-blue-50/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Customers</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-gaming-blue to-gaming-purple bg-clip-text text-transparent">
                {metrics?.activeCustomers || 0}
              </p>
              <p className="text-xs text-gray-500 mt-1 font-medium">
                {metrics?.totalCustomersToday || 0} total today
              </p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-r from-gaming-blue to-gaming-purple rounded-xl flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110">
              <Users className="text-white text-xl" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gaming Stations */}
      <Card className="border-l-4 border-gaming-purple card-shadow card-hover gaming-shadow bg-gradient-to-br from-white to-purple-50/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Station Occupancy</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-gaming-purple to-gaming-orange bg-clip-text text-transparent">
                {metrics?.occupiedStations || 0}/{metrics?.totalStations || 25}
              </p>
              <p className="text-xs text-gaming-purple mt-1 font-medium">
                {metrics?.occupancyRate || 0}% utilization rate
              </p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-r from-gaming-purple to-gaming-orange rounded-xl flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110">
              <Monitor className="text-white text-xl" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Average Session */}
      <Card className="border-l-4 border-gaming-orange card-shadow card-hover gaming-shadow bg-gradient-to-br from-white to-orange-50/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Session Time</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-gaming-orange to-gaming-red bg-clip-text text-transparent">
                {formatTime(metrics?.avgSessionTime || 0)}
              </p>
              <p className="text-xs text-gaming-orange mt-1 flex items-center font-medium">
                <Clock className="w-3 h-3 mr-1" />
                +{metrics?.sessionGrowth || 0}% vs last week
              </p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-r from-gaming-orange to-gaming-red rounded-xl flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110">
              <Clock className="text-white text-xl" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
