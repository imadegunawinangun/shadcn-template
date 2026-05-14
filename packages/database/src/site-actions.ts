"use server"

import { db } from "./index";
import { siteConfig } from "./schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

/**
 * Mengambil konfigurasi situs untuk workspace tertentu dari database
 */
export async function getSiteConfig(workspaceId: string) {
  if (!db) return null;
  
  try {
    const results = await db
      .select()
      .from(siteConfig)
      .where(eq(siteConfig.workspaceId, workspaceId))
      .limit(1);
      
    return results[0] || null;
  } catch (error) {
    console.error("Failed to fetch site config:", error);
    return null;
  }
}

/**
 * Memperbarui konfigurasi situs untuk workspace tertentu (termasuk tema)
 */
export async function updateSiteConfig(workspaceId: string, data: {
  theme?: any;
  name?: string;
  logo?: string;
  imagekitPublicKey?: string;
  imagekitPrivateKey?: string;
  imagekitUrlEndpoint?: string;
}) {
  if (!db) return { success: false, error: "Database not connected" };

  try {
    // Cek apakah config sudah ada
    const existing = await getSiteConfig(workspaceId);

    if (existing) {
      await db
        .update(siteConfig)
        .set({
          ...data,
          updatedAt: new Date(),
        })
        .where(eq(siteConfig.workspaceId, workspaceId));
    } else {
      // Jika belum ada, buat baru (biasanya dilakukan saat pembuatan workspace)
      const crypto = await import("crypto");
      await db.insert(siteConfig).values({
        id: crypto.randomUUID(),
        workspaceId,
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
