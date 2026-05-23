// import { AIAgentOrchestrator } from '@workspace/ai-sdk/server';

export async function POST(req: Request) {
  return new Response(JSON.stringify({ error: "Deprecated in favor of /api/ai/chat" }), { status: 501 });
}
