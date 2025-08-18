import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import type { RevenueData } from "@shared/schema";

export function RevenueChart() {
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  const { data: revenueData, isLoading } = useQuery<RevenueData>({
    queryKey: ['/api/dashboard/revenue', timeframe],
    refetchInterval: 60000,
  });

  const chartData = revenueData?.labels.map((label, index) => ({
    name: label,
    revenue: revenueData.data[index] || 0,
  })) || [];

  return (
    <Card className="card-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Revenue Trends</h3>
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant={timeframe === 'daily' ? 'default' : 'outline'}
              onClick={() => setTimeframe('daily')}
              className={timeframe === 'daily' ? 'bg-gaming-purple text-white' : ''}
            >
              Daily
            </Button>
            <Button
              size="sm"
              variant={timeframe === 'weekly' ? 'default' : 'outline'}
              onClick={() => setTimeframe('weekly')}
              className={timeframe === 'weekly' ? 'bg-gaming-purple text-white' : ''}
            >
              Weekly
            </Button>
            <Button
              size="sm"
              variant={timeframe === 'monthly' ? 'default' : 'outline'}
              onClick={() => setTimeframe('monthly')}
              className={timeframe === 'monthly' ? 'bg-gaming-purple text-white' : ''}
            >
              Monthly
            </Button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gaming-purple"></div>
          </div>
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  stroke="#666"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#666"
                  fontSize={12}
                  tickFormatter={(value) => `₹${value.toLocaleString()}`}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="hsl(var(--gaming-purple))"
                  strokeWidth={3}
                  fill="hsl(var(--gaming-purple) / 0.1)"
                  dot={{ fill: "hsl(var(--gaming-purple))", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: "hsl(var(--gaming-purple))" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
