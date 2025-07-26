import { cameras, incidents, users, type Camera, type Incident, type User, type InsertCamera, type InsertIncident, type InsertUser } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Camera methods
  getCameras(): Promise<Camera[]>;
  createCamera(camera: InsertCamera): Promise<Camera>;
  
  // Incident methods
  getIncidents(resolved?: boolean): Promise<(Incident & { camera: Camera })[]>;
  getIncidentById(id: string): Promise<(Incident & { camera: Camera }) | undefined>;
  resolveIncident(id: string): Promise<(Incident & { camera: Camera }) | undefined>;
  createIncident(incident: InsertIncident): Promise<Incident>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Camera methods
  async getCameras(): Promise<Camera[]> {
    return await db.select().from(cameras);
  }

  async createCamera(insertCamera: InsertCamera): Promise<Camera> {
    const [camera] = await db
      .insert(cameras)
      .values(insertCamera)
      .returning();
    return camera;
  }

  // Incident methods
  async getIncidents(resolved?: boolean): Promise<(Incident & { camera: Camera })[]> {
    const query = db
      .select({
        id: incidents.id,
        cameraId: incidents.cameraId,
        type: incidents.type,
        tsStart: incidents.tsStart,
        tsEnd: incidents.tsEnd,
        thumbnailUrl: incidents.thumbnailUrl,
        resolved: incidents.resolved,
        camera: cameras,
      })
      .from(incidents)
      .innerJoin(cameras, eq(incidents.cameraId, cameras.id))
      .orderBy(desc(incidents.tsStart));

    if (resolved !== undefined) {
      query.where(eq(incidents.resolved, resolved));
    }

    return await query;
  }

  async getIncidentById(id: string): Promise<(Incident & { camera: Camera }) | undefined> {
    const [result] = await db
      .select({
        id: incidents.id,
        cameraId: incidents.cameraId,
        type: incidents.type,
        tsStart: incidents.tsStart,
        tsEnd: incidents.tsEnd,
        thumbnailUrl: incidents.thumbnailUrl,
        resolved: incidents.resolved,
        camera: cameras,
      })
      .from(incidents)
      .innerJoin(cameras, eq(incidents.cameraId, cameras.id))
      .where(eq(incidents.id, id));

    return result || undefined;
  }

  async resolveIncident(id: string): Promise<(Incident & { camera: Camera }) | undefined> {
    const [updated] = await db
      .update(incidents)
      .set({ resolved: true })
      .where(eq(incidents.id, id))
      .returning();

    if (!updated) return undefined;

    return await this.getIncidentById(id);
  }

  async createIncident(insertIncident: InsertIncident): Promise<Incident> {
    const [incident] = await db
      .insert(incidents)
      .values(insertIncident)
      .returning();
    return incident;
  }
}

export const storage = new DatabaseStorage();
