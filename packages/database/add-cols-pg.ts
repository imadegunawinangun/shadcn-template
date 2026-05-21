import postgres from 'postgres';

async function run() {
  const sql = postgres(process.env.DATABASE_URL!);
  
  try {
    await sql`ALTER TABLE site_config ADD COLUMN IF NOT EXISTS "aiProvider" text`;
    await sql`ALTER TABLE site_config ADD COLUMN IF NOT EXISTS "aiApiKey" text`;
    await sql`ALTER TABLE site_config ADD COLUMN IF NOT EXISTS "aiBaseUrl" text`;
    await sql`ALTER TABLE site_config ADD COLUMN IF NOT EXISTS "aiModelId" text`;
    console.log('Columns added successfully using postgres driver!');
  } catch (error: any) {
    console.error('Migration failed:', error.message);
  } finally {
    await sql.end();
  }
}

run();
