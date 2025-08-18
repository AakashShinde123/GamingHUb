import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { TrendingUp, Download, Bell, ChevronRight } from "lucide-react";
import type { StationUtilization } from "@shared/schema";

export function QuickActions() {
  const { data: utilization } = useQuery<StationUtilization>({
    queryKey: ['/api/dashboard/utilization'],
    refetchInterval: 30000,
  });

  const handleGenerateReport = () => {
    // TODO: Implement report generation
    console.log('Generate report clicked');
  };

  const handleExportData = () => {
    // TODO: Implement data export
    console.log('Export data clicked');
  };

  const handleConfigureAlerts = () => {
    // TODO: Implement alert configuration
    console.log('Configure alerts clicked');
  };

  return (
    <div className="space-y-6">
      {/* Quick Actions Card */}
      <Card className="card-shadow">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Button
              variant="ghost"
              className="w-full justify-between p-3 bg-gaming-blue/10 text-gaming-blue hover:bg-gaming-blue/20 h-auto"
              onClick={handleGenerateReport}
            >
              <div className="flex items-center">
                <TrendingUp className="w-4 h-4 mr-3" />
                <span className="font-medium">Generate Report</span>
              </div>
              <ChevronRight className="w-4 h-4" />
            </Button>
            
            <Button
              variant="ghost"
              className="w-full justify-between p-3 bg-gaming-green/10 text-gaming-green hover:bg-gaming-green/20 h-auto"
              onClick={handleExportData}
            >
              <div className="flex items-center">
                <Download className="w-4 h-4 mr-3" />
                <span className="font-medium">Export Data</span>
              </div>
              <ChevronRight className="w-4 h-4" />
            </Button>
            
            <Button
              variant="ghost"
              className="w-full justify-between p-3 bg-gaming-orange/10 text-gaming-orange hover:bg-gaming-orange/20 h-auto"
              onClick={handleConfigureAlerts}
            >
              <div className="flex items-center">
                <Bell className="w-4 h-4 mr-3" />
                <span className="font-medium">Alert Settings</span>
              </div>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Station Status Summary */}
      <Card className="card-shadow">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Station Status</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">PC Gaming</span>
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-900">
                    {utilization?.pcOccupied || 0}
                  </span>
                  <span className="text-sm text-gray-500 mx-1">/</span>
                  <span className="text-sm text-gray-500">
                    {utilization?.pcTotal || 0}
                  </span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gaming-blue h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${utilization?.pcTotal ? (utilization.pcOccupied / utilization.pcTotal) * 100 : 0}%`
                  }}
                />
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Console Gaming</span>
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-900">
                    {utilization?.consoleOccupied || 0}
                  </span>
                  <span className="text-sm text-gray-500 mx-1">/</span>
                  <span className="text-sm text-gray-500">
                    {utilization?.consoleTotal || 0}
                  </span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gaming-purple h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${utilization?.consoleTotal ? (utilization.consoleOccupied / utilization.consoleTotal) * 100 : 0}%`
                  }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
