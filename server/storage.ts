import { 
  type Customer, type InsertCustomer,
  type GamingStation, type InsertGamingStation,
  type Session, type InsertSession,
  type RevenueTarget, type InsertRevenueTarget,
  type Alert, type InsertAlert,
  type Activity, type InsertActivity,
  type SystemSettings, type InsertSystemSettings,
  type ActiveSession,
  type DashboardMetrics,
  type RevenueData,
  type StationUtilization,
  customers, gamingStations, sessions, revenueTargets, alerts, activities, systemSettings
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, gte, lte, sql } from "drizzle-orm";
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
  deleteGamingStation(id: string): Promise<boolean>;

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

  // System Settings methods
  getSystemSettings(): Promise<SystemSettings | undefined>;
  updateSystemSettings(updates: Partial<InsertSystemSettings>): Promise<SystemSettings | undefined>;
  initializeSystemSettings(): Promise<SystemSettings>;

  // Dashboard methods
  getDashboardMetrics(): Promise<DashboardMetrics>;
  getRevenueData(period: 'daily' | 'weekly' | 'monthly'): Promise<RevenueData>;
  getStationUtilization(): Promise<StationUtilization>;
}

export class DatabaseStorage implements IStorage {
  private isInitialized = false;

  constructor() {
    this.initializeDatabase();
  }

  private async initializeDatabase() {
    if (this.isInitialized) return;
    
    try {
      // Check if data already exists, if not, seed with initial data
      const existingStations = await db.select().from(gamingStations).limit(1);
      if (existingStations.length === 0) {
        await this.seedInitialData();
      }
      this.isInitialized = true;
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Error initializing database:', error);
    }
  }

  private async seedInitialData() {
    try {
      // Seed gaming stations
      const stationData: InsertGamingStation[] = [];
      for (let i = 1; i <= 25; i++) {
        const type = i <= 20 ? "PC" : "Console";
        const rate = type === "PC" ? "100.00" : "80.00";
        stationData.push({
          name: `${type}-${i.toString().padStart(2, '0')}`,
          type,
          hourlyRate: rate,
          isActive: true
        });
      }
      
      await db.insert(gamingStations).values(stationData);

      // Seed revenue targets
      const targetData: InsertRevenueTarget[] = [
        { type: "daily", period: "current", targetAmount: "15000.00", currentAmount: "0.00" },
        { type: "weekly", period: "current", targetAmount: "100000.00", currentAmount: "0.00" },
        { type: "monthly", period: "current", targetAmount: "400000.00", currentAmount: "0.00" }
      ];
      
      await db.insert(revenueTargets).values(targetData);

      console.log('Database seeded successfully');
    } catch (error) {
      console.error('Error seeding database:', error);
    }
  }

  // Customer methods
  async getCustomer(id: string): Promise<Customer | undefined> {
    try {
      const [customer] = await db.select().from(customers).where(eq(customers.id, id));
      return customer || undefined;
    } catch (error) {
      console.error('Error getting customer:', error);
      return undefined;
    }
  }

  async getCustomerByPhone(phone: string): Promise<Customer | undefined> {
    try {
      const [customer] = await db.select().from(customers).where(eq(customers.phone, phone));
      return customer || undefined;
    } catch (error) {
      console.error('Error getting customer by phone:', error);
      return undefined;
    }
  }

  async createCustomer(customer: InsertCustomer): Promise<Customer> {
    const newCustomer = {
      id: randomUUID(),
      name: customer.name,
      email: customer.email || null,
      phone: customer.phone || null,
      createdAt: new Date()
    };
    
    const [result] = await db.insert(customers).values(newCustomer).returning();
    return result;
  }

  async getAllCustomers(): Promise<Customer[]> {
    return await db.select().from(customers).orderBy(desc(customers.createdAt));
  }

  // Gaming Station methods
  async getGamingStation(id: string): Promise<GamingStation | undefined> {
    try {
      const [station] = await db.select().from(gamingStations).where(eq(gamingStations.id, id));
      return station || undefined;
    } catch (error) {
      console.error('Error getting gaming station:', error);
      return undefined;
    }
  }

  async getGamingStationByName(name: string): Promise<GamingStation | undefined> {
    try {
      const [station] = await db.select().from(gamingStations).where(eq(gamingStations.name, name));
      return station || undefined;
    } catch (error) {
      console.error('Error getting gaming station by name:', error);
      return undefined;
    }
  }

  async createGamingStation(station: InsertGamingStation): Promise<GamingStation> {
    const newStation = {
      id: randomUUID(),
      type: station.type,
      name: station.name,
      hourlyRate: station.hourlyRate,
      isActive: station.isActive ?? true
    };
    
    const [result] = await db.insert(gamingStations).values(newStation).returning();
    return result;
  }

  async getAllGamingStations(): Promise<GamingStation[]> {
    return await db.select().from(gamingStations).orderBy(gamingStations.name);
  }

  async deleteGamingStation(id: string): Promise<boolean> {
    try {
      // Check if station has any active sessions
      const activeSessions = await db.select().from(sessions)
        .where(and(eq(sessions.stationId, id), eq(sessions.isActive, true)));
      
      if (activeSessions.length > 0) {
        throw new Error("Cannot delete station with active sessions");
      }

      const result = await db.delete(gamingStations)
        .where(eq(gamingStations.id, id));
      
      return result.rowCount !== null && result.rowCount > 0;
    } catch (error) {
      console.error('Error deleting gaming station:', error);
      return false;
    }
  }

  // Session methods
  async getSession(id: string): Promise<Session | undefined> {
    try {
      const [session] = await db.select().from(sessions).where(eq(sessions.id, id));
      return session || undefined;
    } catch (error) {
      console.error('Error getting session:', error);
      return undefined;
    }
  }

  async createSession(session: InsertSession): Promise<Session> {
    const newSession = {
      id: randomUUID(),
      isActive: true,
      customerId: session.customerId,
      stationId: session.stationId,
      startTime: new Date(),
      endTime: null,
      totalAmount: null
    };
    
    const [result] = await db.insert(sessions).values(newSession).returning();
    
    // Create activity log
    await this.createActivity({
      type: "check_in",
      description: `Customer checked in to ${session.stationId}`,
      customerId: session.customerId,
      sessionId: result.id
    });
    
    return result;
  }

  async updateSession(id: string, updates: Partial<Session>): Promise<Session | undefined> {
    try {
      const [result] = await db.update(sessions)
        .set(updates)
        .where(eq(sessions.id, id))
        .returning();
      return result || undefined;
    } catch (error) {
      console.error('Error updating session:', error);
      return undefined;
    }
  }

  async getActiveSessions(): Promise<ActiveSession[]> {
    try {
      const activeSessions = await db
        .select({
          id: sessions.id,
          isActive: sessions.isActive,
          customerId: sessions.customerId,
          stationId: sessions.stationId,
          startTime: sessions.startTime,
          endTime: sessions.endTime,
          totalAmount: sessions.totalAmount,
          customerName: customers.name,
          stationName: gamingStations.name,
          duration: sql<number>`EXTRACT(EPOCH FROM (NOW() - ${sessions.startTime})) / 60`.as('duration'),
          hourlyRate: gamingStations.hourlyRate
        })
        .from(sessions)
        .innerJoin(customers, eq(sessions.customerId, customers.id))
        .innerJoin(gamingStations, eq(sessions.stationId, gamingStations.id))
        .where(eq(sessions.isActive, true));

      return activeSessions;
    } catch (error) {
      console.error('Error getting active sessions:', error);
      return [];
    }
  }

  async getSessionsByDateRange(startDate: Date, endDate: Date): Promise<Session[]> {
    return await db.select().from(sessions)
      .where(and(
        gte(sessions.startTime, startDate),
        lte(sessions.startTime, endDate)
      ))
      .orderBy(desc(sessions.startTime));
  }

  async endSession(id: string): Promise<Session | undefined> {
    try {
      const session = await this.getSession(id);
      if (!session) return undefined;

      const endTime = new Date();
      const duration = (endTime.getTime() - session.startTime!.getTime()) / (1000 * 60); // minutes
      const station = await this.getGamingStation(session.stationId);
      const hourlyRate = parseFloat(station?.hourlyRate || "0");
      const totalAmount = ((duration / 60) * hourlyRate).toFixed(2);

      const [result] = await db.update(sessions)
        .set({
          endTime,
          totalAmount,
          isActive: false
        })
        .where(eq(sessions.id, id))
        .returning();

      // Create activity log
      await this.createActivity({
        type: "check_out",
        description: `Customer checked out from ${session.stationId}. Total: ₹${totalAmount}`,
        customerId: session.customerId,
        sessionId: id
      });

      return result || undefined;
    } catch (error) {
      console.error('Error ending session:', error);
      return undefined;
    }
  }

  // Revenue Target methods
  async getRevenueTarget(type: string, period: string): Promise<RevenueTarget | undefined> {
    try {
      const [target] = await db.select().from(revenueTargets)
        .where(and(
          eq(revenueTargets.type, type),
          eq(revenueTargets.period, period)
        ));
      return target || undefined;
    } catch (error) {
      console.error('Error getting revenue target:', error);
      return undefined;
    }
  }

  async createRevenueTarget(target: InsertRevenueTarget): Promise<RevenueTarget> {
    const newTarget = {
      id: randomUUID(),
      type: target.type,
      createdAt: new Date(),
      period: target.period,
      targetAmount: target.targetAmount,
      currentAmount: target.currentAmount || null
    };
    
    const [result] = await db.insert(revenueTargets).values(newTarget).returning();
    return result;
  }

  async updateRevenueTarget(id: string, updates: Partial<RevenueTarget>): Promise<RevenueTarget | undefined> {
    try {
      const [result] = await db.update(revenueTargets)
        .set(updates)
        .where(eq(revenueTargets.id, id))
        .returning();
      return result || undefined;
    } catch (error) {
      console.error('Error updating revenue target:', error);
      return undefined;
    }
  }

  async getAllRevenueTargets(): Promise<RevenueTarget[]> {
    return await db.select().from(revenueTargets).orderBy(revenueTargets.type);
  }

  // Alert methods
  async createAlert(alert: InsertAlert): Promise<Alert> {
    const newAlert = {
      id: randomUUID(),
      type: alert.type,
      createdAt: new Date(),
      message: alert.message,
      isRead: alert.isRead ?? false,
      severity: alert.severity || "info"
    };
    
    const [result] = await db.insert(alerts).values(newAlert).returning();
    return result;
  }

  async getUnreadAlerts(): Promise<Alert[]> {
    return await db.select().from(alerts)
      .where(eq(alerts.isRead, false))
      .orderBy(desc(alerts.createdAt));
  }

  async markAlertAsRead(id: string): Promise<Alert | undefined> {
    try {
      const [result] = await db.update(alerts)
        .set({ isRead: true })
        .where(eq(alerts.id, id))
        .returning();
      return result || undefined;
    } catch (error) {
      console.error('Error marking alert as read:', error);
      return undefined;
    }
  }

  async getAllAlerts(): Promise<Alert[]> {
    return await db.select().from(alerts).orderBy(desc(alerts.createdAt));
  }

  // Activity methods
  async createActivity(activity: InsertActivity): Promise<Activity> {
    const newActivity = {
      id: randomUUID(),
      type: activity.type,
      description: activity.description,
      createdAt: new Date(),
      customerId: activity.customerId || null,
      sessionId: activity.sessionId || null
    };
    
    const [result] = await db.insert(activities).values(newActivity).returning();
    return result;
  }

  async getRecentActivities(limit: number = 10): Promise<Activity[]> {
    return await db.select().from(activities)
      .orderBy(desc(activities.createdAt))
      .limit(limit);
  }

  // Dashboard methods
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      // Get system settings for total stations
      const settings = await this.getSystemSettings();
      const totalStations = settings?.totalStations || 25;

      // Get today's revenue
      const todaysSessionsResult = await db
        .select({
          totalRevenue: sql<number>`COALESCE(SUM(CAST(${sessions.totalAmount} AS DECIMAL)), 0)`
        })
        .from(sessions)
        .where(and(
          gte(sessions.startTime, today),
          lte(sessions.startTime, tomorrow),
          eq(sessions.isActive, false)
        ));

      const todayRevenue = todaysSessionsResult[0]?.totalRevenue || 0;

      // Get active customers count
      const activeCustomersResult = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(sessions)
        .where(eq(sessions.isActive, true));

      const activeCustomers = activeCustomersResult[0]?.count || 0;

      // Get occupied stations
      const occupiedStationsResult = await db
        .select({ count: sql<number>`COUNT(DISTINCT ${sessions.stationId})` })
        .from(sessions)
        .where(eq(sessions.isActive, true));

      const occupiedStations = occupiedStationsResult[0]?.count || 0;

      // Get total customers today
      const totalCustomersTodayResult = await db
        .select({ count: sql<number>`COUNT(DISTINCT ${sessions.customerId})` })
        .from(sessions)
        .where(and(
          gte(sessions.startTime, today),
          lte(sessions.startTime, tomorrow)
        ));

      const totalCustomersToday = totalCustomersTodayResult[0]?.count || 0;

      return {
        todayRevenue,
        revenueGrowth: 15.3,
        activeCustomers,
        totalCustomersToday,
        occupiedStations,
        totalStations,
        occupancyRate: Math.round((occupiedStations / totalStations) * 100),
        avgSessionTime: 120,
        sessionGrowth: 8.2
      };
    } catch (error) {
      console.error('Error getting dashboard metrics:', error);
      // Get system settings for fallback
      const settings = await this.getSystemSettings();
      const totalStations = settings?.totalStations || 25;
      
      return {
        todayRevenue: 0,
        revenueGrowth: 0,
        activeCustomers: 0,
        totalCustomersToday: 0,
        occupiedStations: 0,
        totalStations,
        occupancyRate: 0,
        avgSessionTime: 0,
        sessionGrowth: 0
      };
    }
  }

  async getRevenueData(period: 'daily' | 'weekly' | 'monthly'): Promise<RevenueData> {
    try {
      const now = new Date();
      const labels: string[] = [];
      const data: number[] = [];

      if (period === 'daily') {
        // Last 7 days
        for (let i = 6; i >= 0; i--) {
          const date = new Date(now);
          date.setDate(date.getDate() - i);
          date.setHours(0, 0, 0, 0);
          
          const nextDate = new Date(date);
          nextDate.setDate(nextDate.getDate() + 1);

          const result = await db
            .select({
              revenue: sql<number>`COALESCE(SUM(CAST(${sessions.totalAmount} AS DECIMAL)), 0)`
            })
            .from(sessions)
            .where(and(
              gte(sessions.startTime, date),
              lte(sessions.startTime, nextDate),
              eq(sessions.isActive, false)
            ));

          labels.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
          data.push(result[0]?.revenue || 0);
        }
      }

      return { labels, data };
    } catch (error) {
      console.error('Error getting revenue data:', error);
      return { labels: [], data: [] };
    }
  }

  async getStationUtilization(): Promise<StationUtilization> {
    try {
      // Get system settings for station counts
      const settings = await this.getSystemSettings();
      const totalStations = settings?.totalStations || 25;
      const pcStations = settings?.pcStations || 15;
      const consoleStations = settings?.consoleStations || 10;
      
      const occupiedResult = await db
        .select({ count: sql<number>`COUNT(DISTINCT ${sessions.stationId})` })
        .from(sessions)
        .where(eq(sessions.isActive, true));

      const occupied = occupiedResult[0]?.count || 0;
      const available = totalStations - occupied;

      // Get PC vs Console breakdown
      const pcOccupiedResult = await db
        .select({ count: sql<number>`COUNT(DISTINCT ${sessions.stationId})` })
        .from(sessions)
        .innerJoin(gamingStations, eq(sessions.stationId, gamingStations.id))
        .where(and(
          eq(sessions.isActive, true),
          eq(gamingStations.type, "PC")
        ));

      const consoleOccupiedResult = await db
        .select({ count: sql<number>`COUNT(DISTINCT ${sessions.stationId})` })
        .from(sessions)
        .innerJoin(gamingStations, eq(sessions.stationId, gamingStations.id))
        .where(and(
          eq(sessions.isActive, true),
          eq(gamingStations.type, "Console")
        ));

      const pcOccupied = pcOccupiedResult[0]?.count || 0;
      const consoleOccupied = consoleOccupiedResult[0]?.count || 0;

      return {
        occupied,
        available,
        pcOccupied,
        pcAvailable: pcStations - pcOccupied,
        consoleOccupied,
        consoleAvailable: consoleStations - consoleOccupied
      };
    } catch (error) {
      console.error('Error getting station utilization:', error);
      // Get system settings for fallback
      const settings = await this.getSystemSettings();
      const totalStations = settings?.totalStations || 25;
      const pcStations = settings?.pcStations || 15;
      const consoleStations = settings?.consoleStations || 10;
      
      return {
        occupied: 0,
        available: totalStations,
        pcOccupied: 0,
        pcAvailable: pcStations,
        consoleOccupied: 0,
        consoleAvailable: consoleStations
      };
    }
  }

  // System Settings methods
  async getSystemSettings(): Promise<SystemSettings | undefined> {
    try {
      const result = await db.select().from(systemSettings).limit(1);
      return result[0];
    } catch (error) {
      console.error('Error getting system settings:', error);
      throw error;
    }
  }

  async updateSystemSettings(updates: Partial<InsertSystemSettings>): Promise<SystemSettings | undefined> {
    try {
      const existingSettings = await this.getSystemSettings();
      if (!existingSettings) {
        // Initialize if doesn't exist
        return await this.initializeSystemSettings();
      }

      const result = await db
        .update(systemSettings)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(systemSettings.id, existingSettings.id))
        .returning();
      
      return result[0];
    } catch (error) {
      console.error('Error updating system settings:', error);
      throw error;
    }
  }

  async initializeSystemSettings(): Promise<SystemSettings> {
    try {
      const existing = await this.getSystemSettings();
      if (existing) {
        return existing;
      }

      const result = await db
        .insert(systemSettings)
        .values({
          centerName: "PlayHub",
          systemVersion: "1.0.0",
          totalStations: 25,
          pcStations: 15,
          consoleStations: 10,
          vrStations: 0,
          arcadeStations: 0
        })
        .returning();

      return result[0];
    } catch (error) {
      console.error('Error initializing system settings:', error);
      throw error;
    }
  }
}

export const storage = new DatabaseStorage();