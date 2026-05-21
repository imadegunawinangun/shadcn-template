import { neon } from '@neondatabase/serverless';

const sql = neon("postgresql://neondb_owner:npg_HQVxg8Ii2PrW@ep-divine-term-aobwwkrv-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require");

async function createTable() {
  try {
    await sql`
      CREATE TABLE landing_page (
        id TEXT PRIMARY KEY
      )
    `;
    console.log('Table created');
  } catch (error) {
    console.error('Expected error:', error.message);
  }
}

createTable();
