"use server";

import { db, userAiConfig, encryption, eq } from "@workspace/database";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function getUserAiConfigAction() {
  let userId: string | null = null;
  try {
    const authResult = await auth();
    userId = authResult?.userId || null;
  } catch (error) {
    console.warn("Clerk auth not available in getUserAiConfigAction");
  }

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
  let userId: string | null = null;
  try {
    const authResult = await auth();
    userId = authResult?.userId || null;
  } catch (error) {
    console.warn("Clerk auth not available in updateUserAiConfigAction");
  }

  if (!userId) {
    return { success: false, error: "Authentication required to save settings in database." };
  }

  try {
    const existing = await db.query.userAiConfig.findFirst({
      where: eq(userAiConfig.userId, userId),
    });

    let newEncryptedKey = existing?.encryptedApiKey;

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

    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("Error updating user AI config:", error);
    return { success: false, error: error.message || "Failed to save configuration" };
  }
}

const DEFAULT_PROVIDER_BASE_URLS: Record<string, string> = {
  openai: "https://api.openai.com/v1",
  openrouter: "https://openrouter.ai/api/v1",
  google: "https://generativelanguage.googleapis.com/v1beta/openai/",
  deepseek: "https://api.deepseek.com",
  anthropic: "https://api.anthropic.com/v1",
  custom: "http://localhost:11434/v1"
};

export async function fetchAvailableModelsAction(params: {
  provider: string;
  apiKey: string;
  baseUrl?: string;
}) {
  const { provider, apiKey, baseUrl } = params;
  let actualApiKey = apiKey;

  // 1. If key is placeholder, retrieve and decrypt it from DB
  if (apiKey === "********") {
    let userId: string | null = null;
    try {
      const authResult = await auth();
      userId = authResult?.userId || null;
    } catch (e) {
      console.warn("Clerk auth not available in fetchAvailableModelsAction");
    }

    if (userId) {
      const config = await db.query.userAiConfig.findFirst({
        where: eq(userAiConfig.userId, userId),
      });
      if (config && config.encryptedApiKey) {
        try {
          actualApiKey = encryption.decrypt(config.encryptedApiKey);
        } catch (err) {
          console.error("Failed to decrypt API Key for fetching models:", err);
          return { success: false, error: "Failed to decrypt API Key." };
        }
      }
    }
  }

  // 2. Fetch models from provider
  try {
    const url = baseUrl || DEFAULT_PROVIDER_BASE_URLS[provider];

    if (provider === "openrouter") {
      const fetchUrl = `${url || "https://openrouter.ai/api/v1"}/models`;
      const res = await fetch(fetchUrl);
      if (!res.ok) {
        throw new Error(`OpenRouter API returned status ${res.status}`);
      }
      const data = await res.json();
      if (data && Array.isArray(data.data)) {
        return { success: true, models: data.data.map((m: any) => m.id) };
      }
    } else if (provider === "openai") {
      if (!actualApiKey) return { success: true, models: [] };
      const fetchUrl = `${url || "https://api.openai.com/v1"}/models`;
      const res = await fetch(fetchUrl, {
        headers: { Authorization: `Bearer ${actualApiKey}` },
      });
      if (!res.ok) {
        throw new Error(`OpenAI API returned status ${res.status}`);
      }
      const data = await res.json();
      if (data && Array.isArray(data.data)) {
        const models = data.data
          .map((m: any) => m.id)
          .filter((id: string) => id.startsWith("gpt") || id.startsWith("o1") || id.startsWith("o3"));
        return { success: true, models };
      }
    } else if (provider === "deepseek") {
      if (!actualApiKey) return { success: true, models: [] };
      const fetchUrl = `${url || "https://api.deepseek.com"}/models`;
      const res = await fetch(fetchUrl, {
        headers: { Authorization: `Bearer ${actualApiKey}` },
      });
      if (!res.ok) {
        throw new Error(`DeepSeek API returned status ${res.status}`);
      }
      const data = await res.json();
      if (data && Array.isArray(data.data)) {
        return { success: true, models: data.data.map((m: any) => m.id) };
      }
    } else if (provider === "google") {
      if (!actualApiKey) return { success: true, models: [] };
      let fetchUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${actualApiKey}`;
      if (url && !url.includes("generativelanguage.googleapis.com")) {
        fetchUrl = `${url}/models`;
      }
      const res = await fetch(fetchUrl);
      if (!res.ok) {
        throw new Error(`Google API returned status ${res.status}`);
      }
      const data = await res.json();
      if (data && Array.isArray(data.models)) {
        return { success: true, models: data.models.map((m: any) => m.name.replace(/^models\//, "")) };
      }
    } else if (provider === "custom") {
      const fetchUrl = `${url || "http://localhost:11434/v1"}/models`;
      const headers: Record<string, string> = {};
      if (actualApiKey) {
        headers["Authorization"] = `Bearer ${actualApiKey}`;
      }
      const res = await fetch(fetchUrl, { headers });
      if (!res.ok) {
        throw new Error(`Custom API returned status ${res.status}`);
      }
      const data = await res.json();
      if (data && Array.isArray(data.data)) {
        return { success: true, models: data.data.map((m: any) => m.id) };
      } else if (data && Array.isArray(data.models)) {
        return { success: true, models: data.models.map((m: any) => m.name || m.model) };
      }
    }

    return { success: true, models: [] };
  } catch (err: any) {
    console.error(`Error fetching models for ${provider}:`, err);
    return { success: false, error: err.message || "Failed to fetch models." };
  }
}

