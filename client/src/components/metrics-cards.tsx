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
      <Card className="border-l-4 border-kawaii-mint card-shadow card-hover kawaii-shadow bg-gradient-to-br from-kawaii-cream/50 to-kawaii-mint/20 float">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-kawaii-lavender kawaii-text">💰 Today's Revenue</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-kawaii-mint to-kawaii-sky bg-clip-text text-transparent bounce-cute">
                {formatCurrency(metrics?.todayRevenue || 0)}
              </p>
              <p className="text-xs text-kawaii-mint mt-1 flex items-center font-medium kawaii-text">
                <TrendingUp className="w-3 h-3 mr-1 wiggle" />
                +{metrics?.revenueGrowth || 0}% from yesterday
              </p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-r from-kawaii-mint to-kawaii-sky rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110 sparkle bounce-cute">
              <DollarSign className="text-white text-xl float" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Customers */}
      <Card className="border-l-4 border-kawaii-sky card-shadow card-hover kawaii-shadow bg-gradient-to-br from-kawaii-cream/50 to-kawaii-sky/20 float" style={{animationDelay: '0.5s'}}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-kawaii-lavender kawaii-text">👥 Active Customers</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-kawaii-sky to-kawaii-lavender bg-clip-text text-transparent bounce-cute">
                {metrics?.activeCustomers || 0}
              </p>
              <p className="text-xs text-gray-500 mt-1 font-medium">
                {metrics?.totalCustomersToday || 0} total today
              </p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-r from-kawaii-sky to-kawaii-lavender rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110 sparkle wiggle">
              <Users className="text-white text-xl float" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gaming Stations */}
      <Card className="border-l-4 border-kawaii-lavender card-shadow card-hover kawaii-shadow bg-gradient-to-br from-kawaii-cream/50 to-kawaii-lavender/20 float" style={{animationDelay: '1s'}}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-kawaii-lavender kawaii-text">🖥️ Station Occupancy</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-kawaii-lavender to-kawaii-peach bg-clip-text text-transparent bounce-cute">
                {metrics?.occupiedStations || 0}/{metrics?.totalStations || 25}
              </p>
              <p className="text-xs text-kawaii-lavender mt-1 font-medium kawaii-text">
                {metrics?.occupancyRate || 0}% utilization rate
              </p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-r from-kawaii-lavender to-kawaii-peach rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110 sparkle bounce-cute">
              <Monitor className="text-white text-xl wiggle" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Average Session */}
      <Card className="border-l-4 border-kawaii-peach card-shadow card-hover kawaii-shadow bg-gradient-to-br from-kawaii-cream/50 to-kawaii-peach/20 float" style={{animationDelay: '1.5s'}}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-kawaii-lavender kawaii-text">⏰ Avg Session Time</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-kawaii-peach to-kawaii-pink bg-clip-text text-transparent bounce-cute">
                {formatTime(metrics?.avgSessionTime || 0)}
              </p>
              <p className="text-xs text-kawaii-peach mt-1 flex items-center font-medium kawaii-text">
                <Clock className="w-3 h-3 mr-1 wiggle" />
                +{metrics?.sessionGrowth || 0}% vs last week
              </p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-r from-kawaii-peach to-kawaii-pink rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110 sparkle float">
              <Clock className="text-white text-xl bounce-cute" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
