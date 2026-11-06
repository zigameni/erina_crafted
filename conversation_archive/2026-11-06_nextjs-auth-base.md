# Current Project Context
## Objective    — Reusable Next.js foundation ("Ziga"): public home, JWT-protected admin dashboard and admin login.
## In Progress  — (none) Base release complete and verified.
## Completed    — Next.js 16 scaffold (TS + Tailwind v4), home page, /zg-login, /zg-admin dashboard, JWT auth layer (login/logout/session APIs), proxy guard, README, env example.
## Pending      — Git init + first commit (not requested yet); real content model for the dashboard; database-backed admins.
## Decisions     — Auth is a stateless HS256 JWT in an HttpOnly cookie (jose), 8h TTL, verified in `proxy.ts` (Next 16 renamed middleware → proxy) and re-checked server-side via `requireAdmin()`. Admin credentials come from env (constant-time compare), reached at /zg-login, dashboard at /zg-admin. Experimental `cacheComponents`/`partialPrefetching` flags removed so request-time cookie reads work without Suspense gymnastics. Design: dark warm palette with gold accent, Geist + Instrument Serif.
## Constraints — No AI attribution in commits (AGENTS.md). Keep auth modules edge/runtime-agnostic so they can be reused in other apps. Secrets live in .env.local only (git-ignored).
## Problems     — In-memory login throttle is per-process; fine for local/single instance only.

---

## 2026-11-06 11:30
### USER
Create a new Next.js application with 3 pages: home, admin dashboard, and admin login. Dashboard reachable only after login at /zg-admin. Login uses JWT. Basic version only — it will be saved and reused by other apps later.

### ASSISTANT
- Scaffolded Next.js 16.4.5 (App Router, TypeScript, Tailwind v4) with `create-next-app`, installed with Bun, added `jose`.
- Pages: `app/page.tsx` (public landing), `app/zg-login/page.tsx` + `components/login-form.tsx`, `app/zg-admin/layout.tsx` + `app/zg-admin/page.tsx` (protected shell + live session overview).
- Auth: `lib/auth.ts` (JWT sign/verify, cookie constants, redirect sanitising), `lib/credentials.ts` (env creds, constant-time compare), `lib/session.ts` (server session read/guard/details), `lib/rate-limit.ts` (login throttle), APIs `/api/auth/login|logout|session`, `proxy.ts` guard (migrated from `middleware.ts` after Next 16 deprecation warning).
- Config: `.env.example` + generated `.env.local` (admin / ziga-admin, random JWT_SECRET), simplified `next.config.ts`, README rewrite.
- Verified: `next build` OK (no deprecation warnings after proxy migration), ESLint clean, curl flow (anon 307 → login, bad creds 401, good creds 200 + cookie, dashboard 200, /zg-login with session → /zg-admin, session API 200/401, logout → 307, tampered token → login, subpath guard, open-redirect rejected, GET login → 405), real browser sign-in through the preview tab reached the dashboard.
- Dev server left running on http://localhost:62533 (registered in the preview panel).
- Next: git init/commit when requested; the base is built to be copied into future apps.
