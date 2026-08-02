---
title: "Datos verificables — fuente única de métricas"
seccion: "meta"
tipo: meta
tags: [hosty, informe-final, metricas]
estado: completo
updated: 2026-08-02
---

# Datos verificables — fuente única de métricas

Esta nota es la fuente única de verdad para toda métrica citada en el vault. Cualquier nota del
informe que mencione una cifra debe citar el identificador `M##` correspondiente en un callout
`[!info] Fuente` y remitir aquí, sin repetir el comando ni el valor crudo. El esquema de
identificadores `M01`–`M22` fue fijado en la fase de diseño de este cambio y se reutiliza sin
modificaciones; los Lotes A–D deben citar estos mismos identificadores y no crear otros.

Todas las cifras de esta nota fueron reproducidas el 2026-07-28 ejecutando los comandos indicados
sobre el estado real del repositorio (`git`, `gh`, lectura de archivos). `M12` y `M13` se
re-verificaron en vivo porque el árbol de trabajo tenía archivos de prueba nuevos, sin confirmar
en un commit, respecto del momento en que se diseñó este cambio.

## Repositorio

| Dato | Valor | Fuente |
|---|---|---|
| URL | `https://github.com/juanpablovaldez/hosty` | `git remote -v` |
| Fecha de creación | 2026-03-29 | `gh repo view juanpablovaldez/hosty --json createdAt` |
| Rama de trabajo principal | `dev` | `git branch --show-current` |

## Tabla de métricas M01–M22

| ID | Métrica | Valor | Comando / fuente | Verificado el |
|---|---|---|---|---|
| M01 | Commits en `dev` | 181 | `git rev-list --count dev` | 2026-07-28 |
| M02 | Commits en todas las refs | 236 | `git rev-list --count --all` | 2026-07-28 |
| M03 | Fecha del primer commit | 2026-03-29 | `git log --reverse --date=short --format=%ad dev \| head -1` | 2026-07-28 |
| M04 | Fecha del último commit | 2026-06-24 | `git log -1 --date=short --format=%ad dev` | 2026-07-28 |
| M05 | Contribuidores | 5 (9 identidades Git) | `git shortlog -sne --all` | 2026-07-28 |
| M06 | Issues totales / cerradas | 50 / 45 | `gh issue list --state all --limit 300 --json number,state` | 2026-07-28 |
| M07 | Pull requests totales / mergeados | 48 / 26 | `gh pr list --state all --limit 300 --json number,mergedAt` | 2026-07-28 |
| M08 | Milestones | 7 | `gh api repos/juanpablovaldez/hosty/milestones?state=all --jq length` | 2026-07-28 |
| M09 | Rutas / protegidas | 14 / 8 | `find frontend/src/routes -name '*.tsx' ! -name '__root.tsx'` (14); `grep -rl requireAuth frontend/src/routes` (8) | 2026-07-28 |
| M10 | Tablas en `public` | 6 (`salones`, `bookings`, `salon_services`, `salon_availability_blocks`, `user_favorites`, `salon_subscriptions`) | `supabase/migrations/*.sql`; `frontend/src/shared/lib/database.types.ts` | 2026-07-28 |
| M11 | Archivos de migración | 10 | `ls supabase/migrations/*.sql \| wc -l` | 2026-07-28 |
| M12 | Pruebas automatizadas (Vitest) | 66 | `npm --prefix frontend run test` (`vitest --run`) | 2026-07-28 |
| M13 | Archivos de prueba | 18 (13 Vitest/RTL + 5 E2E Playwright, excluidos del run de Vitest por `exclude: ['src/e2e/**']`) | `find frontend/src -name '*.test.*' -o -name '*.spec.*'` | 2026-07-28 |
| M14 | Workflows de CI/CD | 3 (`frontend-tests.yml`, `web-dev.yml`, `infra-ci.yml`) | `ls .github/workflows` | 2026-07-28 |
| M15 | Features del frontend | 8 (`auth`, `bookings`, `errors`, `favorites`, `home`, `host`, `profile`, `salones`) | `ls frontend/src/features` | 2026-07-28 |
| M16 | Bucket de Storage | `salon-images` | `supabase/migrations/20260525000001_create_storage_bucket.sql` | 2026-07-28 |
| M17 | Estados de reserva | 4 (`pending`, `confirmed`, `declined`, `cancelled`) | `supabase/migrations/20260609233130_host_booking_management.sql`; `frontend/src/features/host/lib/booking-status.ts` | 2026-07-28 |
| M18 | Tipos de precio | 3 (`fixed`, `estimated`, `on_request`) | `frontend/src/features/host/lib/salon-wizard.ts` | 2026-07-28 |
| M19 | Tablero GitHub Projects v2 | #4 ("Hosty") | `gh project list --owner juanpablovaldez` | 2026-07-28 |
| M20 | Pasos del wizard de reserva | 3 | `frontend/src/features/bookings/components/BookingFlow.tsx` | 2026-07-28 |
| M21 | Pasos del wizard de publicación | 4 | `frontend/src/features/host/components/SalonWizard.tsx` | 2026-07-28 |
| M22 | Enums Postgres | 0 (se usan `CHECK` + tipos de dominio TS) | `grep -rn "CREATE TYPE\|ENUM" supabase/migrations/*.sql` (sin resultados) | 2026-07-28 |

> [!info] Fuente — M01 es la cifra de referencia usada en el resto del informe (T3, T37); M02 se
> cita únicamente como aclaración metodológica, para no ocultar los commits que existen en ramas
> o refs fuera de `dev`.

> [!info] Fuente — M12/M13 se re-verificaron en vivo el 2026-07-28 porque el árbol de trabajo
> tenía archivos de prueba nuevos sin confirmar en un commit al momento del diseño de este cambio.
> El valor de M12 (66 pruebas) y M13 (18 archivos) es el vigente al momento de esta verificación
> y puede volver a cambiar si se agregan pruebas después de esta fecha.

## Commits por mes (rama `dev`)

| Mes | Commits |
|---|---|
| 2026-03 | 1 |
| 2026-04 | 63 |
| 2026-05 | 63 |
| 2026-06 | 54 |

> [!info] Fuente — `git log dev --date=format:'%Y-%m' --format=%ad | sort | uniq -c` (2026-07-28).

## Contribuidores — identidades Git consolidadas (M05)

| Persona | Identidades Git (email) | Commits por identidad | Total |
|---|---|---|---|
| Juan Pablo Valdez | `Orbitado <juanpaavaldezz@gmail.com>`; `Juan Pablo Valdez <105684685+juanpablovaldez@users.noreply.github.com>` | 130 + 10 | 140 |
| Juan Ignacio Mignone | `Juan Ignacio Mignone <mignonejuanignacio@gmail.com>`; `nachomignone <137121859+nachomignone@users.noreply.github.com>` | 37 + 8 | 45 |
| Lautaro Martínez Naglieri | `Lautaro <laaumartinez28@gmail.com>`; `Lautaro Martínez Naglieri <laaumartinez28@gmail.com>`; `LautaroNaglieri <laaumartinez28@gmail.com>` | 28 + 4 + 1 | 33 |
| Benjamín Garma | `benjamingarma <benjamingarma3@gmail.com>` | 10 | 10 |
| Juan Pablo Czurylo | `Juan Pablo Czurylo <pabloczurylo10@gmail.com>` | 8 | 8 |
| **Total** | 9 identidades Git | | **236** (= M02) |

> [!info] Fuente — M05: `git shortlog -sne --all` (2026-07-28). La consolidación de identidades se
> realizó agrupando por dirección de email. Los nombres formales, legajos y roles de cátedra fueron
> aportados por el equipo e incorporados a la Tabla 11 de [[07-Equipo-y-Roles]] al cerrar P-06 y
> P-09 en la versión v1.0.

## Modelo de datos — resumen de 6 tablas (M10)

| Tabla | Propósito |
|---|---|
| `salones` | Catálogo de salones publicados por los anfitriones (ubicación, capacidad, precio, estado) |
| `bookings` | Reservas realizadas por huéspedes sobre un salón, con estado y precio cotizado |
| `salon_services` | Servicios adicionales ofrecidos por un salón |
| `salon_availability_blocks` | Bloqueos de disponibilidad definidos por el anfitrión |
| `user_favorites` | Relación de salones marcados como favoritos por un usuario |
| `salon_subscriptions` | Suscripción de un anfitrión al plan destacado |

El diccionario de datos completo (columnas, tipos, claves foráneas) se documenta en
[[Anexo-I-Modelo-de-Datos]] (T42–T47).

## Áreas de contribución principal por integrante (Lote A, derivado de `git log`)

Nota agregada en la Fase 1 (Lote A) de este cambio, sin alterar ninguna sección previa de este
documento. Se derivó ejecutando `git log --all --author="<email>" --name-only --pretty=format:` por
cada identidad Git de M05, y contando la frecuencia de directorios `frontend/src/features/<n>` (o,
en su ausencia, otros archivos de configuración) presentes en los commits de cada persona.

| Integrante | Áreas principales (top directorios por frecuencia de commit) |
|---|---|
| Juan Pablo Valdez | `features/salones` (14), `features/host` (8), `features/home` (6), `features/bookings` (6), `features/auth` (4) |
| Juan Ignacio Mignone | `features/salones` (19), `features/home` (17), `features/host` (14), `features/favorites` (4) |
| Lautaro Martínez Naglieri | `features/salones` (22), `features/host` (22), `features/bookings` (10), `features/home` (6) |
| Benjamín Garma | Infraestructura de pruebas: `cypress/` (8 archivos), `.github/workflows/frontend-tests.yml` (3), `.mocharc.json`, `playwright.config.ts`, `vite.config.ts` |
| Juan Pablo Czurylo | `features/salones` (búsqueda), `features/bookings` (flujo de reserva), `supabase/functions/send-emails` (notificaciones por email) |

> [!info] Fuente — Derivado de `git log --all --author="<email>" --name-only --pretty=format:` por
> cada email de M05 (2026-07-28). Usado en [[07-Equipo-y-Roles]] (Tabla 11) para fundamentar la
> columna "Responsabilidades principales" con evidencia verificable en lugar de una atribución
> arbitraria.

## Hallazgos adicionales verificados (Lote A, Fase 1)

- **Integración de cobro con Mercado Pago no implementada**: el issue #45 ("feat(payments):
  integrar Mercado Pago para reservas", milestone "Phase 2: Booking & Payments") figura **abierto**
  a la fecha de este informe. En el código, `frontend/src/features/host/components/PlanCard.tsx`
  muestra el mensaje "La integración con Mercado Pago estará disponible próximamente" al intentar
  suscribirse al plan Destacado, y la columna `mercadopago_subscription_id` existe en el esquema
  pero no se completa mediante un flujo de pago real.
- **Sistema de reseñas y calificaciones no implementado**: el issue #33 ("feat(social):
  implementar sistema de reviews y ratings", milestone "Phase 2+: Polish & Optimization") figura
  **abierto**. `frontend/src/features/salones/components/SalonDetailPage.tsx` renderiza una
  constante `SAMPLE_REVIEWS` con datos de ejemplo fijos, no reseñas reales de usuarios.
- **Panel de administrador cerrado sin implementación**: el issue #46 ("feat(admin): panel de
  aprobación y moderación de salones", milestone "Phase 3.B: Admin Panel") figura **cerrado**, pero
  no existe en el repositorio ninguna ruta, componente ni columna de aprobación/moderación asociada
  (`grep` sobre `frontend/src/` y `supabase/migrations/*.sql` sin resultados).

> [!info] Fuente — Verificado con `gh issue view <número> --json state,milestone,body` y `grep`
> sobre el árbol de trabajo (2026-07-28). Usado en [[01-Resumen-Ejecutivo]], [[04-Objetivos]] y
> [[07-Equipo-y-Roles]] para documentar el alcance realmente entregado frente al planificado.

## Hallazgo verificado: estados de reserva (M17)

El estado `declined` de `bookings` fue utilizado por la aplicación **antes** de que la
restricción `CHECK` de la base de datos lo permitiera. La migración inicial sólo aceptaba tres
valores:

> [!info] Fuente — `supabase/migrations/20240101000000_init_hosty.sql:57-58`:
> ```sql
> status      text not null default 'pending'
>               check (status in ('pending', 'confirmed', 'cancelled'))
> ```

La migración `20260609233130_host_booking_management.sql` (líneas 7–11) corrige la restricción y
documenta el motivo en un comentario verbatim del propio archivo:

> [!info] Fuente — `supabase/migrations/20260609233130_host_booking_management.sql:7-11`:
> ```sql
> -- 'declined' was used by the app but missing from the DB check.
> alter table public.bookings drop constraint if exists bookings_status_check;
> alter table public.bookings
>   add constraint bookings_status_check
>   check (status in ('pending', 'confirmed', 'declined', 'cancelled'));
> ```

El tipo TypeScript en `frontend/src/features/host/lib/booking-status.ts` ya modelaba las 4
variantes (`pending`, `confirmed`, `declined`, `cancelled`) antes de que la base de datos las
aceptara: un defecto real de sincronización entre el `CHECK` de Postgres y el dominio TS, sin
ningún `enum` de Postgres de por medio (M22). Este hallazgo se desarrolla como defecto documentado
en [[Anexo-II-Diagramas-de-Flujo]] (F33), [[Anexo-I-Modelo-de-Datos]] (T43) y como deuda técnica
en [[15-Conclusiones]] (T40).

## Métricas adicionales M23–M27 (calculadas en el Lote B, 2026-07-28)

Estas filas extienden la tabla M01–M22 con cifras requeridas por [[09-Planificacion-Scrum]] y
[[13-Ejecucion-por-Sprint]] que no estaban pre-calculadas en el diseño de este cambio. Se agregan
al final para no alterar ningún valor ya fijado por el Lote 0.

| ID | Métrica | Valor | Comando / fuente | Verificado el |
|---|---|---|---|---|
| M23 | Commits por sprint (S1–S5, ventanas del calendario de sprints pinneado) | 50, 38, 39, 13, 41 (suma 181 = M01) | `git log dev --since <inicio> --until <fin> --oneline \| wc -l` por ventana | 2026-07-28 |
| M24 | Issues cerradas por sprint (S1–S5, por fecha real de cierre) | 0, 4, 16, 12, 13 (suma 45 = M06) | `gh issue list --state closed --json number,closedAt` | 2026-07-28 |
| M25 | Story points (escala Fibonacci) registrados en GitHub Projects v2, campo "Size" | 40 de 50 issues con el campo cargado | `gh project item-list 4 --owner juanpablovaldez --format json` | 2026-07-28 |
| M26 | Pull requests cerradas sin fusionar | 20 de 48 (41,7 %); 7 de ellas por la consolidación de la PR #93 | `gh pr list --state all --json number,state,mergedAt` | 2026-07-28 |
| M27 | Duración total del proyecto en semanas | 88 días ÷ 7 ≈ 12,6 semanas | Calculado a partir de M03/M04 | 2026-07-28 |

> [!info] Fuente — Las ventanas de sprint usadas para M23/M24 son las mismas fijadas en el
> diseño de este cambio (S1: 2026-03-29–2026-04-19; S2: 2026-04-20–2026-05-15; S3:
> 2026-05-16–2026-06-05; S4: 2026-06-06–2026-06-13; S5: 2026-06-14–2026-06-24); ver
> [[09-Planificacion-Scrum]] (Tabla 21, con el límite de sprint marcado como inferencia simulada) y
> [[13-Ejecucion-por-Sprint]].

## Métricas adicionales M28–M32 (calculadas en el Lote D, 2026-07-28)

Estas filas extienden la tabla M01–M27 con cifras requeridas por [[12-Testing-y-Calidad]],
[[14-Metricas]] y [[Anexo-IV-API-y-Repositorio]] que no estaban pre-calculadas en el diseño de
este cambio. Se agregan al final para no alterar ningún valor ya fijado por los Lotes 0, A y B.

| ID | Métrica | Valor | Comando / fuente | Verificado el |
|---|---|---|---|---|
| M28 | Pull requests abiertos / mergeados por mes | 2026-04: 9/7 · 2026-05: 19/8 · 2026-06: 20/11 (suma 48/26 = M07) | `gh pr list --state all --json number,createdAt,mergedAt`, agrupado por mes | 2026-07-28 |
| M29 | Invocaciones de operaciones PostgREST (`select`/`insert`/`update`/`delete`) por módulo con carpeta `api/` | `bookings` 5, `favorites` 5, `host` 21, `salones` 4 (total 35) | `grep -oE '\.(select\|insert\|update\|delete\|upsert\|rpc)\(' frontend/src/features/<módulo>/api/*.ts` | 2026-07-28 |
| M30 | Resultado de `lint`/`typecheck` reproducidos en vivo sobre el estado actual del repositorio | `npx tsc -b --noEmit`: 0 errores · `npx eslint .`: 6 errores, 4 advertencias | Ejecución directa en `frontend/` | 2026-07-28 |
| M31 | Relación líneas de código de prueba / líneas de código de producción | 1.462 / 11.148 ≈ 0,13 (13 %) | `find frontend/src -name '*.test.ts' -o -name '*.test.tsx' -o -path '*/e2e/*.spec.ts' \| xargs wc -l`, y su complemento sobre `*.ts`/`*.tsx` | 2026-07-28 |
| M32 | Issues etiquetadas `bug` (todas / cerradas) | 13 / 13 | `gh issue list --state all --label bug --json number,state` | 2026-07-28 |

> [!info] Fuente — M28 se usa en [[14-Metricas]] (Figura 26, Tabla 38) para el gráfico de PRs por
> mes; M29 se usa en [[14-Metricas]] (Tabla 38) y en [[Anexo-IV-API-y-Repositorio]] (Tabla 53); M30
> se usa en [[12-Testing-y-Calidad]] (Tabla 34, criterios de salida) y en [[15-Conclusiones]] (Tabla
> 40, deuda técnica); M31 se usa en [[12-Testing-y-Calidad]] (Tabla 32, cobertura); M32 se usa en
> [[12-Testing-y-Calidad]] (manejo de incidencias) y en [[Anexo-V-Evidencias-QA]] (Tabla 58,
> registro de defectos).

## Métricas adicionales M33–M38 (verificadas en la versión v1.0, 2026-08-02)

Estas filas incorporan las cifras obtenidas al cerrar los placeholders de evidencia (P-39 a P-46).
A diferencia de M01–M32, calculadas por inspección del repositorio, **M34 a M38 provienen de
ejecuciones en vivo contra el ambiente desplegado y la API real**, no de lecturas de archivos.

| ID | Métrica | Valor | Comando / fuente | Verificado el |
|---|---|---|---|---|
| M33 | Cobertura de pruebas (`@vitest/coverage-v8`, proveedor `v8`) | Global: 12,69 % sentencias · 9,18 % ramas · 14,50 % funciones · 16,05 % líneas. Sobre el código ejercitado: 62,50 % · 45,91 % · 69,44 % · 74,84 % | `npm --prefix frontend run test:coverage`; agregación por módulo desde `coverage/coverage-summary.json` | 2026-08-02 |
| M34 | Resultado de la suite E2E sobre `chromium` | 37 escenarios: 31 aprobados, 6 fallidos, 0 *flaky*, 45,4 s | `npx playwright test --project=chromium` en `frontend/` | 2026-08-02 |
| M35 | Llamada real a la API PostgREST de producción | `206 Partial Content`, `Content-Range: 0-2/17` (17 salones en total), 280 ms | `GET {SUPABASE_URL}/rest/v1/salones?select=…&limit=3` con `Prefer: count=exact`, desde el origen desplegado | 2026-08-02 |
| M36 | URL pública del ambiente desplegado | `https://d1ako6y2uvskg7.cloudfront.net/` — responde `200` y renderiza el catálogo con 4 salones disponibles | Navegación directa sobre el ambiente DEV publicado por `web-dev.yml` | 2026-08-02 |
| M37 | Accesibilidad del documento OpenAPI (Swagger) de PostgREST | `401 {"message":"Secret API key required"}` con clave publicable: el contrato existe pero no es de lectura anónima | `GET {SUPABASE_URL}/rest/v1/` con `Accept: application/openapi+json` | 2026-08-02 |
| M38 | Recorrido del wizard de reserva sobre el ambiente desplegado | 3 pasos completados con sesión iniciada; total estimado $ 120.000 = $ 20.000/h × 6 h. **La reserva no se confirmó** | Navegación autenticada sobre `/salones/a1b2c3d4-0004-0004-0004-000000000004/reservar` | 2026-08-02 |

> [!info] Fuente — M33 se usa en [[12-Testing-y-Calidad]] (Tablas 32, 32a y 32b) y en
> [[Anexo-V-Evidencias-QA]] (Figura 36); M34 se usa en [[Anexo-V-Evidencias-QA]] (Figura 38, Tablas
> 57a y 57b); M35 se usa en [[Anexo-V-Evidencias-QA]] (Figura 35, Tabla 57c); M36 se usa en
> [[00-Portada-y-Ficha]] (Tabla 1); M37 se usa en [[Anexo-IV-API-y-Repositorio]] (Tabla 53a); M38 se
> usa en [[Anexo-V-Evidencias-QA]] (Figura 37, Tabla 57d).
>
> **Nota metodológica.** M35 y M37 exigen una clave de API. La clave publicable (`anon`) del
> proyecto se transmitió por encabezado —nunca por *query string*— y aparece enmascarada en la
> Figura 35. Ninguna clave del proyecto está versionada en este vault ni en la colección Postman
> adjunta.

---
[[Indice|Índice]]
