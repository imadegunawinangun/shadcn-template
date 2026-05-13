"use server"

import { db, webhook as webhookTable, webhookDelivery, eq, and, desc } from "@workspace/database"
import { revalidatePath } from "next/cache"
import { getAllRegisteredEvents } from "./registry";

const MOCK_WEBHOOKS = [
  {
    id: "wh_demo_1",
    name: "Stripe Payment Hook",
    url: "https://api.myapp.com/webhooks/stripe",
    type: "incoming",
    status: "active",
    secret: "whsec_demo123456789",
    events: "payment.succeeded,payment.failed",
    createdAt: new Date().toISOString()
  },
  {
    id: "wh_demo_2",
    name: "Slack Alert Hook",
    url: "https://hooks.slack.com/services/...",
    type: "outgoing",
    status: "active",
    secret: "whsec_slack987654321",
    events: "user.created",
    createdAt: new Date().toISOString()
  }
];

export async function getAvailableEvents() { 
  return getAllRegisteredEvents(); 
}

export async function getWebhooks(workspaceId: string) {
  if (!db) {
    console.log("🛠️ DEMO MODE: Returning mock webhooks");
    return MOCK_WEBHOOKS;
  }
  return await db.query.webhook.findMany({
    where: eq(webhookTable.workspaceId, workspaceId),
    orderBy: (webhook, { desc }) => [desc(webhook.createdAt)],
  })
}

export async function createWebhook(workspaceId: string, data: any) {
  const id = data.id || Math.random().toString(36).substring(7);
  const secret = data.secret || `whsec_${Math.random().toString(36).substring(2, 15)}`;
  
  if (!db) {
    console.log("🛠️ DEMO MODE: Simulating webhook creation");
    return { ...data, id, secret, workspaceId, status: "active", createdAt: new Date().toISOString() };
  }

  const [newWb] = await db.insert(webhookTable).values({
    ...data,
    id,
    secret,
    workspaceId,
    status: "active",
  }).returning();
  revalidatePath("/dashboard/automation");
  return newWb;
}

export async function updateWebhook(id: string, data: any) {
  if (!db) {
    console.log("🛠️ DEMO MODE: Simulating webhook update");
    return { id, ...data, updatedAt: new Date().toISOString() };
  }
  
  const [updated] = await db.update(webhookTable).set(data).where(eq(webhookTable.id, id)).returning();
  revalidatePath("/dashboard/automation");
  return updated;
}

export async function deleteWebhook(id: string) {
  if (!db) return;
  await db.delete(webhookTable).where(eq(webhookTable.id, id));
  revalidatePath("/dashboard/automation");
}

export async function rotateWebhookSecret(id: string) {
  const newSecret = `whsec_${Math.random().toString(36).substring(2, 15)}`;
  if (!db) return newSecret;
  
  await db.update(webhookTable).set({ secret: newSecret }).where(eq(webhookTable.id, id));
  revalidatePath("/dashboard/automation");
  return newSecret;
}

export async function getWebhookDeliveries(workspaceId: string, limit = 10) {
  if (!db) return [
    { id: "del_1", webhookId: "wh_demo_1", status: 200, createdAt: new Date().toISOString(), payload: { event: "payment.succeeded" } },
    { id: "del_2", webhookId: "wh_demo_1", status: 500, createdAt: new Date().toISOString(), payload: { event: "payment.failed" } }
  ];
  
  return await db.query.webhookDelivery.findMany({
    orderBy: (webhookDelivery, { desc }) => [desc(webhookDelivery.createdAt)],
    limit: limit,
  })
}
