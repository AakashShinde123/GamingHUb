import { useQuery } from "@tanstack/react-query";
import { AlertPanel } from "@/components/alert-panel";
import { MetricsCards } from "@/components/metrics-cards";
import { RevenueChart } from "@/components/revenue-chart";
import { StationUtilization } from "@/components/station-utilization";
import { ActiveCustomers } from "@/components/active-customers";
import { QuickActions } from "@/components/quick-actions";
import { RecentActivity } from "@/components/recent-activity";
import { RevenueTargets } from "@/components/revenue-targets";
import { Gamepad2, User, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const { data: alerts } = useQuery({
    queryKey: ['/api/alerts'],
    refetchInterval: 30000,
  });

  const unreadAlerts = alerts?.filter((alert: any) => !alert.isRead) || [];

  return (
    <div className="min-h-screen bg-gray-100 font-roboto">
      {/* Header */}
      <header className="bg-white shadow-md border-b-2 border-gaming-purple">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo Section */}
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-gaming-purple to-gaming-orange rounded-lg flex items-center justify-center">
                <Gamepad2 className="text-white text-xl" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Patil's Gaming Cafe</h1>
                <p className="text-sm text-gray-600">Revenue Dashboard</p>
              </div>
            </div>

            {/* Navigation & Alerts */}
            <div className="flex items-center space-x-6">
              {/* Revenue Alert */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="p-2 text-gaming-orange hover:bg-orange-50 rounded-full transition-colors duration-200"
                >
                  <Bell className="h-5 w-5" />
                  {unreadAlerts.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-gaming-red text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadAlerts.length}
                    </span>
                  )}
                </Button>
              </div>

              {/* User Profile */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gaming-blue rounded-full flex items-center justify-center">
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
    </div>
  );
}
