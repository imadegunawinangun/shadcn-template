"use server";

import { db, landingPage, workspace, getSiteConfig, resolveBranding } from "@workspace/database";
import { eq, and, desc, sql } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { nanoid } from "nanoid";
import { TEMPLATES_CONTENT } from "./template-data";

export async function getLandingPages() {
  const { orgId } = await auth();
  if (!orgId) throw new Error("Unauthorized");

  const pages = await db
    .select()
    .from(landingPage)
    .where(eq(landingPage.workspaceId, orgId))
    .orderBy(desc(landingPage.updatedAt));

  // Resolve themes for all pages
  return await Promise.all(pages.map(async (page: any) => {
    const resolvedTheme = await resolveBranding(orgId, "website", page.theme);
    return { ...page, resolvedTheme };
  }));
}

export async function getLandingPage(id: string) {
  const { orgId } = await auth();
  if (!orgId) throw new Error("Unauthorized");

  // DEBUG: Cek kolom yang dilihat aplikasi
  try {
    const cols = await db.execute(sql`SELECT column_name FROM information_schema.columns WHERE table_name = 'landing_page'`);
    console.log("DEBUG: Kolom yang dilihat APLIKASI:", cols.rows.map((c: any) => c.column_name).join(", "));
  } catch (e) {
    console.error("DEBUG: Gagal cek kolom:", e);
  }

  const [page] = await db
    .select()
    .from(landingPage)
    .where(
      and(
        eq(landingPage.id, id),
        eq(landingPage.workspaceId, orgId)
      )
    );

  if (!page) return null;

  const resolvedTheme = await resolveBranding(orgId, "website", page.theme);
  (page as any).resolvedTheme = resolvedTheme;

  const workspaceConfig = await getSiteConfig(orgId, null); // Level 2
  const appConfig = await getSiteConfig(orgId, "website"); // Level 3
  
  (page as any).fallbackConfigs = {
    workspace: workspaceConfig?.theme,
    app: appConfig?.theme
  };


  return page;
}


export async function createLandingPage(data: { title: string; slug: string; templateId?: string; theme?: any }) {
  const { orgId } = await auth();
  if (!orgId) throw new Error("Unauthorized");

  const id = `page_${nanoid(12)}`;
  const templateId = data.templateId || "blank";
  const initialContent = TEMPLATES_CONTENT[templateId] || TEMPLATES_CONTENT.blank;

  // Set the specific title inside template root SEO settings for consistent onboarding
  const contentWithSEO = {
    ...initialContent,
    root: {
      ...initialContent.root,
      title: data.title
    }
  };
  
  await db.insert(landingPage).values({
    id,
    workspaceId: orgId,
    title: data.title,
    slug: data.slug,
    status: "draft",
    content: contentWithSEO,
    theme: data.theme || null,
  });

  revalidatePath("/dashboard/website");
  return { id };
}

export async function updateLandingPage(id: string, data: any) {
  const { orgId } = await auth();
  if (!orgId) throw new Error("Unauthorized");

  await db
    .update(landingPage)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(landingPage.id, id),
        eq(landingPage.workspaceId, orgId)
      )
    );

  revalidatePath("/dashboard/website");
  revalidatePath(`/dashboard/website/${id}`);
}

export async function deleteLandingPage(id: string) {
  const { orgId } = await auth();
  if (!orgId) throw new Error("Unauthorized");

  await db
    .delete(landingPage)
    .where(
      and(
        eq(landingPage.id, id),
        eq(landingPage.workspaceId, orgId)
      )
    );

  revalidatePath("/dashboard/website");
}

export async function setHomePage(id: string) {
  const { orgId } = await auth();
  if (!orgId) throw new Error("Unauthorized");

  // Reset all other pages' isHome to 0 for this workspace
  await db
    .update(landingPage)
    .set({ isHome: 0 })
    .where(eq(landingPage.workspaceId, orgId));

  // Set the target page isHome to 1
  await db
    .update(landingPage)
    .set({ isHome: 1 })
    .where(
      and(
        eq(landingPage.id, id),
        eq(landingPage.workspaceId, orgId)
      )
    );

  revalidatePath("/dashboard/website");
}

export async function getPageBySlug(slug: string) {
  const [page] = await db
    .select()
    .from(landingPage)
    .where(eq(landingPage.slug, slug));

  if (!page) return null;

  const resolvedTheme = await resolveBranding(page.workspaceId, "website", page.theme);
  (page as any).resolvedTheme = resolvedTheme;


  return page;
}

export async function getHomePage() {
  const [page] = await db
    .select()
    .from(landingPage)
    .where(eq(landingPage.isHome, 1));

  if (!page) return null;

  const resolvedTheme = await resolveBranding(page.workspaceId, "website", page.theme);
  (page as any).resolvedTheme = resolvedTheme;


  return page;
}
