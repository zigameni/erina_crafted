import { NextResponse, type NextRequest } from "next/server";

import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";

const ADMIN_PREFIX = "/zg-admin";
const LOGIN_PATH = "/zg-login";

/**
 * Route guard for everything under /zg-admin.
 *
 * The JWT is verified here (no database round trip), so a request never
 * reaches an admin route without a valid, unexpired session.
 *
 * Next.js 16 calls this convention "proxy" — it replaced `middleware.ts`.
 */
export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = await verifySessionToken(token);

  if (pathname === LOGIN_PATH) {
    if (session) {
      return NextResponse.redirect(new URL(ADMIN_PREFIX, request.url));
    }
    return NextResponse.next();
  }

  if (!session) {
    const loginUrl = new URL(LOGIN_PATH, request.url);
    loginUrl.searchParams.set("next", `${pathname}${search}`);

    const response = NextResponse.redirect(loginUrl);

    // Drop an expired or tampered token so the browser stops sending it.
    if (token) {
      response.cookies.delete(SESSION_COOKIE);
    }

    return response;
  }

  // The admin shell marks the current section in its nav; a server component
  // cannot read the pathname, so the guard passes it along as a header.
  const forwarded = new Headers(request.headers);
  forwarded.set("x-admin-path", pathname);

  return NextResponse.next({ request: { headers: forwarded } });
}

export const config = {
  matcher: ["/zg-admin", "/zg-admin/:path*", "/zg-login"],
};
