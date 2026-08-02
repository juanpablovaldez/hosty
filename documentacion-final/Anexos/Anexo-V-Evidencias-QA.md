---
title: "Anexo V — Evidencias de QA"
seccion: "A-V"
orden: 21
tipo: anexo
tags: [hosty, informe-final, qa, evidencias]
estado: completo
figuras: [F35, F36, F37, F38]
tablas: [T56, T57, T57a, T57b, T57c, T57d, T58, T59]
updated: 2026-08-02
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

### Resultado de la última corrida E2E

La suite E2E se reejecutó sobre el proyecto `chromium` el 2026-08-02 para anexar evidencia vigente
y no un reporte histórico. El resultado **no es completamente verde** y se documenta como tal:

| Métrica | Valor |
|---|---|
| Escenarios ejecutados | 37 |
| Aprobados | 31 (83,8 %) |
| Fallidos | 6 (16,2 %) |
| Inestables (*flaky*) | 0 |
| Omitidos | 0 |
| Duración total | 45,4 s |
| Proyecto ejecutado | `chromium` |

*Tabla 57a — Resultado de la corrida E2E del 2026-08-02.*

![[f38-playwright-report.png]]

*Figura 38 — Reporte HTML de Playwright de la corrida del 2026-08-02 (31 aprobados / 6 fallidos).*

| *Spec* | Escenario fallido | Causa observada |
|---|---|---|
| `auth-flow.spec.ts:16` | Login › email inválido muestra error de validación antes de submit | La validación de formato de email no se dispara antes del envío: el mensaje esperado no aparece dentro del *timeout* |
| `auth-flow.spec.ts:78` | Registro › email inválido en registro muestra error | Mismo comportamiento que el anterior, en el formulario de registro |
| `home.spec.ts:34` | Home › indicadores de confianza con "+120 salones verificados" visibles | El *spec* fija un texto de marketing que la interfaz ya no muestra con ese literal |
| `salon-detail.spec.ts:28` | Detalle › botón "Reservar ahora" o "Reservar" visible en salón disponible | El selector no encuentra el botón esperado en la página de detalle |
| `salon-detail.spec.ts:41` | Detalle › click en "Reservar" sin sesión redirige a `/login` | Deriva del anterior: sin botón localizado, la redirección no llega a ejercitarse |
| `salones.spec.ts:43` | Salones › selector de orden actualiza la URL con `sortBy` | `locator('select').first()` resuelve al `<select>` pero la opción `price_asc` no existe con ese valor |

*Tabla 57b — Escenarios E2E fallidos y causa observada.*

> [!info] Fuente — M34: `npx playwright test --project=chromium` ejecutado el 2026-08-02
> (37 escenarios, 31 aprobados, 6 fallidos, 0 *flaky*, 45,4 s). Reporte HTML completo en
> `frontend/playwright-report/index.html`. El resultado es **reproducible**: una corrida previa del
> 2026-06-24, conservada en el mismo reporte, arroja exactamente los mismos 6 fallos, lo que
> descarta inestabilidad y confirma que se trata de deriva real entre los *specs* y la interfaz.

**Análisis.** Los seis fallos comparten un origen: son *specs* escritos contra una versión anterior
de la interfaz y no actualizados cuando cambiaron los textos y los selectores (`+120 salones
verificados`, el rótulo del botón de reserva, el valor `price_asc` del selector de orden). No
corresponden a defectos funcionales de la aplicación —los flujos equivalentes funcionan al
verificarlos manualmente sobre el ambiente desplegado— sino a **deuda de mantenimiento de la suite
E2E**, agravada por que Playwright no forma parte del pipeline de CI (ver [[12-Testing-y-Calidad]]):
al no bloquear ningún merge, la deriva pasó inadvertida. Incorporar la suite E2E al workflow
`frontend-tests.yml` es la contramedida directa y queda registrada como deuda técnica en
[[15-Conclusiones]].

## Evidencia de pruebas sobre la API PostgREST

![[f35-evidencia-api-postgrest.png]]

*Figura 35 — Evidencia de pruebas sobre la API PostgREST.*

La captura corresponde a una llamada real ejecutada desde el ambiente desplegado contra la API de
producción, con la clave enmascarada. Elementos verificables en la evidencia:

| Elemento | Valor observado | Qué demuestra |
|---|---|---|
| Petición | `GET /rest/v1/salones?select=id,name,location,capacity,price_per_hour,is_verified&limit=3` | La proyección de columnas se resuelve del lado del servidor, no filtrando en el cliente |
| Encabezados de autenticación | `apikey` + `Authorization: Bearer` (enmascarados) | La API exige clave en toda petición, incluso para lectura pública |
| Código de respuesta | `206 Partial Content` | PostgREST responde `206` —y no `200`— cuando el resultado está paginado |
| `Content-Range` | `0-2/17` | Devuelve 3 filas de un total real de 17 salones; es el encabezado que alimenta la paginación del catálogo |
| Latencia | 280 ms | Medida extremo a extremo desde el navegador contra el ambiente desplegado |
| Cuerpo | 3 objetos JSON con datos reales del catálogo | El contrato tipado de `database.types.ts` coincide con la respuesta real |

*Tabla 57c — Elementos verificables en la evidencia de la API PostgREST.*

> [!info] Fuente — M35: petición ejecutada el 2026-08-02T15:39:23Z desde el origen
> `https://d1ako6y2uvskg7.cloudfront.net` contra
> `https://gjxextyntxfsztpgkqig.supabase.co/rest/v1/salones`, con `Prefer: count=exact`. La clave
> publicable aparece enmascarada en la captura por higiene de credenciales; la petición completa,
> ejecutable, está en la carpeta "01 · Salones" de la colección Postman adjunta al
> [[Anexo-IV-API-y-Repositorio]].

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

![[f36-cobertura-tests.png]]

*Figura 36 — Reporte de cobertura de pruebas generado por `@vitest/coverage-v8`.*

Captura del reporte HTML navegable producido por la corrida del 2026-08-02. El encabezado consigna
la cobertura global del proyecto —12,69 % de sentencias, 9,18 % de ramas, 14,50 % de funciones y
16,05 % de líneas— y la tabla desglosa cada módulo, permitiendo distinguir los módulos de dominio
bien cubiertos de las carpetas de componentes en 0 %. El análisis de estas cifras y su lectura bajo
los dos criterios de medición se desarrolla en [[12-Testing-y-Calidad]] (Tablas 32, 32a y 32b).

![[f37-flujo-reserva.png]]

*Figura 37 — Capturas de la aplicación en ejecución: los 3 pasos del wizard de reserva.*

Recorrido real sobre el ambiente desplegado, con una sesión autenticada, contra el salón "Villa
Eventos Tafí" (`a1b2c3d4-0004-0004-0004-000000000004`). La ruta `/salones/:id/reservar` está
protegida: sin sesión, la aplicación redirige a `/login?redirect=…`, comportamiento verificado en la
misma sesión de captura.

| Paso | Datos ingresados | Comportamiento observado |
|---|---|---|
| 1 — Fecha y horario | 12/09/2026, de 20:00 a 02:00 | El indicador de progreso marca el paso activo; los horarios se eligen de una lista de franjas de 15 minutos y el asistente acepta un rango que cruza la medianoche |
| 2 — Datos del evento | Casamiento · 120 asistentes · contacto de prueba | El campo de asistentes declara el máximo del salón (300 personas); el paso 1 queda marcado como completado |
| 3 — Confirmación | — | Se muestra el resumen consolidado (fecha, horario, **duración 6 h**, tipo, asistentes, contacto) y el **total estimado de $ 120.000**, calculado como `$ 20.000/h × 6h` |

*Tabla 57d — Recorrido capturado del wizard de reserva.*

> [!info] Fuente — M38: recorrido ejecutado el 2026-08-02 sobre
> `https://d1ako6y2uvskg7.cloudfront.net/salones/a1b2c3d4-0004-0004-0004-000000000004/reservar` con
> sesión iniciada. **La reserva no fue confirmada**: la captura del paso 3 corresponde al estado
> previo a pulsar "Confirmar reserva", de modo que el recorrido no introdujo ninguna fila de prueba
> en la tabla `bookings` del ambiente desplegado. El cálculo del total estimado coincide con
> `price_per_hour` del salón y con la duración derivada del rango horario, lo que verifica en vivo
> la lógica probada por `pricing.test.ts` (9 casos, 100 % de cobertura).

*Figura 37 — Capturas de la aplicación en ejecución (flujo de reserva).*

| Evidencia | Estado |
|---|---|
| Reporte HTML de Playwright (`frontend/playwright-report/`) | **Anexado** — Figura 38 y Tablas 57a/57b; corrida del 2026-08-02: 31 aprobados / 6 fallidos |
| Corrida de Vitest reproducida en este cambio | Ejecutada: `npx vitest run` → 13 archivos, 66 casos, todos en verde (reconfirmada el 2026-08-02) |
| Corrida de `tsc -b --noEmit` reproducida en este cambio | Ejecutada: sin errores (2026-07-28) |
| Corrida de `eslint .` reproducida en este cambio | Ejecutada: 6 errores, 4 advertencias (2026-07-28; ver [[12-Testing-y-Calidad]], Tabla 34) |
| Captura de la API PostgREST | **Anexada** — Figura 35 y Tabla 57c; llamada real con `206` y `Content-Range: 0-2/17` (2026-08-02) |
| Reporte de cobertura de líneas | **Anexado** — Figura 36; `@vitest/coverage-v8` adoptado, 12,69 % global (2026-08-02) |
| Colección Postman | **Anexada** — `assets/hosty.postman_collection.json`, 7 carpetas / 20 peticiones (ver [[Anexo-IV-API-y-Repositorio]]) |
| Captura del tablero de gestión | **Anexada** — Figura 12 en [[09-Planificacion-Scrum]] (2026-08-02) |
| Capturas del flujo de reserva en ejecución | **Anexadas** — Figura 37 y Tabla 57d; recorrido real con sesión iniciada, sin confirmar la reserva (2026-08-02) |

*Tabla 59 — Checklist de evidencias y capturas.*

Con la incorporación de la Figura 37 queda cerrado el último placeholder abierto del informe: el
registro de [[Pendientes]] no conserva ningún `[!todo]` sin resolver.

---
[[Indice|Índice]] · ← [[Anexo-IV-API-y-Repositorio]]
