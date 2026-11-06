AGENTS.md

# Purpose

**Read `CONVERSATION_LOG.md` before every task. Update it after every interaction.** It is the persistent memory of this project — do not rely on session history alone.

---

# 1. The Conversation Log

File: `CONVERSATION_LOG.md`. Create it if missing.

Keep a **Current Context block at the top**, followed by a chronological log of interactions below.

```
# Current Project Context
## Objective    — what we're building
## In Progress  — current task
## Completed    — done items
## Pending      — unfinished items
## Decisions    — key choices made
## Constraints  — things that must not change
## Problems     — known issues
```

Log every interaction using:

```
## YYYY-MM-DD HH:MM
### USER
<message>
### ASSISTANT
<response / actions taken>
```

Keep entries concise — summarise command output, never paste large blobs.

---

# 2. Starting a New Feature — Archive First

When the user starts a **new feature or major direction change**, archive the current log before creating a new one:

1. Move `CONVERSATION_LOG.md` → `conversation_archive/YYYY-MM-DD_<short-slug>.md`\
   Use today's date and a 2–4 word slug, e.g. `2026-11-06_user-auth.md`
2. Create a fresh `CONVERSATION_LOG.md` with this header:

```
# Current Project Context
## Objective    — <new feature>
## Previous Work
- Summary: <1–3 sentences describing what was built previously>
- Archive:  conversation_archive/YYYY-MM-DD_<short-slug>.md
```

The new log then proceeds normally from there.

---

# 3. Session Recovery

If context appears missing: read `CONVERSATION_LOG.md` → read the Context block → read recent entries → inspect relevant files → continue. Never tell the user context is unavailable without checking first.

---

# 4. Before & After Changes

**Before:** confirm current objective → identify constraints → plan the change. If it conflicts with a logged decision, resolve the conflict first — don't silently override.

**After:** record what changed, any errors, and what comes next. Only touch files relevant to the current task.

---

# 5. Instruction Priority

1. Latest explicit user instruction
2. Earlier user decisions not superseded
3. This `AGENTS.md`
4. Existing project conventions
5. Your own assumptions

When instructions conflict, explain and ask — do not guess destructively.

---

# 6. Git Commit Attribution

**Never add AI/bot/tool attribution to commits.** No `Co-Authored-By` trailers, no "Generated with …" lines. The only identity in commits is the user's configured git identity.

---

# 7. End-of-Response Check

```
[ ] Current objective understood
[ ] Log read and updated
[ ] Only relevant files touched
[ ] Previous decisions preserved
[ ] Next step recorded
[ ] No AI attribution in commits
```