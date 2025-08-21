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
import { CheckInDialog } from "@/components/check-in-dialog";
import { Gamepad2, User, Bell, Settings, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Dashboard() {
  const [showSettings, setShowSettings] = useState(false);
  const [showCheckIn, setShowCheckIn] = useState(false);
  
  const { data: alerts } = useQuery({
    queryKey: ['/api/alerts'],
    refetchInterval: 30000,
  });

  const unreadAlerts = (alerts as any[])?.filter((alert: any) => !alert.isRead) || [];

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-gray-200 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 to-purple-50/30"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex justify-between items-center h-16">
            {/* Logo Section */}
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center shadow-lg">
                <Gamepad2 className="text-white text-xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  PlayHub
                </h1>
                <p className="text-sm text-gray-600 font-medium">Gaming Center Management</p>
              </div>
            </div>

            {/* Navigation & Alerts */}
            <div className="flex items-center space-x-4">
              {/* Settings Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSettings(true)}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Settings className="h-5 w-5" />
              </Button>

              {/* Revenue Alert */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Bell className="h-5 w-5" />
                  {unreadAlerts.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                      {unreadAlerts.length}
                    </span>
                  )}
                </Button>
              </div>

              {/* User Profile */}
              <div className="flex items-center space-x-3 bg-gray-100 rounded-lg px-3 py-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <User className="text-white text-sm" />
                </div>
                <span className="text-gray-700 font-medium">Admin</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Quick Check-in Action */}
        <div className="mb-6">
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-left">
                  <h2 className="text-xl font-bold text-white mb-2">Ready to start a gaming session?</h2>
                  <p className="text-blue-100">Check in customers quickly and start tracking their sessions</p>
                </div>
                <Button
                  onClick={() => setShowCheckIn(true)}
                  className="bg-white text-blue-600 hover:bg-blue-50 font-bold px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-200 min-w-[200px]"
                  data-testid="button-main-checkin"
                >
                  <Plus className="w-6 h-6 mr-2" />
                  Start Check-in
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

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
      <CheckInDialog open={showCheckIn} onOpenChange={setShowCheckIn} />
    </div>
  );
}
