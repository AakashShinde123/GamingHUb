import { storage } from "./storage";

interface GoogleSheetsConfig {
  apiKey?: string;
  sheetId?: string;
  enabled: boolean;
}

export class GoogleSheetsService {
  private config: GoogleSheetsConfig;

  constructor() {
    this.config = {
      apiKey: process.env.GOOGLE_SHEETS_API_KEY,
      sheetId: process.env.GOOGLE_SHEETS_ID,
      enabled: !!(process.env.GOOGLE_SHEETS_API_KEY && process.env.GOOGLE_SHEETS_ID)
    };
  }

  async exportDailyData(date: Date = new Date()): Promise<boolean> {
    if (!this.config.enabled) {
      console.log('Google Sheets integration not configured. Skipping export.');
      return false;
    }

    try {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1);

      // Get session data for the day
      const sessions = await storage.getSessionsByDateRange(startDate, endDate);
      
      // Get dashboard metrics
      const metrics = await storage.getDashboardMetrics();
      
      // Get revenue targets
      const targets = await storage.getAllRevenueTargets();
      
      // Format data for Google Sheets
      const exportData = {
        date: startDate.toISOString().split('T')[0],
        metrics,
        sessions: sessions.map(session => ({
          id: session.id,
          customerId: session.customerId,
          stationId: session.stationId,
          startTime: session.startTime,
          endTime: session.endTime,
          totalAmount: session.totalAmount,
          isActive: session.isActive
        })),
        targets,
        exportedAt: new Date().toISOString()
      };

      // In a real implementation, this would send data to Google Sheets API
      console.log('Daily data export prepared for Google Sheets:', {
        date: exportData.date,
        sessionsCount: exportData.sessions.length,
        totalRevenue: exportData.metrics.todayRevenue
      });

      // For now, we'll just log the export. In production, you would:
      // 1. Authenticate with Google Sheets API using service account credentials
      // 2. Append or update the sheet with the daily data
      // 3. Format the data in a user-friendly way

      return true;
    } catch (error) {
      console.error('Error exporting daily data to Google Sheets:', error);
      return false;
    }
  }

  async scheduleAutomaticExport(): Promise<void> {
    if (!this.config.enabled) {
      console.log('Google Sheets integration not configured. Automatic export disabled.');
      return;
    }

    // Schedule daily export at midnight
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const msUntilMidnight = tomorrow.getTime() - now.getTime();
    
    setTimeout(() => {
      this.exportDailyData();
      // Set up recurring daily export
      setInterval(() => {
        this.exportDailyData();
      }, 24 * 60 * 60 * 1000); // 24 hours
    }, msUntilMidnight);

    console.log(`Automatic Google Sheets export scheduled for ${tomorrow.toLocaleString()}`);
  }

  isConfigured(): boolean {
    return this.config.enabled;
  }

  getConfigStatus(): GoogleSheetsConfig {
    return {
      ...this.config,
      apiKey: this.config.apiKey ? '***configured***' : undefined
    };
  }
}

export const googleSheetsService = new GoogleSheetsService();