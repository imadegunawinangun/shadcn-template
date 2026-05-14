import { getAuthenticationParameters } from "@workspace/imagekit";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const authParameters = await getAuthenticationParameters();
    return NextResponse.json(authParameters);
  } catch (error) {
    console.error("ImageKit auth error:", error);
    return NextResponse.json({ error: "Failed to authenticate" }, { status: 500 });
  }
}
