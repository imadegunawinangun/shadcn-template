import { neon } from "@neondatabase/serverless";

const DATABASE_URL = "postgresql://neondb_owner:npg_HQVxg8Ii2PrW@ep-divine-term-aobwwkrv-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

async function main() {
  const sql_neon = neon(DATABASE_URL);
  console.log("=== PENYISIRAN DATABASE TOTAL ===");
  
  try {
    // 1. Buat kolom primary_color (snake_case)
    await sql_neon`ALTER TABLE landing_page ADD COLUMN IF NOT EXISTS "primary_color" TEXT DEFAULT '#3b82f6';`;
    console.log("✓ Kolom primary_color dipastikan ada.");
    
    // 2. Buat kolom primaryColor (camelCase) sebagai cadangan
    await sql_neon`ALTER TABLE landing_page ADD COLUMN IF NOT EXISTS "primaryColor" TEXT DEFAULT '#3b82f6';`;
    console.log("✓ Kolom primaryColor dipastikan ada.");
    
    // 3. Sinkronkan data di antara keduanya
    await sql_neon`UPDATE landing_page SET "primary_color" = "primaryColor" WHERE "primaryColor" IS NOT NULL AND "primary_color" IS NULL;`;
    await sql_neon`UPDATE landing_page SET "primaryColor" = "primary_color" WHERE "primary_color" IS NOT NULL AND "primaryColor" IS NULL;`;
    
    console.log("✓ Sinkronisasi data selesai.");
    
    // 4. Cek ulang hasil akhir
    const finalCheck = await sql_neon`SELECT column_name FROM information_schema.columns WHERE table_name = 'landing_page';`;
    console.log("Hasil akhir kolom:", finalCheck.map(c => c.column_name).join(", "));
    
  } catch (error) {
    console.error("Gagal melakukan penyisiran:", error);
  }
  
  process.exit(0);
}

main();
