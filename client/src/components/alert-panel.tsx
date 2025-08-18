import { useQuery } from "@tanstack/react-query";
import { AlertTriangle } from "lucide-react";
import type { Alert } from "@shared/schema";

export function AlertPanel() {
  const { data: alerts } = useQuery<Alert[]>({
    queryKey: ['/api/alerts'],
    refetchInterval: 30000,
  });

  const unreadAlerts = alerts?.filter(alert => !alert.isRead) || [];
  
  if (unreadAlerts.length === 0) return null;

  // Show the most recent alert
  const latestAlert = unreadAlerts[0];

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case 'warning':
        return 'bg-gaming-yellow/10 border-gaming-yellow text-gaming-yellow';
      case 'error':
        return 'bg-gaming-red/10 border-gaming-red text-gaming-red';
      default:
        return 'bg-gaming-yellow/10 border-gaming-yellow text-gaming-yellow';
    }
  };

  return (
    <div className={`${getAlertColor(latestAlert.severity)} border-l-4 px-6 py-4 mb-6`}>
      <div className="flex items-center">
        <AlertTriangle className="mr-3 flex-shrink-0" size={20} />
        <div>
          <p className="text-sm font-medium text-gray-900">
            Revenue Alert: {latestAlert.message}
          </p>
          <p className="text-xs text-gray-600 mt-1">
            {new Date(latestAlert.createdAt!).toLocaleTimeString()}
          </p>
        </div>
      </div>
    </div>
  );
}
