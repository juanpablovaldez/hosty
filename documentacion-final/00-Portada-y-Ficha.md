---
title: "Portada, resumen y ficha técnica"
seccion: "front"
orden: 1
tipo: front-matter
tags: [hosty, informe-final, portada, resumen]
estado: completo
tablas: [T1, T2]
updated: 2026-08-03
---

# Hosty

**Encontrá, compará y reservá salones sin vueltas**

*Marketplace web para la búsqueda y reserva de salones de eventos en Tucumán*

**Universidad del Norte Santo Tomás de Aquino**
Tecnicatura en Desarrollo y Calidad de Software
Proyecto Final — 2026

**Autores**

| Integrante | Legajo |
|---|---|
| Juan Pablo Valdez | UIA7-0262 |
| Lautaro David Martínez Naglieri | UIA7-0286 |
| Juan Ignacio Mignone | UIA7-0298 |
| Juan Pablo Czurylo | UIA7-0331 |
| Benjamín Garma | UIA7-0362 |

San Miguel de Tucumán, Argentina — 7 de agosto de 2026

## Resumen

La contratación de un salón de eventos en la provincia de Tucumán se resuelve hoy por canales
dispersos —recomendación personal, grupos de redes sociales y llamadas telefónicas— sin ningún
espacio donde comparar disponibilidad, precio y condiciones antes de decidir. El organizador no
llega a conocer el universo real de opciones y no puede saber cuánto cuesta un salón sin contactar
a cada dueño por separado; el anfitrión, en el otro extremo, depende del boca a boca para conseguir
clientes y administra cada reserva a mano, con riesgo de comprometer dos veces la misma fecha.

Este trabajo presenta **Hosty**, un *marketplace* web que reúne la búsqueda, la comparación y la
reserva en un solo lugar, para los dos lados de esa transacción. El producto entrega tres
capacidades de punta a punta: un catálogo público con filtros y mapa geolocalizado; un asistente de
reserva en tres pasos que verifica la disponibilidad antes de confirmar; y un panel para el
anfitrión, con calendario, publicación de salones y gestión de las reservas recibidas.

La solución se construyó como una aplicación de dos capas, sin servidor de aplicación propio: una
*single-page application* en React sobre Vite y TypeScript, y Supabase como plataforma de datos,
autenticación y almacenamiento. La autorización no se resuelve con un esquema de roles sino por
propiedad de la fila, mediante políticas de seguridad a nivel de fila de PostgreSQL. El desarrollo
siguió Scrum a lo largo de cinco *sprints* entre marzo y junio de 2026, con el tablero, las
incidencias y las solicitudes de incorporación administrados en GitHub.

El resultado es una aplicación desplegada y funcionando sobre infraestructura real, con 75 pruebas
automatizadas y 111 ejecuciones de prueba de punta a punta sobre tres navegadores, todas en verde,
y una canalización de integración y despliegue continuos. Cada cifra de este informe se cita contra
el comando que permite reproducirla, y el contenido que no pudo verificarse en el repositorio se
declara explícitamente como reconstruido.

**Palabras clave:** marketplace de servicios · aplicación web · *backend as a service* ·
seguridad a nivel de fila · Scrum · pruebas automatizadas · integración continua

## Ficha técnica del proyecto

| Campo | Valor |
|---|---|
| Nombre del proyecto | Hosty |
| Eslogan | Encontrá, compará y reservá salones sin vueltas |
| Materia | Proyecto Final |
| Carrera | Tecnicatura en Desarrollo y Calidad de Software |
| Institución | Universidad del Norte Santo Tomás de Aquino |
| Año | 2026 — tercer año (último año) de la Tecnicatura |
| Integrantes y roles | Ver Tabla 11 en [[07-Equipo-y-Roles]] |
| Metodología | Scrum, con iteraciones (*sprints*) |
| Período de desarrollo | 2026-03-29 – 2026-06-24 (*sprints* S1–S5) |
| Repositorio | `https://github.com/juanpablovaldez/hosty` |
| Frontend desplegado | `https://d1ako6y2uvskg7.cloudfront.net` |
| Backend (Supabase) | `https://gjxextyntxfsztpgkqig.supabase.co` |
| Fecha de defensa | 2026-08-07 |
| Integrantes que exponen en esta instancia | Juan Pablo Valdez, Juan Ignacio Mignone, Juan Pablo Czurylo y Benjamín Garma. Lautaro David Martínez Naglieri, cuya participación en el desarrollo se documenta en las Tablas 11 y 12, defiende en una instancia posterior |
| Versión de este documento | v1.4 (versión de entrega) |

*Tabla 1 — Ficha técnica del proyecto.*

> [!info] Fuente — La URL del backend corresponde al identificador de proyecto de Supabase
> (`hosty`, región `us-west-2`), verificado tanto en la consola del proveedor como en la traza de
> red real de la aplicación desplegada que documenta la Figura 35.

## Control de versiones del documento

| Versión | Fecha | Cambios | Responsable |
|---|---|---|---|
| v0.1 | 2026-07-28 | Redacción inicial del informe a partir del historial del repositorio | Equipo |
| v1.0 | 2026-07-29 | Datos institucionales, entornos desplegados y primeras evidencias de QA | Equipo |
| v1.1 | 2026-08-02 | Revisión de usabilidad previa a la entrega (Tabla 34b); corrección de los seis casos E2E que fallaban y reejecución de la suite completa sobre el entorno desplegado (Tablas 57b y 57c) | Equipo |
| v1.2 | 2026-08-02 | Adopción de `@vitest/coverage-v8` y medición de cobertura bajo ambos criterios (Tablas 32 y 32a, Figura 37); cierre de los 17 marcadores de contenido pendiente | Equipo |
| v1.3 | 2026-08-03 | Versión de entrega: estructura de trabajo final —portada, resumen, índices de tablas y figuras, bibliografía— y numeración corrida de las secciones | Equipo |
| v1.4 | 2026-08-03 | Fecha de corte de las métricas de proceso incorporada a esta nota metodológica; desglose de los commits fuera de `dev` (sección 14); advertencia sobre el alcance de la Tabla 12; desambiguación del recuento de operaciones de API entre las Tablas 30, 38 y 53 | Equipo |

*Tabla 2 — Control de versiones del documento.*

## Nota metodológica sobre el origen de la información

Este informe distingue de manera explícita dos tipos de contenido. **(a) Datos verificados**:
extraídos del historial Git del repositorio, de la API de GitHub y de los archivos de migración del
proyecto; su origen se cita en una nota *Fuente* que incluye el identificador de la métrica y el
comando que permite reproducirla. **(b) Contenido reconstruido**: redactado de forma plausible por
no existir registro documental del hecho —retrospectivas, entrevistas y estimaciones de esfuerzo y
presupuesto—; se señaliza como *Dato simulado* e indica la base sobre la que se reconstruyó. Ningún
contenido reconstruido debe interpretarse como evidencia empírica.

Esta necesidad de reconstrucción es consecuencia directa de la naturaleza del proyecto: Hosty es un
**MVP académico**, sin cliente real ni instancias formales de relevamiento, entrevista o ceremonia
documentada de punta a punta durante los cuatro meses de desarrollo. Para que el informe igual
describa un proceso de trabajo completo y coherente —con su planificación, sus ceremonias y su
presupuesto—, el equipo optó por reconstruir de forma explícita el contenido que no quedó
documentado en su momento, en lugar de dejar esas secciones vacías. Esa decisión editorial es la que
señaliza el sistema *Dato simulado* descripto arriba.

**Fecha de corte de las métricas de proceso.** Las cifras que describen la ejecución del proyecto
—commits, *issues*, *pull requests* y su distribución por *sprint*— se congelaron el **2026-07-28**,
al cierre del quinto y último *sprint*. El trabajo posterior a esa fecha corresponde a tareas de
estabilización previas a la defensa —ampliación de la suite de pruebas, corrección de detalles de
interfaz y redacción de este informe— y no forma parte del alcance planificado de los *sprints*,
por lo que se excluye deliberadamente: incorporarlo distorsionaría la lectura de la velocidad del
equipo durante el desarrollo. Por eso el repositorio, consultado hoy, exhibe más *commits* que los
que cita la sección 14. Las métricas que describen el **estado actual del producto** —rutas,
tablas, operaciones de API, cobertura de pruebas— se re-verificaron en cambio el **2026-08-02** y
reflejan el repositorio tal como se entrega.

---
[[Indice|Índice]] · [[01-Resumen-Ejecutivo]] →
