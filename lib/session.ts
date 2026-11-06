import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { decodeJwt } from "jose";

import { SESSION_COOKIE, verifySessionToken, type AdminSession } from "@/lib/auth";

/**
 * Server-only session helpers for server components and route handlers.
 * `lib/auth.ts` stays edge-safe; this file may use `next/headers`.
 */

export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  return verifySessionToken(cookieStore.get(SESSION_COOKIE)?.value);
}

export type AdminSessionDetails = {
  session: AdminSession;
  issuedAt: Date | null;
  expiresAt: Date | null;
};

/** Session plus its JWT timestamps, for showing real state in the dashboard. */
export async function getAdminSessionDetails(): Promise<AdminSessionDetails | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  const session = await verifySessionToken(token);

  if (!session || !token) return null;

  const claims = decodeJwt(token);

  return {
    session,
    issuedAt: typeof claims.iat === "number" ? new Date(claims.iat * 1000) : null,
    expiresAt: typeof claims.exp === "number" ? new Date(claims.exp * 1000) : null,
  };
}

/**
 * Guards a server component. Middleware already blocks unauthenticated
 * requests; this check keeps the pages safe on their own as well.
 */
export async function requireAdmin(nextPath = "/zg-admin"): Promise<AdminSession> {
  const session = await getAdminSession();

  if (!session) {
    redirect(`/zg-login?next=${encodeURIComponent(nextPath)}`);
  }

  return session;
}
