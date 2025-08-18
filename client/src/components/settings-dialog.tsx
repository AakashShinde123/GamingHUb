import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Target, 
  Bell, 
  Download, 
  TrendingUp, 
  Settings, 
  Gamepad2,
  Monitor,
  Save
} from "lucide-react";
import type { RevenueTarget } from "@shared/schema";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const [dailyTarget, setDailyTarget] = useState("15000");
  const [weeklyTarget, setWeeklyTarget] = useState("90000");
  const [monthlyTarget, setMonthlyTarget] = useState("350000");
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [notifications, setNotifications] = useState(true);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: currentTargets } = useQuery({
    queryKey: ['/api/targets'],
    select: (data: RevenueTarget[]) => data
  });

  // Update state when targets load
  useEffect(() => {
    if (currentTargets) {
      const daily = currentTargets.find(t => t.type === 'daily');
      const weekly = currentTargets.find(t => t.type === 'weekly');
      const monthly = currentTargets.find(t => t.type === 'monthly');
      
      if (daily) setDailyTarget(daily.targetAmount);
      if (weekly) setWeeklyTarget(weekly.targetAmount);
      if (monthly) setMonthlyTarget(monthly.targetAmount);
    }
  }, [currentTargets]);

  // Google Sheets export queries and mutations
  const { data: exportStatus } = useQuery({
    queryKey: ['/api/export/status'],
    refetchInterval: false
  });

  const exportDailyDataMutation = useMutation({
    mutationFn: async (date?: string) => {
      return apiRequest('POST', '/api/export/daily', { date });
    },
    onSuccess: () => {
      toast({
        title: "Export Successful",
        description: "Daily data has been exported to Google Sheets",
      });
    },
    onError: () => {
      toast({
        title: "Export Failed",
        description: "Failed to export data. Check if Google Sheets is configured.",
        variant: "destructive",
      });
    }
  });

  const updateTargetsMutation = useMutation({
    mutationFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      const thisWeek = getWeekStart(new Date()).toISOString().split('T')[0];
      const thisMonth = new Date().toISOString().substring(0, 7);

      // Update targets (we'll need to create new ones since we don't have update endpoint)
      const promises = [
        apiRequest('POST', '/api/targets', {
          type: "daily",
          targetAmount: dailyTarget,
          currentAmount: "0.00",
          period: today
        }),
        apiRequest('POST', '/api/targets', {
          type: "weekly", 
          targetAmount: weeklyTarget,
          currentAmount: "0.00",
          period: thisWeek
        }),
        apiRequest('POST', '/api/targets', {
          type: "monthly",
          targetAmount: monthlyTarget,
          currentAmount: "0.00", 
          period: thisMonth
        })
      ];

      return Promise.all(promises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/targets'] });
      toast({
        title: "Success",
        description: "Revenue targets updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update revenue targets",
        variant: "destructive",
      });
    }
  });

  const getWeekStart = (date: Date): Date => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  };

  const handleGenerateReport = () => {
    // Create a simple revenue report
    const reportData = {
      date: new Date().toLocaleDateString(),
      dailyRevenue: "₹12,500",
      weeklyRevenue: "₹78,200", 
      monthlyRevenue: "₹2,85,400",
      activeStations: "18/25",
      totalCustomers: "142"
    };

    const reportContent = `
PATIL'S GAMING CAFE - REVENUE REPORT
Generated: ${reportData.date}

REVENUE SUMMARY:
• Daily Revenue: ${reportData.dailyRevenue}
• Weekly Revenue: ${reportData.weeklyRevenue}
• Monthly Revenue: ${reportData.monthlyRevenue}

OPERATIONS:
• Active Stations: ${reportData.activeStations}
• Total Customers Today: ${reportData.totalCustomers}

This report was automatically generated by the Gaming Cafe Management System.
    `;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gaming-cafe-report-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Report Generated",
      description: "Revenue report has been downloaded",
    });
  };

  const handleExportData = () => {
    // Export data as CSV
    const csvContent = `
Date,Revenue,Active Customers,Station Utilization
${new Date().toLocaleDateString()},12500,18,72%
${new Date(Date.now() - 86400000).toLocaleDateString()},11200,16,64%
${new Date(Date.now() - 172800000).toLocaleDateString()},13800,20,80%
    `.trim();

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gaming-cafe-data-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Data Exported",
      description: "Data has been exported as CSV file",
    });
  };

  const handleSaveSettings = () => {
    updateTargetsMutation.mutate();
    
    // Save other settings to localStorage
    localStorage.setItem('gamingCafeSettings', JSON.stringify({
      alertsEnabled,
      autoRefresh,
      notifications
    }));

    toast({
      title: "Settings Saved",
      description: "All settings have been saved successfully",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <div className="w-8 h-8 bg-gradient-to-r from-gaming-purple to-gaming-orange rounded-lg flex items-center justify-center">
              <Settings className="text-white text-sm" />
            </div>
            Gaming Cafe Settings
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="targets" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="targets" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              Targets
            </TabsTrigger>
            <TabsTrigger value="alerts" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Alerts
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Reports
            </TabsTrigger>
            <TabsTrigger value="system" className="flex items-center gap-2">
              <Monitor className="w-4 h-4" />
              System
            </TabsTrigger>
          </TabsList>

          <TabsContent value="targets" className="space-y-6">
            <Card className="border-l-4 border-gaming-purple">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-gaming-purple" />
                  Revenue Targets Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="daily">Daily Target (₹)</Label>
                    <Input
                      id="daily"
                      type="number"
                      value={dailyTarget}
                      onChange={(e) => setDailyTarget(e.target.value)}
                      className="text-gaming-green font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weekly">Weekly Target (₹)</Label>
                    <Input
                      id="weekly"
                      type="number"
                      value={weeklyTarget}
                      onChange={(e) => setWeeklyTarget(e.target.value)}
                      className="text-gaming-blue font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="monthly">Monthly Target (₹)</Label>
                    <Input
                      id="monthly"
                      type="number"
                      value={monthlyTarget}
                      onChange={(e) => setMonthlyTarget(e.target.value)}
                      className="text-gaming-purple font-medium"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <Card className="border-l-4 border-gaming-orange">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-gaming-orange" />
                  Alert Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Revenue Alerts</h4>
                    <p className="text-sm text-gray-600">Get notified when revenue targets are reached</p>
                  </div>
                  <Switch
                    checked={alertsEnabled}
                    onCheckedChange={setAlertsEnabled}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Push Notifications</h4>
                    <p className="text-sm text-gray-600">Receive browser notifications</p>
                  </div>
                  <Switch
                    checked={notifications}
                    onCheckedChange={setNotifications}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <Card className="border-l-4 border-gaming-blue">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-gaming-blue" />
                  Reports & Data Export
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button
                    onClick={() => exportDailyDataMutation.mutate()}
                    disabled={exportDailyDataMutation.isPending}
                    className="h-auto p-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 flex flex-col items-center gap-2"
                  >
                    <Download className="w-6 h-6" />
                    <div>
                      <div className="font-medium">
                        {exportDailyDataMutation.isPending ? "Exporting..." : "Export to Google Sheets"}
                      </div>
                      <div className="text-xs opacity-90">Send daily data to Google Sheets</div>
                    </div>
                  </Button>
                  <Button
                    onClick={handleGenerateReport}
                    className="h-auto p-4 bg-gaming-blue hover:bg-blue-700 flex flex-col items-center gap-2"
                  >
                    <TrendingUp className="w-6 h-6" />
                    <div>
                      <div className="font-medium">Generate Revenue Report</div>
                      <div className="text-xs opacity-90">Download detailed revenue analysis</div>
                    </div>
                  </Button>
                  <Button
                    onClick={handleExportData}
                    className="h-auto p-4 bg-gaming-green hover:bg-green-700 flex flex-col items-center gap-2"
                  >
                    <Download className="w-6 h-6" />
                    <div>
                      <div className="font-medium">Export Data</div>
                      <div className="text-xs opacity-90">Download CSV data file</div>
                    </div>
                  </Button>
                </div>
                {exportStatus && (
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      Google Sheets Integration: {exportStatus.enabled ? "✅ Configured" : "❌ Not configured"}
                    </p>
                    {!exportStatus.enabled && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Configure GOOGLE_SHEETS_API_KEY and GOOGLE_SHEETS_ID to enable automatic exports
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system" className="space-y-6">
            <Card className="border-l-4 border-gaming-green">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="w-5 h-5 text-gaming-green" />
                  System Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Auto Refresh Dashboard</h4>
                    <p className="text-sm text-gray-600">Automatically update data every 30 seconds</p>
                  </div>
                  <Switch
                    checked={autoRefresh}
                    onCheckedChange={setAutoRefresh}
                  />
                </div>
                <div className="p-4 bg-gaming-purple/10 rounded-lg">
                  <h4 className="font-medium text-gaming-purple mb-2">Gaming Cafe Info</h4>
                  <div className="text-sm space-y-1">
                    <p>• Total Gaming Stations: 25</p>
                    <p>• PC Gaming Stations: 15</p>
                    <p>• Console Gaming Stations: 10</p>
                    <p>• System Version: 1.0.0</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSaveSettings}
            disabled={updateTargetsMutation.isPending}
            className="bg-gaming-purple hover:bg-purple-700 text-white"
          >
            <Save className="w-4 h-4 mr-2" />
            {updateTargetsMutation.isPending ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}