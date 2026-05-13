"use server"

import { db, workflow as workflowTable, workflowLog, eq, and, desc, sql } from "@workspace/database"
import { revalidatePath } from "next/cache"

// Data Contoh untuk Demo Mode
const MOCK_WORKFLOWS = [
  {
    id: "wf_demo_1",
    name: "Welcome Email Automation",
    status: "active",
    runs: 124,
    createdAt: new Date().toISOString(),
    triggerId: "manual",
    flow: { nodes: [], edges: [] }
  },
  {
    id: "wf_demo_2",
    name: "Slack Notification on Sale",
    status: "paused",
    runs: 45,
    createdAt: new Date().toISOString(),
    triggerId: "webhook",
    flow: { nodes: [], edges: [] }
  }
];

export async function getWorkflows(workspaceId: string) {
  if (!db) {
    console.log("🛠️ DEMO MODE: Returning mock workflows");
    return MOCK_WORKFLOWS;
  }
  return await db.query.workflow.findMany({
    where: eq(workflowTable.workspaceId, workspaceId),
    orderBy: [desc(workflowTable.createdAt)]
  })
}

export async function createWorkflow(data: { 
  workspaceId: string; 
  name: string; 
  triggerId: string; 
  actions: any[]; 
  flow: any;
}) {
  const id = `wf_${Math.random().toString(36).substring(7)}`;
  
  if (!db) {
    console.log("🛠️ DEMO MODE: Simulating workflow creation");
    return { ...data, id, status: "active", runs: 0, createdAt: new Date().toISOString() };
  }

  const [newWf] = await db.insert(workflowTable).values({
    id,
    workspaceId: data.workspaceId,
    name: data.name,
    triggerId: data.triggerId,
    status: "active",
    flow: data.flow,
    actions: data.actions || [],
    runs: 0
  }).returning();

  revalidatePath("/dashboard/automation");
  return newWf;
}

export async function updateWorkflow(id: string, data: any) {
  if (!db) {
    console.log("🛠️ DEMO MODE: Simulating workflow update");
    return { id, ...data, updatedAt: new Date().toISOString() };
  }
  
  const [updated] = await db.update(workflowTable)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(workflowTable.id, id))
    .returning();

  revalidatePath("/dashboard/automation");
  return updated;
}

export async function deleteWorkflow(id: string) {
  if (!db) return;
  await db.delete(workflowTable).where(eq(workflowTable.id, id));
  revalidatePath("/dashboard/automation");
}

export async function getWorkflowLogs(workspaceId: string, limit = 20) {
  if (!db) return [
    { id: "log_1", workflowId: "wf_demo_1", status: "success", executedAt: new Date().toISOString() },
    { id: "log_2", workflowId: "wf_demo_2", status: "failed", executedAt: new Date().toISOString() }
  ];
  
  return await db.select()
    .from(workflowLog)
    .orderBy(desc(workflowLog.executedAt))
    .limit(limit)
}
