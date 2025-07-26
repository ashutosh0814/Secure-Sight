import { sql, relations } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const cameras = pgTable("cameras", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  location: text("location").notNull(),
});

export const incidents = pgTable("incidents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  cameraId: varchar("camera_id").notNull().references(() => cameras.id),
  type: text("type").notNull(), // 'Unauthorised Access', 'Gun Threat', 'Face Recognised', etc.
  tsStart: timestamp("ts_start").notNull(),
  tsEnd: timestamp("ts_end").notNull(),
  thumbnailUrl: text("thumbnail_url").notNull(),
  resolved: boolean("resolved").notNull().default(false),
});

export const cameraRelations = relations(cameras, ({ many }) => ({
  incidents: many(incidents),
}));

export const incidentRelations = relations(incidents, ({ one }) => ({
  camera: one(cameras, {
    fields: [incidents.cameraId],
    references: [cameras.id],
  }),
}));

export const insertCameraSchema = createInsertSchema(cameras).omit({
  id: true,
});

export const insertIncidentSchema = createInsertSchema(incidents).omit({
  id: true,
});

export type InsertCamera = z.infer<typeof insertCameraSchema>;
export type Camera = typeof cameras.$inferSelect;
export type InsertIncident = z.infer<typeof insertIncidentSchema>;
export type Incident = typeof incidents.$inferSelect;

// User schema (keeping existing)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
