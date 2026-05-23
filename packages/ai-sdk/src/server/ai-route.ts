import { streamText, tool, jsonSchema } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { db, userAiConfig, encryption } from "@workspace/database";
import { eq } from "drizzle-orm";

/**
 * Creates an AI chat handler.
 * Usage in Next.js App Router:
 * 
 * import { handleAiChat } from "@workspace/ai-sdk/server";
 * import { auth } from "@clerk/nextjs/server";
 * 
 * export async function POST(req: Request) {
 *   const { userId } = await auth();
 *   return handleAiChat(req, userId);
 * }
 */
export async function handleAiChat(req: Request, userId: string | null) {
  const { messages, webmcpTools } = await req.json();

  let decryptedKey = "";
  let baseURL: string | undefined = undefined;
  let modelId = "gpt-4-turbo";
  let provider = "openai";

  // Default Base URLs mapped by provider
  const DEFAULT_PROVIDER_BASE_URLS: Record<string, string> = {
    openai: "https://api.openai.com/v1",
    openrouter: "https://openrouter.ai/api/v1",
    google: "https://generativelanguage.googleapis.com/v1beta/openai/",
    deepseek: "https://api.deepseek.com",
    anthropic: "https://api.anthropic.com/v1",
    custom: "http://localhost:11434/v1"
  };

  // 1. Get User AI Config from Database if user is authenticated (BYOK)
  if (userId) {
    const [config] = await db.select().from(userAiConfig).where(eq(userAiConfig.userId, userId));
    if (config) {
      provider = config.provider || "openai";
      if (config.encryptedApiKey) {
        try {
          decryptedKey = encryption.decrypt(config.encryptedApiKey);
        } catch (err) {
          console.error("Failed to decrypt stored API Key:", err);
        }
      }
      baseURL = config.baseUrl || undefined;
      modelId = config.modelId || "gpt-4-turbo";
    }
  }

  // 2. Fallback to Environment Variables (System-wide configuration)
  if (!decryptedKey) {
    provider = process.env.OPENAI_PROVIDER || "openai";
    decryptedKey = process.env.OPENAI_API_KEY || "";
    baseURL = process.env.OPENAI_BASE_URL || undefined;
    modelId = process.env.OPENAI_MODEL_ID || "gpt-4-turbo";
  }

  // 3. Fallback baseURL to default provider URL if empty/undefined
  if (!baseURL && provider) {
    baseURL = DEFAULT_PROVIDER_BASE_URLS[provider];
  }

  if (!decryptedKey) {
    return new Response("AI API Key not configured. Please set up your API key in settings or define OPENAI_API_KEY in environment variables.", { status: 400 });
  }

  try {
    // 3. Initialize Custom Provider
    const openai = createOpenAI({
      apiKey: decryptedKey,
      baseURL: baseURL,
      compatibility: "compatible",
    });

    // 4. Map client-side WebMCP tools to Vercel AI SDK tools
    const serverTools: Record<string, any> = {};
    if (webmcpTools && typeof webmcpTools === "object") {
      for (const [name, def] of Object.entries<any>(webmcpTools)) {
        serverTools[name] = tool({
          description: def.description || `Execute ${name}`,
          parameters: def.parameters ? jsonSchema(def.parameters) : jsonSchema({ type: "object", properties: {} }),
        });
      }
    }

    // 5. Stream Response
    const result = streamText({
      model: openai(modelId),
      messages,
      tools: serverTools,
      system: `You are a helpful AI assistant integrated into the web application. You have access to client-side tools provided by WebMCP. When the user asks you to perform an action (such as changing the theme, starting a new chat, or clearing messages), you MUST invoke the appropriate tool immediately without any preamble, explanation, or polite remarks before the tool call. Do not say "I will clear the chat for you" or "Let me change the theme" first; just execute the tool call instantly. Once the tool returns a result, summarize or confirm the action concisely.`,
    });

    return result.toDataStreamResponse();
  } catch (error: any) {
    console.error("AI SDK Stream Error:", error);
    return new Response(error.message || "Internal Server Error", { status: 500 });
  }
}
