import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, decimal, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const customers = pgTable("customers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  phone: text("phone"),
  email: text("email"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const gamingStations = pgTable("gaming_stations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
  type: text("type").notNull(), // 'PC' or 'Console'
  hourlyRate: decimal("hourly_rate", { precision: 10, scale: 2 }).notNull(),
  isActive: boolean("is_active").default(true),
});

export const sessions = pgTable("sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  customerId: varchar("customer_id").references(() => customers.id).notNull(),
  stationId: varchar("station_id").references(() => gamingStations.id).notNull(),
  startTime: timestamp("start_time").defaultNow(),
  endTime: timestamp("end_time"),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }),
  isActive: boolean("is_active").default(true),
});

export const revenueTargets = pgTable("revenue_targets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: text("type").notNull(), // 'daily', 'weekly', 'monthly'
  targetAmount: decimal("target_amount", { precision: 10, scale: 2 }).notNull(),
  currentAmount: decimal("current_amount", { precision: 10, scale: 2 }).default("0"),
  period: text("period").notNull(), // date string for the period
  createdAt: timestamp("created_at").defaultNow(),
});

export const alerts = pgTable("alerts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: text("type").notNull(), // 'revenue_target', 'low_occupancy', etc.
  message: text("message").notNull(),
  isRead: boolean("is_read").default(false),
  severity: text("severity").notNull().default("info"), // 'info', 'warning', 'error'
  createdAt: timestamp("created_at").defaultNow(),
});

export const activities = pgTable("activities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: text("type").notNull(), // 'check_in', 'check_out', 'alert'
  description: text("description").notNull(),
  customerId: varchar("customer_id").references(() => customers.id),
  sessionId: varchar("session_id").references(() => sessions.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertCustomerSchema = createInsertSchema(customers).omit({
  id: true,
  createdAt: true,
});

export const insertGamingStationSchema = createInsertSchema(gamingStations).omit({
  id: true,
});

export const insertSessionSchema = createInsertSchema(sessions).omit({
  id: true,
  startTime: true,
  totalAmount: true,
});

export const insertRevenueTargetSchema = createInsertSchema(revenueTargets).omit({
  id: true,
  createdAt: true,
});

export const insertAlertSchema = createInsertSchema(alerts).omit({
  id: true,
  createdAt: true,
});

export const insertActivitySchema = createInsertSchema(activities).omit({
  id: true,
  createdAt: true,
});

// Types
export type Customer = typeof customers.$inferSelect;
export type InsertCustomer = z.infer<typeof insertCustomerSchema>;

export type GamingStation = typeof gamingStations.$inferSelect;
export type InsertGamingStation = z.infer<typeof insertGamingStationSchema>;

export type Session = typeof sessions.$inferSelect;
export type InsertSession = z.infer<typeof insertSessionSchema>;

export type RevenueTarget = typeof revenueTargets.$inferSelect;
export type InsertRevenueTarget = z.infer<typeof insertRevenueTargetSchema>;

export type Alert = typeof alerts.$inferSelect;
export type InsertAlert = z.infer<typeof insertAlertSchema>;

export type Activity = typeof activities.$inferSelect;
export type InsertActivity = z.infer<typeof insertActivitySchema>;

// Additional types for API responses
export type ActiveSession = Session & {
  customerName: string;
  stationName: string;
  duration: number; // in minutes
  hourlyRate: string;
};

export type DashboardMetrics = {
  todayRevenue: number;
  revenueGrowth: number;
  activeCustomers: number;
  totalCustomersToday: number;
  occupiedStations: number;
  totalStations: number;
  occupancyRate: number;
  avgSessionTime: number;
  sessionGrowth: number;
};

export type RevenueData = {
  labels: string[];
  data: number[];
};

export type StationUtilization = {
  occupied: number;
  available: number;
  pcOccupied: number;
  pcAvailable: number;
  consoleOccupied: number;
  consoleAvailable: number;
};
