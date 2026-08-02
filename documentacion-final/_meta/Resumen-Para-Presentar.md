---
title: "Resumen para presentar — versión de 2 minutos"
seccion: "meta"
tipo: meta
tags: [hosty, informe-final, presentacion, resumen]
estado: completo
updated: 2026-07-29
---

# Resumen para presentar — versión de 2 minutos

Versión condensada de [[01-Resumen-Ejecutivo]], pensada para decir en voz alta o para dejarle una
copia impresa/en pantalla al profesor. No reemplaza al informe completo — es el punto de partida
de la exposición de hoy. Ver [[Guia-de-Presentacion]] para el guion completo con demo y preguntas
esperadas.

## Qué es Hosty, en una frase

**Hosty es un marketplace web para buscar, comparar y reservar salones de eventos en Tucumán**,
que conecta directamente a organizadores de eventos con anfitriones (dueños de salones).

## El problema

Hoy, buscar un salón en Tucumán depende de recomendaciones personales, redes sociales o llamados
telefónicos — no hay un canal único para comparar disponibilidad, precio y condiciones entre
opciones.

## La solución — 3 capacidades centrales, las 3 entregadas de punta a punta

1. **Catálogo público** con búsqueda, filtros (zona, capacidad, precio, servicios) y mapa
   geolocalizado de salones.
2. **Reserva guiada** en 3 pasos (fecha/hora → datos del evento → confirmación) que valida
   disponibilidad y horario mínimo antes de confirmar.
3. **Panel del anfitrión**: dashboard, calendario de reservas, alta y edición de salón, gestión de
   reservas recibidas, y un plan de suscripción "Destacado" que mejora la posición del salón en el
   catálogo.

Además: sistema de favoritos para el organizador, autenticación completa, y geocoding automático
de la ubicación de cada salón.

**Fuera de alcance, diferido de forma explícita** (no es algo que falta por descuido): cobro con
Mercado Pago (requiere cuenta comercial, fuera del alcance académico) y sistema de reseñas
(etiquetado `post-mvp` desde el planeamiento).

## Cómo se construyó

- **Metodología:** Scrum real sobre GitHub — 5 sprints, ~12,6 semanas (29/03 – 24/06/2026), tablero
  de GitHub Projects v2 con 50 issues (45 cerradas), 48 pull requests (26 mergeados).
- **Equipo:** 5 integrantes — Valdez (Product Owner), Mignone (Scrum Master), Martinez Naglieri,
  Garma (foco en QA) y Czurylo (desarrolladores).
- **Stack:** React 19 + Vite + TypeScript, TanStack Router/Query/Form, Tailwind v4, Supabase como
  backend completo (auth, base de datos Postgres, storage) — sin servidor propio. La autorización
  se resuelve con políticas RLS de Postgres según el dueño de cada fila, no con un esquema de
  roles.
- **Calidad:** 66 pruebas automatizadas (Vitest) más 30 escenarios end-to-end (Playwright) sobre
  el entorno real desplegado, 13 incidencias reales registradas y cerradas en GitHub.

## Estado actual — verificable, no una promesa

| Cifra | Valor |
|---|---|
| Commits en `dev` | 181 |
| Issues cerradas / totales | 45 / 50 (90 %) |
| Pull requests mergeados / totales | 26 / 48 |
| Rutas totales / protegidas | 14 / 8 |
| Pruebas automatizadas | 73 (Vitest) + 111 (Playwright, 3 navegadores) — todas en verde |
| Frontend en vivo | `https://d1ako6y2uvskg7.cloudfront.net` |

## La frase de cierre

Hosty no es un prototipo de wireframes: es una aplicación real, desplegada, con datos reales en
Supabase, un flujo de reserva que funciona de punta a punta, y un proceso de desarrollo
verificable — no reconstruido de memoria — en el propio historial de GitHub.

---
[[Guia-de-Presentacion]] · [[Indice|Índice]]
