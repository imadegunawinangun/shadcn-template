import { neon } from "@neondatabase/serverless";

const DATABASE_URL = "postgresql://neondb_owner:npg_HQVxg8Ii2PrW@ep-divine-term-aobwwkrv-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

async function main() {
  const sql_neon = neon(DATABASE_URL);
  console.log("=== INSPEKSI DATABASE DETAIL ===");
  
  // Cek daftar tabel
  const tables = await sql_neon`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';`;
  console.log("Daftar Tabel:", tables.map(t => t.table_name).join(", "));
  
  // Cek struktur landing_page
  const columns = await sql_neon`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'landing_page';`;
  console.log("Struktur tabel 'landing_page':");
  columns.forEach(c => console.log(` - ${c.column_name} (${c.data_type})`));
  
  if (!columns.find(c => c.column_name === 'primary_color')) {
    console.log("!!! ERROR: Kolom primary_color BENAR-BENAR TIDAK ADA.");
    console.log("Mencoba membuat kolom secara paksa...");
    await sql_neon`ALTER TABLE landing_page ADD COLUMN "primary_color" TEXT DEFAULT '#3b82f6';`;
    console.log("Berhasil menjalankan ALTER TABLE.");
  } else {
    console.log("KOLOM primary_color TERDETEKSI ADA.");
  }
  
  process.exit(0);
}

main();
