import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Customer, GamingStation, ActiveSession } from "@shared/schema";

interface CheckInDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CheckInDialog({ open, onOpenChange }: CheckInDialogProps) {
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [selectedStation, setSelectedStation] = useState("");
  const [isNewCustomer, setIsNewCustomer] = useState(true);
  const [existingCustomer, setExistingCustomer] = useState<Customer | null>(null);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: stations } = useQuery<GamingStation[]>({
    queryKey: ['/api/stations']
  });

  const { data: activeSessions } = useQuery<ActiveSession[]>({
    queryKey: ['/api/sessions/active']
  });

  const occupiedStationIds = activeSessions?.map(session => session.stationId) || [];
  const availableStations = stations?.filter(station => 
    station.isActive && !occupiedStationIds.includes(station.id)
  ) || [];

  const searchCustomerMutation = useMutation({
    mutationFn: (phone: string) =>
      apiRequest('GET', `/api/customers/phone/${phone}`).then(res => res.json()),
    onSuccess: (customer: Customer) => {
      setExistingCustomer(customer);
      setCustomerName(customer.name);
      setIsNewCustomer(false);
    },
    onError: () => {
      setExistingCustomer(null);
      setIsNewCustomer(true);
    }
  });

  const createCustomerMutation = useMutation({
    mutationFn: (data: { name: string; phone?: string }) =>
      apiRequest('POST', '/api/customers', data).then(res => res.json()),
  });

  const createSessionMutation = useMutation({
    mutationFn: (data: { customerId: string; stationId: string }) =>
      apiRequest('POST', '/api/sessions', data).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/sessions/active'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/metrics'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/utilization'] });
      queryClient.invalidateQueries({ queryKey: ['/api/activities'] });
      toast({
        title: "Success",
        description: "Customer checked in successfully",
      });
      handleClose();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to check in customer",
        variant: "destructive",
      });
    }
  });

  const handlePhoneChange = (phone: string) => {
    setCustomerPhone(phone);
    if (phone.length >= 10) {
      searchCustomerMutation.mutate(phone);
    } else {
      setExistingCustomer(null);
      setIsNewCustomer(true);
      setCustomerName("");
    }
  };

  const handleSubmit = async () => {
    if (!customerName || !selectedStation) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      let customerId: string;

      if (existingCustomer) {
        customerId = existingCustomer.id;
      } else {
        const customer = await createCustomerMutation.mutateAsync({
          name: customerName,
          phone: customerPhone || undefined,
        });
        customerId = customer.id;
      }

      await createSessionMutation.mutateAsync({
        customerId,
        stationId: selectedStation,
      });
    } catch (error) {
      console.error('Check-in error:', error);
    }
  };

  const handleClose = () => {
    setCustomerName("");
    setCustomerPhone("");
    setSelectedStation("");
    setExistingCustomer(null);
    setIsNewCustomer(true);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New Customer Check-in</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number (Optional)</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="Enter phone number"
              value={customerPhone}
              onChange={(e) => handlePhoneChange(e.target.value)}
            />
            {searchCustomerMutation.isPending && (
              <p className="text-sm text-gray-500">Searching for customer...</p>
            )}
            {existingCustomer && (
              <p className="text-sm text-gaming-green">✓ Found existing customer: {existingCustomer.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Customer Name *</Label>
            <Input
              id="name"
              placeholder="Enter customer name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              disabled={!!existingCustomer}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="station">Gaming Station *</Label>
            <Select value={selectedStation} onValueChange={setSelectedStation}>
              <SelectTrigger>
                <SelectValue placeholder="Select a gaming station" />
              </SelectTrigger>
              <SelectContent>
                {availableStations.map((station) => (
                  <SelectItem key={station.id} value={station.id}>
                    {station.name} - {station.type} (₹{station.hourlyRate}/hr)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {availableStations.length === 0 && (
              <p className="text-sm text-gaming-red">No stations available</p>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              createSessionMutation.isPending ||
              createCustomerMutation.isPending ||
              !customerName ||
              !selectedStation ||
              availableStations.length === 0
            }
            className="bg-gaming-blue hover:bg-blue-700"
          >
            {(createSessionMutation.isPending || createCustomerMutation.isPending) ? (
              "Checking in..."
            ) : (
              "Check In"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
