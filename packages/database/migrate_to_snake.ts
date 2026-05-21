import { neon } from "@neondatabase/serverless";

const DATABASE_URL = "postgresql://neondb_owner:npg_HQVxg8Ii2PrW@ep-divine-term-aobwwkrv-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

async function main() {
  const sql_neon = neon(DATABASE_URL);
  console.log("Migrasi kolom ke primary_color (snake_case)...");
  try {
    // Tambahkan kolom baru (jika belum ada)
    await sql_neon`ALTER TABLE landing_page ADD COLUMN IF NOT EXISTS "primary_color" TEXT DEFAULT '#3b82f6';`;
    
    // Pindahkan data dari kolom lama (jika ada) ke kolom baru
    await sql_neon`UPDATE landing_page SET "primary_color" = "primaryColor" WHERE "primaryColor" IS NOT NULL;`;
    
    // Hapus kolom lama
    await sql_neon`ALTER TABLE landing_page DROP COLUMN IF EXISTS "primaryColor";`;
    
    console.log("Migrasi berhasil!");
  } catch (error) {
    console.error("Gagal melakukan migrasi:", error);
  }
  process.exit(0);
}

main();
