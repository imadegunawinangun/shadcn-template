import { neon } from '@neondatabase/serverless';

const sql = neon("postgresql://neondb_owner:npg_HQVxg8Ii2PrW@ep-divine-term-aobwwkrv-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require");

async function checkData() {
  try {
    const result = await sql`SELECT * FROM landing_page LIMIT 1`;
    console.log('Query successful, found:', result.length, 'rows');
  } catch (error) {
    console.error('Query failed:', error);
  }
}

checkData();
