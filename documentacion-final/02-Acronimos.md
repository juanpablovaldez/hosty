---
title: "02 — Acrónimos"
seccion: "02"
orden: 3
tipo: seccion
tags: [hosty, informe-final, acronimos]
estado: completo
tablas: [T4]
updated: 2026-07-28
---

# 2. Acrónimos

Esta sección reúne, en orden alfabético, las siglas y los términos técnicos utilizados a lo largo
del informe. Para cada uno se indica su significado y, cuando corresponde, una aclaración sobre su
aplicación concreta en la arquitectura de Hosty — en particular en los casos en que el proyecto se
aparta de la implementación más habitual del término, como ocurre con JWT, RBAC y ORM/ODM. El
resto de los acrónimos se define de forma estándar, sin adaptaciones particulares al proyecto.
Cuando corresponde, cada fila remite al número de la sección del informe donde el concepto se
desarrolla con mayor detalle.

| Sigla | Significado | Aplicación en Hosty |
|---|---|---|
| API | Application Programming Interface | Hosty consume la API REST auto-generada por PostgREST (Supabase); no expone una API propia. |
| BaaS | Backend as a Service | Supabase actúa como BaaS: no existe un servidor de aplicación propio en el proyecto. |
| CI/CD | Integración continua / despliegue continuo | GitHub Actions (`frontend-tests.yml`, `web-dev.yml`, `infra-ci.yml`). |
| CRUD | Create, Read, Update, Delete | Operaciones básicas sobre las 6 tablas del esquema `public`. |
| DER | Diagrama de Entidad-Relación | Modelo de datos completo, documentado en el Anexo I. |
| E2E | End to End | Pruebas automatizadas con Playwright sobre flujos completos de usuario. |
| JWT | JSON Web Token | Supabase Auth emite internamente un JWT por sesión; Hosty no implementa un servicio de JWT propio ni maneja tokens manualmente, sino que delega la autenticación completa en las sesiones de Supabase Auth. |
| MVP | Producto Mínimo Viable | Alcance funcional entregado en este proyecto (ver sección 1). |
| ORM/ODM | Object-Relational / Object-Document Mapping | Hosty no utiliza un ORM: accede a los datos mediante `supabase-js` sobre la API PostgREST y tipos TypeScript generados por introspección del esquema. |
| PR | Pull Request | Unidad de integración de código en GitHub. |
| QA | Quality Assurance | Aseguramiento de calidad, cubierto por pruebas automatizadas y manuales (ver sección 12). |
| RBAC | Role-Based Access Control | Hosty **no** implementa RBAC: la autorización es por propiedad (*ownership*) vía RLS (ver sección 7). |
| RLS | Row Level Security | Mecanismo de Postgres que restringe las filas visibles o editables según `auth.uid()`. |
| SPA | Single Page Application | Arquitectura del frontend, construido en React 19. |
| SQL | Structured Query Language | Lenguaje de consulta de la base de datos Postgres. |
| UX/UI | Experiencia de usuario / Interfaz de usuario | Diseño funcional y visual del producto (ver sección 8). |

*Tabla 4 — Glosario de acrónimos y términos.*

---
[[Indice|Índice]] · ← [[01-Resumen-Ejecutivo]] · [[03-Introduccion]] →
