import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Clean the connection string to remove any schema parameters
let connectionString = process.env.DATABASE_URL;

// Remove schema parameter from URL if it exists
const url = new URL(connectionString);
url.searchParams.delete('schema');
connectionString = url.toString();

// Create the connection with additional options
const client = postgres(connectionString, {
  // Add connection options if needed
  max: 10, // Maximum number of connections
  idle_timeout: 20,
  connect_timeout: 10,
});

export const db = drizzle(client, { schema });

// Optional: Test the connection
client`SELECT 1 as test`.then(() => {
  console.log('✅ Database connected successfully');
}).catch((err) => {
  console.error('❌ Database connection failed:', err.message);
});