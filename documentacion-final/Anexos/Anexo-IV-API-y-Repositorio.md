---
title: "Anexo IV — API y Repositorio"
seccion: "A-IV"
orden: 20
tipo: anexo
tags: [hosty, informe-final, api, repositorio]
estado: completo
tablas: [T53, T53a, T53b, T53c, T54, T55, T55a]
updated: 2026-08-02
---

# Anexo IV. API y Repositorio

Hosty no escribe una API propia: toda la capa de datos se sirve a través de **PostgREST**, el
componente de Supabase que autogenera una API REST directamente a partir del esquema de Postgres
(ver [[11-Arquitectura]]). El contrato de esa API es el propio esquema de la base de datos,
versionado como código en `supabase/migrations/*.sql`, y su proyección tipada del lado del cliente
es `frontend/src/shared/lib/database.types.ts`, generado con `supabase gen types typescript`.

Esto no significa que el proyecto carezca de documentación de API en formato estándar: **sí se usa
Swagger (OpenAPI)**, con la diferencia de que el documento no se redacta a mano sino que lo emite
el propio PostgREST.

## Documentación OpenAPI (Swagger) del contrato

PostgREST publica el contrato completo de la API como documento **OpenAPI 2.0 (Swagger)** en la
raíz del servicio REST. Cada tabla del esquema `public` aparece como recurso, cada columna como
parámetro de filtro, y cada verbo disponible (`GET`, `POST`, `PATCH`, `DELETE`) con su cuerpo y sus
respuestas. El documento puede importarse directamente en Swagger UI o en Postman.

| Campo | Valor |
|---|---|
| URL del documento OpenAPI | `https://gjxextyntxfsztpgkqig.supabase.co/rest/v1/` |
| Encabezado requerido | `Accept: application/openapi+json` |
| Versión de la especificación | OpenAPI 2.0 (Swagger) |
| Autenticación | Requiere **clave secreta** (`service_role`); la clave publicable no alcanza |
| Origen del contrato | Autogenerado desde el esquema de Postgres (`supabase/migrations/*.sql`) |

*Tabla 53a — Documento OpenAPI (Swagger) autogenerado por PostgREST.*

> [!info] Fuente — Verificado en vivo el 2026-08-02 contra el proyecto de producción. Con la clave
> publicable, el endpoint responde `401` con el cuerpo
> `{"message":"Secret API key required","hint":"Only secret API keys can be used for this
> endpoint."}`. **Nota honesta:** el documento Swagger existe y es consultable por el equipo con la
> clave secreta desde el panel de Supabase, pero **no es de lectura anónima**; por eso este anexo
> no publica una URL abierta de Swagger UI. Los recursos y filtros que ese documento describe se
> reproducen, en forma curada y ejecutable, en la colección Postman adjunta (Tabla 53b).

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

## Colección Postman

Se adjunta una colección Postman curada manualmente, en formato **Collection v2.1**, que cubre las
operaciones efectivamente invocadas por el frontend más un conjunto de casos negativos destinados a
evidenciar que la autorización se resuelve en la base de datos (RLS) y no en el cliente.

| Campo | Valor |
|---|---|
| Archivo | `assets/hosty.postman_collection.json` |
| Formato | Postman Collection v2.1 |
| Carpetas | 7 |
| Peticiones | 20 |
| Variables de colección | `baseUrl`, `apikey`, `accessToken`, `salonId` |

*Tabla 53b — Colección Postman adjunta.*

| Carpeta | Peticiones | Qué documenta |
|---|---|---|
| 00 · Contrato OpenAPI (Swagger) | 1 | Descarga del documento Swagger autogenerado (requiere clave secreta) |
| 01 · Salones | 4 | Listado paginado con `Prefer: count=exact`, detalle con proyección anidada, búsqueda `ilike`, filtros `gte`/`in`/`ov` |
| 02 · Auth (GoTrue) | 2 | Inicio de sesión con contraseña y lectura del usuario de la sesión; el JWT se guarda automáticamente en `accessToken` |
| 03 · Reservas (bookings) | 4 | Listado propio, verificación de disponibilidad, alta y cancelación |
| 04 · Favoritos (user_favorites) | 3 | Alta, baja y listado con relación anidada a `salones` |
| 05 · Panel del anfitrión | 3 | Salones propios con conteo de reservas, respuesta a una reserva y bloqueo de fechas |
| 06 · Casos negativos (verificación de RLS) | 3 | `200` con array vacío sin sesión, `400` por violación de `bookings_status_check`, `404` `PGRST205` por recurso inexistente |

*Tabla 53c — Contenido de la colección Postman por carpeta.*

> [!info] Fuente — `assets/hosty.postman_collection.json`, validado como JSON y como colección
> v2.1 (`json.load` + conteo de `item`, 2026-08-02). Las variables `apikey` y `accessToken` se
> distribuyen **vacías**: deben cargarse como variables de entorno de Postman. Ninguna credencial
> del proyecto está versionada dentro de la colección.

### Cómo importarla

1. Postman → *Import* → seleccionar `documentacion-final/assets/hosty.postman_collection.json`.
2. Crear un *Environment* con la variable `apikey` = clave publicable (anon) del proyecto.
3. Ejecutar `02 · Auth › Sign in with password` con un usuario de prueba: su script de test
   completa `accessToken` y habilita las carpetas autenticadas.

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

## Problemas comunes y su resolución

Los siguientes casos son los que efectivamente aparecieron durante el desarrollo y las pruebas
contra la API. Se documentan porque su síntoma induce a un diagnóstico equivocado: en casi todos,
el error que devuelve la API no señala la causa real.

| # | Síntoma | Causa real | Resolución |
|---|---|---|---|
| 1 | `GET /rest/v1/bookings` devuelve `200 OK` con `[]` en vez de `401` | Las políticas RLS no rechazan la petición: filtran filas. Sin sesión, ninguna fila es visible | Verificar que se envía `Authorization: Bearer <access_token>` y no la clave anónima. Un array vacío nunca debe interpretarse como "la tabla está vacía" |
| 2 | `401 {"message":"No API key found in request"}` | Falta el encabezado `apikey`. `supabase-js` lo agrega solo; una petición manual con `curl` o Postman, no | Enviar siempre `apikey` **y** `Authorization` |
| 3 | `401 {"message":"Secret API key required"}` al pedir el documento OpenAPI | El endpoint raíz `/rest/v1/` sólo acepta clave secreta (`service_role`) | Consultar el contrato desde el panel de Supabase, o usar la colección Postman adjunta |
| 4 | `404` con código `PGRST205` | Se usó el nombre de dominio en español en vez del nombre real de la tabla (`reservas` por `bookings`, `favoritos` por `user_favorites`) | El esquema mezcla español (`salones`) e inglés (`bookings`, `user_favorites`): consultar siempre `database.types.ts` |
| 5 | `400` con código `23514` al crear o responder una reserva | Violación de `bookings_status_check`: el estado enviado no pertenece al dominio permitido | Usar únicamente `pending`, `confirmed`, `declined` o `cancelled`. El valor `declined` sólo es válido desde la migración `20260609233130_host_booking_management.sql` (defecto documentado en [[Anexo-V-Evidencias-QA]]) |
| 6 | `409 Conflict` al marcar un salón como favorito | La clave única (`user_id`, `salon_id`) rechaza el duplicado | Usar `upsert` con `on_conflict`, o consultar el estado actual antes de insertar |
| 7 | `PATCH`/`DELETE` rechazado por PostgREST sin llegar a la base | PostgREST exige un filtro explícito para evitar afectar toda la tabla | Agregar siempre `?id=eq.<uuid>` |
| 8 | El tipo TypeScript no coincide con la respuesta real de la API | `database.types.ts` quedó desactualizado tras aplicar una migración | Regenerar con `npx supabase gen types typescript --project-id <ref> > frontend/src/shared/lib/database.types.ts` |
| 9 | La aplicación arranca pero toda petición falla con `401` | Las variables de entorno de Vite no fueron leídas: sólo se exponen al bundle las que empiezan con `VITE_` | Verificar `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` en `frontend/.env` y reiniciar el servidor de desarrollo (Vite no recarga `.env` en caliente) |
| 10 | El build pasa en local pero falla en CI | `routeTree.gen.ts` es generado por TanStack Router y estaba ignorado por Git | Se versionó el archivo (issue #70). El workflow de CI usa **pnpm** mientras que el desarrollo local usa **npm**: no mezclar archivos de *lock* |

*Tabla 55a — Problemas comunes en el consumo de la API y en el entorno de desarrollo.*

> [!info] Fuente — Casos 1 a 7 verificados contra el proyecto real el 2026-08-02 (las respuestas de
> los casos 1, 3 y 5 están reproducidas como peticiones ejecutables en la carpeta "06 · Casos
> negativos" de la colección Postman adjunta). El caso 5 corresponde al defecto de deriva de
> esquema documentado en [[Anexo-V-Evidencias-QA]] (M17); el caso 10, al issue #70 del registro de
> defectos.

---
[[Indice|Índice]] · ← [[Anexo-III-Backlog-User-Stories]] · [[Anexo-V-Evidencias-QA]] →
