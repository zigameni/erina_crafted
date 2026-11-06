import { SignJWT, jwtVerify } from "jose";

/**
 * Shared JWT session primitives.
 *
 * This module is intentionally runtime-agnostic (it only depends on `jose` and
 * Web APIs) so the exact same verification code can run in the proxy, route
 * handlers and server components.
 */

export const SESSION_COOKIE = "ziga_admin_session";
export const SESSION_MAX_AGE = 60 * 60 * 8; // 8 hours, in seconds
export const SESSION_ISSUER = "ziga-admin";

export type AdminSession = {
  /** Admin identifier (username today, user id later). */
  sub: string;
  role: "admin";
};

const encoder = new TextEncoder();

function getSecretKey(): Uint8Array {
  const secret = process.env.JWT_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error(
      "JWT_SECRET is missing or too short. Set it to a random value of at least 32 characters (see .env.example).",
    );
  }

  return encoder.encode(secret);
}

export function isAuthConfigured(): boolean {
  const secret = process.env.JWT_SECRET;
  return typeof secret === "string" && secret.length >= 32;
}

export async function createSessionToken(session: AdminSession): Promise<string> {
  return new SignJWT({ role: session.role })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setSubject(session.sub)
    .setIssuer(SESSION_ISSUER)
    .setAudience(SESSION_ISSUER)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(getSecretKey());
}

/**
 * Verifies signature, issuer, audience and expiry.
 * Returns `null` for anything that is not a currently valid admin session.
 */
export async function verifySessionToken(
  token: string | undefined,
): Promise<AdminSession | null> {
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSecretKey(), {
      issuer: SESSION_ISSUER,
      audience: SESSION_ISSUER,
      algorithms: ["HS256"],
    });

    if (payload.role !== "admin" || typeof payload.sub !== "string") {
      return null;
    }

    return { sub: payload.sub, role: "admin" };
  } catch {
    return null;
  }
}

/** Only allow internal admin redirects, never an absolute or protocol-relative URL. */
export function safeRedirectTarget(candidate: unknown): string {
  if (typeof candidate !== "string") return "/zg-admin";

  if (!candidate.startsWith("/zg-admin")) return "/zg-admin";
  if (candidate.startsWith("//") || candidate.startsWith("/\\")) return "/zg-admin";

  return candidate;
}
