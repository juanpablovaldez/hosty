---
title: "Anexo V — Evidencias de QA"
seccion: "A-V"
orden: 21
tipo: anexo
tags: [hosty, informe-final, qa, evidencias]
estado: con-pendientes
figuras: [F35, F36, F37]
tablas: [T56, T57, T58, T59]
updated: 2026-07-28
---

# Anexo V. Evidencias de QA

Este anexo reúne la evidencia de ejecución de la suite automatizada y el registro de defectos
reales del proyecto, complementando la matriz de casos manuales de [[12-Testing-y-Calidad]].

## Suite de pruebas automatizadas

| Archivo | Tipo | Casos |
|---|---|---|
| `src/features/salones/lib/pricing.test.ts` | Unitaria | 9 |
| `src/test/button.test.tsx` | Componente | 3 |
| `src/test/badge.test.tsx` | Componente | 3 |
| `src/features/bookings/api/bookings.test.ts` | Integración | 6 |
| `src/features/salones/api/salones.queries.test.ts` | Integración | 8 |
| `src/features/favorites/api/favorites.test.ts` | Integración | 6 |
| `src/features/salones/components/CardSalon.test.tsx` | Componente | 9 |
| `src/components/layout/Header.test.tsx` | Componente | 5 |
| `src/features/auth/components/LoginPage.test.tsx` | Integración | 1 |
| `src/features/auth/lib/auth.test.ts` | Unitaria | 6 |
| `src/features/auth/components/RegisterPage.test.tsx` | Integración | 2 |
| `src/features/auth/store/auth.store.test.ts` | Unitaria | 4 |
| `src/test/mocha/search-validation.test.ts` | Legacy (Mocha + Chai, también recolectado por Vitest) | 4 |
| **Total (Vitest)** | | **66** |

*Tabla 56 — Suite de pruebas automatizadas: archivo y casos.*

> [!info] Fuente — `npx vitest run --reporter=verbose` ejecutado sobre el repositorio
> (2026-07-28): 13 archivos, 66 casos, todos en verde (`Test Files 13 passed`, `Tests 66 passed`).
> El conteo de casos por archivo se obtuvo con
> `grep -cE '^\s*(it|test)\(' <archivo>` sobre cada uno.

## Escenarios de prueba E2E (Playwright)

| *Spec* | Escenarios | Navegadores |
|---|---|---|
| `src/e2e/auth-flow.spec.ts` | 9 | Chromium, Firefox, WebKit |
| `src/e2e/home.spec.ts` | 7 | Chromium, Firefox, WebKit |
| `src/e2e/navigation.spec.ts` | 8 | Chromium, Firefox, WebKit |
| `src/e2e/salon-detail.spec.ts` | 5 | Chromium, Firefox, WebKit |
| `src/e2e/salones.spec.ts` | 8 | Chromium, Firefox, WebKit |
| **Total** | **37 escenarios × 3 navegadores = 111 ejecuciones** | |

*Tabla 57 — Escenarios de prueba E2E (Playwright).*

> [!info] Fuente — `grep -cE '^\s*test\(' <spec>` sobre cada archivo de `frontend/src/e2e/`
> (2026-07-28); configuración de navegadores en `frontend/playwright.config.ts`
> (`projects: chromium, firefox, webkit`).

> [!todo] PLACEHOLDER P-44 — Anexar el reporte HTML de Playwright ya generado
> El proyecto ya cuenta con un reporte HTML real generado localmente en
> `frontend/playwright-report/index.html` (confirmado presente en el árbol de trabajo al momento
> de esta verificación). Anexarlo (o una captura de su resumen) como evidencia formal de la última
> corrida E2E antes de la entrega. Responsable: equipo. Destino: esta sección.

## Evidencia de pruebas sobre la API PostgREST

> [!todo] PLACEHOLDER P-41 — Captura de una ejecución de prueba contra la API PostgREST
> Adjuntar una captura de una llamada real (por ejemplo, desde el *Network tab* del navegador o
> desde una petición `curl`/Postman manual) contra `{SUPABASE_URL}/rest/v1/salones`, mostrando la
> respuesta de PostgREST. Guardar como `assets/f35-evidencia-api-postgrest.png` (nombre ya
> reservado en `assets/README.md`). Responsable: equipo.

*Figura 35 — Evidencia de pruebas sobre la API PostgREST.*

## Registro de defectos y retesting

Trece incidencias reales, todas etiquetadas `bug` en GitHub y todas cerradas, constituyen el
registro verificable de defectos del proyecto. La columna "Severidad" no proviene de un campo
formal de GitHub (el repositorio no usa un esquema de severidad estructurado) y se marca como
estimación.

| Issue | Título | Severidad (estimada) | Estado | Retesting |
|---|---|---|---|---|
| #87 | `fix(footer)`: links apuntan a rutas incorrectas o inexistentes | Baja | Cerrado | Manual, sobre DEV |
| #85 | `fix`: borrado de salón, horarios de reserva y validaciones del flujo | Media | Cerrado | Manual, sobre DEV |
| #76 | `fix(footer)`: links del footer son placeholders | Baja | Cerrado | Manual, sobre DEV |
| #75 | `fix(favorites)`: agregar a favoritos no persiste (sólo estado local) | Alta | Cerrado | Manual, sobre DEV |
| #74 | `fix(salones)`: el mapa en `/salones` no está implementado | Media | Cerrado | Manual, sobre DEV |
| #72 | `fix(nav)`: el link "Cómo funciona" no navega a ninguna sección | Baja | Cerrado | Manual, sobre DEV |
| #71 | `fix(ci)`: estabilizar pipeline de CI | Media | Cerrado | Verificado en `frontend-tests.yml` |
| #70 | `fix(ci)`: commitear `routeTree.gen.ts` para desbloquear build de CI | Alta | Cerrado | Verificado en CI |
| #64 | `fix(ux)`: correcciones UX y features faltantes (grupos 1-4) | Media | Cerrado | Manual, sobre DEV |
| #34 | `fix(seo)`: implementar meta tags y Open Graph | Baja | Cerrado | Manual, sobre DEV |
| #29 | `fix(ux)`: mejorar manejo de errores y mensajes al usuario | Media | Cerrado | Manual, sobre DEV |
| #28 | `fix(ux)`: agregar *loading states* a búsquedas y filtros | Baja | Cerrado | Manual, sobre DEV |
| #26 | `fix(responsive)`: página no es completamente responsive en mobile | Media | Cerrado | Manual, sobre DEV |

*Tabla 58 — Registro de defectos y retesting.*

> [!info] Fuente — `gh issue list --state all --label bug --json number,title,state` (2026-07-28):
> 13 issues, 13 `CLOSED`.

> [!warning] Dato simulado SIM-37 — Columna "Severidad (estimada)"
> GitHub no registra un campo de severidad estructurado para estos issues. La clasificación
> Alta/Media/Baja de esta tabla es una estimación plausible del agente, basada en el impacto
> funcional descrito en el título de cada issue (por ejemplo, que favoritos no persista se estima
> Alta por afectar datos del usuario; un link roto en el footer se estima Baja), y no corresponde a
> un criterio de triage formalmente documentado por el equipo.

Un defecto adicional, real y verificado —no simulado— se documenta aparte por su relevancia
arquitectónica, y se distingue visualmente de la tabla anterior por no llevar el marcador
`[!warning]`:

> [!info] Fuente — Defecto real: deriva del estado de `bookings` (M17). El estado `declined` fue
> utilizado por la aplicación (`frontend/src/features/host/lib/booking-status.ts`) antes de que la
> restricción `CHECK` de la base de datos lo permitiera
> (`supabase/migrations/20240101000000_init_hosty.sql:57-58`, que sólo aceptaba `pending`,
> `confirmed` y `cancelled`). **Severidad: media.** **Resolución:** migración
> `supabase/migrations/20260609233130_host_booking_management.sql:7-11`, que elimina y recrea la
> restricción con los 4 valores. **Retest:** se verificó, leyendo la migración, que la restricción
> `bookings_status_check` recreada admite explícitamente `'pending', 'confirmed', 'declined',
> 'cancelled'`. Análisis de deuda técnica asociado en [[12-Testing-y-Calidad]] y en la sección 15
> (Conclusiones, Tabla 40).

## Checklist de evidencias y capturas pendientes

> [!todo] PLACEHOLDER P-42 — Reporte de cobertura de pruebas
> No existe una herramienta de cobertura de líneas configurada en el proyecto (ver
> [[12-Testing-y-Calidad]], Tabla 32); por lo tanto, no hay un reporte que capturar todavía. Esta
> figura queda pendiente hasta que se instale una herramienta como `@vitest/coverage-v8` y se
> ejecute con esa opción habilitada. Responsable: equipo. Destino: esta figura y Tabla 32.

*Figura 36 — Reporte de cobertura de pruebas.*

> [!todo] PLACEHOLDER P-43 — Capturas del flujo de reserva en ejecución
> Adjuntar capturas de pantalla de los 3 pasos del *wizard* de reserva (`BookingFlow.tsx`) sobre el
> ambiente DEV desplegado, mostrando datos reales. Guardar como
> `assets/f37-flujo-reserva.png` (nombre ya reservado en `assets/README.md`). Responsable: equipo.

*Figura 37 — Capturas de la aplicación en ejecución (flujo de reserva).*

| Evidencia | Estado |
|---|---|
| Reporte HTML de Playwright (`frontend/playwright-report/`) | Generado localmente; pendiente de anexado formal (P-44) |
| Corrida de Vitest reproducida en este cambio | Ejecutada: `npx vitest run` → 13 archivos, 66 casos, todos en verde (2026-07-28) |
| Corrida de `tsc -b --noEmit` reproducida en este cambio | Ejecutada: sin errores (2026-07-28) |
| Corrida de `eslint .` reproducida en este cambio | Ejecutada: 6 errores, 4 advertencias (2026-07-28; ver [[12-Testing-y-Calidad]], Tabla 34) |
| Captura de la API PostgREST | Pendiente (P-41) |
| Reporte de cobertura de líneas | No existe herramienta configurada; pendiente de adopción (P-42) |
| Capturas del flujo de reserva en ejecución | Pendiente (P-43) |

*Tabla 59 — Checklist de evidencias y capturas pendientes.*

---
[[Indice|Índice]] · ← [[Anexo-IV-API-y-Repositorio]]
