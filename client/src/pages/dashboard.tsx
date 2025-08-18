import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AlertPanel } from "@/components/alert-panel";
import { MetricsCards } from "@/components/metrics-cards";
import { RevenueChart } from "@/components/revenue-chart";
import { StationUtilization } from "@/components/station-utilization";
import { ActiveCustomers } from "@/components/active-customers";
import { QuickActions } from "@/components/quick-actions";
import { RecentActivity } from "@/components/recent-activity";
import { RevenueTargets } from "@/components/revenue-targets";
import { SettingsDialog } from "@/components/settings-dialog";
import { Gamepad2, User, Bell, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const [showSettings, setShowSettings] = useState(false);
  
  const { data: alerts } = useQuery({
    queryKey: ['/api/alerts'],
    refetchInterval: 30000,
  });

  const unreadAlerts = (alerts as any[])?.filter((alert: any) => !alert.isRead) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 font-roboto">
      {/* Header */}
      <header className="bg-white shadow-lg border-b-4 border-gaming-purple relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gaming-blue/5 to-gaming-purple/5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex justify-between items-center h-16">
            {/* Logo Section */}
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-gaming-purple to-gaming-orange rounded-xl flex items-center justify-center shadow-lg gaming-shadow">
                <Gamepad2 className="text-white text-xl" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-gaming-purple to-gaming-orange bg-clip-text text-transparent">
                  PlayHub
                </h1>
                <p className="text-sm text-gray-600 font-medium">Revenue Management Dashboard</p>
              </div>
            </div>

            {/* Navigation & Alerts */}
            <div className="flex items-center space-x-4">
              {/* Settings Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSettings(true)}
                className="p-2 text-gaming-purple hover:bg-gaming-purple/10 rounded-full transition-all duration-200 hover:scale-110"
              >
                <Settings className="h-5 w-5" />
              </Button>

              {/* Revenue Alert */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="p-2 text-gaming-orange hover:bg-orange-50 rounded-full transition-all duration-200 hover:scale-110"
                >
                  <Bell className="h-5 w-5" />
                  {unreadAlerts.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-gaming-red text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                      {unreadAlerts.length}
                    </span>
                  )}
                </Button>
              </div>

              {/* User Profile */}
              <div className="flex items-center space-x-3 bg-gray-50 rounded-full px-3 py-2">
                <div className="w-8 h-8 bg-gradient-to-r from-gaming-blue to-gaming-green rounded-full flex items-center justify-center">
                  <User className="text-white text-sm" />
                </div>
                <span className="text-gray-700 font-medium">Admin</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Alert Panel */}
        <AlertPanel />

        {/* Key Metrics Cards */}
        <MetricsCards />

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <RevenueChart />
          <StationUtilization />
        </div>

        {/* Customer Management & Gaming Stations */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <ActiveCustomers />
          </div>
          <QuickActions />
        </div>

        {/* Recent Activity & Revenue Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentActivity />
          <RevenueTargets />
        </div>
      </main>

      <SettingsDialog open={showSettings} onOpenChange={setShowSettings} />
    </div>
  );
}
