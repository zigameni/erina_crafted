/**
 * Small in-memory throttle for the login endpoint.
 *
 * Good enough for a single-process deployment or local use. On a
 * multi-instance host, replace the Map with a shared store (Redis, Upstash,
 * the platform's KV) using the same interface.
 */

type Bucket = { count: number; resetAt: number };

const WINDOW_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 8;

const buckets = new Map<string, Bucket>();

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
};

export function consumeLoginAttempt(key: string): RateLimitResult {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, remaining: MAX_ATTEMPTS - 1, retryAfterSeconds: 0 };
  }

  bucket.count += 1;

  if (bucket.count > MAX_ATTEMPTS) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
    };
  }

  return {
    allowed: true,
    remaining: MAX_ATTEMPTS - bucket.count,
    retryAfterSeconds: 0,
  };
}

/** Called after a successful login so a legitimate admin starts clean. */
export function resetLoginAttempts(key: string): void {
  buckets.delete(key);
}

export function getClientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]!.trim();
  }
  return request.headers.get("x-real-ip") ?? "unknown";
}
