import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

if (typeof window === "undefined" && !connectionString) {
  console.error("❌ ERROR: DATABASE_URL is not defined in environment variables.");
}

// Inisialisasi client Neon dan lakukan patch agar kompatibel dengan Drizzle
// Pesan error menyarankan penggunaan .query() untuk pemanggilan konvensional
const sql = connectionString ? neon(connectionString) : null;
const client = sql ? (query: string, params: any[], options: any) => sql.query(query, params, options) : null;

export const db = client ? drizzle(client as any, { schema }) : null as any;

export * from "./schema";
export * from "./site-actions";
export * from "./team-actions";
export * from "drizzle-orm";
export { schema };
