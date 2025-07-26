import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // GET /api/incidents?resolved=false - return newest-first JSON
  app.get("/api/incidents", async (req, res) => {
    try {
      const resolvedParam = req.query.resolved;
      let resolved: boolean | undefined;
      
      if (resolvedParam === "true") {
        resolved = true;
      } else if (resolvedParam === "false") {
        resolved = false;
      }

      const incidents = await storage.getIncidents(resolved);
      res.json(incidents);
    } catch (error) {
      console.error("Error fetching incidents:", error);
      res.status(500).json({ error: "Failed to fetch incidents" });
    }
  });

  // PATCH /api/incidents/:id/resolve - flip resolved and echo updated row
  app.patch("/api/incidents/:id/resolve", async (req, res) => {
    try {
      const { id } = req.params;
      
      const incident = await storage.resolveIncident(id);
      
      if (!incident) {
        return res.status(404).json({ error: "Incident not found" });
      }

      res.json(incident);
    } catch (error) {
      console.error("Error resolving incident:", error);
      res.status(500).json({ error: "Failed to resolve incident" });
    }
  });

  // GET /api/cameras - get all cameras
  app.get("/api/cameras", async (req, res) => {
    try {
      const cameras = await storage.getCameras();
      res.json(cameras);
    } catch (error) {
      console.error("Error fetching cameras:", error);
      res.status(500).json({ error: "Failed to fetch cameras" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
