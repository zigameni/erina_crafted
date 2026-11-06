import { NextResponse, type NextRequest } from "next/server";

import {
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  createSessionToken,
  safeRedirectTarget,
} from "@/lib/auth";
import { checkAdminCredentials, isCredentialsConfigured } from "@/lib/credentials";
import { consumeLoginAttempt, getClientKey, resetLoginAttempts } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const INVALID_CREDENTIALS = "Invalid username or password.";

export async function POST(request: NextRequest) {
  if (!isCredentialsConfigured()) {
    console.error("[auth] ADMIN_USERNAME / ADMIN_PASSWORD are not configured.");
    return NextResponse.json(
      { error: "Admin sign-in is not configured on this server." },
      { status: 503 },
    );
  }

  const clientKey = getClientKey(request);
  const limit = consumeLoginAttempt(clientKey);

  if (!limit.allowed) {
    return NextResponse.json(
      { error: `Too many attempts. Try again in ${limit.retryAfterSeconds}s.` },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } },
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { username, password, next } = (body ?? {}) as Record<string, unknown>;

  if (typeof username !== "string" || typeof password !== "string" || !username || !password) {
    return NextResponse.json(
      { error: "Username and password are required." },
      { status: 400 },
    );
  }

  if (!checkAdminCredentials(username, password)) {
    return NextResponse.json({ error: INVALID_CREDENTIALS }, { status: 401 });
  }

  let token: string;

  try {
    token = await createSessionToken({ sub: username.trim().toLowerCase(), role: "admin" });
  } catch (error) {
    console.error("[auth] Could not create session token:", error);
    return NextResponse.json(
      { error: "Session signing is not configured on this server." },
      { status: 503 },
    );
  }

  resetLoginAttempts(clientKey);

  const response = NextResponse.json({
    ok: true,
    redirectTo: safeRedirectTarget(next),
  });

  response.cookies.set({
    name: SESSION_COOKIE,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });

  return response;
}
