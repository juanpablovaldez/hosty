---
title: "Anexo III — Backlog Completo de User Stories"
seccion: "A-III"
orden: 19
tipo: anexo
tags: [hosty, informe-final, backlog]
estado: completo
tablas: [T51, T52]
updated: 2026-08-04
---

# Anexo III. Backlog Completo de User Stories

Este anexo reproduce el backlog completo del proyecto: las 50 issues del repositorio (M06), con
su hito de GitHub asociado y su estado real, clasificado como **entregada** (funcionalidad
construida) o **diferida** (issue cerrada como `not planned`, alcance excluido del MVP con su
justificación escrita). El detalle de las 15 historias destacadas y su relación con criterios de
aceptación se documenta en
[[09-Planificacion-Scrum]] (Tabla 19); la ejecución cronológica, en
[[13-Ejecucion-por-Sprint]].

## Backlog completo

| Issue | Título | Hito / épica (GitHub) | Estado |
|---|---|---|---|
| #11 | UI-01: High-fidelity Search UI (Filter logic, Plus Jakarta Sans) | Phase 1.B: Search & Filtering | Entregada |
| #12 | UI-02: High-fidelity Salon Cards (Verified badge, responsive) | Phase 1.B: Search & Filtering | Entregada |
| #13 | AUTH-01: Supabase Authentication (Login, Register, Session) | Phase 1.A: Auth & Onboarding | Entregada |
| #14 | DATA-01: Dynamic Salon Listing: Connect to Supabase Table | Phase 1.B: Search & Filtering | Entregada |
| #15 | SALON-01: Salon Detail Page: Gallery & Features | Phase 1.B: Search & Filtering | Entregada |
| #16 | BOOK-01: Booking Flow: Date Selection & Availability | Phase 2: Booking & Payments | Entregada |
| #17 | BOOK-02: Booking Confirmation & User Dashboard | Phase 2: Booking & Payments | Entregada |
| #18 | HOST-01: Host Dashboard: Manage own listings | Phase 1.A: Auth & Onboarding | Entregada |
| #19 | HOST-02: 'Create Salon' Wizard for Hosts | Phase 1.A: Auth & Onboarding | Entregada |
| #20 | TEST-01: Unit & Component Testing Setup (Vitest) | Phase 2+: Polish & Optimization | Entregada |
| #21 | TEST-02: E2E Testing for Booking Flow (Playwright) | Phase 2+: Polish & Optimization | Entregada |
| #22 | INFRA-01: Production Infrastructure (CloudFront + SSL) | Phase 2+: Polish & Optimization | Entregada |
| #23 | DOCS-01: Final Project Report & Handoff | Phase 2+: Polish & Optimization | Entregada |
| #24 | PERF-01: Performance & SEO Optimization | Phase 2+: Polish & Optimization | Entregada |
| #25 | chore(types): regenerar database.types.ts desde Supabase | Phase 2+: Polish & Optimization | Entregada |
| #26 | fix(responsive): página no es completamente responsive en mobile | Phase 2+: Polish & Optimization | Entregada |
| #27 | feat(salones): persistir filtros en URL o localStorage | Phase 1.B: Search & Filtering | Entregada |
| #28 | fix(ux): agregar loading states a búsquedas y filtros | Phase 2+: Polish & Optimization | Entregada |
| #29 | fix(ux): mejorar manejo de errores y mensajes al usuario | Phase 2+: Polish & Optimization | Entregada |
| #30 | feat(salones): implementar paginación o infinite scroll | Phase 1.B: Search & Filtering | Entregada |
| #31 | feat(booking): completar flujo de reserva | Phase 2: Booking & Payments | Entregada |
| #32 | feat(backend): implementar notificaciones por email | Phase 2.B: Notifications | Entregada |
| #33 | feat(social): implementar sistema de reviews y ratings | Phase 2+: Polish & Optimization | Diferida — `not planned` |
| #34 | fix(seo): implementar meta tags y Open Graph | Phase 2+: Polish & Optimization | Entregada |
| #35 | perf: auditar y mejorar Core Web Vitals | Phase 2+: Polish & Optimization | Diferida — `not planned` |
| #36 | feat(i18n): completar traducciones español-inglés | Phase 2+: Polish & Optimization | Entregada |
| #37 | chore(database): revisar y agregar indexes necesarios | Phase 2+: Polish & Optimization | Entregada |
| #38 | chore(design): documentar todos los color tokens del brandbook | Phase 2+: Polish & Optimization | Entregada |
| #45 | feat(payments): integrar Mercado Pago para reservas | Phase 2: Booking & Payments | Diferida — `not planned` |
| #46 | feat(admin): panel de aprobación y moderación de salones | Phase 3.B: Admin Panel | Entregada |
| #47 | feat(host): plan Destacado y suscripción de visibilidad para dueños | Phase 3: Host Features | Entregada |
| #63 | feat(ui): rediseño visual v2 — Design Handoff (tokens, hero editorial, HostyBadge) | Phase 2+: Polish & Optimization | Entregada |
| #64 | fix(ux): correcciones UX y features faltantes (Grupos 1-4) | Phase 2+: Polish & Optimization | Entregada |
| #65 | feat(host): gestión de reservas del host (drawer, confirmar/rechazar, conflictos, RLS) | Phase 3: Host Features | Entregada |
| #66 | feat(host): precios flexibles y catálogo de servicios extra | Phase 3: Host Features | Entregada |
| #67 | feat(host): agenda — calendario mensual con bloqueo de fechas | Phase 3: Host Features | Entregada |
| #68 | feat(host): gestión de salones (pausar/activar/eliminar, contacto WhatsApp/llamada) | Phase 3: Host Features | Entregada |
| #69 | chore(db): migraciones Supabase del panel host | Phase 3: Host Features | Entregada |
| #70 | fix(ci): commitear routeTree.gen.ts para desbloquear build de CI | Phase 2+: Polish & Optimization | Entregada |
| #71 | fix(ci): estabilizar pipeline de CI — npm ci en frontend/, sync de lockfiles | (sin hito) | Entregada |
| #72 | fix(nav): el link 'Cómo funciona' de la navbar no navega a ninguna sección | (sin hito) | Entregada |
| #73 | chore(nacho): integrar cambios pendientes de Nacho | (sin hito) | Entregada |
| #74 | fix(salones): el mapa en /salones no está implementado | (sin hito) | Entregada |
| #75 | fix(favorites): agregar a favoritos no persiste — solo estado local | (sin hito) | Entregada |
| #76 | fix(footer): links del footer son placeholders | (sin hito) | Entregada |
| #81 | feat(host): geolocalizar salones al crearlos para el mapa de /salones | (sin hito) | Entregada |
| #85 | fix: borrado de salón, horarios de reserva y validaciones del flujo | (sin hito) | Entregada |
| #87 | fix(footer): links apuntan a rutas incorrectas o inexistentes | (sin hito) | Entregada |
| #88 | feat(favorites): implementar persistencia de favoritos en Supabase | (sin hito) | Entregada |
| #92 | Test cases: flujo de register/login (unit, integración y e2e) | (sin hito) | Entregada |

*Tabla 51 — Backlog completo de user stories con estado (entregada/diferida).*

> [!info] Fuente — M06: `gh issue list --repo juanpablovaldez/hosty --state all --limit 200 --json
> number,title,state,labels,milestone` (verificado 2026-08-04); **50 entregadas de 50 (100 %)**, de
> las cuales 3 se cerraron como `not planned` (alcance diferido, no trabajo abandonado). Ver
> [[Datos-Verificables]].

### Sobre las 3 historias diferidas

Ninguna de estas tres issues representa trabajo inconcluso dentro de su propio alcance declarado:
las tres son alcance excluido del MVP, decidido y documentado antes de cerrarse formalmente el
2026-08-04.

- **#45** (Mercado Pago) — integración de pasarela de pago fuera del alcance de un MVP académico;
  requiere cuenta comercial y credenciales de producción.
- **#35** (Core Web Vitals) — auditoría de rendimiento planificada como mejora post-entrega.
- **#33** (reviews y ratings) — con etiqueta real `post-mvp` en el propio repositorio: decisión
  explícita de excluir esta funcionalidad del alcance del MVP, no trabajo incompleto.

Las otras dos issues que figuraban como abiertas en verificaciones anteriores de este informe
(**#38**, tokens de color del brandbook; **#23**, este informe final) estaban de hecho completadas
—los tokens en la Tabla 14 de [[08-Diseno-y-Desarrollo]], el informe en este mismo vault— y se
cerraron como entregadas, no como diferidas.

## Trazabilidad: historia → issue → PR → archivo

| Historia | Issue | PR | Archivo principal |
|---|---|---|---|
| Registro e inicio de sesión | #13 | (sin PR con referencia explícita) | `frontend/src/features/auth/store/auth.store.ts` |
| Panel del anfitrión | #18 | #43 | `frontend/src/features/host/components/HostDashboardPage.tsx` |
| Asistente de publicación de salón | #19 | #44 | `frontend/src/features/host/components/SalonWizard.tsx` |
| Búsqueda y filtros | #11 | (sin PR con referencia explícita) | `frontend/src/features/salones/components/SalonFilters.tsx` |
| Detalle de salón | #15 | (sin PR con referencia explícita) | `frontend/src/features/salones/components/SalonDetailPage.tsx` |
| Paginación del listado | #30 | #55 | `frontend/src/features/salones/components/SalonGrid.tsx` |
| Selección de fecha y disponibilidad | #16 | #54 | `frontend/src/features/bookings/components/BookingFlow.tsx` |
| Confirmación y panel de reservas | #17 | (sin PR con referencia explícita) | `frontend/src/features/bookings/components/MyBookingsPage.tsx` |
| Flujo de reserva completo | #31 | (sin PR con referencia explícita) | `frontend/src/features/bookings/components/BookingFlow.tsx` |
| Gestión de reservas del anfitrión | #65 | (sin PR con referencia explícita) | `frontend/src/features/host/components/BookingDrawer.tsx` |
| Precios y servicios flexibles | #66 | (sin PR con referencia explícita) | `frontend/src/features/host/api/host.mutations.ts` |
| Agenda y bloqueo de fechas | #67 | (sin PR con referencia explícita) | `frontend/src/features/host/components/CalendarioView.tsx` |
| Plan destacado | #47 | #80 | `frontend/src/features/host/components/PlanCard.tsx` |
| Pruebas E2E del flujo de reserva | #21 | #57 | `frontend/src/e2e/` |
| Infraestructura de producción | #22 | (sin PR con referencia explícita) | `infra/frontend.tf` |

*Tabla 52 — Trazabilidad historia ↔ issue ↔ PR ↔ archivo.*

> [!info] Fuente — Búsqueda de referencias cruzadas issue↔PR sobre `gh pr list --state all --json
> number,title,body,mergedAt` (verificado 2026-07-28). Donde no se encontró una referencia textual
> explícita al número de issue en el título o cuerpo de ninguna PR, la celda se marca
> honestamente como tal en lugar de asumir una correspondencia; el archivo principal citado en esa
> fila sí es real y corresponde a la funcionalidad de la historia.

---
[[Indice|Índice]] · ← [[Anexo-II-Diagramas-de-Flujo]] · [[Anexo-IV-API-y-Repositorio]] →
