var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  cameraRelations: () => cameraRelations,
  cameras: () => cameras,
  incidentRelations: () => incidentRelations,
  incidents: () => incidents,
  insertCameraSchema: () => insertCameraSchema,
  insertIncidentSchema: () => insertIncidentSchema,
  insertUserSchema: () => insertUserSchema,
  users: () => users
});
import { sql, relations } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var cameras = pgTable("cameras", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  location: text("location").notNull()
});
var incidents = pgTable("incidents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  cameraId: varchar("camera_id").notNull().references(() => cameras.id),
  type: text("type").notNull(),
  // 'Unauthorised Access', 'Gun Threat', 'Face Recognised', etc.
  tsStart: timestamp("ts_start").notNull(),
  tsEnd: timestamp("ts_end").notNull(),
  thumbnailUrl: text("thumbnail_url").notNull(),
  resolved: boolean("resolved").notNull().default(false)
});
var cameraRelations = relations(cameras, ({ many }) => ({
  incidents: many(incidents)
}));
var incidentRelations = relations(incidents, ({ one }) => ({
  camera: one(cameras, {
    fields: [incidents.cameraId],
    references: [cameras.id]
  })
}));
var insertCameraSchema = createInsertSchema(cameras).omit({
  id: true
});
var insertIncidentSchema = createInsertSchema(incidents).omit({
  id: true
});
var users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull()
});
var insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true
});

// server/db.ts
import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var connectionString = process.env.DATABASE_URL;
var url = new URL(connectionString);
url.searchParams.delete("schema");
connectionString = url.toString();
var client = postgres(connectionString, {
  // Add connection options if needed
  max: 10,
  // Maximum number of connections
  idle_timeout: 20,
  connect_timeout: 10
});
var db = drizzle(client, { schema: schema_exports });
client`SELECT 1 as test`.then(() => {
  console.log("\u2705 Database connected successfully");
}).catch((err) => {
  console.error("\u274C Database connection failed:", err.message);
});

// server/storage.ts
import { eq, desc } from "drizzle-orm";
var DatabaseStorage = class {
  // User methods
  async getUser(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || void 0;
  }
  async getUserByUsername(username) {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || void 0;
  }
  async createUser(insertUser) {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  // Camera methods
  async getCameras() {
    return await db.select().from(cameras);
  }
  async createCamera(insertCamera) {
    const [camera] = await db.insert(cameras).values(insertCamera).returning();
    return camera;
  }
  // Incident methods
  async getIncidents(resolved) {
    const query = db.select({
      id: incidents.id,
      cameraId: incidents.cameraId,
      type: incidents.type,
      tsStart: incidents.tsStart,
      tsEnd: incidents.tsEnd,
      thumbnailUrl: incidents.thumbnailUrl,
      resolved: incidents.resolved,
      camera: cameras
    }).from(incidents).innerJoin(cameras, eq(incidents.cameraId, cameras.id)).orderBy(desc(incidents.tsStart));
    if (resolved !== void 0) {
      query.where(eq(incidents.resolved, resolved));
    }
    return await query;
  }
  async getIncidentById(id) {
    const [result] = await db.select({
      id: incidents.id,
      cameraId: incidents.cameraId,
      type: incidents.type,
      tsStart: incidents.tsStart,
      tsEnd: incidents.tsEnd,
      thumbnailUrl: incidents.thumbnailUrl,
      resolved: incidents.resolved,
      camera: cameras
    }).from(incidents).innerJoin(cameras, eq(incidents.cameraId, cameras.id)).where(eq(incidents.id, id));
    return result || void 0;
  }
  async resolveIncident(id) {
    const [updated] = await db.update(incidents).set({ resolved: true }).where(eq(incidents.id, id)).returning();
    if (!updated) return void 0;
    return await this.getIncidentById(id);
  }
  async createIncident(insertIncident) {
    const [incident] = await db.insert(incidents).values(insertIncident).returning();
    return incident;
  }
};
var storage = new DatabaseStorage();

// server/routes.ts
async function registerRoutes(app2) {
  app2.get("/api/incidents", async (req, res) => {
    try {
      const resolvedParam = req.query.resolved;
      let resolved;
      if (resolvedParam === "true") {
        resolved = true;
      } else if (resolvedParam === "false") {
        resolved = false;
      }
      const incidents2 = await storage.getIncidents(resolved);
      res.json(incidents2);
    } catch (error) {
      console.error("Error fetching incidents:", error);
      res.status(500).json({ error: "Failed to fetch incidents" });
    }
  });
  app2.patch("/api/incidents/:id/resolve", async (req, res) => {
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
  app2.get("/api/cameras", async (req, res) => {
    try {
      const cameras2 = await storage.getCameras();
      res.json(cameras2);
    } catch (error) {
      console.error("Error fetching cameras:", error);
      res.status(500).json({ error: "Failed to fetch cameras" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url2 = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url2, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    console.error(err);
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const PORT = process.env.PORT || 5e3;
  server.listen(parseInt(PORT.toString(), 10), "127.0.0.1", () => {
    log(`Server running on http://127.0.0.1:${PORT}`);
  });
})();
