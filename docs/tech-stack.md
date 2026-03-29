# SalonSpot — Tech Stack Reference

> **Last updated:** March 2026
> **Audience:** Development team, faculty reviewers, future contributors

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Frontend (`web/`)](#frontend-web)
3. [Backend (`api/`)](#backend-api)
4. [Infrastructure (`api/infra/`)](#infrastructure-apiinfra)
5. [How Everything Connects](#how-everything-connects)
6. [Glossary](#glossary)

---

## Architecture Overview

SalonSpot follows a **three-layer architecture** where each layer has a clear responsibility:

```
┌─────────────────────────────────────────────────────────────┐
│                        USERS (Browser)                      │
└────────────────────────────┬────────────────────────────────┘
                             │
                   ┌─────────▼──────────┐
                   │   AWS CloudFront   │  ← CDN (caches & serves frontend)
                   └─────────┬──────────┘
                             │
              ┌──────────────┼──────────────┐
              │                             │
    ┌─────────▼─────────┐       ┌───────────▼──────────┐
    │   Frontend (SPA)  │       │   Backend (REST API) │
    │   React + Vite    │──────▶│   NestJS 11          │
    │   web/            │       │   api/               │
    └───────────────────┘       └───────────┬──────────┘
                                            │
                           ┌────────────────┼────────────────┐
                           │                │                │
                  ┌────────▼──────┐  ┌──────▼──────┐  ┌─────▼─────┐
                  │  PostgreSQL   │  │   AWS S3    │  │ AWS SES   │
                  │  (via Prisma) │  │  (images)   │  │ (emails)  │
                  └───────────────┘  └─────────────┘  └───────────┘
```

- **Frontend** → What the user sees and interacts with (the web app).
- **Backend** → The server that processes requests, enforces rules, and talks to databases.
- **Infrastructure** → The cloud services that host, secure, and deliver everything.

---

## Frontend (`web/`)

The frontend is a **Single Page Application (SPA)** — a web app that loads once and updates dynamically without full-page reloads, creating a smooth user experience.

### Core Framework

| Technology     | Version | What it does                                                                                                                                                                                |
| -------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **React**      | 19+     | A JavaScript library for building user interfaces using reusable **components** (small, self-contained pieces of UI like buttons, cards, or forms).                                         |
| **Vite**       | 6+      | A build tool that bundles our code for production and provides an extremely fast development server with instant updates when you change a file (**Hot Module Replacement**).               |
| **TypeScript** | 5.x     | A superset of JavaScript that adds **static types** — meaning you declare what kind of data a variable holds (string, number, etc.) and the compiler catches mistakes before the code runs. |

> **Why React + Vite?**
> React is the most widely adopted UI library, which means extensive documentation, community support, and a rich ecosystem of tools. Vite replaces older bundlers like Webpack with significantly faster build times — local dev startup goes from seconds to milliseconds.

### Routing

| Technology          | What it does                                                                                                                                                                                                                                                          |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **TanStack Router** | Manages **client-side navigation** — when a user clicks a link, the app updates the URL and renders the correct page without contacting the server. Uses **file-based routing**, meaning each file inside a specific folder automatically becomes a route (URL path). |

**How file-based routing works:**

```
web/src/routes/
├── __root.tsx          → Layout wrapper (always rendered)
├── index.tsx           → /
├── login.tsx           → /login
├── venues/
│   ├── index.tsx       → /venues
│   └── $venueId.tsx    → /venues/:venueId (dynamic parameter)
```

> You don't need to manually define routes in a configuration file. The folder and file structure **is** the configuration. The `$` prefix indicates a **dynamic segment** — for example, `/venues/42` would match `$venueId.tsx` with `venueId = 42`.

### Data Fetching & Server State

| Technology         | What it does                                                                                                                                                                                                                                        |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **TanStack Query** | Handles all communication with the backend API. Manages **caching** (storing responses so repeated requests are instant), **automatic retries** on failure, **background refetching** (silently updating stale data), and **loading/error states**. |

> **Why not just use `fetch`?**
> Raw `fetch` calls don't manage cache, retries, or loading states. TanStack Query solves these problems declaratively — you describe _what data you need_, and it handles _how and when_ to get it.

**Example pattern:**

```typescript
// This hook fetches venue data, caches it, and provides loading/error states
const { data, isLoading, error } = useQuery({
  queryKey: ["venue", venueId], // Unique cache key
  queryFn: () => api.venues.getById(venueId), // The actual API call
});
```

### Forms & Validation

| Technology        | What it does                                                                                                                                                                                      |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **TanStack Form** | Manages form state (what the user typed), **field-level validation** (checking each input as the user types), submission handling, and error display.                                             |
| **Zod**           | A schema validation library. You define the **shape** of valid data (e.g., "email must be a string in email format, name must be at least 2 characters"), and Zod checks data against that shape. |

> **Why both?** TanStack Form manages the UI side of forms (tracking which fields are touched, when to show errors). Zod defines the validation **rules** themselves. They integrate together — TanStack Form uses Zod schemas as its validation engine.

**Example:**

```typescript
// 1. Define the rules with Zod
const CreateVenueSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  capacity: z.number().positive("Capacity must be a positive number"),
  email: z.string().email("Must be a valid email address"),
});

// 2. TanStack Form uses the schema to validate automatically
```

### Client State Management

| Technology  | What it does                                                                                                                                                                                                             |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Zustand** | A lightweight state management library for **client-only state** — data that doesn't come from the server but needs to be shared across components (e.g., UI preferences, the currently open modal, sidebar visibility). |

> **Important distinction:**
>
> - **Server state** (venue listings, user profiles) → managed by TanStack Query.
> - **Client state** (sidebar open/closed, selected filters) → managed by Zustand.
>
> Mixing these two concerns is a common source of bugs. Keeping them separate makes the codebase easier to reason about.

**Example:**

```typescript
// Define a store for UI state
const useUIStore = create((set) => ({
  isSidebarOpen: false,
  toggleSidebar: () =>
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
}));

// Use it in any component
const { isSidebarOpen, toggleSidebar } = useUIStore();
```

### UI Component Library

| Technology    | What it does                                                                                                                                                                                                                                                          |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **shadcn/ui** | A collection of pre-built, accessible, and customizable UI components (buttons, modals, dropdowns, date pickers, etc.). Unlike traditional component libraries, **shadcn/ui copies component source code into your project**, giving you full control to modify them. |

> **Why shadcn/ui instead of Material UI or Ant Design?**
>
> - You own the code — no dependency lock-in or breaking changes from library updates.
> - Built on top of **Radix UI** primitives, which handle accessibility (keyboard navigation, screen readers) correctly out of the box.
> - Styled with **Tailwind CSS**, which uses utility classes directly in HTML (`className="bg-blue-500 text-white p-4"`) rather than writing separate CSS files.

---

## Backend (`api/`)

The backend is a **REST API** — it exposes a set of URL endpoints that the frontend calls to read and write data (e.g., `GET /venues`, `POST /bookings`).

### Core Framework

| Technology     | Version      | What it does                                                                                                                                                                                                                                                                                                   |
| -------------- | ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **NestJS**     | 11           | A Node.js framework for building server applications. Organizes code into **modules** (self-contained feature units like `VenuesModule`, `BookingsModule`), each containing **controllers** (handle HTTP requests), **services** (business logic), and **providers** (dependencies like database connections). |
| **TypeScript** | 5.x (strict) | Same language as the frontend but with **strict mode** enabled — this turns on the most rigorous type-checking rules, catching more potential bugs at compile time.                                                                                                                                            |

> **Why NestJS?**
> Express.js (the most common Node.js framework) gives you maximum freedom but no structure. NestJS provides an **opinionated architecture** (modules, dependency injection, decorators) that keeps large codebases organized and testable. It's heavily inspired by Angular's architecture.

**How a NestJS module is organized:**

```
api/src/venues/
├── venues.module.ts       → Declares the module and its dependencies
├── venues.controller.ts   → Handles HTTP routes (GET /venues, POST /venues)
├── venues.service.ts      → Contains the business logic
├── dto/
│   ├── create-venue.dto.ts → Defines the shape of a "create venue" request body
│   └── update-venue.dto.ts → Defines the shape of an "update venue" request body
└── entities/
    └── venue.entity.ts     → Represents a venue in the database
```

### Database & ORM

| Technology         | Version | What it does                                                                                                                                                                                                           |
| ------------------ | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **PostgreSQL**     | 16      | A powerful, open-source **relational database**. Data is stored in tables with rows and columns, and relationships between tables are defined explicitly (e.g., a venue _has many_ bookings).                          |
| **Prisma**         | 7       | An **ORM** (Object-Relational Mapper) — it lets you interact with the database using TypeScript code instead of writing raw SQL. You define your data model in a schema file, and Prisma generates a type-safe client. |
| **Docker Compose** | —       | Runs PostgreSQL locally inside a **container** (an isolated environment), so every developer has the same database setup without installing PostgreSQL directly on their machine.                                      |

> **Prisma client location:** The generated client lives at `api/generated/prisma/`. This is auto-generated code — never edit it manually.

**Prisma workflow:**

```
1. Define your model in schema.prisma:

   model Venue {
     id        Int      @id @default(autoincrement())
     name      String
     capacity  Int
     bookings  Booking[]
     createdAt DateTime @default(now())
   }

2. Run migration:  npx prisma migrate dev --name add-venues

3. Use the generated client in your service:

   const venues = await this.prisma.venue.findMany({
     where: { capacity: { gte: 50 } },
     include: { bookings: true },
   });
```

### Authentication & Security

| Technology       | What it does                                                                                                                                                                                                       |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Passport.js**  | An authentication middleware for Node.js. Supports multiple strategies (ways to verify identity).                                                                                                                  |
| **passport-jwt** | A Passport **strategy** that validates JSON Web Tokens (JWTs). When a user logs in via Cognito, they receive a JWT. Every subsequent API request includes this token, and `passport-jwt` verifies it's legitimate. |
| **jwks-rsa**     | Fetches Cognito's **public keys** to verify that tokens were actually issued by our Cognito instance (not forged by an attacker).                                                                                  |
| **Helmet**       | Adds security-related HTTP headers to every response (e.g., preventing clickjacking, disabling MIME sniffing). A one-line setup that eliminates common web vulnerabilities.                                        |

> **Authentication flow:**
>
> 1. User logs in through AWS Cognito (frontend redirects to Cognito's hosted UI).
> 2. Cognito verifies credentials + MFA and issues a **JWT token**.
> 3. Frontend stores the token and sends it with every API request (`Authorization: Bearer <token>`).
> 4. Backend uses `passport-jwt` + `jwks-rsa` to verify the token on every request.
> 5. If valid → request proceeds. If invalid → `401 Unauthorized`.

### Validation & Transformation

| Technology            | What it does                                                                                                                                                                                       |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **class-validator**   | Validates incoming request data using **decorators** (annotations on class properties). For example, `@IsEmail()` on a field ensures the value is a valid email.                                   |
| **class-transformer** | Converts plain JSON objects (from HTTP requests) into typed class instances, and strips any unexpected properties. This prevents users from sending extra fields that could cause security issues. |

**Example DTO (Data Transfer Object):**

```typescript
// This class defines and validates the expected shape of a "create venue" request
export class CreateVenueDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsInt()
  @Min(1)
  capacity: number;

  @IsEmail()
  contactEmail: string;
}
```

> When a request arrives at `POST /venues`, NestJS automatically validates the body against this DTO. If validation fails, it returns a `400 Bad Request` with specific error messages — the controller code never runs with invalid data.

### Logging & Monitoring

| Technology       | What it does                                                                                                                                                                               |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **nest-winston** | Integrates the Winston logging library with NestJS. Produces **structured logs** (JSON format) that are machine-readable, making it easy to search and filter logs in production.          |
| **errsole**      | Provides a lightweight web-based **error console** for the backend. Useful during development to browse errors, stack traces, and request context without digging through terminal output. |

### API Documentation

| Technology            | What it does                                                                                                                                                                                                                                                                  |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Swagger / OpenAPI** | Auto-generates interactive API documentation from your code. Visit `/api/docs` during development to see every endpoint, its expected inputs, and responses — and test them directly from the browser. **Enabled in development only** (disabled in production for security). |

---

## Infrastructure (`api/infra/`)

Infrastructure refers to all the **cloud services and automation** that deploy, host, and secure the application in real environments.

### Authentication & User Management

| Service         | What it does                                                                                                                                                               |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **AWS Cognito** | Manages user registration, login, password recovery, and **Multi-Factor Authentication (MFA)**. We don't store passwords ourselves — Cognito handles all of that securely. |

> **Why not build our own auth?**
> Authentication is one of the hardest things to get right securely. Cognito handles password hashing, brute-force protection, MFA, token rotation, and compliance out of the box. Building this from scratch would take weeks and introduce security risks.

### Data Storage

| Service                | What it does                                                                                                                                                                                                         |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **AWS RDS PostgreSQL** | A managed PostgreSQL database hosted by AWS. "Managed" means AWS handles backups, patches, scaling, and failover — we focus on our data model and queries. Encrypted at rest with **KMS** (see below).               |
| **AWS S3**             | Object storage for files (venue images, documents). Configured with **SSE-KMS** (Server-Side Encryption using KMS keys) and **no public access** — files are served exclusively through CloudFront with signed URLs. |

### Content Delivery & Email

| Service            | What it does                                                                                                                                                                                                                                                                             |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **AWS CloudFront** | A **Content Delivery Network (CDN)** that distributes the frontend files from servers located worldwide. A user in Buenos Aires gets served from a nearby edge location instead of a distant data center, reducing load times significantly. Also serves as a reverse proxy for the API. |
| **AWS SES**        | **Simple Email Service** — sends transactional emails (booking confirmations, password resets, notifications) reliably at scale.                                                                                                                                                         |

### Security

| Service     | What it does                                                                                                                                                             |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **AWS KMS** | **Key Management Service** — manages encryption keys used to encrypt the database (RDS) and file storage (S3). Keys are rotated automatically and never exposed in code. |

### Infrastructure as Code

| Technology    | What it does                                                                                                                                                                                                                                                            |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Terraform** | Defines all cloud infrastructure in **code files** (`.tf`), so environments can be created, updated, and destroyed consistently and repeatably. Instead of clicking through the AWS console, you run `terraform apply` and the infrastructure is created automatically. |

> **Per-environment stacks:** We maintain separate Terraform configurations for `dev`, `staging`, and `prod`. Each environment has its own database, S3 bucket, and Cognito pool. This isolation prevents development changes from affecting production.

**Terraform project structure:**

```
api/infra/
├── modules/             → Reusable infrastructure components
│   ├── cognito/         → User pool configuration
│   ├── rds/             → Database configuration
│   ├── s3/              → Storage bucket configuration
│   └── ...
├── environments/
│   ├── dev/             → Dev-specific variables and state
│   ├── staging/         → Staging-specific variables and state
│   └── prod/            → Production-specific variables and state
└── main.tf              → Root module that composes everything
```

### CI/CD (Continuous Integration / Continuous Deployment)

| Technology         | What it does                                                                                                                                                                                         |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **GitHub Actions** | Automates the build, test, and deployment pipeline. When code is pushed to specific branches, workflows run automatically: linting, tests, building, and deploying to the corresponding environment. |

> **Per-environment workflows:**
>
> - Push to `develop` → deploys to **dev**
> - Push to `staging` → deploys to **staging**
> - Push to `main` → deploys to **production**

**What a typical CI/CD pipeline does:**

```
1. Code is pushed to GitHub
2. GitHub Actions triggers automatically
3. Install dependencies
4. Run linters (code style checks)
5. Run tests
6. Build the application
7. Run Prisma migrations
8. Deploy to the target environment
9. Run smoke tests (basic health checks)
```

---

## How Everything Connects

Here is a simplified flow of what happens when a user books a venue:

```
1. USER clicks "Book this venue" in the React app

2. FRONTEND
   → TanStack Form validates the booking data using Zod schema
   → TanStack Query sends a POST /bookings request with the JWT token

3. CLOUDFRONT
   → Routes the API request to the backend server

4. BACKEND (NestJS)
   → Helmet adds security headers
   → Passport validates the JWT against Cognito's public keys
   → class-validator checks the request body against CreateBookingDto
   → BookingsService runs the business logic
   → Prisma writes the booking to PostgreSQL (RDS)
   → nest-winston logs the operation

5. SIDE EFFECTS
   → AWS SES sends a confirmation email to the user
   → AWS SES sends a notification email to the venue owner

6. RESPONSE
   → Backend returns the created booking
   → TanStack Query caches the response and updates the UI
   → Zustand may update UI state (e.g., show success toast)
```

---

## Glossary

| Term          | Definition                                                                                                                                   |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| **SPA**       | Single Page Application — a web app that loads once and updates content dynamically.                                                         |
| **ORM**       | Object-Relational Mapper — translates between code objects and database tables.                                                              |
| **JWT**       | JSON Web Token — a compact, signed token used to prove a user's identity.                                                                    |
| **MFA**       | Multi-Factor Authentication — requires a second verification step (e.g., phone code) beyond the password.                                    |
| **CDN**       | Content Delivery Network — distributes content from servers close to users for faster loading.                                               |
| **IaC**       | Infrastructure as Code — managing cloud resources through code files instead of manual setup.                                                |
| **CI/CD**     | Continuous Integration / Continuous Deployment — automating the process of testing and deploying code.                                       |
| **DTO**       | Data Transfer Object — a class that defines the expected shape and validation rules for data entering the API.                               |
| **SSE-KMS**   | Server-Side Encryption with KMS — files are automatically encrypted when stored, using keys managed by AWS KMS.                              |
| **HMR**       | Hot Module Replacement — the dev server updates your app in real-time as you save files, without a full page reload.                         |
| **Decorator** | A special annotation (e.g., `@IsEmail()`) that adds metadata or behavior to a class or property. Used heavily in NestJS and class-validator. |

---

> **Note:** This document describes the planned architecture. Specific versions and configurations may evolve as the project progresses. Always refer to `package.json` and `terraform.tfstate` for exact versions in each environment.
