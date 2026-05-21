import { neon } from '@neondatabase/serverless';
const sql = neon(process.env.DATABASE_URL!);

async function run() {
  await sql`ALTER TABLE site_config ADD COLUMN IF NOT EXISTS "aiProvider" text`;
  await sql`ALTER TABLE site_config ADD COLUMN IF NOT EXISTS "aiApiKey" text`;
  await sql`ALTER TABLE site_config ADD COLUMN IF NOT EXISTS "aiBaseUrl" text`;
  await sql`ALTER TABLE site_config ADD COLUMN IF NOT EXISTS "aiModelId" text`;
  console.log('Columns added successfully');
}

run().catch(err => {
  console.log(err.message);
  process.exit(1);
});
