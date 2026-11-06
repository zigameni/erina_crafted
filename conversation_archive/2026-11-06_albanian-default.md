# Current Project Context
## Objective    — The Erina Crafted site is bilingual (English at `/`, Albanian at `/sq`), every string and image lives in `content/site.<locale>.json`, and the admin panel can edit all of it at `/zg-admin/content`.
## Previous Work
- Summary: Concept 01 (Modern Luxury) was ported from the prototype into the Next.js app as `app/page.tsx` + `app/home.css` (scoped to `.erina`) + one imperative client island, on top of the existing JWT-guarded `/zg-admin`. Real copy and photography are still placeholders.
- Archive:  conversation_archive/2026-11-06_i18n-content-editor.md  (earlier: `2026-11-06_design-direction-chosen.md`, `2026-11-06_ziga-base-git.md`, `2026-11-06_nextjs-auth-base.md`)
## In Progress  — (none) i18n + content editor built and verified.
## Completed    — `content/site.en.json` / `content/site.sq.json` (full copy); `lib/content.ts` (types, `LOCALES`, `parseContent` validation, `getContent`, atomic `saveContent`); `components/home/home-page.tsx` (content-driven markup); `app/page.tsx` + `app/sq/page.tsx` (metadata, canonical, `alternates.languages`); `components/admin/content-form.tsx` (per-section editor, add/remove lists, colour swatches, sticky save bar); `app/zg-admin/content/page.tsx` (language tabs, banners); `app/zg-admin/content/actions.ts` (guarded server action + `revalidatePath`); `proxy.ts` stamps `x-admin-path`; admin nav/breadcrumb now path-aware; `.lang-switch` stays visible under 56rem; `.contact__details` line for optional phone/location.
## Pending      — Real copy, real photography, real contact details; mobile-menu labelling; a commit.
## Decisions    — Content model is a validated JSON document per locale, so adding a third language is one file plus one route. The editor submits the whole document as JSON to a server action that re-parses it with `parseContent` before writing, so the form can never persist an invalid shape; writes go through a temp file + rename. `HomePage` is a server component shared by both routes, so neither locale ships extra JS. The proxy passes the request path as `x-admin-path` rather than turning the admin shell into a client component.
## Constraints — No invented projects, locations or credentials: placeholders are flagged in the copy. Never read or print `.env.local`. No AI attribution in commits.
## Problems     — This browser reports `prefers-reduced-motion: reduce`, so parallax and the reveal cascade remain verified only on their no-motion path.

---

## 2026-11-06 21:10
### USER
Can the site be offered in Albanian too, with all texts in JSON, and contact details / images / works editable from the admin panel?

### ASSISTANT
- Added Arabic-script-free i18n by content file: `content/site.en.json` and `content/site.sq.json` hold every string, image URL, alt text, nav item, material swatch and contact field. `lib/content.ts` defines the types, validates untrusted JSON field-by-field (lengths, URL scheme, email, hex colour, list sizes) and writes atomically via temp file + rename.
- Split the page: `components/home/home-page.tsx` renders the design from content; `app/page.tsx` and `app/sq/page.tsx` only load content and build metadata (absolute title, canonical, `hreflang` alternates). `lang` is set on the wrapper, header and mobile menu both carry the language link, and the Albanian headline keeps its italic emphasis.
- Admin editor at `/zg-admin/content`: language tabs (English `/`, Shqip `/sq`), every section as a card (meta, brand/header, hero, practice, services, work, studio, contact, footer), add/remove for services, projects and materials, portrait-crop checkbox, colour pickers, live JSON in a hidden field, sticky save bar. Server action re-checks the session (`requireAdmin`), re-validates, writes, then `revalidatePath("/")`, `("/sq")` and the editor.
- Admin chrome: `proxy.ts` stamps `x-admin-path` so the layout can mark the active nav item and breadcrumb ("Content" vs "Overview") without becoming a client component; the dashboard's next-steps card now points at Content.
- Verified: `bun run lint` clean, `bun run build` clean — `/` and `/sq` prerender static, `/zg-admin/content` dynamic; anonymous `/zg-admin/content` → 307 to `/zg-login`; both locales render `lang`, canonical and `hreflang` alternates correctly with working language links; signed in as admin, filled phone/location and saved — the JSON file updated and `/` immediately rendered the new contact line; a bad Instagram URL was rejected with "Nothing was saved — contact.instagramUrl must start with…" and the file was left untouched; then restored the fields to empty and confirmed the line disappears from both locales; the Shqip tab loads the Albanian document.
- Not verified: the hero parallax and reveal cascade (browser reports reduced motion), and the admin editor below desktop width.
- Next: replace placeholder copy/photography and commit.

## 2026-11-06 22:05
### USER
Show a small image preview next to the admin URL fields; better, allow real uploads. Current images stay as defaults; an upload replaces the shown image, and uploading again deletes the previous one for that spot.

### ASSISTANT
- Added `lib/uploads.ts`: one file per language and image spot (`en-hero-…png`), 8 MB cap, JPEG/PNG/WebP/AVIF/GIF only, extension taken from the MIME type, spot names checked against a strict pattern. Writing a spot deletes the older file for the same language and spot; `pruneUploads` deletes uploads the saved content no longer references (a removed project, or a URL switched back to the default).
- `POST /api/admin/images`: session guard (401 JSON), cross-origin refusal (403), `{ok,url}` on success. Returns `/uploads/…`, which the existing `url()` validator already accepts, so nothing changed in the content model.
- The editor's image fields are now `ImageField`: thumbnail, editable URL and an "Upload image" button that posts a single file and writes the returned URL into the draft. Save still publishes the document; uploads alone change nothing on the site.
- Fixed during verification: the new image inputs had lost their accessible name; each now has a proper label.
- Verified: endpoint by curl — 401 signed out, replacement deletes the old file, 403 cross-origin, 400 wrong type, 400 bad spot, uploaded file served as `image/png`; editor renders 9 thumbnails, all loaded; a saved draft pointing at an uploaded file reached the JSON and `/`, and the file survived pruning; restoring the Unsplash URL pruned the orphan file and `public/uploads` is empty again. `bun run lint` and `bun run build` clean, `/api/admin/images` dynamic.
- Note: uploads live in `public/uploads` and are written at runtime, so they need a running Next server (dev or `next start`), not a static export. They are deliberately not gitignored — they are site content.
- Next: replace the placeholder photography, then commit.
