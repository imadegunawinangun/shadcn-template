import { neon } from "@neondatabase/serverless";

const sql = neon("postgresql://neondb_owner:npg_HQVxg8Ii2PrW@ep-divine-term-aobwwkrv-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require");

async function createTable() {
  console.log("🚀 Creating siteConfig table...");
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS "siteConfig" (
        "id" text PRIMARY KEY NOT NULL,
        "workspaceId" text NOT NULL UNIQUE REFERENCES "workspace"("id"),
        "theme" jsonb,
        "name" text,
        "logo" text,
        "imagekitPublicKey" text,
        "imagekitPrivateKey" text,
        "imagekitUrlEndpoint" text,
        "createdAt" timestamp DEFAULT now() NOT NULL,
        "updatedAt" timestamp DEFAULT now() NOT NULL
      );
    `;
    console.log("✅ Table siteConfig created successfully!");
  } catch (error) {
    console.error("❌ Error creating table:", error);
  }
}

createTable();
