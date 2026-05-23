// import { streamText } from 'ai';
// import { ProviderFactory } from '@workspace/ai-sdk/server';

export async function POST(req: Request) {
  return new Response(JSON.stringify({ error: "Deprecated in favor of new AI SDK implementation" }), { status: 501 });
}
