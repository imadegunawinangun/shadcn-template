import { NextResponse } from "next/server";
import { runWorkflow } from "@workspace/automation";

export async function POST(req: Request) {
  try {
    const userData = await req.json();

    // 1. Simulasi mengambil data Workflow dari database
    // Di dunia nyata, Anda akan mengambil ini dari Prisma berdasarkan Trigger
    const welcomeWorkflow = {
      id: "wf_welcome_01",
      name: "User Welcome Automation",
      status: "Active",
      actions: [
        { id: "send_email", label: "Send Welcome Email" },
        { id: "slack_notify", label: "Notify Team on Slack" },
        { id: "database_update", label: "Mark User as Onboarded" }
      ]
    };

    console.log("-----------------------------------------");
    console.log("🚀 [API] Menerima pendaftaran user baru:", userData.email);

    // 2. Jalankan Workflow Engine
    // Ini akan menjalankan semua aksi di atas secara berurutan
    await runWorkflow(welcomeWorkflow, userData);

    console.log("✅ [API] Semua otomatisasi selesai dijalankan.");
    console.log("-----------------------------------------");

    return NextResponse.json({ 
      success: true, 
      message: "Workflow executed. Check server logs for details.",
      executedActions: welcomeWorkflow.actions.map(a => a.label)
    });

  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to run workflow" }, { status: 500 });
  }
}
