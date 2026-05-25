# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in the Hosty repository.

## Project Overview
**Hosty** is a marketplace for finding and booking event venues (salones) in Tucumán, Argentina.
Monorepo with a React frontend and a **Supabase** backend.

> The `backend/` folder (NestJS) is retained but **inactive**. All backend interactions go through Supabase.
> Do NOT add NestJS code or axios calls in `frontend/`.

## Stack

### Frontend (`frontend/`)
- **React 19** + Vite + TypeScript (strict)
- **Tailwind CSS v4** — brand tokens via CSS custom properties in `src/index.css`
- **shadcn/ui** — UI primitives (`src/components/ui/`). Add with: `npx shadcn@latest add <component>`
- **TanStack Router** (file-based, `src/routes/`) + **TanStack Query** v5
- **TanStack Form** + Zod for forms
- **Zustand** for client state (theme)
- **react-i18next** (ES primary, EN secondary)
- **lucide-react** for icons — always use `strokeWidth={1.5}` (Heroicons-equivalent outline style)

### Backend / BaaS
- **Supabase** — database, auth, storage
- Client: `src/shared/lib/supabase.ts` (typed with `database.types.ts`)
- Types: regenerate after schema changes with:
  ```
  npx supabase gen types typescript --project-id <ref> > frontend/src/shared/lib/database.types.ts
  ```

## Commands

### Frontend
```bash
npm --prefix frontend install          # install deps (use npm, not pnpm, for frontend)
npm --prefix frontend run dev          # start Vite dev server
npm --prefix frontend run build        # type-check + build
npm --prefix frontend run lint         # ESLint
npm --prefix frontend run typecheck    # tsc --noEmit
npm --prefix frontend run test         # Vitest
```

### Supabase CLI
```bash
supabase login                         # authenticate (interactive, opens browser)
supabase link --project-ref <ref>      # link local project
supabase db push                       # apply migrations
supabase gen types typescript ...      # regenerate database.types.ts
```

## Folder Conventions

```
frontend/src/
  features/<name>/
    components/   # React components for this feature
    api/          # useQuery / useMutation hooks (Supabase calls)
    types.ts      # TypeScript types for this feature
  components/
    layout/       # Header, Footer, RootLayout
    ui/           # shadcn primitives
  routes/         # TanStack Router file-based routes
  shared/
    lib/          # supabase.ts, database.types.ts, utils.ts
    store/        # Zustand stores
  i18n/           # i18next setup + locales
```

## Code Conventions
- **ESLint 9+** — strict; `@typescript-eslint/no-explicit-any` is an error.
- **Prettier** — single quotes, trailing commas (all).
- **TypeScript** — strict mode enabled.
- **Brand tokens** — always use CSS variable tokens (`bg-primary`, `text-foreground`, etc.), **never** raw hex values in JSX.
- **Icons** — `lucide-react` only; always add `strokeWidth={1.5}`.
- **No comments** — self-documenting names preferred; add a comment only when the WHY is non-obvious.

## Routes

| Path | Component |
|------|-----------|
| `/` | `HomePage` |
| `/salones` | `SalonesPage` (search + filters) |
| `/salones/:id` | `SalonDetailPage` |
| `/salones/:id/reservar` | `BookingFlow` |
