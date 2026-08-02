---
title: "00 — Portada y Ficha Técnica"
seccion: "00"
orden: 1
tipo: seccion
tags: [hosty, informe-final, portada]
estado: completo
tablas: [T1, T2]
updated: 2026-08-02
---

# 00. Portada y Ficha Técnica

## Portada

# Hosty

### *Encontrá, compará y reservá salones sin vueltas.*

Hosty es una plataforma web de tipo marketplace para la búsqueda, comparación y reserva de
salones de eventos en la provincia de Tucumán, Argentina.

**Institución:** Universidad del Norte Santo Tomás de Aquino (UNSTA)

**Carrera:** Tecnicatura en Desarrollo y Calidad de Software

**Materia:** Proyecto Final

**Año de presentación:** 2026

**Integrantes:** Juan Pablo Valdez · Lautaro David Martínez Naglieri · Juan Ignacio Mignone ·
Benjamín Garma · Juan Pablo Czurylo

## Ficha técnica del proyecto

| Campo | Valor |
|---|---|
| Nombre del proyecto | Hosty |
| Eslogan | *Encontrá, compará y reservá salones sin vueltas.* |
| Materia | Proyecto Final |
| Carrera | Tecnicatura en Desarrollo y Calidad de Software |
| Institución | Universidad del Norte Santo Tomás de Aquino (UNSTA) |
| Año | 2026 |
| Integrantes y roles formales | 5 integrantes — detalle de nombre, legajo y rol formal de cátedra en la Tabla 11 de [[07-Equipo-y-Roles]] |
| Metodología | Scrum, con iteraciones (sprints) |
| Período de desarrollo | 2026-03-29 – 2026-06-24 (sprints S1–S5) |
| Repositorio | `https://github.com/juanpablovaldez/hosty` |
| Ambiente desplegado (frontend) | `https://d1ako6y2uvskg7.cloudfront.net/` — S3 + CloudFront, ambiente **DEV**, único publicado (ver Tabla 55 en [[Anexo-IV-API-y-Repositorio]]) |
| Backend / BaaS | `https://gjxextyntxfsztpgkqig.supabase.co` (API PostgREST pública; panel de administración con acceso restringido) |
| Versión de este documento | v1.0 (final) |

*Tabla 1 — Ficha técnica del proyecto.*

> [!info] Fuente — URL del ambiente desplegado verificada en vivo el 2026-08-02 (respuesta HTTP 200
> del frontend y `HTTP 206` de la API PostgREST, ver Figura 35 en [[Anexo-V-Evidencias-QA]]). El
> proyecto de Supabase se declara en `frontend/.env` (`VITE_SUPABASE_URL`) y en el pipeline
> `web-dev.yml`, que sincroniza `dist/` contra el bucket S3 de DEV e invalida la distribución de
> CloudFront. **Nota honesta:** el repositorio define ramas `dev`, `staging` y `main`, pero sólo
> existe workflow de despliegue para DEV; no hay, por lo tanto, un ambiente productivo separado.

## Índice numerado

00. Portada y Ficha Técnica
01. Resumen Ejecutivo
02. Acrónimos
03. Introducción
04. Objetivos
05. Problema a Resolver
06. Impacto de la Solución
07. Equipo y Roles
08. Diseño y Desarrollo
09. Planificación Scrum
10. Presupuesto
11. Arquitectura
12. Testing y Calidad
13. Ejecución por Sprint
14. Métricas
15. Conclusiones
Anexo I. Modelo de Datos
Anexo II. Diagramas de Flujo Complementarios
Anexo III. Backlog de User Stories
Anexo IV. API y Repositorio
Anexo V. Evidencias de QA

El detalle navegable de este índice, con enlaces a cada nota, se encuentra en [[Indice]].

## Control de versiones del documento

| Versión | Fecha | Cambios | Responsable |
|---|---|---|---|
| v0.1 | 2026-07-28 | Generación inicial del vault `documentacion-final/` (Lote 0 — Fundación) | Equipo |
| v0.2 | 2026-07-29 | Cierre transversal: índices de figuras y tablas, verificación de trazabilidad de métricas | Equipo |
| v1.0 | 2026-08-02 | Versión final: datos institucionales y de equipo completados; evidencias de QA incorporadas (cobertura de líneas, reporte E2E, llamada real a la API PostgREST, tablero de gestión); colección Postman anexada | Equipo |

*Tabla 2 — Control de versiones del documento.*

**Versión definitiva:** v1.0 · **Fecha de cierre:** 2026-08-02 · **Fecha de defensa prevista:**
2026-08-14.

> [!warning] Dato simulado SIM-38 — Fecha de defensa
> La fecha de defensa consignada arriba es una previsión del equipo y no una fecha confirmada por
> la cátedra al momento de cerrar esta versión. Debe reemplazarse por la fecha oficial en cuanto
> sea comunicada.

## Nota metodológica sobre el origen de la información

> ## Nota metodológica sobre el origen de la información
>
> Este informe distingue de manera explícita tres tipos de contenido. **(a) Datos verificados**:
> extraídos del historial Git del repositorio, de la API de GitHub y de los archivos de migración
> del proyecto; su origen se cita en un bloque `[!info] Fuente` que incluye el identificador de la
> métrica y el comando que permite reproducirla, y se consolidan en la nota
> [[Datos-Verificables]]. **(b) Contenido simulado**: redactado de forma plausible por no existir
> registro documental del hecho (retrospectivas, entrevistas, estimaciones de esfuerzo y
> presupuesto); se señaliza con `[!warning] Dato simulado` e indica la base sobre la que se
> reconstruyó. Ningún contenido simulado debe interpretarse como evidencia empírica. **(c)
> Contenido pendiente**: información que únicamente el equipo puede aportar (denominación
> institucional, nombres y roles formales, tarifas, capturas de pantalla y URLs productivas); se
> señaliza con `[!todo] PLACEHOLDER` y se consolida en [[Pendientes]].

## Instrucción de exportación a PDF

> Markdown no admite encabezados ni pies de página. Al exportar el vault a PDF desde Obsidian
> (*Archivo → Exportar a PDF*), debe configurarse el pie de página del documento exportado con:
> nombre del proyecto (Hosty), carrera, y número de página. Ninguna nota de este vault renderiza
> un pie de página por sí misma.

---
[[Indice|Índice]] · [[01-Resumen-Ejecutivo]] →
