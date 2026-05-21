"use server"

import { db } from "./index";
import { siteConfig } from "./schema";
import { eq, and, isNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";

/**
 * Mengambil konfigurasi situs untuk workspace dan aplikasi tertentu
 */
export async function getSiteConfig(workspaceId: string, appId?: string | null) {
  if (!db) return null;
  
  try {
    const results = await db
      .select()
      .from(siteConfig)
      .where(
        and(
          eq(siteConfig.workspaceId, workspaceId),
          appId ? eq(siteConfig.appId, appId) : isNull(siteConfig.appId)
        )
      )
      .limit(1);
      
    return results[0] || null;
  } catch (error) {
    console.error("Failed to fetch site config:", error);
    return null;
  }
}

/**
 * Memperbarui konfigurasi situs (termasuk tema)
 */
export async function updateSiteConfig(workspaceId: string, data: {
  theme?: any;
  name?: string;
  logo?: string;
  imagekitPublicKey?: string;
  imagekitPrivateKey?: string;
  imagekitUrlEndpoint?: string;
  aiProvider?: string;
  aiApiKey?: string;
  aiBaseUrl?: string;
  aiModelId?: string;
  landingPage?: any;
}, appId?: string | null) {
  if (!db) return { success: false, error: "Database not connected" };

  try {
    const existing = await getSiteConfig(workspaceId, appId);

    if (existing) {
      await db
        .update(siteConfig)
        .set({
          ...data,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(siteConfig.workspaceId, workspaceId),
            appId ? eq(siteConfig.appId, appId) : isNull(siteConfig.appId)
          )
        );
    } else {
      const crypto = await import("crypto");
      await db.insert(siteConfig).values({
        id: crypto.randomUUID(),
        workspaceId,
        appId: appId || null,
        ...data,
      });
    }
    
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    console.error("Failed to update site config:", error);
    return { success: false, error: "Failed to update database" };
  }
}
