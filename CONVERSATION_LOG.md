# Current Project Context
## Objective    — The Erina Crafted site is bilingual with Albanian as the default language at `/` and English at `/en`; every string and image lives in `content/site.<locale>.json`, and the admin panel edits all of it at `/zg-admin/content`.
## Previous Work
- Summary: Concept 01 was ported into Next.js, then made bilingual (English at `/`, Albanian at `/sq`) with every string, image and contact field moved into validated per-language JSON and editable from `/zg-admin/content`, including image thumbnails and real uploads stored in `public/uploads`.
- Archive:  conversation_archive/2026-11-06_albanian-default.md  (earlier: `2026-11-06_i18n-content-editor.md`, `2026-11-06_design-direction-chosen.md`, `2026-11-06_ziga-base-git.md`, `2026-11-06_nextjs-auth-base.md`)
## In Progress  — Switching the default language to Albanian (`/` = sq, `/en` = English).
## Completed    — (previous feature complete — see the archive)
## Pending      — Real copy, real photography, real contact details; mobile-menu labelling; a commit.
## Decisions    — Content model is a validated JSON document per locale, so a language is one file plus one route. The editor submits the whole document as JSON to a server action that re-validates before writing; writes go through a temp file + rename. Uploads live in `public/uploads`, one file per language and image spot.
## Constraints — No invented projects, locations or credentials: placeholders stay flagged in the copy. Never read or print `.env.local`. No AI attribution in commits.
## Problems     — This browser reports `prefers-reduced-motion: reduce`, so parallax and the reveal cascade remain verified only on their no-motion path.

## 2026-11-06 22:40
### USER
Make Albanian the default language.

### ASSISTANT
- Albanian now serves the root: `DEFAULT_LOCALE` is `"sq"`, `app/page.tsx` renders the Albanian document, and English moved from `/sq` to `/en` (`app/en/page.tsx`).
- Added `LOCALE_PATHS` to `lib/content.ts` so canonicals, `hreflang` alternates, the editor's preview link, the language tabs and `revalidatePath` all take paths from one place. The language switch hrefs swapped in both content files (`sq` → `/en`, `en` → `/`), and `next.config.ts` permanently redirects the old `/sq` to `/`.
- Admin editor: the default tab is Shqip at `/` and English at `/en`; the save action maps any non-`en` value to the default locale and revalidates both pages. `<html lang>` is now `sq`, with `lang="en"` on the admin and sign-in shells because that UI stays English.
- Verified: `/` renders Albanian — `lang="sq"`, Albanian title, canonical `/`, alternates sq `/` and en `/en`, header switch to `/en` labelled English; `/en` renders English with the mirrored metadata and a switch back to `/` labelled Shqip; `/sq` → 308 to `/`; anonymous `/zg-admin/content` still 307s to sign-in; saved both documents from the editor, each wrote its own JSON file and redirected to `?lang=<locale>&saved=1`; `bun run lint` and `bun run build` clean with routes `/` and `/en`.
- Not verified: nothing new is unverified beyond the standing reduced-motion caveat.
- Next: real copy and photography, then a commit.
