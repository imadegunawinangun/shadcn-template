import { neon } from "@neondatabase/serverless";

const DATABASE_URL = "postgresql://neondb_owner:npg_HQVxg8Ii2PrW@ep-divine-term-aobwwkrv-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

async function main() {
  const sql_neon = neon(DATABASE_URL);
  console.log("Memeriksa kolom pada tabel landing_page...");
  const columns = await sql_neon`SELECT column_name FROM information_schema.columns WHERE table_name = 'landing_page';`;
  console.log("Kolom yang ditemukan:", columns.map(c => c.column_name).join(", "));
  
  if (!columns.find(c => c.column_name === 'primaryColor')) {
    console.log("Kolom primaryColor TIDAK ditemukan. Mencoba menambahkan lagi...");
    await sql_neon`ALTER TABLE landing_page ADD COLUMN "primaryColor" TEXT DEFAULT '#3b82f6';`;
    console.log("Perintah ALTER TABLE selesai.");
  } else {
    console.log("Kolom primaryColor SUDAH ada.");
  }
  process.exit(0);
}

main();
