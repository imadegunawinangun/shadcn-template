import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

if (typeof window === "undefined") {
  if (!connectionString) {
    console.error("❌ ERROR: DATABASE_URL is not defined in environment variables.");
  } else {
    console.log(`🔌 DB: Connecting to ${connectionString.split('@')[1]?.split('/')[0] || 'unknown host'}`);
  }
}

// Inisialisasi client Neon dan lakukan patch agar kompatibel dengan Drizzle
// Pesan error menyarankan penggunaan .query() untuk pemanggilan konvensional
const sqlClient = connectionString ? neon(connectionString) : null;

export const db = sqlClient 
  ? drizzle(((sql: string, params: any[], options: any) => sqlClient.query(sql, params, options)) as any, { schema, logger: false }) 
  : null as any;

export * from "./schema";
export * from "./site-actions";
export * from "./team-actions";
export * from "./post-actions";
export * from "./branding";
export * from "drizzle-orm";
export { schema };
