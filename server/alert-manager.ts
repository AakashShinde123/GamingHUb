import { storage } from "./storage";

export class AlertManager {
  private checkInterval: NodeJS.Timeout | null = null;

  async initialize() {
    // Check alerts every 30 minutes
    this.checkInterval = setInterval(() => {
      this.checkAndCreateAlerts();
    }, 30 * 60 * 1000);

    // Run initial check
    await this.checkAndCreateAlerts();
    console.log('Alert Manager initialized - monitoring revenue targets and system status');
  }

  async checkAndCreateAlerts() {
    try {
      await this.checkRevenueTargets();
      await this.checkOccupancyLevels();
      await this.checkLongRunningSessions();
    } catch (error) {
      console.error('Error in alert check:', error);
    }
  }

  private async checkRevenueTargets() {
    const targets = await storage.getAllRevenueTargets();
    const now = new Date();
    const currentHour = now.getHours();

    for (const target of targets) {
      const currentAmount = parseFloat(target.currentAmount || "0");
      const targetAmount = parseFloat(target.targetAmount);
      const percentage = (currentAmount / targetAmount) * 100;

      // Check if we've already created an alert for this target today
      const existingAlerts = await storage.getAllAlerts();
      const todayAlerts = existingAlerts.filter(alert => {
        const alertDate = new Date(alert.createdAt!);
        const today = new Date();
        return alertDate.toDateString() === today.toDateString() && 
               alert.type === 'revenue_target' && 
               alert.message.includes(target.type);
      });

      if (todayAlerts.length > 0) continue; // Don't spam alerts

      let shouldAlert = false;
      let severity: 'info' | 'warning' | 'error' = 'info';
      let message = '';

      if (target.type === 'daily') {
        // Alert if it's after 6 PM and we're under 70% of target
        if (currentHour >= 18 && percentage < 70) {
          shouldAlert = true;
          severity = percentage < 30 ? 'error' : 'warning';
          message = `Daily revenue target critical - only ₹${currentAmount.toLocaleString()} of ₹${targetAmount.toLocaleString()} achieved (${Math.round(percentage)}%)`;
        }
        // Alert if it's after 3 PM and we're under 40% of target
        else if (currentHour >= 15 && percentage < 40) {
          shouldAlert = true;
          severity = 'warning';
          message = `Daily revenue target at risk - only ₹${currentAmount.toLocaleString()} of ₹${targetAmount.toLocaleString()} achieved (${Math.round(percentage)}%)`;
        }
      } else if (target.type === 'weekly') {
        const dayOfWeek = now.getDay(); // 0 = Sunday
        const daysIntoWeek = dayOfWeek === 0 ? 7 : dayOfWeek;
        const expectedPercentage = (daysIntoWeek / 7) * 100;
        
        if (percentage < expectedPercentage - 20) {
          shouldAlert = true;
          severity = percentage < expectedPercentage - 40 ? 'error' : 'warning';
          message = `Weekly revenue target behind schedule - ₹${currentAmount.toLocaleString()} of ₹${targetAmount.toLocaleString()} (${Math.round(percentage)}% vs expected ${Math.round(expectedPercentage)}%)`;
        }
      } else if (target.type === 'monthly') {
        const dayOfMonth = now.getDate();
        const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
        const expectedPercentage = (dayOfMonth / daysInMonth) * 100;
        
        if (percentage < expectedPercentage - 15) {
          shouldAlert = true;
          severity = percentage < expectedPercentage - 30 ? 'error' : 'warning';
          message = `Monthly revenue target behind schedule - ₹${currentAmount.toLocaleString()} of ₹${targetAmount.toLocaleString()} (${Math.round(percentage)}% vs expected ${Math.round(expectedPercentage)}%)`;
        }
      }

      if (shouldAlert) {
        await storage.createAlert({
          type: 'revenue_target',
          message,
          severity
        });
        console.log(`Revenue alert created: ${message}`);
      }
    }
  }

  private async checkOccupancyLevels() {
    const utilization = await storage.getStationUtilization();
    const occupancyRate = (utilization.occupied / (utilization.occupied + utilization.available)) * 100;
    const currentHour = new Date().getHours();

    // Check if it's peak hours (5 PM to 10 PM) and occupancy is low
    if (currentHour >= 17 && currentHour <= 22 && occupancyRate < 20) {
      // Check if we already alerted about low occupancy in the last 2 hours
      const existingAlerts = await storage.getAllAlerts();
      const recentOccupancyAlerts = existingAlerts.filter(alert => {
        const alertTime = new Date(alert.createdAt!);
        const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
        return alertTime > twoHoursAgo && alert.type === 'low_occupancy';
      });

      if (recentOccupancyAlerts.length === 0) {
        await storage.createAlert({
          type: 'low_occupancy',
          message: `Low occupancy during peak hours - only ${utilization.occupied} of ${utilization.occupied + utilization.available} stations occupied (${Math.round(occupancyRate)}%)`,
          severity: occupancyRate < 10 ? 'error' : 'warning'
        });
        console.log(`Occupancy alert created: ${occupancyRate}% occupancy during peak hours`);
      }
    }
  }

  private async checkLongRunningSessions() {
    const activeSessions = await storage.getActiveSessions();
    const fourHoursAgo = new Date(Date.now() - 4 * 60 * 60 * 1000);

    for (const session of activeSessions) {
      if (session.startTime && new Date(session.startTime) < fourHoursAgo) {
        // Check if we already alerted about this session
        const existingAlerts = await storage.getAllAlerts();
        const sessionAlerts = existingAlerts.filter(alert => 
          alert.type === 'long_session' && alert.message.includes(session.id)
        );

        if (sessionAlerts.length === 0) {
          const durationHours = Math.round((Date.now() - new Date(session.startTime).getTime()) / (1000 * 60 * 60));
          await storage.createAlert({
            type: 'long_session',
            message: `Customer has been playing for ${durationHours} hours on ${session.stationName || session.stationId} - consider checking in`,
            severity: durationHours > 6 ? 'warning' : 'info'
          });
          console.log(`Long session alert created: ${durationHours} hours for session ${session.id}`);
        }
      }
    }
  }

  destroy() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
      console.log('Alert Manager destroyed');
    }
  }
}

export const alertManager = new AlertManager();