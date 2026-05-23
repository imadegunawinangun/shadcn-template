import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  return NextResponse.json({ error: "Deprecated in favor of /api/ai/chat" }, { status: 501 });
}
