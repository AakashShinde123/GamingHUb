import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Settings, Edit2, Monitor, Gamepad2, Headphones, Joystick, Save, X } from "lucide-react";
import type { SystemSettings } from "@shared/schema";

export function PlayHubInfo() {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [formData, setFormData] = useState({
    centerName: "",
    systemVersion: "",
    totalStations: "",
    pcStations: "",
    consoleStations: "",
    vrStations: "",
    arcadeStations: ""
  });
  const { toast } = useToast();

  const { data: settings, isLoading } = useQuery<SystemSettings>({
    queryKey: ['/api/settings'],
    refetchInterval: 30000,
  });

  const updateSettingsMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest('PATCH', '/api/settings', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/settings'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/utilization'] });
      setShowEditDialog(false);
      toast({
        title: "Success!",
        description: "PlayHub settings have been updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update PlayHub settings",
        variant: "destructive",
      });
    }
  });

  const openEditDialog = () => {
    if (settings) {
      setFormData({
        centerName: settings.centerName,
        systemVersion: settings.systemVersion,
        totalStations: settings.totalStations?.toString() || "0",
        pcStations: settings.pcStations?.toString() || "0",
        consoleStations: settings.consoleStations?.toString() || "0",
        vrStations: settings.vrStations?.toString() || "0",
        arcadeStations: settings.arcadeStations?.toString() || "0"
      });
    }
    setShowEditDialog(true);
  };

  const closeEditDialog = () => {
    setShowEditDialog(false);
    setFormData({
      centerName: "",
      systemVersion: "",
      totalStations: "",
      pcStations: "",
      consoleStations: "",
      vrStations: "",
      arcadeStations: ""
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const data = {
      centerName: formData.centerName.trim(),
      systemVersion: formData.systemVersion.trim(),
      totalStations: parseInt(formData.totalStations) || 0,
      pcStations: parseInt(formData.pcStations) || 0,
      consoleStations: parseInt(formData.consoleStations) || 0,
      vrStations: parseInt(formData.vrStations) || 0,
      arcadeStations: parseInt(formData.arcadeStations) || 0,
    };

    updateSettingsMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <Card className="border-l-4 border-blue-500 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-500" />
            PlayHub Info
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="border-l-4 border-blue-500 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-blue-500" />
              {settings?.centerName || "PlayHub"} Info
            </CardTitle>
            <Button
              onClick={openEditDialog}
              size="sm"
              variant="outline"
              className="hover:bg-blue-50 hover:border-blue-300"
              data-testid="button-edit-settings"
            >
              <Edit2 className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Station Breakdown */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                <Monitor className="w-4 h-4 text-blue-600" />
                Gaming Stations
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Monitor className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium">Total Gaming Stations</span>
                  </div>
                  <span className="font-bold text-purple-600">{settings?.totalStations || 0}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Gamepad2 className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium">PC Gaming Stations</span>
                  </div>
                  <span className="font-bold text-blue-600">{settings?.pcStations || 0}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Joystick className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium">Console Gaming Stations</span>
                  </div>
                  <span className="font-bold text-green-600">{settings?.consoleStations || 0}</span>
                </div>

                {(settings?.vrStations || 0) > 0 && (
                  <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Headphones className="w-4 h-4 text-orange-600" />
                      <span className="text-sm font-medium">VR Gaming Stations</span>
                    </div>
                    <span className="font-bold text-orange-600">{settings?.vrStations || 0}</span>
                  </div>
                )}

                {(settings?.arcadeStations || 0) > 0 && (
                  <div className="flex items-center justify-between p-3 bg-pink-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Joystick className="w-4 h-4 text-pink-600" />
                      <span className="text-sm font-medium">Arcade Stations</span>
                    </div>
                    <span className="font-bold text-pink-600">{settings?.arcadeStations || 0}</span>
                  </div>
                )}
              </div>
            </div>

            {/* System Info */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                <Settings className="w-4 h-4 text-blue-600" />
                System Information
              </h4>
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Center Name</span>
                  <p className="font-medium text-gray-900">{settings?.centerName || "PlayHub"}</p>
                </div>
                
                <div className="p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">System Version</span>
                  <p className="font-medium text-gray-900">{settings?.systemVersion || "1.0.0"}</p>
                </div>
                
                <div className="p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Last Updated</span>
                  <p className="font-medium text-gray-900">
                    {settings?.updatedAt 
                      ? new Date(settings.updatedAt).toLocaleDateString() 
                      : "Never"
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={closeEditDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit PlayHub Settings</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="center-name">Center Name</Label>
                <Input
                  id="center-name"
                  value={formData.centerName}
                  onChange={(e) => setFormData(prev => ({ ...prev, centerName: e.target.value }))}
                  placeholder="e.g., PlayHub"
                  required
                  data-testid="input-center-name"
                />
              </div>
              
              <div className="col-span-2">
                <Label htmlFor="system-version">System Version</Label>
                <Input
                  id="system-version"
                  value={formData.systemVersion}
                  onChange={(e) => setFormData(prev => ({ ...prev, systemVersion: e.target.value }))}
                  placeholder="e.g., 1.0.0"
                  required
                  data-testid="input-system-version"
                />
              </div>

              <div>
                <Label htmlFor="total-stations">Total Stations</Label>
                <Input
                  id="total-stations"
                  type="number"
                  min="0"
                  value={formData.totalStations}
                  onChange={(e) => setFormData(prev => ({ ...prev, totalStations: e.target.value }))}
                  placeholder="25"
                  data-testid="input-total-stations"
                />
              </div>

              <div>
                <Label htmlFor="pc-stations">PC Stations</Label>
                <Input
                  id="pc-stations"
                  type="number"
                  min="0"
                  value={formData.pcStations}
                  onChange={(e) => setFormData(prev => ({ ...prev, pcStations: e.target.value }))}
                  placeholder="15"
                  data-testid="input-pc-stations"
                />
              </div>

              <div>
                <Label htmlFor="console-stations">Console Stations</Label>
                <Input
                  id="console-stations"
                  type="number"
                  min="0"
                  value={formData.consoleStations}
                  onChange={(e) => setFormData(prev => ({ ...prev, consoleStations: e.target.value }))}
                  placeholder="10"
                  data-testid="input-console-stations"
                />
              </div>

              <div>
                <Label htmlFor="vr-stations">VR Stations</Label>
                <Input
                  id="vr-stations"
                  type="number"
                  min="0"
                  value={formData.vrStations}
                  onChange={(e) => setFormData(prev => ({ ...prev, vrStations: e.target.value }))}
                  placeholder="0"
                  data-testid="input-vr-stations"
                />
              </div>

              <div>
                <Label htmlFor="arcade-stations">Arcade Stations</Label>
                <Input
                  id="arcade-stations"
                  type="number"
                  min="0"
                  value={formData.arcadeStations}
                  onChange={(e) => setFormData(prev => ({ ...prev, arcadeStations: e.target.value }))}
                  placeholder="0"
                  data-testid="input-arcade-stations"
                />
              </div>
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={closeEditDialog}
                className="flex-1"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={updateSettingsMutation.isPending}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                data-testid="button-save-settings"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}