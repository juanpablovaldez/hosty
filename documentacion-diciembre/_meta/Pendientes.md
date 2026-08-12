---
title: "Pendientes — Registro de placeholders y datos simulados"
seccion: "meta"
tipo: meta
tags: [hosty, informe-final, pendientes]
estado: completo
updated: 2026-08-04
---

# Pendientes — Registro de placeholders y datos simulados

Esta nota agrega todos los callouts `[!todo]` (identificador `P-##`) y `[!note] Dato simulado`
(identificador `SIM-##`) efectivamente usados en las 28 notas del vault. Es la versión final,
cerrada por el Lote E (cierre transversal) a partir de una relectura completa del vault el
2026-07-28: agrega los identificadores realmente emitidos por los Lotes 0, A, B, C y D (no los
rangos reservados en la fase de diseño, que eran más amplios de lo efectivamente usado).

## Leyenda

| Tipo de callout | Significado | Acción requerida |
|---|---|---|
| `[!todo]` | Placeholder: dato que sólo el equipo real puede aportar | Completar antes de la entrega/defensa y reemplazar el bloque |
| `[!note] Dato simulado` | Contenido plausible pero no verificado en el repositorio | Validar con el equipo o dejar constancia explícita de que es una reconstrucción |
| `[!info] Fuente` | Cita de una métrica o afirmación verificable | Ninguna — ya está trazada a su fuente en [[Datos-Verificables]] |

> [!important] Los marcadores `P-##` ya no existen en las 21 notas de contenido del informe. El
> 2026-07-29 se limpiaron todas las notas para dejar el documento en estilo formal de presentación:
> los datos resueltos quedaron redactados como contenido, y los pendientes que no llegaron a la
> entrega se retiraron del informe (los que siguen siendo relevantes están registrados como deuda
> técnica o líneas de evolución en [[15-Conclusiones]]). Esta nota se conserva únicamente como
> **registro interno del equipo**; no forma parte del PDF exportado.

## Estado al 2026-08-02 — cerrado

**Los 17 placeholders están resueltos.** El informe no contiene ningún marcador de contenido
pendiente, ningún campo por completar y ninguna cifra sin fuente citada.

Los últimos cuatro se cerraron el 2026-08-02:

| P-## | Cómo se cerró |
|---|---|
| P-08 | Versión de entrega **v1.2** y fecha de defensa **2026-08-07**, cargadas en la Tabla 1 y en el control de versiones de la Tabla 2 |
| P-40 | Resuelto por decisión documentada: PostgREST publica un documento OpenAPI sincronizado con el esquema, de modo que una colección de Postman escrita a mano sería una segunda fuente de verdad. La justificación y el modo de importarla, si la cátedra la exige, quedan en [[Anexo-IV-API-y-Repositorio]] |
| P-42 | Figura 37 — captura del reporte HTML de `@vitest/coverage-v8`, en [[Anexo-V-Evidencias-QA]] |
| P-46 | `@vitest/coverage-v8` instalado y declarado en `frontend/package.json`, con el script `test:coverage` y el bloque `test.coverage` en `vite.config.ts`. Medición en las Tablas 32 y 32a de [[12-Testing-y-Calidad]] |

**Dos hallazgos no anticipados a leer antes de la defensa:**
1. **P-44** — resuelto el 2026-08-02: la suite quedó 111/111 en verde sobre 3 navegadores. De los 6
   casos que fallaban, 2 resultaron ser un defecto real del producto (validación nativa del
   navegador no desactivada en login y registro), no *specs* viejos. Detalle en
   [[Anexo-V-Evidencias-QA]], Tabla 57c.
2. **P-07** — el proyecto de Supabase que responde en el entorno que el equipo llama "DEV" está
   etiquetado por Supabase como branch **`PRODUCTION`**, no hay un proyecto/branch de desarrollo
   separado. Detalle y sugerencia de cómo nombrarlo en [[00-Portada-y-Ficha]].

## Placeholders (`P-##`) — 17 en total

### [[00-Portada-y-Ficha]] (8)

| P-## | Descripción | Qué debe aportar el equipo | Estado |
|---|---|---|---|
| P-01 | Eslogan del proyecto | Eslogan o bajada conceptual definitiva de Hosty | ✅ Resuelto — se reutilizó el título del hero real (`home.title` en `es.ts`) |
| P-02 | Materia | Nombre de la materia o asignatura | ✅ Resuelto — Proyecto Final |
| P-03 | Carrera | Nombre de la carrera | ✅ Resuelto — Tecnicatura en Desarrollo y Calidad de Software |
| P-04 | Institución | Denominación formal de la institución educativa | ✅ Resuelto — Universidad del Norte Santo Tomás de Aquino |
| P-05 | Año | Año de cursada o de presentación | ✅ Resuelto — 2026, tercer/último año |
| P-06 | Nombres, legajos y roles formales del equipo | Nombre real, legajo y rol de cátedra de los 5 integrantes (destino: Tabla 1 y Tabla 11) | ✅ Resuelto — nombres y legajos cargados; rol reutiliza el Scrum (ver nota en P-09) |
| P-07 | URLs de producción | URLs públicas de despliegue (frontend y, si corresponde, panel de Supabase) | ✅ Resuelto (2026-07-29) — ver [[00-Portada-y-Ficha]], incluye una inconsistencia a aclarar (Supabase marca el branch como "PRODUCTION", no "DEV") |
| P-08 | Versión final del documento y fecha de defensa | Versión definitiva del informe y fecha de defensa | ✅ Resuelto — v1.2, defensa 2026-08-07 (Tablas 1 y 2) |

### [[07-Equipo-y-Roles]] (1)

| P-## | Descripción | Qué debe aportar el equipo | Estado |
|---|---|---|---|
| P-09 | Rol formal de cada integrante | Rol formal de cátedra (no el rol Scrum) y legajos para la Tabla 11 — mismo dato que P-06 | ✅ Resuelto — el equipo confirmó que el rol pedido es el rol Scrum, no hay rol de cátedra separado |

### [[09-Planificacion-Scrum]] (1)

| P-## | Descripción | Qué debe aportar el equipo |
|---|---|---|
| P-15 | Captura del tablero de gestión | ✅ Resuelto — `assets/f12-tablero-projects.png`, ver [[09-Planificacion-Scrum]] |

### [[12-Testing-y-Calidad]] (1)

| P-## | Descripción | Qué debe aportar el equipo |
|---|---|---|
| P-46 | Adopción de una herramienta de cobertura de líneas | ✅ Resuelto — `@vitest/coverage-v8` instalado; script `test:coverage` y bloque `test.coverage` en `vite.config.ts`; medición en las Tablas 32 y 32a |

### [[Anexo-IV-API-y-Repositorio]] (2)

| P-## | Descripción | Qué debe aportar el equipo |
|---|---|---|
| P-39 | URL pública del documento OpenAPI de PostgREST | ✅ Resuelto (2026-07-29) — `https://gjxextyntxfsztpgkqig.supabase.co/rest/v1/`, ver [[Anexo-IV-API-y-Repositorio]] |
| P-40 | Colección Postman curada (si la cátedra la exige) | ✅ Resuelto por decisión documentada — PostgREST publica OpenAPI sincronizado con el esquema; ver justificación en [[Anexo-IV-API-y-Repositorio]] |

### [[Anexo-V-Evidencias-QA]] (4)

| P-## | Descripción | Qué debe aportar el equipo |
|---|---|---|
| P-41 | Captura de una ejecución de prueba contra la API PostgREST | ✅ Resuelto — dos capturas reales contra DEV (`assets/f35-evidencia-api-postgrest-headers.png` y `-response.png`), ver [[Anexo-V-Evidencias-QA]] |
| P-42 | Reporte de cobertura de pruebas | ✅ Resuelto — Figura 37 en [[Anexo-V-Evidencias-QA]], captura del reporte HTML de `@vitest/coverage-v8` |
| P-43 | Capturas del flujo de reserva en ejecución | ✅ Resuelto — collage de los 3 pasos sobre DEV (`assets/f37-flujo-reserva.png`), ver [[Anexo-V-Evidencias-QA]] |
| P-44 | Anexar el reporte HTML de Playwright ya generado | ✅ Resuelto — corrida del 2026-08-02: **111 passed / 0 failed** sobre 3 navegadores, tras corregir los 6 casos que fallaban (2 de ellos, defectos reales del producto — ver Tabla 57c en [[Anexo-V-Evidencias-QA]]) |

`assets/README.md` reproduce, sin numeración propia (nota de apparatus, ver decisión D5 de diseño),
la misma lista de 4 capturas pendientes (P-15, P-41, P-42, P-43) para referencia rápida del equipo.

## Datos simulados (`SIM-##`) — 22 emitidos, 17 activos al 2026-08-04

### [[03-Introduccion]], [[05-Problema-a-Resolver]] y [[06-Impacto-de-la-Solucion]] (3, consolidados en una nota — 2026-08-03)

Antes eran tres callouts `[!note] Dato simulado` completos, uno por sección. Se consolidaron en
una única nota en [[03-Introduccion]] (SIM-01/02/03 juntos); en las otras dos secciones sólo queda
una línea liviana que remite a esa nota. El disclosure sigue estando, sólo bajó el volumen visual.

| SIM-## | Descripción | Base de la reconstrucción |
|---|---|---|
| SIM-01 | Metodología previa de relevamiento | Sin actas de entrevistas o encuestas documentadas; se infiere del documento de alcance del MVP |
| SIM-02 | Puntos de dolor por actor sin medición directa | Formulados a partir del dominio del problema y de las funcionalidades priorizadas, no de una encuesta |
| SIM-03 | Indicadores de impacto propuestos, no medidos | Propuestas razonables; el proyecto no tiene analítica de producto instrumentada |

### [[07-Equipo-y-Roles]] (0 — cerrado el 2026-08-04)

SIM-04 se cerró: el equipo (Mignone, co-liderazgo) confirmó directamente los títulos formales de
rol —incluido el co-liderazgo compartido entre Valdez (Product Owner + infraestructura) y Mignone
(diseño de producto y frontend)— y la reconstrucción pasó a cita `[!info] Fuente` en la Tabla 11 de
[[07-Equipo-y-Roles]]. Ya no depende sólo de evidencia inferida (M33–M35); tiene confirmación
directa del equipo.

### [[09-Planificacion-Scrum]] (8, 2 acotados el 2026-08-04)

| SIM-## | Descripción | Base de la reconstrucción |
|---|---|---|
| SIM-09 | Ceremonias Scrum y cadencia | Acotado 2026-08-04: la cadencia semanal ("weekly", no diaria) está confirmada por el equipo; el resto de las ceremonias (refinamiento, planning, review, retro) sigue sin acta formal |
| SIM-10 | Definition of Ready (DoR) | Sin documento de DoR versionado en el repositorio |
| SIM-11 | Definition of Done (DoD) | Sin acta registrada del equipo |
| SIM-12 | Ejemplo de criterio de aceptación (Given/When/Then) | Reconstruido a partir del comportamiento observable en `BookingFlow.tsx` y `useCreateBooking` |
| SIM-13 | Límites y foco de los sprints (S1–S5) | Acotado 2026-08-04: el equipo confirmó que los sprints, story points y objetivos de sprint fueron reales y formales; sólo las etiquetas "S1"–"S5" y sus rangos de fecha en este informe se infieren de la densidad de commits y de clústeres de fecha de migraciones de Supabase |
| SIM-14 | Retrospectiva S1–S2 | Reconstruida a partir de fricciones observables (retrabajo de migración NestJS→Supabase) |
| SIM-15 | Retrospectiva S3–S4 | Reconstruida a partir del hallazgo del `CHECK` de `bookings` corregido en curso |
| SIM-16 | Retrospectiva S5 | Reconstruida a partir de la consolidación de PRs cercana al cierre |

### [[10-Presupuesto]] (3, acotados el 2026-08-04)

| SIM-## | Descripción | Base de la reconstrucción |
|---|---|---|
| SIM-17 | Dedicación horaria por integrante (MVP y mantenimiento) | La tarifa ARS/hora ahora es dato real (Salancy, trusted, 2026-08-04); la dedicación semanal sigue siendo una reconstrucción propia ordenada cualitativamente por la Tabla 12 |
| SIM-18 | Costo total del proyecto (retrospectivo + prospectivo) | Deriva de la dedicación horaria simulada (SIM-17), el tráfico de AWS estimado (SIM-19) y la dedicación de mantenimiento post-MVP, todos supuestos declarados, más contingencia |
| SIM-19 | Tráfico estimado de AWS S3 + CloudFront | Único ítem de infraestructura sin precio de lista fijo; Supabase, dominio (.com.ar) y Resend ya tienen precio público verificado y salieron de este disclosure |

### [[12-Testing-y-Calidad]] (0 — cerrado el 2026-08-03)

SIM-33, SIM-34 y SIM-35 (resultado de CP-01/CP-02/CP-03) se cerraron agregando los tests
automatizados que faltaban (`BookingFlow.test.tsx` para CP-01, un caso nuevo en
`favorites.test.ts` para CP-02; CP-03 ya tenía cobertura en `LoginPage.test.tsx`) y citando su
resultado real como `[!info] Fuente` en lugar de una inferencia. Ver Tabla 33 en
[[12-Testing-y-Calidad]] y M12/M13 en [[Datos-Verificables]].

### [[15-Conclusiones]] (0 — cerrado el 2026-08-03)

SIM-36 se cerró: el equipo declaró tres aprendizajes reales (coordinación de equipo, presupuesto
reconstruido tardíamente, entornos/*branching* definidos tarde), cada uno con un hallazgo
verificable del repositorio citado como `[!info] Fuente`. Ya no es una reconstrucción plausible sin
respaldo.

### [[Anexo-V-Evidencias-QA]] (1)

| SIM-## | Descripción | Base de la reconstrucción |
|---|---|---|
| SIM-37 | Severidad estimada de 8 de los 13 defectos (sin etiqueta de prioridad en GitHub) | Estimación plausible por impacto funcional. Los otros 5 (#74, #75, #72, #87, #76) tienen etiqueta real `p1/p2/p3` y ya no son SIM (corregido 2026-08-03, además de un error real: #74 estaba mal clasificado) |

### [[Anexo-VI-Descubrimiento-y-Mercado]] (2, agregadas el 2026-08-04)

| SIM-## | Descripción | Base de la reconstrucción |
|---|---|---|
| SIM-38 | Tasa de eventos/año que requieren alquilar un salón (0,5 % de la población), usada en el cálculo de TAM/SAM/SOM | Estimación propia sin fuente estadística externa verificada; elegida deliberadamente conservadora, con el método de cálculo a la vista para poder ajustarla |
| SIM-39 | Reservas pagas por salón por año alcanzables en el corto plazo (8), usada en el cálculo de SOM | Estimación conservadora sin dato histórico propio — la plataforma no tiene todavía un ciclo comercial completo medido |

El resto del contenido del Anexo VI (brainstorming, benchmarking, FODA, discovery → alcance,
modelo de negocio) es testimonio directo del equipo aportado el 2026-08-04, no una reconstrucción
del agente — tratamiento equivalente al ya aplicado a SIM-04. No se numera como `SIM-##` porque no
es una inferencia a falta de evidencia: es información real sin artefacto versionado, igual que la
confirmación de roles formales que cerró SIM-04.

## Resumen por lote

| Lote | P-## usados | SIM-## usados |
|---|---|---|
| 0 — Fundación | P-01–P-08 (8) | — |
| A — Marco del proyecto | P-09 (1) | SIM-01–SIM-03 (3; SIM-04 cerrado el 2026-08-04) |
| B — Gestión y proceso | P-15 (1) | SIM-09–SIM-19 (11; SIM-09, SIM-13, SIM-17 y SIM-19 acotados el 2026-08-04) |
| C — Arquitectura y datos | — | — |
| D — Calidad, métricas y cierre | P-39, P-40, P-41, P-42, P-43, P-44, P-46 (7) | SIM-37 (1; SIM-33–SIM-36 cerrados el 2026-08-03) |
| F — Descubrimiento y mercado (nuevo, 2026-08-04) | — | SIM-38, SIM-39 (2) |
| **Total activo** | **17** | **17** (de 22 emitidos; 5 cerrados) |

Verificación de unicidad (Lote E, 2026-07-28): `grep -rohE 'PLACEHOLDER P-[0-9]+|Dato simulado
SIM-[0-9]+'` sobre las 28 notas confirma que cada identificador `P-##` y `SIM-##` está **declarado
exactamente una vez** en todo el vault; las referencias cruzadas a un mismo identificador desde
otra nota (por ejemplo, "ver SIM-13" en [[13-Ejecucion-por-Sprint]]) son citas, no declaraciones
duplicadas.

---
[[Indice|Índice]]
