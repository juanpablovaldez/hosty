---
title: "assets — Capturas de pantalla pendientes"
seccion: "readme"
tipo: meta
tags: [hosty, informe-final, assets]
estado: con-pendientes
updated: 2026-07-29
---

# assets — Capturas de pantalla del informe

Este directorio recibe las capturas de pantalla que las figuras del informe referencian como
*slot de captura* (figuras numeradas cuyo contenido es una imagen real, no un diagrama Mermaid).
La tabla siguiente indica, para cada una, la nota que la contiene y su estado al 2026-07-29.

| Figura | Nota de origen | Contenido de la captura | Archivo | Estado |
|---|---|---|---|---|
| F12 | [[09-Planificacion-Scrum]] | Tablero de gestión del proyecto en GitHub Projects v2 (board #4) | `f12-tablero-projects.png` | ✅ Incorporada (P-15) |
| F35 | [[Anexo-V-Evidencias-QA]] | Evidencia de pruebas sobre la API PostgREST | `f35-evidencia-api-postgrest-headers.png` + `f35-evidencia-api-postgrest-response.png` | ✅ Incorporada (P-41) — dos archivos: headers y respuesta |
| F36 | [[Anexo-V-Evidencias-QA]] | Reporte de cobertura de pruebas | `f36-reporte-cobertura.png` | ❌ Pendiente (P-42) — bloqueada hasta instalar `@vitest/coverage-v8` (P-46) |
| F37 | [[Anexo-V-Evidencias-QA]] | Capturas de la aplicación en ejecución (flujo de reserva) | `f37-flujo-reserva.png` | ✅ Incorporada (P-43) — collage de los 3 pasos del wizard |

Además, no numerado como figura: `playwright-report-2026-08-02/` contiene el reporte HTML completo
de la corrida E2E de Playwright anexada en [[Anexo-V-Evidencias-QA]] (P-44).

> [!todo] Queda una sola captura pendiente: **F36** (reporte de cobertura), que depende de que se
> instale primero una herramienta de cobertura de líneas (P-46). No bloquea la entrega: su ausencia
> ya está documentada como hallazgo en [[12-Testing-y-Calidad]] y en la deuda técnica de
> [[15-Conclusiones]]. Este archivo es de apparatus (no forma parte de la numeración `P-##` de la
> Sección 0) y sólo sirve como lista de referencia.

---
[[Indice|Índice]]
