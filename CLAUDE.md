# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in the Hosty repository.

## Project Overview
**Hosty** is a platform for finding and booking venues. It is a monorepo containing a React frontend and a NestJS backend.

## Commands
All commands should be run using `pnpm`.

### Root
- `pnpm install` - Install all dependencies

### Backend (`backend/`)
- `pnpm --filter backend start:dev` - Watch mode (primary dev command)
- `pnpm --filter backend build` - Compile TypeScript to dist/
- `pnpm --filter backend test` - Run unit tests
- `pnpm --filter backend lint` - Run ESLint

### Frontend (`frontend/`)
- `pnpm --filter frontend dev` - Start dev server
- `pnpm --filter frontend build` - Type-check and build
- `pnpm --filter frontend lint` - Run ESLint

### Database (Prisma)
- `npx prisma migrate dev` - Create/apply migrations
- `npx prisma generate` - Regenerate Prisma client
- `npx prisma studio` - Open database browser

## Code Conventions
- **ESLint 9+** - Strict rules: `@typescript-eslint/no-explicit-any` is an error.
- **Prettier** - Single quotes, trailing commas (all).
- **TypeScript** - Strict mode enabled.
- **Screaming Architecture** - Feature-based folder structure (`src/features/<name>`).
