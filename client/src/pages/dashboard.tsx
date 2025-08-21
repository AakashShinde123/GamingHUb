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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 font-nunito">
      {/* Header */}
      <header className="bg-gradient-to-r from-kawaii-pink to-kawaii-cream shadow-lg border-b-4 border-kawaii-pink relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-kawaii-lavender/10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex justify-between items-center h-16">
            {/* Logo Section */}
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-kawaii-mint to-kawaii-sky rounded-full flex items-center justify-center shadow-lg kawaii-shadow float bounce-cute">
                <Gamepad2 className="text-white text-xl wiggle" />
              </div>
              <div>
                <h1 className="text-2xl font-bold font-fredoka bg-gradient-to-r from-kawaii-pink to-kawaii-lavender bg-clip-text text-transparent kawaii-text">
                  🎮 PlayHub Paradise
                </h1>
                <p className="text-sm text-kawaii-lavender font-medium">Pixel Paradise Dashboard 💕</p>
              </div>
            </div>

            {/* Navigation & Alerts */}
            <div className="flex items-center space-x-4">
              {/* Settings Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSettings(true)}
                className="p-2 text-kawaii-lavender hover:bg-kawaii-lavender/20 rounded-full transition-all duration-200 hover:scale-110 sparkle button-glow"
              >
                <Settings className="h-5 w-5" />
              </Button>

              {/* Revenue Alert */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="p-2 text-kawaii-peach hover:bg-kawaii-peach/20 rounded-full transition-all duration-200 hover:scale-110 bounce-cute button-glow"
                >
                  <Bell className="h-5 w-5" />
                  {unreadAlerts.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-kawaii-pink text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse wiggle">
                      {unreadAlerts.length}
                    </span>
                  )}
                </Button>
              </div>

              {/* Pixel Characters */}
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-r from-kawaii-sky to-kawaii-mint rounded-lg flex items-center justify-center sparkle bounce-cute">
                  <span className="text-lg">🤖</span>
                </div>
                <div className="w-10 h-10 bg-gradient-to-r from-kawaii-lavender to-kawaii-pink rounded-lg flex items-center justify-center sparkle wiggle">
                  <span className="text-lg">👾</span>
                </div>
                <div className="w-10 h-10 bg-gradient-to-r from-kawaii-peach to-kawaii-cream rounded-lg flex items-center justify-center sparkle float">
                  <span className="text-lg">🎮</span>
                </div>
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
