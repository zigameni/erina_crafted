import { NextResponse } from "next/server";

import { getAdminSession } from "@/lib/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Reusable session probe: any client (or a future mobile/other app) can ask
 * "who is signed in?" and get a 401 when the JWT is missing or expired.
 */
export async function GET() {
  const session = await getAdminSession();

  if (!session) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  return NextResponse.json(
    { user: session },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}
