import { db } from "./db";
import { cameras, incidents } from "@shared/schema";

async function seed() {
  console.log("Seeding database...");

  // Insert cameras
  const cameraData = [
    { name: "Camera - 01", location: "Vault Camera A" },
    { name: "Camera - 02", location: "Shop Floor Camera A" },
    { name: "Camera - 03", location: "Entrance Camera A" },
  ];

  const insertedCameras = await db.insert(cameras).values(cameraData).returning();
  console.log("Inserted cameras:", insertedCameras);

  // Create timestamps for a 24-hour span
  const baseDate = new Date("2025-07-07");
  
  // Insert incidents
  const incidentData = [
    {
      cameraId: insertedCameras[1].id, // Shop Floor Camera A
      type: "Unauthorised Access",
      tsStart: new Date(baseDate.getTime() + 14 * 60 * 60 * 1000 + 35 * 60 * 1000), // 14:35
      tsEnd: new Date(baseDate.getTime() + 14 * 60 * 60 * 1000 + 37 * 60 * 1000), // 14:37
      thumbnailUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&h=60",
      resolved: false,
    },
    {
      cameraId: insertedCameras[1].id, // Shop Floor Camera A
      type: "Gun Threat",
      tsStart: new Date(baseDate.getTime() + 14 * 60 * 60 * 1000 + 35 * 60 * 1000), // 14:35
      tsEnd: new Date(baseDate.getTime() + 14 * 60 * 60 * 1000 + 37 * 60 * 1000), // 14:37
      thumbnailUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&h=60",
      resolved: false,
    },
    {
      cameraId: insertedCameras[1].id, // Shop Floor Camera A
      type: "Unauthorised Access",
      tsStart: new Date(baseDate.getTime() + 14 * 60 * 60 * 1000 + 35 * 60 * 1000), // 14:35
      tsEnd: new Date(baseDate.getTime() + 14 * 60 * 60 * 1000 + 37 * 60 * 1000), // 14:37
      thumbnailUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&h=60",
      resolved: false,
    },
    {
      cameraId: insertedCameras[1].id, // Shop Floor Camera A
      type: "Unauthorised Access",
      tsStart: new Date(baseDate.getTime() + 14 * 60 * 60 * 1000 + 35 * 60 * 1000), // 14:35
      tsEnd: new Date(baseDate.getTime() + 14 * 60 * 60 * 1000 + 37 * 60 * 1000), // 14:37
      thumbnailUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&h=60",
      resolved: false,
    },
    {
      cameraId: insertedCameras[1].id, // Shop Floor Camera A
      type: "Unauthorised Access",
      tsStart: new Date(baseDate.getTime() + 14 * 60 * 60 * 1000 + 35 * 60 * 1000), // 14:35
      tsEnd: new Date(baseDate.getTime() + 14 * 60 * 60 * 1000 + 37 * 60 * 1000), // 14:37
      thumbnailUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&h=60",
      resolved: false,
    },
    {
      cameraId: insertedCameras[0].id, // Vault Camera A
      type: "Face Recognised",
      tsStart: new Date(baseDate.getTime() + 14 * 60 * 60 * 1000 + 45 * 60 * 1000), // 14:45
      tsEnd: new Date(baseDate.getTime() + 14 * 60 * 60 * 1000 + 47 * 60 * 1000), // 14:47
      thumbnailUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&h=60",
      resolved: false,
    },
    {
      cameraId: insertedCameras[2].id, // Entrance Camera A
      type: "Traffic congestion",
      tsStart: new Date(baseDate.getTime() + 11 * 60 * 60 * 1000), // 11:00
      tsEnd: new Date(baseDate.getTime() + 11 * 60 * 60 * 1000 + 30 * 60 * 1000), // 11:30
      thumbnailUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&h=60",
      resolved: false,
    },
    // Add more incidents to reach 15 total
    ...Array.from({ length: 8 }, (_, i) => ({
      cameraId: insertedCameras[i % 3].id,
      type: i % 2 === 0 ? "Unauthorised Access" : "Face Recognised",
      tsStart: new Date(baseDate.getTime() + (10 + i) * 60 * 60 * 1000), // Various hours
      tsEnd: new Date(baseDate.getTime() + (10 + i) * 60 * 60 * 1000 + 30 * 60 * 1000),
      thumbnailUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&h=60",
      resolved: false,
    })),
    // Add some resolved incidents
    ...Array.from({ length: 4 }, (_, i) => ({
      cameraId: insertedCameras[i % 3].id,
      type: "Unauthorised Access",
      tsStart: new Date(baseDate.getTime() + (8 + i) * 60 * 60 * 1000), // Earlier hours
      tsEnd: new Date(baseDate.getTime() + (8 + i) * 60 * 60 * 1000 + 20 * 60 * 1000),
      thumbnailUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&h=60",
      resolved: true,
    })),
  ];

  const insertedIncidents = await db.insert(incidents).values(incidentData).returning();
  console.log(`Inserted ${insertedIncidents.length} incidents`);

  console.log("Seeding completed!");
}

seed().catch(console.error);
