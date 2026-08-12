---
title: "Presentación final — estructura de slides"
seccion: "meta"
tipo: meta
tags: [hosty, presentacion, slides, defensa]
estado: completo
updated: 2026-08-02
---

# Presentación final — estructura de slides

> [!warning] Superado por [[Defensa-2026-08-07]]
> Este documento describe una versión anterior del mazo (21 slides). El mazo actual, auditado slide
> por slide en la Parte 1 de [[Defensa-2026-08-07]], tiene **15 slides** más una propuesta de slide
> de Presupuesto sin agregar todavía. Usar esa nota como fuente vigente del contenido de cada slide.

Defensa del **viernes 7 de agosto de 2026**. Duración objetivo: **20 a 25 minutos**, con demo en
vivo integrada y participación de **cuatro** integrantes — ver la advertencia arriba.

Este documento define **qué va en cada slide**. El reparto de bloques y las fichas de apoyo
individuales están en [[Presentacion-Reparto-y-Fichas]]; la logística, el guion de la demo y las
preguntas esperables, en [[Guia-de-Presentacion]].

## Criterio de diseño de las slides

Tres reglas que conviene no romper, porque son las que separan una presentación que se sigue de una
que se lee:

1. **Una idea por slide.** Si una slide necesita dos títulos, son dos slides.
2. **Nada de párrafos.** Máximo 5 viñetas de una línea. Lo que se explica se dice hablando; la
   slide sólo ancla la idea.
3. **El número siempre con su fuente.** Cada cifra que aparezca en pantalla existe en el informe y
   es reproducible. Si una cifra no se puede defender, no va.

Paleta: usar los colores de marca del brandbook (coral `#E8452A`, tinta `#1C2B3A`, hueso `#FAF8F5`,
ámbar `#F5A623`). Tipografía consistente en todas las slides. El isotipo de Hosty va en la portada
y, en pequeño, en el pie del resto.

## Mapa de slides

**Total: 21 slides.** La columna *Bloque* remite al reparto de [[Presentacion-Reparto-y-Fichas]].

| # | Slide | Contenido | Apoyo visual | Bloque |
|---|---|---|---|---|
| 1 | Portada | Hosty · Proyecto Final · Tecnicatura en Desarrollo y Calidad de Software · UNSTA · 2026 · los 5 nombres | Isotipo grande sobre fondo hueso | 1 |
| 2 | Qué es Hosty | Una frase: marketplace para encontrar y reservar salones de eventos en Tucumán | Captura de la home, a pantalla completa | 1 |
| 3 | Cómo surge la idea | 3 viñetas: la búsqueda de salón hoy es boca a boca, Instagram y WhatsApp; no hay catálogo unificado en Tucumán; el que organiza no puede comparar | Foto o ilustración simple | 1 |
| 4 | El problema, en concreto | Árbol de problemas: causas → problema central → efectos | **Figura 4** del informe | 1 |
| 5 | Cómo se busca hoy vs. con Hosty | Proceso *as-is* contra *to-be* | **Figura 5** del informe | 1 |
| 6 | Qué decidimos construir | 3 capacidades del MVP: catálogo con filtros y mapa · reserva en 3 pasos · panel del anfitrión | Íconos, sin texto largo | 1 |
| 7 | Qué dejamos afuera, a propósito | Mercado Pago (#45), reviews y ratings (#33, `post-mvp`), panel de administración | Fondo distinto, para marcar que es una decisión y no un olvido | 1 |
| 8 | Cómo trabajamos | Scrum: 5 sprints · ~12,6 semanas · tablero en GitHub Projects v2 · roles del equipo | **Figura 10** (iteración Scrum) | 2 |
| 9 | Los 5 sprints | Una línea por sprint: foco y fecha de cierre | **Tabla 35** resumida a 5 filas de una línea | 2 |
| 10 | Evolución del proyecto | Commits por mes, marzo a junio | **Figura 22** del informe | 2 |
| 11 | Dónde llegamos | 45 de 50 issues cerradas (90 %) · 181 commits · 26 PR mergeados | Captura del tablero (`f12-tablero-projects.png`) | 2 |
| 12 | **DEMO — Buscar y reservar** | Slide separadora, sólo el título. Se pasa al navegador | Fondo coral, texto grande | 3 |
| 13 | **DEMO — Publicar y gestionar** | Slide separadora, sólo el título. Se pasa al navegador | Fondo coral, texto grande | 4 |
| 14 | Arquitectura general | SPA React ↔ Supabase (Auth · PostgREST · Storage · Postgres con RLS) | **Figura 14** del informe | 5 |
| 15 | Tecnologías | Frontend, backend, infraestructura y herramientas, en 4 columnas | Logos + nombre y versión | 5 |
| 16 | La decisión que más nos definió | Sin backend propio: Supabase como *backend as a service*. Qué ganamos y qué cedimos | Dos columnas: ganamos / cedimos | 5 |
| 17 | Seguridad: autorización por propiedad | RLS de Postgres decide por fila según `auth.uid()`; ser anfitrión es consecuencia de publicar un salón, no un permiso otorgado | **Figura 29** (cadena de autorización) | 5 |
| 18 | Cómo probamos | Pirámide de pruebas: unitarias · componentes · E2E | **Figura 19** del informe | 6 |
| 19 | Herramientas de calidad y automatización | Vitest 73 casos · Playwright 5 specs × 3 navegadores · ESLint · TypeScript estricto · 3 workflows de CI/CD | **Figura 20** (pipeline) | 6 |
| 20 | Qué falta y qué sigue | Roadmap corto / mediano / largo plazo | **Figura 27** del informe | 7 |
| 21 | Cierre | "Hosty conecta a quien organiza un evento con el salón indicado, en un solo lugar." + datos de contacto del equipo | Isotipo | 7 |

## Notas sobre las figuras

Todas las figuras citadas ya existen en el informe y se pueden exportar del PDF consolidado
(`documentacion-final-unico/Hosty-Informe-Final.pdf`). No hay que rehacerlas.

Al llevarlas a la slide conviene **agrandarlas y quitarles el epígrafe**: en el informe el epígrafe
es necesario, en una slide es ruido — el orador dice lo que la figura muestra.

Las dos slides separadoras de demo (12 y 13) existen para que el cambio a navegador sea deliberado
y no un accidente. Antes de la presentación hay que dejar el navegador abierto en la pestaña
correcta, en una ventana distinta, y practicar el salto con `Alt+Tab`.

## Errores frecuentes que conviene evitar

- **Leer la slide.** Si la slide dice lo mismo que el orador, sobra una de las dos.
- **Meter código en las slides.** Nadie lee código proyectado en 20 segundos. Si hace falta mostrar
  código, se muestra en el editor, en vivo y con la fuente agrandada.
- **Dejar la demo para el final.** Si el tiempo se acorta, lo que se recorta es la arquitectura, no
  la demo: la demo es lo único que no se puede reemplazar hablando.
- **Cambiar de orador sin transición.** Cada relevo se anuncia en una frase ("ahora Lautaro va a
  contar cómo está construido por dentro"), para que no se note el corte.

---
[[Presentacion-Reparto-y-Fichas]] · [[Guia-de-Presentacion]] · [[Indice|Índice]]
