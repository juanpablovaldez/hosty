---
title: "assets — Capturas y adjuntos del informe"
seccion: "readme"
tipo: meta
tags: [hosty, informe-final, assets]
estado: completo
updated: 2026-08-02
---

# assets — Capturas y adjuntos del informe

Este directorio contiene las imágenes reales que las figuras del informe referencian (a diferencia
de los 33 diagramas Mermaid, que se renderizan desde el propio Markdown) y los archivos adjuntos
que se distribuyen junto al documento.

## Capturas de pantalla

| Figura | Nota de origen | Contenido de la captura | Archivo | Estado |
|---|---|---|---|---|
| F12 | [[09-Planificacion-Scrum]] | Tablero de gestión del proyecto en GitHub Projects v2 (board #4) | `f12-tablero-projects.png` | Incorporada (2026-08-02) |
| F35 | [[Anexo-V-Evidencias-QA]] | Evidencia de pruebas sobre la API PostgREST | `f35-evidencia-api-postgrest.png` | Incorporada (2026-08-02) |
| F36 | [[Anexo-V-Evidencias-QA]] | Reporte de cobertura de pruebas | `f36-cobertura-tests.png` | Incorporada (2026-08-02) |
| F37 | [[Anexo-V-Evidencias-QA]] | Capturas de la aplicación en ejecución (flujo de reserva) | `f37-flujo-reserva.png` | Incorporada (2026-08-02) |
| F38 | [[Anexo-V-Evidencias-QA]] | Reporte HTML de Playwright de la corrida del 2026-08-02 | `f38-playwright-report.png` | Incorporada (2026-08-02) |

Las 5 capturas están incorporadas; no queda ninguna pendiente. `f37-flujo-reserva.png` es un
montaje vertical de los 3 pasos del *wizard* de reserva, recorridos con sesión iniciada sobre el
ambiente desplegado y **sin confirmar la reserva**, para no introducir filas de prueba en la tabla
`bookings`. Este archivo es de apparatus: no forma parte de la numeración `P-##` de la Sección 0 y
sólo sirve como lista de referencia.

## Adjuntos

| Archivo | Formato | Referenciado desde | Contenido |
|---|---|---|---|
| `hosty.postman_collection.json` | Postman Collection v2.1 | [[Anexo-IV-API-y-Repositorio]] (Tablas 53b y 53c) | 7 carpetas / 20 peticiones contra la API PostgREST y Supabase Auth, incluidos 3 casos negativos de verificación de RLS. Las variables `apikey` y `accessToken` se distribuyen vacías: ninguna credencial está versionada |

---
[[Indice|Índice]]
