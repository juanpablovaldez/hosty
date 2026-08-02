---
title: "Pendientes — Registro de placeholders y datos simulados"
seccion: "meta"
tipo: meta
tags: [hosty, informe-final, pendientes]
estado: completo
updated: 2026-08-02
---

# Pendientes — Registro de placeholders y datos simulados

Esta nota agrega todos los callouts `[!todo]` (identificador `P-##`) y `[!warning] Dato simulado`
(identificador `SIM-##`) efectivamente usados en las notas del vault.

**Estado al cierre de la versión v1.0 (2026-08-02): los 17 placeholders quedaron resueltos.** No
queda ningún callout `[!todo]` abierto en el vault. En el mismo cierre se incorporaron 3 datos
simulados nuevos (SIM-38, SIM-39 y SIM-40), por la misma razón que los anteriores: se declara
explícitamente aquello que se reconstruyó en lugar de presentarlo como verificado.

## Leyenda

| Tipo de callout | Significado | Acción requerida |
|---|---|---|
| `[!todo]` | Placeholder: dato que sólo el equipo real puede aportar | Completar antes de la entrega/defensa y reemplazar el bloque |
| `[!warning] Dato simulado` | Contenido plausible pero no verificado en el repositorio | Validar con el equipo o dejar constancia explícita de que es una reconstrucción |
| `[!info] Fuente` | Cita de una métrica o afirmación verificable | Ninguna — ya está trazada a su fuente en [[Datos-Verificables]] |

## Placeholders (`P-##`) — 17 de 17 resueltos

Los 17 placeholders abiertos en la versión v0.2 quedaron resueltos en la versión v1.0
(2026-08-02).

### Resueltos en v1.0 (17)

| P-## | Nota | Cómo se resolvió |
|---|---|---|
| P-01 | [[00-Portada-y-Ficha]] | Eslogan definido: *"Encontrá, compará y reservá salones sin vueltas."* |
| P-02 | [[00-Portada-y-Ficha]] | Materia: Proyecto Final |
| P-03 | [[00-Portada-y-Ficha]] | Carrera: Tecnicatura en Desarrollo y Calidad de Software |
| P-04 | [[00-Portada-y-Ficha]] | Institución: Universidad del Norte Santo Tomás de Aquino (UNSTA) |
| P-05 | [[00-Portada-y-Ficha]] | Año de presentación: 2026 |
| P-06 | [[00-Portada-y-Ficha]] | Nombres y legajos reales de los 5 integrantes incorporados a la Tabla 11 |
| P-07 | [[00-Portada-y-Ficha]] | URL del ambiente desplegado y del proyecto de Supabase incorporadas a la Tabla 1, con la aclaración de que el único ambiente publicado es DEV |
| P-08 | [[00-Portada-y-Ficha]] | Versión v1.0 y fecha de cierre 2026-08-02 en la Tabla 2; la fecha de defensa queda marcada como previsión (SIM-38) |
| P-09 | [[07-Equipo-y-Roles]] | Columna "Rol formal (cátedra)" y legajos agregados a la Tabla 11; la asignación de rol se marca como reconstrucción (SIM-39) |
| P-15 | [[09-Planificacion-Scrum]] | Captura real del tablero incorporada como Figura 12 (`f12-tablero-projects.png`) |
| P-39 | [[Anexo-IV-API-y-Repositorio]] | URL real del documento OpenAPI documentada en la Tabla 53a, con el hallazgo de que exige clave secreta |
| P-40 | [[Anexo-IV-API-y-Repositorio]] | Colección Postman curada creada (`assets/hosty.postman_collection.json`, 7 carpetas / 20 peticiones), Tablas 53b y 53c |
| P-41 | [[Anexo-V-Evidencias-QA]] | Llamada real a PostgREST capturada como Figura 35, con análisis en la Tabla 57c |
| P-42 | [[Anexo-V-Evidencias-QA]] | Reporte de cobertura capturado como Figura 36; métricas en las Tablas 32, 32a y 32b |
| P-43 | [[Anexo-V-Evidencias-QA]] | Recorrido real del wizard con sesión iniciada, capturado como Figura 37 y descripto en la Tabla 57d; la reserva no se confirmó, para no dejar datos de prueba en `bookings` |
| P-44 | [[Anexo-V-Evidencias-QA]] | Reporte HTML de Playwright reejecutado y anexado como Figura 38; resultados en las Tablas 57a y 57b |
| P-46 | [[12-Testing-y-Calidad]] | `@vitest/coverage-v8` instalado, configurado en `vite.config.ts` y expuesto como script `test:coverage` |

`assets/README.md` reproduce, sin numeración propia (nota de apparatus, ver decisión D5 de diseño),
el estado de las capturas para referencia rápida del equipo.

## Datos simulados (`SIM-##`) — 23 en total

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

### [[00-Portada-y-Ficha]] (1)

| SIM-## | Descripción | Base de la reconstrucción |
|---|---|---|
| SIM-38 | Fecha de defensa | Previsión del equipo; no confirmada por la cátedra al cerrar la versión v1.0 |

### [[07-Equipo-y-Roles]] (2)

| SIM-## | Descripción | Base de la reconstrucción |
|---|---|---|
| SIM-04 | Asignación de rol de equipo (Scrum) | Reconstrucción por volumen y área de los commits de cada integrante |
| SIM-39 | Columna "Rol formal (cátedra)" de la Tabla 11 | Derivada del área y volumen de trabajo observable (commits, PRs e issues resueltos); los legajos de esa misma tabla sí son datos reales |

### [[09-Planificacion-Scrum]] (9)

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
| SIM-40 | Criterios de aceptación de las 15 historias destacadas (Tabla 19a) | Los issues describen la funcionalidad en prosa, sin Given/When/Then; reconstruidos desde el texto del issue y el comportamiento observable del código |

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

| Lote | P-## usados | P-## aún pendientes | SIM-## usados |
|---|---|---|---|
| 0 — Fundación | P-01–P-08 (8) | — | SIM-38 (1) |
| A — Marco del proyecto | P-09 (1) | — | SIM-01–SIM-04, SIM-39 (5) |
| B — Gestión y proceso | P-15 (1) | — | SIM-09–SIM-19, SIM-40 (12) |
| C — Arquitectura y datos | — | — | — |
| D — Calidad, métricas y cierre | P-39, P-40, P-41, P-42, P-43, P-44, P-46 (7) | — | SIM-33–SIM-37 (5) |
| **Total** | **17** | **0** | **23** |

Verificación de unicidad (Lote E, 2026-07-28): `grep -rohE 'PLACEHOLDER P-[0-9]+|Dato simulado
SIM-[0-9]+'` sobre las 28 notas confirma que cada identificador `P-##` y `SIM-##` está **declarado
exactamente una vez** en todo el vault; las referencias cruzadas a un mismo identificador desde
otra nota (por ejemplo, "ver SIM-13" en [[13-Ejecucion-por-Sprint]]) son citas, no declaraciones
duplicadas.

---
[[Indice|Índice]]
