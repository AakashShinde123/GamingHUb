import { 
  type Customer, type InsertCustomer,
  type GamingStation, type InsertGamingStation,
  type Session, type InsertSession,
  type RevenueTarget, type InsertRevenueTarget,
  type Alert, type InsertAlert,
  type Activity, type InsertActivity,
  type ActiveSession,
  type DashboardMetrics,
  type RevenueData,
  type StationUtilization
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Customer methods
  getCustomer(id: string): Promise<Customer | undefined>;
  getCustomerByPhone(phone: string): Promise<Customer | undefined>;
  createCustomer(customer: InsertCustomer): Promise<Customer>;
  getAllCustomers(): Promise<Customer[]>;

  // Gaming Station methods
  getGamingStation(id: string): Promise<GamingStation | undefined>;
  getGamingStationByName(name: string): Promise<GamingStation | undefined>;
  createGamingStation(station: InsertGamingStation): Promise<GamingStation>;
  getAllGamingStations(): Promise<GamingStation[]>;

  // Session methods
  getSession(id: string): Promise<Session | undefined>;
  createSession(session: InsertSession): Promise<Session>;
  updateSession(id: string, updates: Partial<Session>): Promise<Session | undefined>;
  getActiveSessions(): Promise<ActiveSession[]>;
  getSessionsByDateRange(startDate: Date, endDate: Date): Promise<Session[]>;
  endSession(id: string): Promise<Session | undefined>;

  // Revenue Target methods
  getRevenueTarget(type: string, period: string): Promise<RevenueTarget | undefined>;
  createRevenueTarget(target: InsertRevenueTarget): Promise<RevenueTarget>;
  updateRevenueTarget(id: string, updates: Partial<RevenueTarget>): Promise<RevenueTarget | undefined>;
  getAllRevenueTargets(): Promise<RevenueTarget[]>;

  // Alert methods
  createAlert(alert: InsertAlert): Promise<Alert>;
  getUnreadAlerts(): Promise<Alert[]>;
  markAlertAsRead(id: string): Promise<Alert | undefined>;
  getAllAlerts(): Promise<Alert[]>;

  // Activity methods
  createActivity(activity: InsertActivity): Promise<Activity>;
  getRecentActivities(limit?: number): Promise<Activity[]>;

  // Dashboard methods
  getDashboardMetrics(): Promise<DashboardMetrics>;
  getRevenueData(period: 'daily' | 'weekly' | 'monthly'): Promise<RevenueData>;
  getStationUtilization(): Promise<StationUtilization>;
}

export class MemStorage implements IStorage {
  private customers: Map<string, Customer> = new Map();
  private gamingStations: Map<string, GamingStation> = new Map();
  private sessions: Map<string, Session> = new Map();
  private revenueTargets: Map<string, RevenueTarget> = new Map();
  private alerts: Map<string, Alert> = new Map();
  private activities: Map<string, Activity> = new Map();

  constructor() {
    this.initializeData();
  }

  private async initializeData() {
    // Initialize gaming stations
    const stations: InsertGamingStation[] = [
      { name: "PC-01", type: "PC", hourlyRate: "100.00", isActive: true },
      { name: "PC-02", type: "PC", hourlyRate: "100.00", isActive: true },
      { name: "PC-03", type: "PC", hourlyRate: "100.00", isActive: true },
      { name: "PC-04", type: "PC", hourlyRate: "100.00", isActive: true },
      { name: "PC-05", type: "PC", hourlyRate: "100.00", isActive: true },
      { name: "PC-06", type: "PC", hourlyRate: "100.00", isActive: true },
      { name: "PC-07", type: "PC", hourlyRate: "100.00", isActive: true },
      { name: "PC-08", type: "PC", hourlyRate: "100.00", isActive: true },
      { name: "PC-09", type: "PC", hourlyRate: "100.00", isActive: true },
      { name: "PC-10", type: "PC", hourlyRate: "100.00", isActive: true },
      { name: "PC-11", type: "PC", hourlyRate: "100.00", isActive: true },
      { name: "PC-12", type: "PC", hourlyRate: "100.00", isActive: true },
      { name: "PC-13", type: "PC", hourlyRate: "100.00", isActive: true },
      { name: "PC-14", type: "PC", hourlyRate: "100.00", isActive: true },
      { name: "PC-15", type: "PC", hourlyRate: "100.00", isActive: true },
      { name: "PS5-01", type: "Console", hourlyRate: "120.00", isActive: true },
      { name: "PS5-02", type: "Console", hourlyRate: "120.00", isActive: true },
      { name: "PS5-03", type: "Console", hourlyRate: "120.00", isActive: true },
      { name: "PS5-04", type: "Console", hourlyRate: "120.00", isActive: true },
      { name: "PS5-05", type: "Console", hourlyRate: "120.00", isActive: true },
      { name: "XBOX-01", type: "Console", hourlyRate: "120.00", isActive: true },
      { name: "XBOX-02", type: "Console", hourlyRate: "120.00", isActive: true },
      { name: "XBOX-03", type: "Console", hourlyRate: "120.00", isActive: true },
      { name: "XBOX-04", type: "Console", hourlyRate: "120.00", isActive: true },
      { name: "XBOX-05", type: "Console", hourlyRate: "120.00", isActive: true },
    ];

    for (const station of stations) {
      await this.createGamingStation(station);
    }

    // Initialize revenue targets
    const today = new Date().toISOString().split('T')[0];
    const thisWeek = this.getWeekStart(new Date()).toISOString().split('T')[0];
    const thisMonth = new Date().toISOString().substring(0, 7);

    await this.createRevenueTarget({
      type: "daily",
      targetAmount: "15000.00",
      currentAmount: "0.00",
      period: today
    });

    await this.createRevenueTarget({
      type: "weekly",
      targetAmount: "90000.00",
      currentAmount: "0.00",
      period: thisWeek
    });

    await this.createRevenueTarget({
      type: "monthly",
      targetAmount: "350000.00",
      currentAmount: "0.00",
      period: thisMonth
    });
  }

  private getWeekStart(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  }

  // Customer methods
  async getCustomer(id: string): Promise<Customer | undefined> {
    return this.customers.get(id);
  }

  async getCustomerByPhone(phone: string): Promise<Customer | undefined> {
    return Array.from(this.customers.values()).find(c => c.phone === phone);
  }

  async createCustomer(insertCustomer: InsertCustomer): Promise<Customer> {
    const id = randomUUID();
    const customer: Customer = {
      ...insertCustomer,
      id,
      createdAt: new Date()
    };
    this.customers.set(id, customer);
    return customer;
  }

  async getAllCustomers(): Promise<Customer[]> {
    return Array.from(this.customers.values());
  }

  // Gaming Station methods
  async getGamingStation(id: string): Promise<GamingStation | undefined> {
    return this.gamingStations.get(id);
  }

  async getGamingStationByName(name: string): Promise<GamingStation | undefined> {
    return Array.from(this.gamingStations.values()).find(s => s.name === name);
  }

  async createGamingStation(insertStation: InsertGamingStation): Promise<GamingStation> {
    const id = randomUUID();
    const station: GamingStation = {
      ...insertStation,
      id
    };
    this.gamingStations.set(id, station);
    return station;
  }

  async getAllGamingStations(): Promise<GamingStation[]> {
    return Array.from(this.gamingStations.values());
  }

  // Session methods
  async getSession(id: string): Promise<Session | undefined> {
    return this.sessions.get(id);
  }

  async createSession(insertSession: InsertSession): Promise<Session> {
    const id = randomUUID();
    const session: Session = {
      ...insertSession,
      id,
      startTime: new Date(),
      totalAmount: null,
      isActive: true
    };
    this.sessions.set(id, session);

    // Create activity
    const customer = await this.getCustomer(insertSession.customerId);
    const station = await this.getGamingStation(insertSession.stationId);
    await this.createActivity({
      type: "check_in",
      description: `${customer?.name} checked in to ${station?.name}`,
      customerId: insertSession.customerId,
      sessionId: id
    });

    return session;
  }

  async updateSession(id: string, updates: Partial<Session>): Promise<Session | undefined> {
    const session = this.sessions.get(id);
    if (!session) return undefined;

    const updatedSession = { ...session, ...updates };
    this.sessions.set(id, updatedSession);
    return updatedSession;
  }

  async getActiveSessions(): Promise<ActiveSession[]> {
    const activeSessions = Array.from(this.sessions.values()).filter(s => s.isActive);
    const result: ActiveSession[] = [];

    for (const session of activeSessions) {
      const customer = await this.getCustomer(session.customerId);
      const station = await this.getGamingStation(session.stationId);
      
      if (customer && station) {
        const duration = Math.floor((new Date().getTime() - session.startTime!.getTime()) / (1000 * 60));
        result.push({
          ...session,
          customer,
          station,
          duration
        });
      }
    }

    return result;
  }

  async getSessionsByDateRange(startDate: Date, endDate: Date): Promise<Session[]> {
    return Array.from(this.sessions.values()).filter(s => {
      const sessionDate = s.startTime;
      return sessionDate && sessionDate >= startDate && sessionDate <= endDate;
    });
  }

  async endSession(id: string): Promise<Session | undefined> {
    const session = this.sessions.get(id);
    if (!session || !session.isActive) return undefined;

    const endTime = new Date();
    const durationHours = (endTime.getTime() - session.startTime!.getTime()) / (1000 * 60 * 60);
    const station = await this.getGamingStation(session.stationId);
    const totalAmount = durationHours * parseFloat(station?.hourlyRate || "0");

    const updatedSession = await this.updateSession(id, {
      endTime,
      totalAmount: totalAmount.toFixed(2),
      isActive: false
    });

    if (updatedSession) {
      // Update revenue targets
      await this.updateRevenueTargets(totalAmount);

      // Create activity
      const customer = await this.getCustomer(session.customerId);
      await this.createActivity({
        type: "check_out",
        description: `${customer?.name} completed session - ₹${totalAmount.toFixed(0)} earned`,
        customerId: session.customerId,
        sessionId: id
      });

      // Check for revenue alerts
      await this.checkRevenueAlerts();
    }

    return updatedSession;
  }

  private async updateRevenueTargets(amount: number) {
    const today = new Date().toISOString().split('T')[0];
    const thisWeek = this.getWeekStart(new Date()).toISOString().split('T')[0];
    const thisMonth = new Date().toISOString().substring(0, 7);

    // Update daily target
    const dailyTarget = await this.getRevenueTarget("daily", today);
    if (dailyTarget) {
      const currentAmount = parseFloat(dailyTarget.currentAmount || "0") + amount;
      await this.updateRevenueTarget(dailyTarget.id, {
        currentAmount: currentAmount.toFixed(2)
      });
    }

    // Update weekly target
    const weeklyTarget = await this.getRevenueTarget("weekly", thisWeek);
    if (weeklyTarget) {
      const currentAmount = parseFloat(weeklyTarget.currentAmount || "0") + amount;
      await this.updateRevenueTarget(weeklyTarget.id, {
        currentAmount: currentAmount.toFixed(2)
      });
    }

    // Update monthly target
    const monthlyTarget = await this.getRevenueTarget("monthly", thisMonth);
    if (monthlyTarget) {
      const currentAmount = parseFloat(monthlyTarget.currentAmount || "0") + amount;
      await this.updateRevenueTarget(monthlyTarget.id, {
        currentAmount: currentAmount.toFixed(2)
      });
    }
  }

  private async checkRevenueAlerts() {
    const targets = await this.getAllRevenueTargets();
    
    for (const target of targets) {
      const currentAmount = parseFloat(target.currentAmount || "0");
      const targetAmount = parseFloat(target.targetAmount);
      const percentage = (currentAmount / targetAmount) * 100;

      if (percentage >= 85 && percentage < 90) {
        await this.createAlert({
          type: "revenue_target",
          message: `${target.type.charAt(0).toUpperCase() + target.type.slice(1)} target ${percentage.toFixed(0)}% achieved`,
          severity: "info"
        });
      } else if (percentage >= 90 && percentage < 100) {
        await this.createAlert({
          type: "revenue_target",
          message: `${target.type.charAt(0).toUpperCase() + target.type.slice(1)} target ${percentage.toFixed(0)}% achieved - Almost there!`,
          severity: "warning"
        });
      } else if (percentage >= 100) {
        await this.createAlert({
          type: "revenue_target",
          message: `🎉 ${target.type.charAt(0).toUpperCase() + target.type.slice(1)} target achieved!`,
          severity: "info"
        });
      }
    }
  }

  // Revenue Target methods
  async getRevenueTarget(type: string, period: string): Promise<RevenueTarget | undefined> {
    return Array.from(this.revenueTargets.values()).find(t => t.type === type && t.period === period);
  }

  async createRevenueTarget(insertTarget: InsertRevenueTarget): Promise<RevenueTarget> {
    const id = randomUUID();
    const target: RevenueTarget = {
      ...insertTarget,
      id,
      createdAt: new Date()
    };
    this.revenueTargets.set(id, target);
    return target;
  }

  async updateRevenueTarget(id: string, updates: Partial<RevenueTarget>): Promise<RevenueTarget | undefined> {
    const target = this.revenueTargets.get(id);
    if (!target) return undefined;

    const updatedTarget = { ...target, ...updates };
    this.revenueTargets.set(id, updatedTarget);
    return updatedTarget;
  }

  async getAllRevenueTargets(): Promise<RevenueTarget[]> {
    return Array.from(this.revenueTargets.values());
  }

  // Alert methods
  async createAlert(insertAlert: InsertAlert): Promise<Alert> {
    const id = randomUUID();
    const alert: Alert = {
      ...insertAlert,
      id,
      createdAt: new Date()
    };
    this.alerts.set(id, alert);
    return alert;
  }

  async getUnreadAlerts(): Promise<Alert[]> {
    return Array.from(this.alerts.values())
      .filter(a => !a.isRead)
      .sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime());
  }

  async markAlertAsRead(id: string): Promise<Alert | undefined> {
    const alert = this.alerts.get(id);
    if (!alert) return undefined;

    const updatedAlert = { ...alert, isRead: true };
    this.alerts.set(id, updatedAlert);
    return updatedAlert;
  }

  async getAllAlerts(): Promise<Alert[]> {
    return Array.from(this.alerts.values())
      .sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime());
  }

  // Activity methods
  async createActivity(insertActivity: InsertActivity): Promise<Activity> {
    const id = randomUUID();
    const activity: Activity = {
      ...insertActivity,
      id,
      createdAt: new Date()
    };
    this.activities.set(id, activity);
    return activity;
  }

  async getRecentActivities(limit: number = 10): Promise<Activity[]> {
    return Array.from(this.activities.values())
      .sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime())
      .slice(0, limit);
  }

  // Dashboard methods
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    const todaySessions = await this.getSessionsByDateRange(startOfDay, endOfDay);
    const completedTodaySessions = todaySessions.filter(s => !s.isActive && s.totalAmount);
    
    const todayRevenue = completedTodaySessions.reduce((sum, s) => sum + parseFloat(s.totalAmount || "0"), 0);
    
    const activeSessions = await this.getActiveSessions();
    const activeCustomers = activeSessions.length;
    const totalCustomersToday = todaySessions.length;

    const allStations = await this.getAllGamingStations();
    const totalStations = allStations.length;
    const occupiedStations = activeSessions.length;
    const occupancyRate = totalStations > 0 ? (occupiedStations / totalStations) * 100 : 0;

    // Calculate average session time for completed sessions today
    const avgSessionTime = completedTodaySessions.length > 0 
      ? completedTodaySessions.reduce((sum, s) => {
          const duration = (s.endTime!.getTime() - s.startTime!.getTime()) / (1000 * 60);
          return sum + duration;
        }, 0) / completedTodaySessions.length
      : 0;

    return {
      todayRevenue: Math.round(todayRevenue),
      revenueGrowth: 15.3, // Mock growth percentage
      activeCustomers,
      totalCustomersToday,
      occupiedStations,
      totalStations,
      occupancyRate: Math.round(occupancyRate),
      avgSessionTime: Math.round(avgSessionTime),
      sessionGrowth: 8 // Mock session growth percentage
    };
  }

  async getRevenueData(period: 'daily' | 'weekly' | 'monthly'): Promise<RevenueData> {
    if (period === 'daily') {
      // Last 7 days
      const labels = [];
      const data = [];
      
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
        
        const sessions = await this.getSessionsByDateRange(startOfDay, endOfDay);
        const revenue = sessions
          .filter(s => s.totalAmount)
          .reduce((sum, s) => sum + parseFloat(s.totalAmount || "0"), 0);
        
        labels.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
        data.push(Math.round(revenue));
      }
      
      return { labels, data };
    }
    
    // Mock data for weekly/monthly
    return {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      data: [45000, 52000, 48000, 61000]
    };
  }

  async getStationUtilization(): Promise<StationUtilization> {
    const allStations = await this.getAllGamingStations();
    const activeSessions = await this.getActiveSessions();
    
    const pcStations = allStations.filter(s => s.type === 'PC');
    const consoleStations = allStations.filter(s => s.type === 'Console');
    
    const occupiedPCs = activeSessions.filter(s => s.station.type === 'PC').length;
    const occupiedConsoles = activeSessions.filter(s => s.station.type === 'Console').length;
    
    return {
      occupied: activeSessions.length,
      available: allStations.length - activeSessions.length,
      pcOccupied: occupiedPCs,
      pcTotal: pcStations.length,
      consoleOccupied: occupiedConsoles,
      consoleTotal: consoleStations.length
    };
  }
}

export const storage = new MemStorage();
