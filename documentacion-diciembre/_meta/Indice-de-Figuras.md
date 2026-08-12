---
title: "Índice de Figuras"
seccion: "meta"
tipo: meta
tags: [hosty, informe-final, figuras]
estado: completo
updated: 2026-08-04
---

# Índice de Figuras

Registro global de las 37 figuras del informe (33 diagramas Mermaid + 4 *slots* de captura de
pantalla), con la nota que las contiene y el epígrafe verbatim tal como aparece en el cuerpo de
cada nota. La columna **Estado** indica si la figura ya fue incorporada a su nota (`Hecho`) o si
todavía está pendiente de creación (`Pendiente`). Esta tabla fue verificada y cerrada por el Lote E
(cierre transversal) contra el texto real de las 21 notas de contenido: las 37 figuras están
presentes, numeradas de forma contigua y sin duplicados.

| Figura | Nota de origen | Epígrafe | Estado |
|---|---|---|---|
| F1 | [[01-Resumen-Ejecutivo]] | Síntesis: problema → solución (marketplace de salones) → resultados verificables | Hecho |
| F2 | [[03-Introduccion]] | Estructura del informe: 16 secciones + 5 anexos y sus dependencias de lectura | Hecho |
| F3 | [[04-Objetivos]] | Árbol de objetivos: OG → OE1..OE6, con la épica asociada a cada OE | Hecho |
| F4 | [[05-Problema-a-Resolver]] | Árbol de problemas: causas → problema central → efectos | Hecho |
| F5 | [[06-Impacto-de-la-Solucion]] | Proceso as-is (WhatsApp/Instagram/boca a boca) vs. to-be con Hosty | Hecho |
| F6 | [[07-Equipo-y-Roles]] | Organigrama Scrum: PO / SM / equipo de desarrollo (5 integrantes) | Hecho |
| F7 | [[08-Diseno-y-Desarrollo]] | Proceso de diseño: relevamiento → wireframes → design system → implementación → revisión | Hecho |
| F8 | [[08-Diseno-y-Desarrollo]] | Mapa de navegación: 14 rutas — 6 públicas / 8 protegidas (`requireAuth`) | Hecho |
| F9 | [[08-Diseno-y-Desarrollo]] | Anatomía de una feature: `features/<n>/{components,api,types.ts}` ↔ `routes/` ↔ `shared/lib` | Hecho |
| F10 | [[09-Planificacion-Scrum]] | Iteración Scrum: refinamiento, planificación, daily, revisión y retrospectiva | Hecho |
| F11 | [[09-Planificacion-Scrum]] | Ciclo de vida de un issue en GitHub Projects v2: Todo → In Progress → In Review → Done (+ Blocked) | Hecho |
| F12 | [[09-Planificacion-Scrum]] | Tablero de gestión del proyecto en GitHub Projects v2 (board #4) — *slot de captura* (P-15) | Hecho |
| F13 | [[10-Presupuesto]] | Distribución del presupuesto por rubro: RRHH, infraestructura y herramientas, contingencia | Hecho |
| F14 | [[11-Arquitectura]] | Arquitectura general: SPA React ↔ Supabase (Auth/PostgREST/Storage/Postgres+RLS) | Hecho |
| F15 | [[11-Arquitectura]] | Despliegue: repo → GitHub Actions → build → S3+CloudFront (DEV); Supabase Cloud; Terraform | Hecho |
| F16 | [[11-Arquitectura]] | Bootstrap de autenticación: `main.tsx` → `initAuth()` → `getSession()` → `auth.store` → `authReady` → ruta o redirect | Hecho |
| F17 | [[11-Arquitectura]] | Capas y dependencias permitidas: `routes → features → shared/lib → Supabase` | Hecho |
| F18 | [[11-Arquitectura]] | Ciclo de lectura de datos: componente → hook TanStack Query → `supabase-js` → PostgREST → RLS → Postgres → caché | Hecho |
| F19 | [[12-Testing-y-Calidad]] | Pirámide de pruebas: unitarias (Vitest) / componentes (RTL+jsdom) / E2E (Playwright) | Hecho |
| F20 | [[12-Testing-y-Calidad]] | Pipeline CI/CD: PR → `frontend-tests.yml` (Vitest) → merge a `dev` → `web-dev.yml`; `infra-ci.yml` manual | Hecho |
| F21 | [[12-Testing-y-Calidad]] | Ciclo de vida de un defecto: Reportado → Triage → En curso → En revisión → Retesting → Cerrado (+ No reproducible / Diferido) | Hecho |
| F22 | [[13-Ejecucion-por-Sprint]] | Commits por mes en la rama dev (marzo-junio 2026) | Hecho |
| F23 | [[13-Ejecucion-por-Sprint]] | Issues cerradas por sprint (S1-S5) | Hecho |
| F24 | [[13-Ejecucion-por-Sprint]] | Capacidad más distintiva, extremo a extremo: huésped reserva → anfitrión cotiza (`quotedPrice`) → confirma/rechaza → estado final del huésped | Hecho |
| F25 | [[14-Metricas]] | Distribución de commits por contribuidor (5 contribuidores) | Hecho |
| F26 | [[14-Metricas]] | Pull requests abiertos vs. mergeados por mes | Hecho |
| F27 | [[15-Conclusiones]] | Roadmap de evolución: corto (deuda técnica) / medio (i18n, pagos) / largo (multi-provincia) | Hecho |
| F28 | [[Anexo-I-Modelo-de-Datos]] | Modelo de datos completo: `auth.users` + las 6 tablas públicas con cardinalidades y claves foráneas | Hecho |
| F29 | [[Anexo-I-Modelo-de-Datos]] | Cadena de autorización por propiedad: request → JWT → `auth.uid()` → política RLS → allow/deny | Hecho |
| F30 | [[Anexo-II-Diagramas-de-Flujo]] | Flujo de búsqueda y filtrado: home → `/salones` → filtros/mapa → `/salones/:id` | Hecho |
| F31 | [[Anexo-II-Diagramas-de-Flujo]] | Flujo de reserva (wizard de 3 pasos): fecha y horario → datos del evento → confirmación | Hecho |
| F32 | [[Anexo-II-Diagramas-de-Flujo]] | Flujo de publicación de salón (wizard de 4 pasos): datos básicos → capacidad/precio/servicios → imágenes → vista previa | Hecho |
| F33 | [[Anexo-II-Diagramas-de-Flujo]] | Máquina de estados de una reserva: `pending` → `confirmed` \| `declined` \| `cancelled` | Hecho |
| F34 | [[Anexo-II-Diagramas-de-Flujo]] | Gestión de favoritos y plan destacado | Hecho |
| F35 | [[Anexo-V-Evidencias-QA]] | Evidencia de pruebas sobre la API PostgREST — captura | Hecho |
| F36 | [[Anexo-V-Evidencias-QA]] | Flujo de reserva de la aplicación en ejecución — captura | Hecho |
| F37 | [[Anexo-V-Evidencias-QA]] | Reporte de cobertura de pruebas (`@vitest/coverage-v8`) — captura | Hecho |
| F38 | [[Anexo-VI-Descubrimiento-y-Mercado]] | TAM / SAM / SOM: del mercado nacional al volumen alcanzable con la base de salones actual | Hecho |
| F39 | [[11-Arquitectura]] | Camino de escalado: de un MVP de costo cero a una operación multi-provincia, con el disparador de cada salto | Hecho |

**Total: 39 figuras** (35 diagramas Mermaid + 4 capturas: F12, F35, F36, F37) — secuencia contigua
F1–F39, sin huecos ni duplicados (2026-08-04). F37 (captura de cobertura) faltaba en este índice
pese a estar ya en [[Anexo-V-Evidencias-QA]] desde el cierre de SIM-33/34; se corrige acá.

La figura que en versiones preliminares ocupaba el lugar F36 (reporte de cobertura de líneas) se
retiró del informe por no existir todavía una herramienta de cobertura configurada en el proyecto;
la numeración se compactó en consecuencia.

---
[[Indice|Índice]]
