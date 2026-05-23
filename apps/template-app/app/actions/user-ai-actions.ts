"use server";

import { db, userAiConfig, encryption, eq } from "@workspace/database";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function getUserAiConfigAction() {
  const { userId } = await auth();
  if (!userId) return null;

  try {
    const config = await db.query.userAiConfig.findFirst({
      where: eq(userAiConfig.userId, userId),
    });
    
    return {
      aiProvider: config?.provider || "",
      aiApiKey: config?.encryptedApiKey ? "********" : "", // Don't send real key to client
      aiBaseUrl: config?.baseUrl || "",
      aiModelId: config?.modelId || "",
    };
  } catch (error) {
    console.error("Error fetching user AI config:", error);
    return null;
  }
}

export async function updateUserAiConfigAction(data: {
  aiProvider?: string;
  aiApiKey?: string;
  aiBaseUrl?: string;
  aiModelId?: string;
}) {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "Unauthorized" };

  try {
    // Check existing to see if we need to update the key
    const existing = await db.query.userAiConfig.findFirst({
      where: eq(userAiConfig.userId, userId),
    });

    let newEncryptedKey = existing?.encryptedApiKey;

    // Only encrypt and save if a new key is provided (and it's not the placeholder)
    if (data.aiApiKey && data.aiApiKey !== "********") {
      newEncryptedKey = encryption.encrypt(data.aiApiKey);
    }

    if (existing) {
      await db.update(userAiConfig)
        .set({
          provider: data.aiProvider || "openai",
          baseUrl: data.aiBaseUrl || null,
          modelId: data.aiModelId || null,
          encryptedApiKey: newEncryptedKey,
          updatedAt: new Date(),
        })
        .where(eq(userAiConfig.userId, userId));
    } else {
      await db.insert(userAiConfig).values({
        userId,
        provider: data.aiProvider || "openai",
        baseUrl: data.aiBaseUrl || null,
        modelId: data.aiModelId || null,
        encryptedApiKey: newEncryptedKey || "",
      });
    }

    revalidatePath("/dashboard/settings");
    return { success: true };
  } catch (error: any) {
    console.error("Error updating user AI config:", error);
    return { success: false, error: error.message || "Failed to save configuration" };
  }
}
