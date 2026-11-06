# Current Project Context
## Objective    — Design exploration for Erina Crafted: two HTML/CSS/JS home-page concepts (Modern Luxury and Creative Craftsmanship) plus a chooser page, to pick the direction for the real site.
## Previous Work
- Summary: Built the reusable Next.js base (home, JWT admin login, guarded /zg-admin), rebranded it from "erina" to "ziga", exported a copy to `workspace/templates/nextjs_home_login_dashboard`, and committed it to git on `main`.
- Archive:  conversation_archive/2026-11-06_ziga-base-git.md  (earlier: `2026-11-06_nextjs-auth-base.md`)
## In Progress  — Concept 01 chosen and back to its original footer. Ready to build 01 into the Next.js site.
## Completed    — `prototypes/index.html` chooser; `prototypes/erina-crafted/design-1-luxury/`; `prototypes/erina-crafted/design-2-creative/`; served locally on port 8123.
## Pending      — Build concept 01 into the real site as its home page (real copy, real photography, contact handling), keeping `/zg-login` and `/zg-admin`; commit `prototypes/`.
## Decisions    — Concepts are deliberately different: serif-led warm neutrals + large photography (01) vs editorial Fraunces/Archivo with terracotta-olive colour and asymmetric grids (02). Vanilla JS only, no build step, per the brief. Shared motion vocabulary follows the installed design skills: custom cubic-bezier tokens, transform/opacity only, hover gated behind `(hover: hover) and (pointer: fine)`, reduced-motion variants, one entrance per container. Direction confirmed: concept 01 (Modern Luxury) carries the production site. Concept 02's oversized closing wordmark was tried in 01's footer and rejected — on the paper palette it read as odd, so 01 keeps its quiet three-column footer.
## Constraints — No invented projects, locations or credentials: all copy is placeholder and flagged as such in the markup. Photography is temporary Unsplash imagery. Prototype files are not part of the Next.js app and must not affect it.
## Problems     — The preview panel renders ~720 CSS px wide, so full-width desktop pixels cannot be captured; desktop layout was verified by geometry instead.

---

## 2026-11-06 15:10
### USER
Use the new `prototypes/` folder to build two design prototypes for Erina Crafted (Modern Luxury and Creative Craftsmanship) with HTML/CSS/vanilla JS, fully responsive and interactive, plus a landing page to compare them. Design skills are installed at `C:\Users\Administrator\.claude\skills`.

### ASSISTANT
- Read the skills (`emil-design-eng`, `animate`, `choreograph`) and applied their motion rules.
- Curated photography by downloading and visually reviewing candidates; discarded the generic ones. All chosen image URLs return 200.
- Built `design-1-luxury`: fixed header that solidifies on scroll, full-bleed hero with parallax, sticky service list paired with a crossfading image column, asymmetric work grid, studio + material swatches, dark enquiry block, minimal footer.
- Built `design-2-creative`: editorial 12-column hero with overlapping stamp/chip, turn marquee, terracotta hover-fill service rows, asymmetric mosaic, sticky-indexed dark process section with active-step tracking, colour-swatch studio block, terracotta contact, outlined footer wordmark.
- Accessibility/polish: skip links, alt text, focus states, aria-expanded menus with Escape/focus return, keyboard parity on service rows, `prefers-reduced-motion`, contrast-adjusted tokens (`--muted`, `--gold`, `--terra`), typographic apostrophes.
- Verified in the browser: no console errors, all remote assets 200, no horizontal overflow at 1440 / 1100 / 720 / 390, mobile menus open/close, header scroll state, service-image pairing, process step activation, reveals firing. Stopped mid-review to fix lower-hero contrast; resumed and completed it.
- Served with `python -m http.server 8123 --bind 127.0.0.1 --directory prototypes` (PID 12860, log `proto-serve.log`).
- Next: pick a direction and develop it into the production site.

---

## 2026-11-06 18:30
### USER
Pointed at `C:\Users\Administrator\Downloads\erina_crafted-2ba575e7-a932-4be1-9f96-464f835431fb` (exported app data) and asked what could be recovered from it.

### ASSISTANT
- Inspected the folder: `project.json`, `desktop-v2.db` (+ `-wal`, `-shm`), `desktop-v2.db.browser.json`. It is this project's Freebuff desktop database, bound to the older path `workspace\erina_crafted` (this workspace is `erina_crafted_1`, different project id).
- Dumped the SQLite schema read-only: `threads`/`messages`/`queue_items` chat store plus FTS index.
- Result: 1 thread (`Nextjs Admin Dashboard With JWT Login`, started 11:07, last touched 18:22, model fbc/deepseek-slow) but **0 messages, 0 queue items, 0 FTS rows** and an empty WAL — the transcript was never written to this file, so no chat text was recoverable.
- History was instead recovered from this workspace: `CONVERSATION_LOG.md` + two archives, git log (3 commits, clean tree apart from the log, the newer archive and `prototypes/`), and `desktop-v2.db.browser.json`, whose history lists the visited URLs (prototypes on :8123, dashboard/login on :62533 / :50827).
- Verified current state: prototypes intact (7 files, 3,983 lines), no old servers listening (8123 / 56945 / 62533 / 50827 all closed), `prototypes/` and the git archive still uncommitted.
- Next: user picks a prototype direction; commit `prototypes/` + this log, then build the chosen concept into the real site.

---

## 2026-11-06 18:45
### USER
Restart the prototype server and show both designs side by side to pick one.

### ASSISTANT
- Restarted `python -m http.server 8123 --bind 127.0.0.1 --directory prototypes` (PID 10272, appending to `proto-serve.log`); all pages and assets return 200.
- Built `prototypes/compare.html`: both prototypes embedded in iframes at one shared CSS width, scaled to fit their pane, with viewport presets (1440 / 1100 / 768 / 390), proportional scroll sync (toggleable) and "open full" links per pane. Centres the frame when a narrow preset is smaller than its pane; stacks the panes below 56rem.
- Registered the preview at `http://127.0.0.1:8123/compare.html`.
- Bug found while testing: scroll sync ping-ponged (a 2000px scroll landed at 2601) because the echoed scroll event re-fired the other pane's handler and the proportional mapping is not reversible. First fix (time-based mute) still drifted. Final fix: each pane records the position written to it and ignores a scroll that lands there, so only real user scroll propagates.
- Verified in the browser: both iframes load at 1440 (scale 0.447) with no console errors, all images/fonts 200; presets resize the iframe's real innerWidth (1440/768/390) and centre it at 390; sync tracks and settles from either pane with 0.000 proportional drift; toggle off moves one pane only.
- Next: user picks a concept; commit `prototypes/` + log, then build the chosen direction into the Next.js site.

---

## 2026-11-06 19:05
### USER
Prefers concept 01 overall, but likes concept 02's ending with "Erina Crafted" in big letters.

### ASSISTANT
- Added `.site-foot__mark` to concept 01: oversized Cormorant wordmark as the last element of the footer, outlined rather than filled (`-webkit-text-stroke: 1px` at 28% ink, transparent fill, `@supports` fallback to a 15% ink fill) and sized in `vw` so it spans the page. The existing wordmark, nav and meta row are untouched above it.
- Hit a stale-cache problem while verifying: the browser kept serving the pre-edit HTML/CSS to the iframes, so the mark rendered as unstyled 16px text. `python -m http.server` sends only `Last-Modified`, which lets Chrome reuse a heuristic-fresh copy.
- Fixes: added `prototypes/serve.py` (static server sending `Cache-Control: no-store`; run `python prototypes/serve.py 8123`), and made `compare.html` load each iframe through a cache-busted URL so the panes always reflect disk. Restarted the server on :8123 with the new script and re-registered the preview.
- Verified in the browser: at 1440 the mark is 208px with a 1px outline and fits exactly (right edge 1423); 768 gives 111px, 390 gives 57px, none of the three widths overflow horizontally. Both panes left scrolled to their endings so the footers sit side by side.
- Not viewed as a rendered image — geometry, font-size, stroke and overflow were measured; the visual balance still needs the user's eye in the preview.
- Next: confirm the footer reads right, then build concept 01 into the Next.js app (home page replacing the current one, keeping `/zg-login` and `/zg-admin`), and commit `prototypes/`.

---

## 2026-11-06 19:20
### USER
The big text looked odd on the first design — remove it.

### ASSISTANT
- Reverted both halves of the change: removed the `site-foot__mark` element from concept 01's footer and deleted its CSS block (the `.site-foot` overflow rule, the mark rule and the `@supports` stroke override). Footer markup, CSS rule order and brace count are back to the originals (188/188).
- Verified: no `site-foot__mark` reference remains in HTML or CSS; the browser reports no mark in the document, footer overflow back to `visible`, footer height back to 170px and page height back to 5906px — the same numbers as before the wordmark was added. Stylesheet rule count is 144 again, so nothing else was disturbed.
- Kept the other two fixes from that round, since they are unrelated to the design: `prototypes/serve.py` (no-store static server) and the cache-busted iframe loading in `compare.html`.
- Next: build concept 01 into the Next.js site, keeping `/zg-login` and `/zg-admin`.
