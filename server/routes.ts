import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Test endpoint for mobile debugging
  app.get("/api/test", (req, res) => {
    res.json({ 
      success: true, 
      message: "API is working!", 
      timestamp: new Date().toISOString(),
      headers: req.headers,
      ip: req.ip 
    });
  });

  // LemonSqueezy API routes - use dynamic import
  try {
    const { default: lemonsqueezyRoutes } = await import("./src/routes/lemonsqueezy.mjs");
    app.use("/api/lemonsqueezy", lemonsqueezyRoutes);
    console.log("✅ LemonSqueezy routes loaded successfully");
  } catch (error) {
    console.error("❌ Failed to load LemonSqueezy routes:", error);
  }

  // put additional application routes here
  // prefix all routes with /api

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  const httpServer = createServer(app);

  return httpServer;
}
