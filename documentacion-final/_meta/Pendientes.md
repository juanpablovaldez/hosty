---
title: "Pendientes — Registro de placeholders y datos simulados"
seccion: "meta"
tipo: meta
tags: [hosty, informe-final, pendientes]
estado: con-pendientes
updated: 2026-07-29
---

# Pendientes — Registro de placeholders y datos simulados

Esta nota agrega todos los callouts `[!todo]` (identificador `P-##`) y `[!warning] Dato simulado`
(identificador `SIM-##`) efectivamente usados en las 28 notas del vault. Es la versión final,
cerrada por el Lote E (cierre transversal) a partir de una relectura completa del vault el
2026-07-28: agrega los identificadores realmente emitidos por los Lotes 0, A, B, C y D (no los
rangos reservados en la fase de diseño, que eran más amplios de lo efectivamente usado).

## Leyenda

| Tipo de callout | Significado | Acción requerida |
|---|---|---|
| `[!todo]` | Placeholder: dato que sólo el equipo real puede aportar | Completar antes de la entrega/defensa y reemplazar el bloque |
| `[!warning] Dato simulado` | Contenido plausible pero no verificado en el repositorio | Validar con el equipo o dejar constancia explícita de que es una reconstrucción |
| `[!info] Fuente` | Cita de una métrica o afirmación verificable | Ninguna — ya está trazada a su fuente en [[Datos-Verificables]] |

> [!important] Los marcadores `P-##` ya no existen en las 21 notas de contenido del informe. El
> 2026-07-29 se limpiaron todas las notas para dejar el documento en estilo formal de presentación:
> los datos resueltos quedaron redactados como contenido, y los pendientes que no llegaron a la
> entrega se retiraron del informe (los que siguen siendo relevantes están registrados como deuda
> técnica o líneas de evolución en [[15-Conclusiones]]). Esta nota se conserva únicamente como
> **registro interno del equipo**; no forma parte del PDF exportado.

## Estado al 2026-07-29

De los 17 placeholders originales: **13 resueltos** (P-01 a P-07, P-09, P-15, P-39, P-41, P-43,
P-44). Queda **1 con fecha comprometida pero sin cerrar** (P-08 — a definir en la reunión del
2026-07-29). Quedan **3 sin tocar**: P-40, P-42, P-46 — ninguno bloquea la defensa de hoy.

⚠️ **Dos hallazgos no anticipados a leer antes de la defensa:**
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
| P-08 | Versión final del documento y fecha de defensa | Versión definitiva del informe y fecha de defensa | 🟡 A definir en reunión del 2026-07-29 |

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
| P-46 | Adopción de una herramienta de cobertura de líneas | Instalar y ejecutar `@vitest/coverage-v8` (u otra) antes de la próxima entrega (destino: script `test`, Tabla 32) |

### [[Anexo-IV-API-y-Repositorio]] (2)

| P-## | Descripción | Qué debe aportar el equipo |
|---|---|---|
| P-39 | URL pública del documento OpenAPI de PostgREST | ✅ Resuelto (2026-07-29) — `https://gjxextyntxfsztpgkqig.supabase.co/rest/v1/`, ver [[Anexo-IV-API-y-Repositorio]] |
| P-40 | Colección Postman curada (si la cátedra la exige) | Confeccionar una colección Postman manual como seguimiento posterior, si se requiere |

### [[Anexo-V-Evidencias-QA]] (4)

| P-## | Descripción | Qué debe aportar el equipo |
|---|---|---|
| P-41 | Captura de una ejecución de prueba contra la API PostgREST | ✅ Resuelto — dos capturas reales contra DEV (`assets/f35-evidencia-api-postgrest-headers.png` y `-response.png`), ver [[Anexo-V-Evidencias-QA]] |
| P-42 | Reporte de cobertura de pruebas | Pendiente hasta instalar una herramienta de cobertura (ver P-46); destino Figura 36 y Tabla 32 |
| P-43 | Capturas del flujo de reserva en ejecución | ✅ Resuelto — collage de los 3 pasos sobre DEV (`assets/f37-flujo-reserva.png`), ver [[Anexo-V-Evidencias-QA]] |
| P-44 | Anexar el reporte HTML de Playwright ya generado | ✅ Resuelto — corrida del 2026-08-02: **111 passed / 0 failed** sobre 3 navegadores, tras corregir los 6 casos que fallaban (2 de ellos, defectos reales del producto — ver Tabla 57c en [[Anexo-V-Evidencias-QA]]) |

`assets/README.md` reproduce, sin numeración propia (nota de apparatus, ver decisión D5 de diseño),
la misma lista de 4 capturas pendientes (P-15, P-41, P-42, P-43) para referencia rápida del equipo.

## Datos simulados (`SIM-##`) — 20 en total

### [[03-Introduccion]] (1)

| SIM-## | Descripción | Base de la reconstrucción |
|---|---|---|
| SIM-01 | Metodología previa de relevamiento | Sin actas de entrevistas o encuestas documentadas; se infiere del documento de alcance del MVP |

### [[05-Problema-a-Resolver]] (1)

| SIM-## | Descripción | Base de la reconstrucción |
|---|---|---|
| SIM-02 | Puntos de dolor por actor sin medición directa | Formulados a partir del dominio del problema y de las funcionalidades priorizadas, no de una encuesta |

### [[06-Impacto-de-la-Solucion]] (1)

| SIM-## | Descripción | Base de la reconstrucción |
|---|---|---|
| SIM-03 | Indicadores de impacto propuestos, no medidos | Propuestas razonables; el proyecto no tiene analítica de producto instrumentada |

### [[07-Equipo-y-Roles]] (1)

| SIM-## | Descripción | Base de la reconstrucción |
|---|---|---|
| SIM-04 | Asignación de rol de equipo (Scrum) | Reconstrucción por volumen y área de los commits de cada integrante |

### [[09-Planificacion-Scrum]] (8)

| SIM-## | Descripción | Base de la reconstrucción |
|---|---|---|
| SIM-09 | Ceremonias Scrum y cadencia | Sin acta formal; cadencia plausible para un equipo estudiantil de 5 integrantes |
| SIM-10 | Definition of Ready (DoR) | Sin documento de DoR versionado en el repositorio |
| SIM-11 | Definition of Done (DoD) | Sin acta registrada del equipo |
| SIM-12 | Ejemplo de criterio de aceptación (Given/When/Then) | Reconstruido a partir del comportamiento observable en `BookingFlow.tsx` y `useCreateBooking` |
| SIM-13 | Límites y foco de los sprints (S1–S5) | Inferidos de la densidad de commits y de clústeres de fecha de migraciones de Supabase |
| SIM-14 | Retrospectiva S1–S2 | Reconstruida a partir de fricciones observables (retrabajo de migración NestJS→Supabase) |
| SIM-15 | Retrospectiva S3–S4 | Reconstruida a partir del hallazgo del `CHECK` de `bookings` corregido en curso |
| SIM-16 | Retrospectiva S5 | Reconstruida a partir de la consolidación de PRs cercana al cierre |

### [[10-Presupuesto]] (3)

| SIM-## | Descripción | Base de la reconstrucción |
|---|---|---|
| SIM-17 | Tarifas y dedicación horaria | Estimación de mercado para perfiles junior/estudiantiles en Tucumán, 2026 |
| SIM-18 | Costo total del proyecto | Deriva de los supuestos simulados de la Tabla 23 más contingencia |
| SIM-19 | Estimación de costo de producción comercial | Valores de lista pública de proveedores, no una cotización contratada |

### [[12-Testing-y-Calidad]] (3)

| SIM-## | Descripción | Base de la reconstrucción |
|---|---|---|
| SIM-33 | Resultado obtenido de CP-01 (caso manual) | Inferido de la prueba de integración equivalente (`bookings.test.ts`) |
| SIM-34 | Resultado obtenido de CP-02 (caso manual) | Inferido de `useToggleFavorite` (`favorites.test.ts`) |
| SIM-35 | Resultado obtenido de CP-03 (caso manual) | Inferido del test de integración `LoginPage.test.tsx` |

### [[15-Conclusiones]] (1)

| SIM-## | Descripción | Base de la reconstrucción |
|---|---|---|
| SIM-36 | Aprendizajes del equipo | Sin registro de retrospectivas individuales; reconstrucción plausible a partir de la naturaleza del proyecto |

### [[Anexo-V-Evidencias-QA]] (1)

| SIM-## | Descripción | Base de la reconstrucción |
|---|---|---|
| SIM-37 | Columna "Severidad (estimada)" del registro de defectos | GitHub no registra un campo de severidad estructurado; estimación plausible por impacto funcional |

## Resumen por lote

| Lote | P-## usados | SIM-## usados |
|---|---|---|
| 0 — Fundación | P-01–P-08 (8) | — |
| A — Marco del proyecto | P-09 (1) | SIM-01–SIM-04 (4) |
| B — Gestión y proceso | P-15 (1) | SIM-09–SIM-19 (11) |
| C — Arquitectura y datos | — | — |
| D — Calidad, métricas y cierre | P-39, P-40, P-41, P-42, P-43, P-44, P-46 (7) | SIM-33–SIM-37 (5) |
| **Total** | **17** | **20** |

Verificación de unicidad (Lote E, 2026-07-28): `grep -rohE 'PLACEHOLDER P-[0-9]+|Dato simulado
SIM-[0-9]+'` sobre las 28 notas confirma que cada identificador `P-##` y `SIM-##` está **declarado
exactamente una vez** en todo el vault; las referencias cruzadas a un mismo identificador desde
otra nota (por ejemplo, "ver SIM-13" en [[13-Ejecucion-por-Sprint]]) son citas, no declaraciones
duplicadas.

---
[[Indice|Índice]]
