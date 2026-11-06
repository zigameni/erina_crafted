/**
 * Admin credential check.
 *
 * Credentials come from the environment so no password ever lives in the
 * repository. Swap this file for a database lookup (with a hashed password)
 * when moving beyond a single administrator.
 */

const encoder = new TextEncoder();

function constantTimeEqual(a: string, b: string): boolean {
  const left = encoder.encode(a);
  const right = encoder.encode(b);

  // Compare over the longer length so the loop count does not reveal which
  // side was shorter; the length difference is folded into the result.
  const length = Math.max(left.length, right.length);
  let mismatch = left.length ^ right.length;

  for (let index = 0; index < length; index += 1) {
    mismatch |= (left[index] ?? 0) ^ (right[index] ?? 0);
  }

  return mismatch === 0;
}

export function getAdminUsername(): string | null {
  const username = process.env.ADMIN_USERNAME?.trim();
  return username ? username.toLowerCase() : null;
}

export function isCredentialsConfigured(): boolean {
  return Boolean(
    getAdminUsername() && process.env.ADMIN_PASSWORD && process.env.ADMIN_PASSWORD.length > 0,
  );
}

export function checkAdminCredentials(username: unknown, password: unknown): boolean {
  const expectedUsername = getAdminUsername();
  const expectedPassword = process.env.ADMIN_PASSWORD;

  if (!expectedUsername || !expectedPassword) return false;
  if (typeof username !== "string" || typeof password !== "string") return false;

  const usernameMatches = constantTimeEqual(username.trim().toLowerCase(), expectedUsername);
  const passwordMatches = constantTimeEqual(password, expectedPassword);

  return usernameMatches && passwordMatches;
}
