import postgres from 'postgres';

async function run() {
  const sql = postgres(process.env.DATABASE_URL!);
  
  try {
    const res = await sql`SELECT * FROM site_config LIMIT 1`;
    console.log('Columns in DB:', Object.keys(res[0] || {}));
  } catch (error: any) {
    console.error('Query failed:', error.message);
  } finally {
    await sql.end();
  }
}

run();
