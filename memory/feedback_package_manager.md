---
name: Use npm in frontend (not pnpm)
description: User prefers npm for package installs in the frontend even though root workspace uses pnpm
type: feedback
---

Use `npm install` (not `pnpm`) when installing packages inside `frontend/`.

**Why:** User explicitly rejected pnpm and said to use npm instead.

**How to apply:** Run `npm install <pkg>` from `frontend/` dir (or `npm --prefix frontend install <pkg>` from root). Do NOT use `pnpm add` for frontend packages.
