# Current Project Context
## Objective    — Concept 01 (Modern Luxury) is now the real home page of the Next.js app, with `/zg-login` and the guarded `/zg-admin` still working.
## Previous Work
- Summary: Built a reusable Next.js base (home, JWT admin sign-in, guarded dashboard), rebranded it "ziga", exported a template copy, committed it. Then built two HTML/CSS/vanilla-JS home-page concepts for Erina Crafted, compared them side by side, and chose concept 01 — after trying and rejecting concept 02's oversized footer wordmark.
- Archive:  conversation_archive/2026-11-06_design-direction-chosen.md  (earlier: `2026-11-06_ziga-base-git.md`, `2026-11-06_nextjs-auth-base.md`)
## In Progress  — (none) Port complete and verified.
## Completed    — `app/page.tsx` (concept 01 markup, static prerender), `app/home.css` (design ported, scoped to `.erina`), `components/home/home-behavior.tsx` (client island), next/font for Cormorant Garamond + Jost, footer link to `/zg-login`.
## Pending      — Real copy, real photography (phone/email/location still placeholders), contact handling, and a commit.
## Decisions    — Design CSS is scoped under `.erina` so `globals.css` and the dark admin theme stay untouched; the home route's stylesheet is only shipped to that route. Behaviour lives in one imperative client island instead of making the whole marketing page a client component. Photography stays plain `<img>` with explicit aspect-ratio boxes while it is provisional — `next/image` is the follow-up once real files exist.
## Constraints — No invented projects, locations or credentials: placeholder copy is flagged in the markup. Secrets live in `.env.local` only. No AI attribution in commits.
## Problems     — This browser reports `prefers-reduced-motion: reduce`, so the hero parallax and the reveal cascade cannot be exercised here; only their no-motion path has been verified.

---

## 2026-11-06 19:40
### USER
Go with concept 01. Start implementing, and check the skills in `C:\Users\Administrator\.claude\skills`, though it is unclear which are useful.

### ASSISTANT
- Reviewed the 18 skills. Used `emil-design-eng` (motion decision rules, hover gating, `:active` feedback, stagger) and `animation-performance` (composite-only properties, avoid inherited CSS variables in scroll writes). The rest are not applicable here: `animate-expo`/`write-swift` (native/Swift), `ask-sonner` (toast library), `pick-ui-library`/`prototype`/`break-ui`/`find-skills` (invoked-only utilities), `animation-vocabulary`, `apple-design`, `mobile-native`, and the motion audit/removal skills.
- Ported concept 01: `app/page.tsx` as a server component with `metadata` (absolute title so the "· Ziga" template suffix is dropped), data arrays for services/projects/materials, and the prototype markup. `app/home.css` carries the design verbatim with every selector scoped to `.erina`; keyframes renamed `er-fade-up`/`er-cue`; added `@media (scripting: none)` so content is never left hidden without JS.
- Fonts switched from a Google Fonts `<link>` to `next/font/google` (Cormorant Garamond + Jost), so there is no render-blocking third-party request; variables land on the `.erina` wrapper only.
- Behaviour moved from `script.js` into `components/home/home-behavior.tsx` (one client island, teardown included). Two deliberate improvements over the prototype: the hero parallax writes `transform` straight to the `<img>` rather than setting `--hero-shift` on `.hero` (a variable there restyles every descendant on each scroll frame), and the mobile menu's `visibility` flips immediately on open instead of at 50% of the fade.
- Removed prototype chrome: "Concept 01 — Modern Luxury" labels, the "← All concepts" link. Added a "Staff sign in" link to `/zg-login` in the footer meta.
- Verified: `bun run lint` clean, `bun run build` clean (TypeScript included), `/` prerendered static, `/zg-admin` anonymous → 307 `/zg-login?next=%2Fzg-admin`, `/zg-login` → 200. In the browser: Cormorant/Jost resolved, paper `#f6f1e9` and ink `#2c251e` applied, 6 sections, 9 images all loaded, 4 service images, service 3 hover → image 3, header solidifies past 24px and returns at top, no horizontal overflow at 1440 or 390, projects full-width at 390, menu opens (aria-expanded, `hidden`, body lock), Escape closes and returns focus, nav link closes it and jumps, and `/zg-login` receives none of the home stylesheet.
- Could not verify: hero parallax and the reveal cascade, because this browser reports `prefers-reduced-motion: reduce` — the no-motion branch is what ran (reveals marked in immediately, parallax skipped). An auto-focus-into-menu attempt was removed rather than shipped unverified: focus stays on the trigger, and the panel is the next node in DOM order so Tab walks into it.
- Next: real copy and photography, contact handling, then commit.
