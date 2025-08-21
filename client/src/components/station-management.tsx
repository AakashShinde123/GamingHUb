import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Plus, Monitor, Edit2, Trash2, Gamepad2 } from "lucide-react";
import type { GamingStation } from "@shared/schema";

export function StationManagement() {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingStation, setEditingStation] = useState<GamingStation | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    type: "PC Gaming",
    hourlyRate: "",
    isActive: true
  });
  const { toast } = useToast();

  const { data: stations, isLoading } = useQuery<GamingStation[]>({
    queryKey: ['/api/stations'],
    refetchInterval: 30000,
  });

  const createStationMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest('POST', '/api/stations', data);
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['/api/stations'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/utilization'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/metrics'] });
      const stationName = formData.name;
      setShowAddDialog(false);
      setFormData({ name: "", type: "PC Gaming", hourlyRate: "", isActive: true });
      toast({
        title: "Success!",
        description: `Gaming station "${stationName}" has been created successfully`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create gaming station. Please check all fields.",
        variant: "destructive",
      });
    }
  });

  const updateStationMutation = useMutation({
    mutationFn: async ({ id, ...data }: any) => {
      return apiRequest('PATCH', `/api/stations/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/stations'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/utilization'] });
      setEditingStation(null);
      setFormData({ name: "", type: "PC Gaming", hourlyRate: "", isActive: true });
      toast({
        title: "Station Updated",
        description: "Gaming station has been updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update gaming station",
        variant: "destructive",
      });
    }
  });

  const deleteStationMutation = useMutation({
    mutationFn: async (stationId: string) => {
      return apiRequest('DELETE', `/api/stations/${stationId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/stations'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/utilization'] });
      toast({
        title: "Station Deleted",
        description: "Gaming station has been removed successfully",
      });
    },
    onError: () => {
      toast({
        title: "Delete Failed",
        description: "Failed to delete gaming station. It may have active sessions.",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Station name is required",
        variant: "destructive",
      });
      return;
    }
    
    if (!formData.hourlyRate || parseFloat(formData.hourlyRate) <= 0) {
      toast({
        title: "Error", 
        description: "Valid hourly rate is required",
        variant: "destructive",
      });
      return;
    }

    const data = {
      name: formData.name.trim(),
      type: formData.type,
      hourlyRate: parseFloat(formData.hourlyRate),
      isActive: formData.isActive
    };


    if (editingStation) {
      updateStationMutation.mutate({ id: editingStation.id, ...data });
    } else {
      createStationMutation.mutate(data);
    }
  };

  const openEditDialog = (station: GamingStation) => {
    setEditingStation(station);
    setFormData({
      name: station.name,
      type: station.type,
      hourlyRate: station.hourlyRate.toString(),
      isActive: Boolean(station.isActive)
    });
    setShowAddDialog(true);
  };

  const closeDialog = () => {
    setShowAddDialog(false);
    setEditingStation(null);
    setFormData({ name: "", type: "PC Gaming", hourlyRate: "", isActive: true });
  };

  return (
    <>
      <Card className="border-l-4 border-purple-500 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Monitor className="w-5 h-5 text-purple-500" />
              Gaming Stations
            </CardTitle>
            <Button
              onClick={() => setShowAddDialog(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-4 py-2 shadow-lg"
              data-testid="button-add-station"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Station
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-32 bg-gray-200 rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : stations?.length === 0 ? (
            <div className="text-center py-8">
              <Gamepad2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No gaming stations found</p>
              <p className="text-sm text-gray-400 mt-1">Click "Add Station" to create your first station</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stations?.map((station) => (
                <div
                  key={station.id}
                  className="p-4 border border-gray-200 rounded-lg bg-white hover:shadow-md transition-all duration-200 group"
                  data-testid={`station-card-${station.id}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${station.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <h4 className="font-semibold text-gray-900">{station.name}</h4>
                    </div>
                    <div className="flex gap-1 opacity-75 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openEditDialog(station)}
                        className="h-8 w-8 p-0 hover:bg-blue-50 hover:border-blue-300"
                        data-testid={`button-edit-station-${station.id}`}
                      >
                        <Edit2 className="h-3 w-3 text-blue-600" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteStationMutation.mutate(station.id)}
                        disabled={deleteStationMutation.isPending}
                        className="h-8 w-8 p-0 hover:bg-red-50 hover:border-red-300"
                        data-testid={`button-delete-station-${station.id}`}
                      >
                        <Trash2 className="h-3 w-3 text-red-600" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <span className="font-medium text-gray-900">{station.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Rate:</span>
                      <span className="font-medium text-green-600">₹{station.hourlyRate}/hr</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className={`font-medium ${station.isActive ? 'text-green-600' : 'text-red-600'}`}>
                        {station.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Station Dialog */}
      <Dialog open={showAddDialog} onOpenChange={closeDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingStation ? 'Edit Gaming Station' : 'Add New Gaming Station'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="station-name">Station Name</Label>
              <Input
                id="station-name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., PC Station 1"
                required
                data-testid="input-station-name"
              />
            </div>
            
            <div>
              <Label htmlFor="station-type">Station Type</Label>
              <Select 
                value={formData.type} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger data-testid="select-station-type">
                  <SelectValue placeholder="Select station type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PC Gaming">PC Gaming</SelectItem>
                  <SelectItem value="Console Gaming">Console Gaming</SelectItem>
                  <SelectItem value="VR Gaming">VR Gaming</SelectItem>
                  <SelectItem value="Arcade">Arcade</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="hourly-rate">Hourly Rate (₹)</Label>
              <Input
                id="hourly-rate"
                type="number"
                step="0.01"
                value={formData.hourlyRate}
                onChange={(e) => setFormData(prev => ({ ...prev, hourlyRate: e.target.value }))}
                placeholder="e.g., 100"
                required
                data-testid="input-hourly-rate"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="is-active"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: !!checked }))}
                data-testid="switch-is-active"
              />
              <Label htmlFor="is-active">Station is active</Label>
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={closeDialog}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createStationMutation.isPending || updateStationMutation.isPending}
                className="flex-1 bg-purple-600 hover:bg-purple-700"
                data-testid="button-save-station"
              >
                {editingStation ? 'Update Station' : 'Create Station'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}