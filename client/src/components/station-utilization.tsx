import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import type { StationUtilization } from "@shared/schema";

const COLORS = ['hsl(var(--gaming-green))', '#E0E0E0'];

export function StationUtilization() {
  const { data: utilization, isLoading } = useQuery<StationUtilization>({
    queryKey: ['/api/dashboard/utilization'],
    refetchInterval: 30000,
  });

  const chartData = [
    { name: 'Occupied', value: utilization?.occupied || 0 },
    { name: 'Available', value: utilization?.available || 0 },
  ];

  return (
    <Card className="card-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Station Utilization</h3>
          <span className="text-sm text-gray-600">Real-time</span>
        </div>
        
        {isLoading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gaming-purple"></div>
          </div>
        ) : (
          <>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-gaming-green rounded-full mr-2"></div>
                <span className="text-gray-600">
                  Occupied: <span className="font-medium">{utilization?.occupied || 0}</span>
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-gray-300 rounded-full mr-2"></div>
                <span className="text-gray-600">
                  Available: <span className="font-medium">{utilization?.available || 0}</span>
                </span>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
