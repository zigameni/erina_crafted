# Ziga

A small, opinionated Next.js foundation: a public home page, an admin sign-in page and a
private dashboard, wired together with JWT sessions. Built to be reused as the starting
point for the next app.

```bash
bun install
bun run dev
```

Open http://localhost:3000. Sign in at `/zg-login` with the credentials from `.env.local`.

## Routes

| Route             | Access    | Notes                                                        |
| ----------------- | --------- | ------------------------------------------------------------ |
| `/`               | Public    | Home page, static.                                           |
| `/zg-login`       | Public    | Admin sign-in. Redirects to `/zg-admin` when already signed in. |
| `/zg-admin`       | JWT only  | Dashboard. Guarded by `proxy.ts` and re-checked server-side. |
| `/api/auth/login` | Public    | `POST { username, password, next? }` → sets session cookie.  |
| `/api/auth/logout`| Public    | `POST` → clears the session cookie.                          |
| `/api/auth/session` | Session | `GET` → `{ user }`, or `401` when not signed in.             |

## Environment

Copy `.env.example` to `.env.local` and change the values. `.env.local` is git-ignored.

```bash
ADMIN_USERNAME=admin
ADMIN_PASSWORD=change-me
JWT_SECRET=...   # openssl rand -base64 48
```

`JWT_SECRET` must be at least 32 characters. Rotating it invalidates every existing
session.

## How the auth works

1. `POST /api/auth/login` checks the credentials in constant time
   (`lib/credentials.ts`), throttles repeated failures (`lib/rate-limit.ts`) and signs a
   short-lived HS256 JWT with `jose` (`lib/auth.ts`).
2. The token is stored in an `HttpOnly`, `SameSite=Lax` cookie (named
   `ziga_admin_session`), `Secure` in production, valid for 8 hours.
3. `proxy.ts` verifies signature, issuer, audience and expiry on every request to
   `/zg-admin`. Anonymous requests are redirected to `/zg-login?next=…`; expired or
   tampered cookies are deleted.
4. `requireAdmin()` in `lib/session.ts` re-checks the session inside server components,
   so pages stay safe even if the guard is bypassed.
5. Signing out posts to `/api/auth/logout`, which clears the cookie.

## Structure

```
app/
  page.tsx                  public home
  zg-login/page.tsx         admin sign-in (server) + components/login-form.tsx (client)
  zg-admin/layout.tsx       protected shell + session guard
  zg-admin/page.tsx         dashboard overview
  api/auth/                 login, logout, session route handlers
components/                 brand mark, login form, sign-out button
lib/auth.ts                 JWT sign/verify, cookie name, redirect sanitising
lib/credentials.ts          env-driven admin credential check
lib/session.ts              server-side session helpers (next/headers)
lib/rate-limit.ts           in-memory login throttle
proxy.ts                    route guard for /zg-admin and /zg-login
```

## Reusing this in another app

- Keep `lib/auth.ts`, `lib/credentials.ts`, `lib/session.ts` and `proxy.ts`; adjust
  `SESSION_COOKIE`, `SESSION_MAX_AGE` and the matcher.
- Replace `checkAdminCredentials` with a database lookup and a hashed password
  (`argon2`/`bcrypt`) when you need more than one admin.
- The in-memory throttle is per process; swap it for a shared store (Redis/Upstash) on
  multi-instance hosting.
- Every authenticated mutation should still re-check the session server-side and scope
  data to `session.sub`.

## Scripts

```bash
bun run dev     # dev server (Turbopack)
bun run build   # production build
bun run start   # serve the production build
bun run lint    # ESLint
```
