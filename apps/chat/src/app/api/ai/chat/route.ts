import { handleAiChat } from "@workspace/ai-sdk/server";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  let userId: string | null = null;
  try {
    const authResult = await auth();
    userId = authResult?.userId || null;
  } catch (error) {
    // Toleran jika Clerk belum dikonfigurasi di apps/chat
    console.warn("Clerk auth not configured or failed, using environment variables fallback.");
  }
  return handleAiChat(req, userId);
}
