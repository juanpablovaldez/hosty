---
title: "Anexo IV — API y Repositorio"
seccion: "A-IV"
orden: 20
tipo: anexo
tags: [hosty, informe-final, api, repositorio]
estado: con-pendientes
tablas: [T53, T54, T55]
updated: 2026-07-28
---

# Anexo IV. API y Repositorio

Hosty no expone una API propia documentada con Swagger o una colección de Postman: toda la capa
de datos se sirve a través de **PostgREST**, el componente de Supabase que autogenera una API REST
directamente a partir del esquema de Postgres (ver [[11-Arquitectura]]). El contrato de esa API es
el propio esquema de la base de datos, versionado como código en `supabase/migrations/*.sql`, y su
proyección tipada del lado del cliente es `frontend/src/shared/lib/database.types.ts`, generado con
`supabase gen types typescript`.

## Operaciones PostgREST por módulo

PostgREST expone, por cada tabla del esquema `public`, operaciones `GET` (con filtros como
`.eq()`, `.ilike()`, `.overlaps()`, `.range()`), `POST` (insert), `PATCH` (update) y `DELETE`,
además de proyección de relaciones anidadas vía claves foráneas. En lugar de listar el máximo
teórico por tabla, se cuentan las invocaciones reales de esas operaciones en el código del
frontend, módulo por módulo:

| Módulo | Invocaciones `select` | Invocaciones `insert` | Invocaciones `update` | Invocaciones `delete` | Total |
|---|---|---|---|---|---|
| `bookings` | 3 | 1 | 1 | 0 | 5 |
| `favorites` | 2 | 1 | 0 | 2 | 5 |
| `host` | 8 | 4 | 6 | 3 | 21 |
| `salones` | 4 | 0 | 0 | 0 | 4 |
| **Total** | **17** | **6** | **7** | **5** | **35** |

*Tabla 53 — Operaciones PostgREST por módulo.*

> [!info] Fuente — conteo propio con
> `grep -oE '\.(select|insert|update|delete|upsert|rpc)\(' frontend/src/features/<módulo>/api/*.ts`
> (2026-07-28). Los módulos `auth`, `home`, `profile` y `errors` no tienen carpeta `api/`: `auth`
> opera contra Supabase Auth (GoTrue), una API separada de PostgREST, y los otros tres no
> consultan tablas propias.

> [!todo] PLACEHOLDER P-39 — URL pública del documento OpenAPI de PostgREST
> PostgREST publica su propio documento OpenAPI en `{SUPABASE_URL}/rest/v1/` (encabezado
> `Accept: application/openapi+json`). Completar `{SUPABASE_URL}` con el valor real del proyecto de
> Supabase de producción antes de la entrega — no se expone aquí por no ser un dato público de este
> repositorio. Responsable: equipo. Destino: esta sección.

> [!todo] PLACEHOLDER P-40 — Colección Postman curada (si la cátedra la exige)
> Este informe documenta el contrato autogenerado de PostgREST como equivalente funcional de
> Swagger/Postman. Si la evaluación requiere una colección Postman curada manualmente, confeccionarla
> como seguimiento posterior a esta entrega. Responsable: equipo.

## Repositorio

| Campo | Valor |
|---|---|
| Repositorio | `https://github.com/juanpablovaldez/hosty` |
| Rama principal de integración | `dev` |
| Ramas de entorno | `main`, `staging`, `dev` |
| Convención de commits | Conventional Commits, forzada por `commitlint` (`@commitlint/config-conventional`) vía hook `commit-msg` de Husky |
| *Hook* de pre-commit | `npx lint-staged` (lint sobre `frontend/src/**/*.{ts,tsx}` antes de cada commit) |
| Estructura | Monorepo con *workspaces* de npm (`frontend` y `backend`); `backend` sigue declarado en `package.json` pese a haber sido eliminado del disco — ver la sección 15 (Conclusiones, Tabla 40) |

*Tabla 54 — Estructura del repositorio y convenciones de commits y ramas.*

> [!info] Fuente — `git remote -v`; `git branch -a` (2026-07-28): ramas locales `main`, `dev`,
> `staging`, además de ramas de features/fixes; `commitlint.config.js` y `.husky/commit-msg`.

## Workflows de CI/CD

| Workflow | Disparador | Jobs | Resultado |
|---|---|---|---|
| `frontend-tests.yml` | `pull_request` sobre paths `frontend/**` | Instala dependencias con pnpm y ejecuta `pnpm test run` (Vitest) | Bloquea el merge si algún test falla |
| `web-dev.yml` | `push` a `dev` sobre paths `frontend/**`; también `workflow_dispatch` | Build (`npm run build`), `aws s3 sync` al bucket de DEV, invalidación de CloudFront | Despliega el frontend a DEV (único ambiente desplegado, ver [[12-Testing-y-Calidad]]) |
| `infra-ci.yml` | `workflow_dispatch` (manual) | `terraform fmt -check`, `terraform init`, `terraform validate`, `terraform plan` sobre `infra/` | Valida cambios de infraestructura sin aplicarlos automáticamente |

*Tabla 55 — Workflows de CI/CD: disparador, jobs y resultado.*

> [!info] Fuente — M14: `ls .github/workflows` (2026-07-28); lectura directa de
> `frontend-tests.yml`, `web-dev.yml`, `infra-ci.yml`.

---
[[Indice|Índice]] · ← [[Anexo-III-Backlog-User-Stories]] · [[Anexo-V-Evidencias-QA]] →
