import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertCustomerSchema, 
  insertSessionSchema,
  insertRevenueTargetSchema 
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Customer routes
  app.get("/api/customers", async (req, res) => {
    try {
      const customers = await storage.getAllCustomers();
      res.json(customers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch customers" });
    }
  });

  app.post("/api/customers", async (req, res) => {
    try {
      const validatedData = insertCustomerSchema.parse(req.body);
      const customer = await storage.createCustomer(validatedData);
      res.status(201).json(customer);
    } catch (error) {
      res.status(400).json({ message: "Invalid customer data" });
    }
  });

  app.get("/api/customers/phone/:phone", async (req, res) => {
    try {
      const customer = await storage.getCustomerByPhone(req.params.phone);
      if (!customer) {
        return res.status(404).json({ message: "Customer not found" });
      }
      res.json(customer);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch customer" });
    }
  });

  // Gaming station routes
  app.get("/api/stations", async (req, res) => {
    try {
      const stations = await storage.getAllGamingStations();
      res.json(stations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch gaming stations" });
    }
  });

  // Session routes
  app.get("/api/sessions/active", async (req, res) => {
    try {
      const activeSessions = await storage.getActiveSessions();
      res.json(activeSessions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch active sessions" });
    }
  });

  app.post("/api/sessions", async (req, res) => {
    try {
      const validatedData = insertSessionSchema.parse(req.body);
      const session = await storage.createSession(validatedData);
      res.status(201).json(session);
    } catch (error) {
      res.status(400).json({ message: "Invalid session data" });
    }
  });

  app.patch("/api/sessions/:id/end", async (req, res) => {
    try {
      const session = await storage.endSession(req.params.id);
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }
      res.json(session);
    } catch (error) {
      res.status(500).json({ message: "Failed to end session" });
    }
  });

  // Dashboard routes
  app.get("/api/dashboard/metrics", async (req, res) => {
    try {
      const metrics = await storage.getDashboardMetrics();
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard metrics" });
    }
  });

  app.get("/api/dashboard/revenue", async (req, res) => {
    try {
      const period = req.query.period as 'daily' | 'weekly' | 'monthly' || 'daily';
      const revenueData = await storage.getRevenueData(period);
      res.json(revenueData);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch revenue data" });
    }
  });

  app.get("/api/dashboard/utilization", async (req, res) => {
    try {
      const utilization = await storage.getStationUtilization();
      res.json(utilization);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch station utilization" });
    }
  });

  // Alert routes
  app.get("/api/alerts", async (req, res) => {
    try {
      const alerts = await storage.getUnreadAlerts();
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch alerts" });
    }
  });

  app.patch("/api/alerts/:id/read", async (req, res) => {
    try {
      const alert = await storage.markAlertAsRead(req.params.id);
      if (!alert) {
        return res.status(404).json({ message: "Alert not found" });
      }
      res.json(alert);
    } catch (error) {
      res.status(500).json({ message: "Failed to mark alert as read" });
    }
  });

  // Activity routes
  app.get("/api/activities", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const activities = await storage.getRecentActivities(limit);
      res.json(activities);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch activities" });
    }
  });

  // Revenue target routes
  app.get("/api/targets", async (req, res) => {
    try {
      const targets = await storage.getAllRevenueTargets();
      res.json(targets);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch revenue targets" });
    }
  });

  app.post("/api/targets", async (req, res) => {
    try {
      const validatedData = insertRevenueTargetSchema.parse(req.body);
      const target = await storage.createRevenueTarget(validatedData);
      res.status(201).json(target);
    } catch (error) {
      res.status(400).json({ message: "Invalid target data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
