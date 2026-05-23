import { handleAiChat } from "@workspace/ai-sdk/server";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  const { userId } = await auth();
  return handleAiChat(req, userId);
}
