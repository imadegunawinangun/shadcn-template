import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { landingPage } from "./schema";
import { eq } from "drizzle-orm";

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }

  const sqlClient = neon(connectionString);
  const db = drizzle((sql: string, params: any[], options: any) => sqlClient.query(sql, params, options), { logger: false });

  console.log("Fetching all landing pages...");
  const pages = await db.select().from(landingPage);
  console.log(`Found ${pages.length} pages.`);

  let migratedCount = 0;

  for (const page of pages) {
    if (Array.isArray(page.content)) {
      console.log(`Migrating page ${page.id} (${page.title})...`);
      
      const legacySections = page.content;
      const puckData = {
        content: legacySections.map((sec: any) => ({
          type: sec.type === 'hero' ? 'Hero' 
               : sec.type === 'pricing' ? 'Pricing'
               : sec.type === 'features' ? 'Features'
               : sec.type === 'testimonials' ? 'Testimonials'
               : sec.type === 'cta' ? 'CTA'
               : sec.type === 'contact' ? 'Contact'
               : sec.type === 'team' ? 'Team'
               : sec.type === 'gallery' ? 'Gallery'
               : sec.type === 'faq' ? 'FAQ'
               : sec.type === 'stats' ? 'Stats'
               : 'Features',
          props: {
            id: sec.id,
            ...sec.content,
            title: sec.content?.title || sec.title
          }
        })),
        root: {
          props: {
            title: page.title,
            themeStyle: "default",
            themeColor: "zinc",
            themeRadius: "0.5"
          }
        },
        zones: {}
      };

      await db.update(landingPage)
        .set({ content: puckData })
        .where(eq(landingPage.id, page.id));
        
      console.log(`Successfully migrated ${page.id}`);
      migratedCount++;
    } else {
      console.log(`Page ${page.id} is already in Puck format or empty. Skipping.`);
    }
  }

  console.log(`\nMigration complete! Migrated ${migratedCount} pages.`);
}

main().catch(console.error);
