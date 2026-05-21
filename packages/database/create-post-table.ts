import { neon } from '@neondatabase/serverless';

async function main() {
  const sql = neon(process.env.DATABASE_URL!);
  
  await sql`
    CREATE TABLE IF NOT EXISTS "post" (
        "id" text PRIMARY KEY NOT NULL,
        "workspaceId" text NOT NULL REFERENCES "workspace"("id"),
        "title" text NOT NULL,
        "slug" text NOT NULL,
        "content" text,
        "excerpt" text,
        "featuredImage" text,
        "categories" jsonb,
        "tags" jsonb,
        "status" text DEFAULT 'draft' NOT NULL,
        "metaTitle" text,
        "metaDescription" text,
        "views" integer DEFAULT 0 NOT NULL,
        "createdAt" timestamp DEFAULT now() NOT NULL,
        "updatedAt" timestamp DEFAULT now() NOT NULL
    );
  `;
  
  console.log('Post table created successfully');
}

main().catch(console.error);
