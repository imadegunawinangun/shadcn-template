import { db, workflowLog, workflow as workflowTable, sql, eq } from "@workspace/database";

export function resolveTemplates(template: string, context: any) {
  if (typeof template !== "string") return template;
  return template.replace(/\{\{\s*([^}]+)\s*\}\}/g, (match, path) => {
    const value = path.trim().split('.').reduce((obj: any, key: string) => obj?.[key], context);
    return value !== undefined ? value : match;
  });
}

const MAX_RETRIES = 3;
const INITIAL_BACKOFF = 1000; 

export async function runWorkflow(workflow: any, triggerData: any, availablePieces: Record<string, any> = {}) {
  const logId = Math.random().toString(36).substring(7);
  console.log(`[Workflow Engine] [${logId}] Memulai eksekusi: ${workflow.name}`);
  
  if (workflow.status.toLowerCase() !== "active") return;

  await db.update(workflowTable)
    .set({ runs: sql`${workflowTable.runs} + 1` })
    .where(eq(workflowTable.id, workflow.id));

  let status = "success";
  let errorMsg = null;
  const stepLogs: any[] = [];
  const context = { triggerData, steps: {} as Record<string, any>, env: process.env };

  const nodes = workflow.flow?.nodes || [];
  const edges = workflow.flow?.edges || [];
  const executionOrder: any[] = [];
  const triggerNode = nodes.find((n: any) => n.type === 'trigger');
  
  if (triggerNode) {
    let currentId = triggerNode.id;
    while (currentId) {
      const edge = edges.find((e: any) => e.source === currentId);
      if (edge) {
        const nextNode = nodes.find((n: any) => n.id === edge.target);
        if (nextNode) { executionOrder.push(nextNode); currentId = nextNode.id; } 
        else { currentId = null; }
      } else { currentId = null; }
    }
  }

  for (const step of executionOrder) {
    const pieceId = step.data.id;
    const piece = availablePieces[pieceId];
    if (!piece) {
      errorMsg = `Piece ${pieceId} not found.`;
      status = "failed";
      break;
    }

    const resolvedConfig = {} as any;
    for (const [key, val] of Object.entries(step.data.config || {})) {
      resolvedConfig[key] = resolveTemplates(val as string, context);
    }

    let retryCount = 0;
    let success = false;
    let result = null;

    while (retryCount < MAX_RETRIES && !success) {
      try {
        result = await piece.run({ config: resolvedConfig, context });
        success = true;
      } catch (err: any) {
        retryCount++;
        if (retryCount >= MAX_RETRIES) { status = "failed"; errorMsg = err.message; break; }
        await new Promise(res => setTimeout(res, INITIAL_BACKOFF * Math.pow(2, retryCount)));
      }
    }

    if (status === "failed") break;
    context.steps[step.id] = result;
    stepLogs.push({ step: step.data.label, status: "success", output: result });
  }

  await db.insert(workflowLog).values({
    id: `log_${Date.now()}_${logId}`,
    workflowId: workflow.id,
    status,
    executedAt: new Date(),
    duration: 0,
    logs: JSON.stringify(stepLogs),
    error: errorMsg
  });
}
