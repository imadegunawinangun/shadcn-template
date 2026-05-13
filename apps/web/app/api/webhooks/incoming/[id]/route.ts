import { NextResponse } from "next/server";
import { runWorkflow, piecesMap as standardPieces } from "@workspace/workflows/src/lib/engine"; 
import { piecesMap as registryPieces } from "@workspace/workflows/src/pieces/registry";
import { db, webhook as webhookTable, webhookDelivery } from "@workspace/database";
import { eq } from "@workspace/database";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const signature = req.headers.get("x-webhook-secret"); // Mengambil secret dari header
  
  try {
    const payload = await req.json();
    
    // Cari konfigurasi webhook berdasarkan ID
    const webhookConfig = await db.query.webhook.findFirst({
      where: eq(webhookTable.id, id)
    });

    if (!webhookConfig) {
      return NextResponse.json({ error: "Webhook not found" }, { status: 404 });
    }

    // VERIFIKASI KEAMANAN: Cek apakah secret cocok
    if (webhookConfig.secret && signature !== webhookConfig.secret) {
      return NextResponse.json({ error: "Unauthorized: Invalid Signing Secret" }, { status: 401 });
    }

    // Cari workflow yang terhubung (berdasarkan triggerId atau id webhook)
    const workflows = await db.query.workflow.findMany({
      where: (wf, { eq, or }) => or(eq(wf.id, id), eq(wf.triggerId, id))
    });

    // Log pengiriman webhook
    await db.insert(webhookDelivery).values({
      id: `del_${Math.random().toString(36).substring(7)}`,
      webhookId: id,
      status: 200,
      payload,
    }).catch(err => console.error("Failed to log delivery:", err));

    // Jalankan semua workflow yang terhubung
    for (const wf of workflows) {
      runWorkflow(wf, payload, registryPieces).catch(err => {
        console.error(`Error running workflow ${wf.id}:`, err);
      });
    }

    return NextResponse.json({ 
      status: "success", 
      message: "Webhook processed",
      triggered: workflows.length 
    });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
