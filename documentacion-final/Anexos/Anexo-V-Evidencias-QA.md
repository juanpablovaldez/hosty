---
title: "Anexo V — Evidencias de QA"
seccion: "A-V"
orden: 21
tipo: anexo
tags: [hosty, informe-final, qa, evidencias]
estado: completo
figuras: [F35, F36, F37]
tablas: [T56, T57, T58, T59]
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
| `src/features/bookings/components/BookingFlow.test.tsx` | Componente | 1 |
| `src/features/salones/api/salones.queries.test.ts` | Integración | 8 |
| `src/features/favorites/api/favorites.test.ts` | Integración | 7 |
| `src/features/salones/components/CardSalon.test.tsx` | Componente | 9 |
| `src/components/layout/Header.test.tsx` | Componente | 5 |
| `src/features/auth/components/LoginPage.test.tsx` | Integración | 1 |
| `src/features/auth/lib/auth.test.ts` | Unitaria | 6 |
| `src/features/auth/components/RegisterPage.test.tsx` | Integración | 2 |
| `src/features/auth/store/auth.store.test.ts` | Unitaria | 4 |
| `src/shared/lib/errors.test.ts` | Unitaria | 7 |
| `src/test/mocha/search-validation.test.ts` | Legacy (Mocha + Chai, también recolectado por Vitest) | 4 |
| **Total (Vitest)** | | **75** |

*Tabla 56 — Suite de pruebas automatizadas: archivo y casos.*

> [!info] Fuente — `npx vitest run --reporter=verbose` ejecutado sobre el repositorio
> (2026-08-03): 15 archivos, 75 casos, todos en verde (`Test Files 15 passed`, `Tests 75 passed`).
> El conteo de casos por archivo se obtuvo con
> `grep -cE '^\s*(it|test)\(' <archivo>` sobre cada uno. `BookingFlow.test.tsx` y el séptimo caso de
> `favorites.test.ts` se agregaron el 2026-08-03 para cerrar SIM-33/SIM-34 de
> [[12-Testing-y-Calidad]] (Tabla 33).

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

La suite completa de Playwright se ejecutó sobre el frontend desplegado, no sobre un servidor
local, de modo que el resultado refleja el comportamiento del sistema tal como lo recibe un
usuario final.

| Parámetro | Valor |
|---|---|
| Fecha de ejecución | 2026-08-02 |
| Entorno | `https://d1ako6y2uvskg7.cloudfront.net` (frontend desplegado) |
| Navegadores | 3 (Chromium, Firefox y WebKit) |
| *Specs* ejecutados | 5 (`auth-flow`, `home`, `navigation`, `salon-detail`, `salones`) |
| Casos ejecutados | 111 (37 casos × 3 navegadores) |
| Casos exitosos | 111 |
| Casos fallidos | 0 |

*Tabla 57b — Resultado de la corrida E2E sobre el entorno desplegado.*

La suite quedó completamente en verde tras la corrección de los seis casos que fallaban en la
corrida anterior (2026-07-29). El análisis caso por caso distinguió dos situaciones de naturaleza
distinta, y esa distinción es el resultado más relevante de esta ronda de pruebas: **cuatro fallos
eran localizadores mal escritos, pero dos estaban señalando un defecto real del producto.**

| # | *Spec* | Causa del fallo | Clasificación | Corrección |
|---|---|---|---|---|
| 1 | `auth-flow.spec.ts` | El mensaje de validación "Email inválido" nunca llegaba a renderizarse: el campo declara `type="email"` y el formulario no desactivaba la validación nativa del navegador, que interceptaba el envío y mostraba su propio aviso, en el idioma del navegador y con un estilo ajeno a la aplicación | **Defecto del producto** | Se agregó el atributo `noValidate` al formulario de inicio de sesión, de modo que la validación la resuelva el formulario de la aplicación y el mensaje se muestre en español |
| 2 | `auth-flow.spec.ts` | Misma causa que el caso 1, en el formulario de registro | **Defecto del producto** | Se agregó `noValidate` al formulario de registro |
| 3 | `home.spec.ts` | El localizador `getByText(/\+120/)` resolvía a dos elementos —el indicador de confianza y la tarjeta de propuesta de valor—, lo que Playwright rechaza por su modo estricto. El texto sí estaba presente | *Spec* mal escrito | Se acotó el localizador a la primera coincidencia |
| 4 | `salon-detail.spec.ts` | El localizador buscaba el control de reserva con el rol `button`, pero el componente se renderiza como enlace (`<Button asChild>` delega el elemento al `<Link>` que envuelve), por lo que su rol de accesibilidad es `link` | *Spec* mal escrito | Se corrigió el rol del localizador a `link` |
| 5 | `salon-detail.spec.ts` | Caso dependiente del anterior | Consecuencia del caso 4 | Resuelto con la misma corrección |
| 6 | `salones.spec.ts` | `locator('select').first()` resolvía al selector de zona, que aparece antes en el documento y no contiene las opciones de ordenamiento | *Spec* mal escrito | Se apuntó el localizador al identificador explícito `#salones-sort-select` |

*Tabla 57c — Análisis de los casos fallidos y su corrección.*

Los casos 1 y 2 merecen una lectura aparte. Ambos habían sido clasificados en una revisión
preliminar como *specs* desactualizados; el análisis detallado mostró lo contrario: las pruebas
estaban correctamente escritas y señalaban una falla real, del mismo tipo que la registrada como
R-01 y R-02 en la Tabla 34b. Es un ejemplo concreto del valor de las pruebas automatizadas de punta
a punta, y también de que el diagnóstico de un fallo no puede darse por supuesto sin reproducirlo:
descartar los dos casos como "*specs* viejos" habría dejado el defecto en el producto.

El caso 4 tiene, además, valor como hallazgo de accesibilidad: que una herramienta automatizada no
pueda identificar el control de reserva por su rol sugiere revisar su marcado semántico, dado que
un lector de pantalla enfrentaría la misma limitación. Los seis casos quedaron corregidos y la
suite completa en verde; lo que permanece abierto es esa revisión del marcado semántico del control
de reserva, registrada como trabajo de corto plazo en [[15-Conclusiones]].

El reporte HTML completo de esta corrida se anexa en `assets/playwright-report-2026-08-02/`.

## Evidencia de pruebas sobre la API PostgREST

La Figura 35 documenta una llamada real a la API de datos, capturada desde el inspector de red del
navegador sobre la aplicación desplegada: la primera imagen muestra la URL completa del *endpoint*,
el método y los encabezados de la petición; la segunda, el cuerpo de la respuesta con registros
reales de la tabla `salones`.

> [!info] Fuente — Captura tomada el 2026-07-29 sobre `/salones` en el entorno desplegado. El
> código de estado es `206 Partial Content` y no `200`: PostgREST responde `206` cuando la
> consulta está paginada mediante el encabezado `Range`, como ocurre aquí con `limit=4`. Es el
> comportamiento esperado del protocolo, no una condición de error.

![Evidencia API PostgREST — headers](../assets/f35-evidencia-api-postgrest-headers.png)
![Evidencia API PostgREST — response](../assets/f35-evidencia-api-postgrest-response.png)

*Figura 35 — Evidencia de pruebas sobre la API PostgREST.*

## Registro de defectos y retesting

Trece incidencias reales, todas etiquetadas `bug` en GitHub y todas cerradas, constituyen el
registro verificable de defectos del proyecto. De esas 13, **5 llevan además una etiqueta de
prioridad real** (`p1-high`/`p2-medium`/`p3-low`) asignada en GitHub — la misma usada en
[[12-Testing-y-Calidad]] (criterios de severidad) —, por lo que su columna "Severidad" queda
verificada, no estimada. Las 8 restantes no fueron priorizadas explícitamente con esa etiqueta, así
que su severidad sigue siendo una estimación (SIM-37).

| Issue | Título | Severidad | Estado | Retesting |
|---|---|---|---|---|
| #87 | `fix(footer)`: links apuntan a rutas incorrectas o inexistentes | Media *(verificada)* | Cerrado | Manual, sobre DEV |
| #85 | `fix`: borrado de salón, horarios de reserva y validaciones del flujo | Media *(estimada)* | Cerrado | Manual, sobre DEV |
| #76 | `fix(footer)`: links del footer son placeholders | Baja *(verificada)* | Cerrado | Manual, sobre DEV |
| #75 | `fix(favorites)`: agregar a favoritos no persiste (sólo estado local) | Alta *(verificada)* | Cerrado | Manual, sobre DEV |
| #74 | `fix(salones)`: el mapa en `/salones` no está implementado | Alta *(verificada)* | Cerrado | Manual, sobre DEV |
| #72 | `fix(nav)`: el link "Cómo funciona" no navega a ninguna sección | Media *(verificada)* | Cerrado | Manual, sobre DEV |
| #71 | `fix(ci)`: estabilizar pipeline de CI | Media *(estimada)* | Cerrado | Verificado en `frontend-tests.yml` |
| #70 | `fix(ci)`: commitear `routeTree.gen.ts` para desbloquear build de CI | Alta *(estimada)* | Cerrado | Verificado en CI |
| #64 | `fix(ux)`: correcciones UX y features faltantes (grupos 1-4) | Media *(estimada)* | Cerrado | Manual, sobre DEV |
| #34 | `fix(seo)`: implementar meta tags y Open Graph | Baja *(estimada)* | Cerrado | Manual, sobre DEV |
| #29 | `fix(ux)`: mejorar manejo de errores y mensajes al usuario | Media *(estimada)* | Cerrado | Manual, sobre DEV |
| #28 | `fix(ux)`: agregar *loading states* a búsquedas y filtros | Baja *(estimada)* | Cerrado | Manual, sobre DEV |
| #26 | `fix(responsive)`: página no es completamente responsive en mobile | Media *(estimada)* | Cerrado | Manual, sobre DEV |

*Tabla 58 — Registro de defectos y retesting. "(verificada)" = severidad confirmada por etiqueta real de GitHub, no estimación.*

> [!info] Fuente — `gh issue list --state all --label bug --json number,title,state` (2026-07-28):
> 13 issues, 13 `CLOSED`. Etiquetas de prioridad: `gh issue list --state all --label bug --json
> number,labels` (2026-08-03) — #74 y #75 con `p1-high` (Alta); #72 y #87 con `p2-medium` (Media);
> #76 con `p3-low` (Baja). La versión anterior de esta tabla tenía #74 como "Media" y #87 y #72
> como "Baja", en contradicción con la propia etiqueta de GitHub y con la clasificación ya correcta
> de [[12-Testing-y-Calidad]] (criterios de severidad); se corrige aquí para que ambas notas
> coincidan.

> [!warning] Dato simulado SIM-37 — Severidad estimada de 8 de los 13 defectos
> GitHub no tiene una etiqueta de prioridad para #85, #71, #70, #64, #34, #29, #28 y #26. Su
> columna "Severidad" es una estimación plausible basada en el impacto funcional descrito en el
> título del issue, no un criterio de triage documentado por el equipo. Los 5 defectos restantes
> (#74, #75, #72, #87, #76) ya no son estimados: su severidad es la etiqueta real de GitHub.

Un defecto adicional, real y verificado —no simulado— se documenta aparte por su relevancia
arquitectónica. A diferencia de las incidencias reconstruidas de la tabla anterior, su nota va
encabezada como *Fuente* y no como *Dato simulado*, porque cada afirmación se verifica leyendo los
archivos de migración que se citan:

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

## Evidencia de la aplicación en ejecución

La Figura 36 documenta el flujo de reserva completo sobre el entorno desplegado, para el salón
"Villa Eventos Tafí": **Paso 1 — Fecha y hora** (25/12/2026, 16:00–22:15), **Paso 2 — Tu evento**
(casamiento, 150 asistentes y datos de contacto) y **Paso 3 — Confirmar**, donde el sistema
calcula la duración (6,25 h) y el total estimado ($125.000) a partir del precio por hora del salón.
El indicador de progreso superior aparece en las tres capturas, mostrando el avance entre pasos.

![Flujo de reserva — 3 pasos](../assets/f37-flujo-reserva.png)

*Figura 36 — Flujo de reserva de la aplicación en ejecución.*

## Evidencia de cobertura de pruebas

La Figura 37 reproduce el encabezado del reporte HTML generado por `@vitest/coverage-v8` sobre la
corrida del 2026-08-02, con las cuatro métricas globales y el desglose por carpeta. Es la fuente
directa de las Tablas 32 y 32a de [[12-Testing-y-Calidad]]: el contraste entre las carpetas de
dominio en verde (`features/auth/store` al 100 %, `features/bookings/api` al 97,05 %) y las de
presentación en rojo (`features/bookings/components` y `features/home/components` en 0 %) es
visible de un vistazo y corresponde a la priorización declarada en la sección 12.

![Reporte de cobertura de @vitest/coverage-v8](../assets/f37-reporte-cobertura.jpg)

*Figura 37 — Reporte de cobertura de pruebas (`@vitest/coverage-v8`, 2026-08-02).*

> [!info] Fuente — `npm --prefix frontend run test:coverage`; captura del reporte HTML generado en
> `frontend/coverage/index.html`. Los porcentajes de la captura (12,44 % de sentencias, 8,97 % de
> ramas, 13,87 % de funciones y 15,68 % de líneas) corresponden a la corrida del 2026-08-02, sobre
> 14 archivos y 73 casos. **Quedaron desactualizados el 2026-08-04**, al agregar
> `BookingFlow.test.tsx` y un caso nuevo en `favorites.test.ts` (cierre de SIM-33/SIM-34, ver
> [[12-Testing-y-Calidad]] Tabla 33): la cobertura global subió a 16,41 % de sentencias (Tabla 32).
> La captura no se regeneró; **Tabla 32 es la cifra vigente**, no esta figura.

## Resumen de evidencias

| Evidencia | Resultado |
|---|---|
| Corrida de Vitest | 15 archivos, 75 casos, todos exitosos (2026-08-04) |
| Corrida E2E de Playwright sobre el entorno desplegado | 111 casos sobre 3 navegadores, todos exitosos (2026-08-02; ver Tablas 57b y 57c) |
| Cobertura de pruebas (`@vitest/coverage-v8`) | 16,41 % global de sentencias; 59,83 % sobre el código ejercitado (2026-08-04; ver Tablas 32 y 32a) |
| Verificación de tipos (`tsc -b --noEmit`) | Sin errores (2026-07-28) |
| Análisis estático (`eslint .`) | 6 errores y 4 advertencias (2026-07-28; ver [[12-Testing-y-Calidad]], Tabla 34) |
| Evidencia de la API de datos | Figura 35 — llamada real capturada sobre el entorno desplegado |
| Evidencia de la aplicación en ejecución | Figura 36 — flujo de reserva de tres pasos |
| Evidencia de cobertura | Figura 37 — reporte HTML de `@vitest/coverage-v8` |

*Tabla 59 — Resumen de evidencias de calidad.*

---
[[Indice|Índice]] · ← [[Anexo-IV-API-y-Repositorio]]
