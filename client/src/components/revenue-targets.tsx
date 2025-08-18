import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SettingsDialog } from "@/components/settings-dialog";
import { Target } from "lucide-react";
import type { RevenueTarget } from "@shared/schema";

export function RevenueTargets() {
  const [showSettings, setShowSettings] = useState(false);
  const { data: targets, isLoading } = useQuery<RevenueTarget[]>({
    queryKey: ['/api/targets'],
    refetchInterval: 30000,
  });

  const getTargetByType = (type: string) => {
    return targets?.find(target => target.type === type);
  };

  const getPercentage = (current: string, target: string) => {
    const currentAmount = parseFloat(current);
    const targetAmount = parseFloat(target);
    return targetAmount > 0 ? Math.round((currentAmount / targetAmount) * 100) : 0;
  };

  const getGradientColor = (type: string) => {
    switch (type) {
      case 'daily':
        return 'from-gaming-green to-gaming-blue';
      case 'weekly':
        return 'from-gaming-blue to-gaming-purple';
      case 'monthly':
        return 'from-gaming-purple to-gaming-orange';
      default:
        return 'from-gaming-blue to-gaming-purple';
    }
  };

  const formatCurrency = (amount: string) => {
    return `₹${parseFloat(amount).toLocaleString()}`;
  };

  const dailyTarget = getTargetByType('daily');
  const weeklyTarget = getTargetByType('weekly');
  const monthlyTarget = getTargetByType('monthly');

  return (
    <>
      <Card className="card-shadow border-l-4 border-gaming-purple gaming-shadow">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <div className="w-6 h-6 bg-gradient-to-r from-gaming-purple to-gaming-orange rounded mr-2"></div>
            Revenue Targets
          </h3>
        
        {isLoading ? (
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded-full mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Daily Target */}
            {dailyTarget && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Daily Target</span>
                  <span className="text-sm text-gray-600">
                    <span className="font-medium text-gaming-green">
                      {formatCurrency(dailyTarget.currentAmount || "0")}
                    </span>{' '}
                    / {formatCurrency(dailyTarget.targetAmount)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-1">
                  <div
                    className={`bg-gradient-to-r ${getGradientColor('daily')} h-3 rounded-full transition-all duration-300`}
                    style={{
                      width: `${Math.min(getPercentage(dailyTarget.currentAmount || "0", dailyTarget.targetAmount), 100)}%`
                    }}
                  />
                </div>
                <p className="text-xs text-gray-500">
                  {getPercentage(dailyTarget.currentAmount || "0", dailyTarget.targetAmount)}% achieved
                </p>
              </div>
            )}

            {/* Weekly Target */}
            {weeklyTarget && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Weekly Target</span>
                  <span className="text-sm text-gray-600">
                    <span className="font-medium text-gaming-blue">
                      {formatCurrency(weeklyTarget.currentAmount || "0")}
                    </span>{' '}
                    / {formatCurrency(weeklyTarget.targetAmount)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-1">
                  <div
                    className={`bg-gradient-to-r ${getGradientColor('weekly')} h-3 rounded-full transition-all duration-300`}
                    style={{
                      width: `${Math.min(getPercentage(weeklyTarget.currentAmount || "0", weeklyTarget.targetAmount), 100)}%`
                    }}
                  />
                </div>
                <p className="text-xs text-gray-500">
                  {getPercentage(weeklyTarget.currentAmount || "0", weeklyTarget.targetAmount)}% achieved
                </p>
              </div>
            )}

            {/* Monthly Target */}
            {monthlyTarget && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Monthly Target</span>
                  <span className="text-sm text-gray-600">
                    <span className="font-medium text-gaming-purple">
                      {formatCurrency(monthlyTarget.currentAmount || "0")}
                    </span>{' '}
                    / {formatCurrency(monthlyTarget.targetAmount)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-1">
                  <div
                    className={`bg-gradient-to-r ${getGradientColor('monthly')} h-3 rounded-full transition-all duration-300`}
                    style={{
                      width: `${Math.min(getPercentage(monthlyTarget.currentAmount || "0", monthlyTarget.targetAmount), 100)}%`
                    }}
                  />
                </div>
                <p className="text-xs text-gray-500">
                  {getPercentage(monthlyTarget.currentAmount || "0", monthlyTarget.targetAmount)}% achieved
                </p>
              </div>
            )}
          </div>
        )}

        <Button
          onClick={() => setShowSettings(true)}
          className="w-full mt-4 bg-gaming-purple hover:bg-purple-700 text-white transition-all duration-200 hover:scale-[1.02]"
        >
          <Target className="w-4 h-4 mr-2" />
          Configure Targets
        </Button>
        </CardContent>
      </Card>

      <SettingsDialog open={showSettings} onOpenChange={setShowSettings} />
    </>
  );
}
