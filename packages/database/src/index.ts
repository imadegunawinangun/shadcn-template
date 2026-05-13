import { drizzle } from "drizzle-orm/neon-serverless";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("❌ ERROR: DATABASE_URL is not defined in environment variables.");
} else {
  console.log("✅ Database URL detected, initializing connection...");
}

// Inisialisasi client Neon
const client = connectionString ? neon(connectionString) : null;
export const db = client ? drizzle(client, { schema }) : null as any;

export * from "./schema";
export * from "drizzle-orm";
export { schema };
