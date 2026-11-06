# Current Project Context
## Objective    — Reusable Next.js base (now branded "Ziga"): public home, JWT-protected admin dashboard, admin login — packaged as a template for other projects.
## Previous Work
- Summary: Built the Next.js 16 app with home page, /zg-login, JWT-guarded /zg-admin, auth APIs and proxy guard; verified build, lint and the full auth flow.
- Archive:  conversation_archive/2026-11-06_nextjs-auth-base.md
## In Progress  — (none) Rebrand + template export complete.
## Completed    — Brand renamed erina → ziga everywhere (copy, cookie, issuer, package name, README, env). Project copied to workspace/templates/nextjs_home_login_dashboard with a fresh JWT_SECRET.
## Pending      — Register the template folder in whatever workflow the user uses for new projects; possible git init for the template copy.
## Decisions    — Placeholder brand is "ziga" until a real product name exists; no "erina" string may remain anywhere. Template copy excludes node_modules, .next, dev logs and this project's conversation log/archive.
## Constraints — AGENTS.md: log kept current; no AI attribution in commits. Auth modules stay dependency-light (jose + Web APIs only) so they can be lifted into other apps.
## Problems     — In-memory login throttle is per-process (fine for local, needs shared store when scaled).

---

## 2026-11-06 12:20
### USER
This is a template — remove "erina" everywhere and use "ziga" instead. Also copy the whole project to C:\Users\Administrator\Desktop\workspace\templates\nextjs_home_login_dashboard so it can be reused in other projects.

### ASSISTANT
- Renamed brand across source, docs and config: page copy, metadata titles, `SESSION_COOKIE` → `ziga_admin_session`, `SESSION_ISSUER` → `ziga-admin`, package name `ziga-crafted`, README, dev password.
- `grep -ri erina` now returns zero matches in the project and in the exported copy.
- Rebuilt: `bun install` (lockfile name synced) + `next build` pass; dev server restarted on the new env, old password → 401, new password → 200, `/zg-admin` renders with the renamed cookie.
- Exported to `templates/nextjs_home_login_dashboard` (244 KB, no node_modules/.next/logs, own `.env.local` with a fresh JWT_SECRET, credentials admin / ziga-admin); `diff -rq` against the source shows an exact match apart from the excluded files.
- Next: use the folder as the starting point for new apps.
