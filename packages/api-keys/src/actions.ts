"use server"

import { db, apiKey, eq, desc } from "@workspace/database"
import { revalidatePath } from "next/cache"

const MOCK_KEYS = [
  { id: "key_demo_1", name: "Development Key", key: "sk_live_demo123...", createdAt: new Date().toISOString(), lastUsedAt: new Date().toISOString() },
  { id: "key_demo_2", name: "Production Key", key: "sk_live_demo987...", createdAt: new Date().toISOString(), lastUsedAt: null }
];

export async function getApiKeys(workspaceId: string) {
  if (!db) {
    console.log("🛠️ DEMO MODE: Returning mock API keys");
    return MOCK_KEYS;
  }
  return await db.query.apiKey.findMany({
    where: eq(apiKey.workspaceId, workspaceId),
    orderBy: [desc(apiKey.createdAt)]
  })
}

export async function createApiKey(workspaceId: string, name: string) {
  const id = `ak_${Math.random().toString(36).substring(7)}`;
  const key = `sk_live_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
  
  if (!db) {
    console.log("🛠️ DEMO MODE: Simulating API key creation");
    return { id, name, key, createdAt: new Date().toISOString() };
  }

  const [newKey] = await db.insert(apiKey).values({
    id,
    workspaceId,
    name,
    key, // In real app, hash this!
  }).returning();
  
  revalidatePath("/dashboard/automation");
  return newKey;
}

export async function deleteApiKey(id: string) {
  if (!db) return;
  await db.delete(apiKey).where(eq(apiKey.id, id));
  revalidatePath("/dashboard/automation");
}
