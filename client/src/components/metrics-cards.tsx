import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, Users, Monitor, Clock, TrendingUp, BarChart3 } from "lucide-react";
import type { DashboardMetrics } from "@shared/schema";
import arcadeMachineImg from "@assets/generated_images/Pixel_arcade_machine_8b299005.png";
import sleepingCharacterImg from "@assets/generated_images/Sleeping_pixel_character_f431f23e.png";
import pixelAvatarsImg from "@assets/generated_images/Pixel_gaming_avatars_34d8ef3a.png";

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
    <>
      {/* Main Paradise Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Revenue Card */}
        <Card className="relative overflow-hidden card-hover bg-gradient-to-br from-kawaii-mint/80 to-kawaii-sky/60 border-0 shadow-2xl float">
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-700 kawaii-text">Revenue</h3>
              <span className="text-3xl">💰</span>
            </div>
            
            {/* Simple Bar Chart */}
            <div className="flex items-end space-x-2 h-24 mb-4">
              <div className="bg-kawaii-sky w-4 h-8 rounded-t bounce-cute" style={{animationDelay: '0.1s'}}></div>
              <div className="bg-kawaii-mint w-4 h-16 rounded-t bounce-cute" style={{animationDelay: '0.2s'}}></div>
              <div className="bg-kawaii-sky w-4 h-12 rounded-t bounce-cute" style={{animationDelay: '0.3s'}}></div>
              <div className="bg-kawaii-mint w-4 h-20 rounded-t bounce-cute" style={{animationDelay: '0.4s'}}></div>
              <div className="bg-kawaii-sky w-4 h-14 rounded-t bounce-cute" style={{animationDelay: '0.5s'}}></div>
            </div>
            
            <p className="text-2xl font-bold text-gray-700 kawaii-text">
              {formatCurrency(metrics?.todayRevenue || 0)}
            </p>
            <p className="text-sm text-gray-600 flex items-center">
              <TrendingUp className="w-3 h-3 mr-1 wiggle" />
              +{metrics?.revenueGrowth || 0}% today
            </p>
          </CardContent>
        </Card>

        {/* Active Sessions Card */}
        <Card className="relative overflow-hidden card-hover bg-gradient-to-br from-kawaii-lavender/80 to-purple-200/60 border-0 shadow-2xl float" style={{animationDelay: '0.5s'}}>
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-700 kawaii-text">Active Sessions</h3>
              <span className="text-3xl">🎮</span>
            </div>
            
            {/* Arcade Machine Image */}
            <div className="flex justify-center mb-4">
              <img 
                src={arcadeMachineImg} 
                alt="Arcade Machine" 
                className="w-20 h-20 object-contain bounce-cute"
              />
            </div>
            
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-sm text-kawaii-lavender">🕹️</span>
              <p className="text-2xl font-bold text-gray-700 kawaii-text">
                {metrics?.activeCustomers || 0} Players
              </p>
            </div>
            <p className="text-sm text-gray-600">
              {metrics?.totalCustomersToday || 0} total today
            </p>
          </CardContent>
        </Card>

        {/* Inactive Stations Card */}
        <Card className="relative overflow-hidden card-hover bg-gradient-to-br from-kawaii-pink/60 to-kawaii-peach/60 border-0 shadow-2xl float" style={{animationDelay: '1s'}}>
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-700 kawaii-text">Inactive Stations</h3>
              <span className="text-3xl">😴</span>
            </div>
            
            {/* Sleeping Character Image */}
            <div className="flex justify-center mb-4">
              <img 
                src={sleepingCharacterImg} 
                alt="Sleeping Character" 
                className="w-20 h-20 object-contain float"
              />
            </div>
            
            <p className="text-2xl font-bold text-gray-700 kawaii-text mb-2">
              {(metrics?.totalStations || 25) - (metrics?.occupiedStations || 0)} Stations
            </p>
            <p className="text-sm text-gray-600">
              {metrics?.occupancyRate || 0}% utilization rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Customer Avatars Section */}
      <div className="mb-8">
        <h3 className="text-lg font-bold text-gray-700 kawaii-text mb-4">Customer Avatars</h3>
        <div className="flex space-x-4">
          <div className="w-16 h-16 bg-gradient-to-br from-kawaii-sky to-kawaii-mint rounded-xl flex items-center justify-center card-hover sparkle">
            <span className="text-2xl">🤖</span>
          </div>
          <div className="w-16 h-16 bg-gradient-to-br from-kawaii-mint to-kawaii-sky rounded-xl flex items-center justify-center card-hover bounce-cute">
            <span className="text-2xl">🛸</span>
          </div>
          <div className="w-16 h-16 bg-gradient-to-br from-kawaii-sky to-kawaii-lavender rounded-xl flex items-center justify-center card-hover wiggle">
            <span className="text-2xl">👾</span>
          </div>
        </div>
      </div>
    </>
  );
}
