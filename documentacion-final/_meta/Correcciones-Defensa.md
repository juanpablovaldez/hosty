---
title: "Correcciones pendientes antes de la defensa"
seccion: "meta"
tipo: meta
tags: [hosty, informe-final, presentacion, defensa]
estado: abierto
updated: 2026-08-03
---

# Correcciones pendientes antes de la defensa

Registro abierto de todo lo detectado entre el 2026-08-02 y el 2026-08-03, al revisar la
presentación contra el informe. Defensa: **viernes 7 de agosto de 2026**.

A diferencia de [[Pendientes]] —que registra los marcadores `P-##` y `SIM-##` del informe y está
cerrado—, esta nota registra correcciones de contenido y de presentación surgidas de la revisión
del equipo. No forma parte del PDF exportado.

## Regla de orden

La fuente única de verdad es [[Datos-Verificables]]. Cualquier cifra se corrige en este orden:

```
Datos-Verificables (M##)  →  nota de sección  →  regenerar consolidado  →  slide
```

Al revés, el informe y las slides vuelven a divergir. Ninguna cifra se cambia sólo en la slide.

## A. Cambio de integrantes

**Lautaro David Martínez Naglieri (UIA7-0286) no expone el 2026-08-07.** Rinde en diciembre de 2026
con una feature adicional. **Participó del proyecto y eso no se toca.**

Criterio fijado por el equipo el 2026-08-03: *se saca su parte de la exposición, no su
participación en el proyecto.*

| Dónde aparece | Qué hacer | Estado |
|---|---|---|
| Portada del informe, tabla de integrantes | **Se queda** | Cerrado |
| [[07-Equipo-y-Roles]] Tablas 11 y 12 | **Se quedan** — el historial Git es verificable con `git shortlog` | Cerrado |
| [[14-Metricas]] Figura 22 (torta de commits) | **Se queda** | Cerrado |
| Ficha técnica de la portada | Agregar una fila con quiénes exponen el 2026-08-07 | Abierto |
| Slides: asignación de orador | **Reasignar sus bloques** | Abierto, urgente |
| [[Presentacion-Reparto-y-Fichas]] | Eliminar la Ficha 4 y rehacer las frases de traspaso que la encadenan | Abierto |

**Lo urgente es el reparto, no el nombre.** En el plan de [[Presentacion-Estructura-Slides]] tenía
el **bloque 4: "Demo en vivo — publicar un salón y gestionar reservas" (4:00)**. En el mazo real de
15 slides tiene la slide 6 (1:30) y la demo (3:00). En los dos casos se lleva la demo del lado del
anfitrión, que es justamente la que el profesor pidió expresamente y que hoy falta (ver D4).

**Reasignación recomendada: Czurylo toma los dos bloques de demo (9:00).** Una sola persona al
teclado y cero traspasos en el momento más frágil de la exposición. Ya tiene la sesión abierta y el
panel del anfitrión es la otra cara de la reserva que él construyó. Si Czurylo no está cómodo
sosteniendo nueve minutos, la alternativa es que Mignone tome el bloque del anfitrión —trabajó en
ese panel según la Tabla 11— y quede en 8:30.

**Por qué la portada del informe no se toca.** Naglieri escribió 33 commits y va a defender el
proyecto en diciembre. Sacarlo del informe sería falsear el registro de un trabajo que hizo, y
además es verificable en treinta segundos con `git shortlog -sne --all`. Lo que sí conviene es que
la ficha técnica diga quiénes exponen el 7 de agosto, para que nadie tenga que preguntar por qué
hay cinco nombres en la portada y cuatro personas en el aula.

## B. Correcciones al informe

| # | Nota | Corrección | Estado |
|---|---|---|---|
| 1 | [[00-Portada-y-Ficha]] | Agregar a la Nota metodológica el **corte de métricas del 2026-07-28**: el repositorio hoy tiene 209 commits en `dev` y el informe cita 181; la justificación existe en [[Datos-Verificables]] pero **no se consolida en el PDF** | Abierto |
| 2 | [[14-Metricas]] | Explicar la diferencia entre los 236 commits totales y los 181 de `dev`: 34 están en la rama `staging` (backend NestJS descartado por ADR-1, commits del 2 y 3 de abril) y ~19 en ramas de PRs cerrados sin fusionar (M07: 20 de 48) | Abierto |
| 3 | [[07-Equipo-y-Roles]] Tabla 12 | Agregar advertencia sobre qué mide y qué no mide el volumen de commits. Dato duro verificado: **33 de los 140 commits del integrante con más volumen (24 %) corresponden a `staging`**, la rama del backend descartado, que no aportó una línea al producto entregado. Hay además 9 identidades Git para 5 personas | Abierto |
| 4 | [[04-Objetivos]] OE6 y [[README]] | "28 notas" → **35** (17 secciones + 5 anexos + 11 de `_meta` + 2 README) | Abierto |

## C. Correcciones a las slides

Verificadas contra el informe. Todas las de la Diapo 12 y 13 coinciden con lo que ya había
detectado el equipo.

### Diapo 4 — Objetivos

| Dice | Debe decir |
|---|---|
| OE5: 66 pruebas automatizadas | **73** |
| OE6: 28 notas | **35** (corregir primero en el informe, punto B4) |

### Diapo 11 — La capa de API

**El 35 del equipo es correcto. El 26 también. El informe llama igual a dos cosas distintas.**

Ambos valores están en el informe, con criterios declarados y reproducibles:

| Dónde | Valor | Qué cuenta |
|---|---|---|
| Sección 11.7, Tabla 30 | **26** | hooks exportados de `api/*.ts` (14 consultas + 12 mutaciones) |
| Sección 14, Tabla 38 | **35** | invocaciones de método PostgREST |
| [[Anexo-IV-API-y-Repositorio]] Tabla 53 | **35** | idem, abierto por módulo |

Verificado el 2026-08-03 con el grep que cita la propia fuente de la Tabla 53
(`grep -ohE '\.(select|insert|update|delete|upsert|rpc)\('`): bookings 5, favorites 5, host 21,
salones 4 = **35 exacto** ✓. Y contando hooks exportados: 14 + 12 = **26 exacto** ✓.

**El defecto es la etiqueta compartida**, no las cifras. Quien compare la sección 11 con la 14 ve
26 contra 35 para lo que parece la misma magnitud. Corrección aplicada: la Tabla 30 pasa a hablar
de *operaciones expuestas como hooks* y las Tablas 38 y 53 de *invocaciones PostgREST*, con
referencia cruzada entre ellas.

**Para la slide 11: usar 35 con el desglose por módulo** (host 21, bookings 5, favorites 5,
salones 4), que es lo que dicen dos de las tres tablas. Lo que no se puede es mezclar: el desglose
"14 consultas · 12 mutaciones" pertenece al criterio del 26 y no cierra con 35.

Pendiente aparte de la misma slide: la evidencia que muestra (`2026-08-02`, `limit=3`,
`Content-Range 0-2/17`, 280 ms, 17 salones) **no existe en el informe**. La Figura 35 del
[[Anexo-V-Evidencias-QA]] es del 2026-07-29 con `limit=4` y no registra latencia. O se agrega esa
captura al anexo, o la slide usa la evidencia documentada.

### Diapo 12 — Estrategia de pruebas

| Dice | Debe decir |
|---|---|
| 66 pruebas en 13 archivos de Vitest | **73 en 14** |
| 18 archivos de prueba totales | **19 (14 Vitest + 5 Playwright)** |
| 1.462 líneas sobre 11.148 | **1.505 sobre 11.208** |
| 5 specs × 3 navegadores = 37 escenarios | La cuenta no cierra (5×3=15). Es **37 escenarios × 3 navegadores = 111 ejecuciones** |

### Diapo 13 — Resultados de la medición

| Dice | Debe decir |
|---|---|
| 31/37 aprobados · 6 fallidos · chromium | **111/111 exitosos · 37 escenarios × 3 navegadores (Chromium, Firefox, WebKit)** |
| 12,69 % global de sentencias | **12,44 %** |
| 62,50 % del código ejercitado | **63,01 %** |
| 7 carpetas de componentes en 0 % | **17 carpetas** |

**Además hay que reescribir la conclusión de la slide.** Hoy dice que los 6 fallos eran *specs*
desactualizados y no defectos funcionales. La Tabla 57c del [[Anexo-V-Evidencias-QA]] dice lo
contrario y en negrita: **cuatro eran localizadores mal escritos y dos eran defectos reales del
producto** (la validación de email no se disparaba porque el formulario no desactivaba la
validación nativa del navegador; se corrigió con `noValidate`). El informe deja escrito que la
clasificación preliminar fue errónea.

Es además la mejor anécdota de calidad que tiene el proyecto y conviene contarla: *las pruebas
encontraron un defecto que el equipo no había visto, y casi lo descartamos como test viejo.*

### Diapo 5 — Planificación Scrum

Pedido del equipo: hoy la slide es prácticamente sólo el gráfico de commits. Falta el proceso —
sprints, épicas, tablero de GitHub Projects v2 y retrospectivas.

**Cuidado con las retrospectivas.** La Tabla 22 de [[09-Planificacion-Scrum]] es un **dato simulado
declarado**: no existe acta de retrospectiva registrada, el contenido está reconstruido a partir de
fricciones observables en el historial. En el informe está correctamente señalizado. Si va a una
slide, no puede presentarse como registro de una ceremonia real. La formulación honesta es hablar
de las fricciones que el historial muestra y las correcciones que se tomaron, sin llamarlas actas.

**Recomendación sobre el gráfico de commits por integrante:** sacarlo. Ver decisión abierta D1.

## D. Decisiones abiertas

**D1 — Gráfico de commits por integrante en la slide 5.**
Recomendación: quitarlo y reemplazarlo por contribución **por área** (lo que ya hace la Tabla 11).
El motivo no es que la distribución sea despareja, sino que el volumen de commits no mide aporte:
el 24 % de los commits del integrante con más volumen son de una rama descartada, hay 9 identidades
Git para 5 personas, y quien hace los merges acumula commits ajenos. Las métricas de proceso
(5 sprints, 236 commits, 181 en `dev`, 45/50 issues, 26 PRs) se mantienen como métricas del
proyecto, sin abrir por persona. Verificar antes si la cátedra exige evidencia de contribución
individual. La Tabla 12 se queda en el informe con la advertencia del punto B3.

**D2 — Ampliar la cobertura de pruebas de los flujos críticos.**
Pedido del equipo. Es trabajo real, no una corrección. El costo oculto: **cada test que se agrega
invalida la cifra en ocho lugares del informe** — Tablas 32, 32a y 32b, OE5 en [[04-Objetivos]], el
resumen de la portada, la deuda técnica de [[15-Conclusiones]], la Tabla 60 del
[[Anexo-V-Evidencias-QA]] y las slides 4, 12 y 13. Hay que exportar el PDF de nuevo y volver a
imprimir.

Si se hace, se hace **de una sola vez y con fecha de congelamiento**, no de a poco durante la
semana. Hacerlo el jueves es la peor opción posible: deja el informe impreso desmentido por el
repositorio, que es exactamente el problema que esta nota existe para evitar.

**D3 — Agregar el presupuesto a las slides.**
La sección 10 del informe está completa (618 h, ARS 5.877.000 de RRHH, total ARS 6.816.050 con
contingencia, USD 0 de infraestructura real) y hoy no aparece en ninguna slide. Si se agrega, hay
que declarar que las tarifas son estimadas (SIM-17 y SIM-18).

**D4 — Agregar la demo de publicar un salón.**
El plan de [[Presentacion-Estructura-Slides]] define dos separadoras de demo: "Buscar y reservar" y
"Publicar y gestionar". El mazo sólo tiene la primera. El asistente de publicación en 4 pasos no se
muestra nunca, pese a que la slide 6 lo anuncia. Requiere subir el tiempo de demo de 3:00 a ~5:00 y
sumar capturas de respaldo de ese flujo.

## E. Verificaciones ya hechas

Para no repetirlas:

| Qué | Resultado |
|---|---|
| Commits en `dev` al corte | **181 exacto** ✓ reproduce M01 |
| Commits totales al corte | 234 en el clon local contra los 236 del informe; diferencia de 2, atribuible a ramas borradas tras la medición. No se corrige |
| Commits por integrante | 4 de 5 reproducen exacto; Valdez da 138 contra 140, misma diferencia de 2 |
| Los 53 commits fuera de `dev` | 34 en `origin/staging` (33 de Valdez), 19 en 12 ramas de PRs sin fusionar, 0 en `main` |
| Operaciones PostgREST | **26** ✓ (14 consultas + 12 mutaciones), contado hook por hook |
| Versiones de la slide 8 | ✓ todas coinciden con `frontend/package.json` |
| 10 migraciones, 6 tablas, 14 rutas (6+8) | ✓ |
| Cobertura por módulo de la slide 13 | ✓ los porcentajes por carpeta son correctos |

---
[[Pendientes]] · [[Datos-Verificables]] · [[Guia-de-Presentacion]] · [[Indice|Índice]]
