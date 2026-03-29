# Hosty

A platform for finding and booking venues.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, TypeScript, TanStack Router/Query/Form, Zustand, shadcn/ui, Tailwind CSS |
| Backend | NestJS 11, TypeScript (strict), Passport JWT, class-validator, Swagger |
| Database | PostgreSQL 16 via Prisma 7 |
| Infrastructure | AWS (Cognito, RDS, S3, SES, CloudFront), Terraform |

See [`docs/tech-stack.md`](docs/tech-stack.md) for the full architecture reference.

---

## Prerequisites

- **Node.js** 22+
- **pnpm** 10+ — `npm install -g pnpm`
- **Docker** (for the local database)

---

## Getting Started

### 1. Clone and install

```bash
git clone <repo-url>
cd hosty

# Install frontend dependencies
cd frontend && pnpm install

# Install backend dependencies
cd ../backend && pnpm install
```

### 2. Configure environment

```bash
cd backend
cp .env.example .env
# Edit .env if needed (defaults work for local Docker setup)
```

### 3. Start the database

```bash
cd backend
docker compose up -d
```

### 4. Run Prisma migrations

```bash
cd backend
npx prisma migrate dev --name init
```

### 5. Start both servers

```bash
# Terminal 1 — backend (http://localhost:3000)
cd backend && pnpm start:dev

# Terminal 2 — frontend (http://localhost:5173)
cd frontend && pnpm dev
```

- **Frontend:** http://localhost:5173
- **API docs (Swagger):** http://localhost:3000/api/docs

---

## Project Structure

```
hosty/
├── frontend/          # React SPA (Vite)
│   └── src/
│       ├── routes/    # File-based routes (TanStack Router)
│       ├── features/  # Feature modules (screaming architecture)
│       ├── shared/    # Cross-cutting utilities
│       └── components/ui/  # shadcn/ui components
│
├── backend/           # NestJS REST API
│   ├── src/
│   │   ├── common/    # Shared infrastructure (DB, filters, interceptors)
│   │   └── <feature>/ # Feature modules (added as needed)
│   └── prisma/        # Database schema and migrations
│
└── docs/              # Architecture documentation
```

### Screaming Architecture

Each feature lives in its own self-contained folder. The name of the folder immediately communicates what the app does:

**Frontend** — `src/features/<feature>/`
```
venues/
├── api/            # TanStack Query hooks + raw API calls
├── components/     # React components for this feature
├── hooks/          # Feature-specific custom hooks
├── schemas/        # Zod validation schemas
├── stores/         # Zustand store (UI state only)
├── types/          # TypeScript interfaces
└── index.ts        # Public barrel export
```

**Backend** — `src/<feature>/`
```
venues/
├── venues.module.ts
├── venues.controller.ts   # HTTP handlers
├── venues.service.ts      # Business logic
├── dto/                   # Input validation (class-validator)
└── entities/              # Swagger response types
```

> **Rule:** A feature module never imports from another feature's internal files — only through its public `index.ts` (frontend) or NestJS module `exports` (backend).

---

## Adding a New Feature

### Frontend

1. Create `src/features/<name>/` with the structure above
2. Add your route file at `src/routes/<name>/index.tsx` (or `$id.tsx`)
3. Import components from the feature in the route file

### Backend

```bash
cd backend
npx @nestjs/cli generate module <name>
npx @nestjs/cli generate controller <name>
npx @nestjs/cli generate service <name>
```

Then register the module in `app.module.ts`.

---

## Available Scripts

### Frontend (`frontend/`)

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start dev server with HMR |
| `pnpm build` | Type-check and build for production |
| `pnpm lint` | Run ESLint |
| `pnpm preview` | Preview the production build |

### Backend (`backend/`)

| Command | Description |
|---------|-------------|
| `pnpm start:dev` | Start with watch mode |
| `pnpm build` | Compile TypeScript |
| `pnpm test` | Run unit tests |
| `pnpm test:e2e` | Run end-to-end tests |
| `pnpm lint` | Run ESLint |

### Prisma

| Command | Description |
|---------|-------------|
| `npx prisma migrate dev --name <description>` | Create and apply a new migration |
| `npx prisma generate` | Regenerate the Prisma client after schema changes |
| `npx prisma studio` | Open the Prisma database browser |

### Adding shadcn/ui components

```bash
cd frontend
pnpx shadcn@latest add button
pnpx shadcn@latest add card dialog
```

---

## Environment Variables

See `backend/.env.example` for the full list. Key variables:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `FRONTEND_URL` | Allowed CORS origin |
| `NODE_ENV` | `development` or `production` |
| `AWS_REGION` | AWS region (for Cognito JWT validation) |
| `COGNITO_USER_POOL_ID` | Cognito User Pool ID |
