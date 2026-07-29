---
title: "README — Guía de uso del vault"
seccion: "readme"
orden: 0
tipo: meta
tags: [hosty, informe-final, readme]
estado: completo
updated: 2026-07-28
---

# README — Guía de uso del vault `documentacion-final/`

Este directorio contiene el informe final del proyecto **Hosty** en formato de vault de
[Obsidian](https://obsidian.md), organizado en 16 secciones numeradas (00–15) y 5 anexos
(Anexo I–V), más un conjunto de notas de apoyo (`_meta/`) y de recursos (`assets/`). El punto de
entrada para navegar el contenido es [[Indice]], que enumera las 21 notas en su orden de lectura
y su correspondencia con la rúbrica académica.

## Cómo abrir el vault en Obsidian

1. Abrir Obsidian.
2. Seleccionar **Abrir carpeta como vault**.
3. Elegir la carpeta `documentacion-final/` (no el repositorio completo).
4. Comenzar la lectura desde [[Indice]] o desde [[00-Portada-y-Ficha]].

No se genera ninguna carpeta `.obsidian/` como parte de este cambio: la configuración local del
vault (tema, plugins) queda a criterio de quien lo abra.

## Convención de callouts

Este vault distingue de manera explícita tres tipos de contenido mediante un conjunto cerrado de
tres callouts de Obsidian. Ningún otro tipo de callout debe usarse en las notas de contenido:

- **`[!todo]`** marca un *placeholder*: un dato que sólo el equipo real puede aportar (por
  ejemplo, el nombre de la institución, la carrera o las URLs de producción). Lleva un
  identificador `P-##` y se agrega a [[Pendientes]]. Puede verse un ejemplo real en
  [[00-Portada-y-Ficha]].
- **`[!warning] Dato simulado`** marca contenido plausible pero no verificado en el repositorio
  (por ejemplo, una retrospectiva de sprint reconstruida a partir de la actividad observable, o
  una estimación de presupuesto). Lleva un identificador `SIM-##` e indica la base sobre la que
  se reconstruyó. Este vault reutiliza el mismo marcador en las notas de planificación y
  presupuesto que se agregan en fases posteriores del cambio.
- **`[!info] Fuente`** cita la métrica (`M##`) y el comando o archivo que la reproduce,
  inmediatamente después de la figura, tabla o afirmación numérica que respalda. Puede verse un
  ejemplo real en [[Datos-Verificables]].

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

Esta misma nota se reproduce, palabra por palabra, en [[00-Portada-y-Ficha]] (Sección 0), tal
como exige la especificación de honestidad académica de este cambio.

## Instrucción de exportación a PDF

> Markdown no admite encabezados ni pies de página. Al exportar el vault a PDF desde Obsidian
> (*Archivo → Exportar a PDF*), debe configurarse el pie de página del documento exportado con:
> nombre del proyecto (Hosty), carrera, y número de página. Ninguna nota de este vault renderiza
> un pie de página por sí misma.

Esta instrucción también se reproduce, palabra por palabra, en [[00-Portada-y-Ficha]].

## Estructura del vault

El vault agrupa 28 notas en cuatro conjuntos: las 16 secciones numeradas y los 5 anexos que
constituyen el cuerpo del informe (raíz de `documentacion-final/` y `Anexos/`); las notas de
apoyo en `_meta/` ([[Indice]], [[Datos-Verificables]], [[Indice-de-Figuras]],
[[Indice-de-Tablas]] y [[Pendientes]]), que no forman parte de la rúbrica ni de la numeración de
figuras/tablas; y `assets/README.md`, que documenta las capturas de pantalla pendientes de
incorporar.

## Extensión estimada del informe (calculado por el Lote E, cierre transversal)

Sobre las 21 notas de contenido (00–15 y Anexos I–V, excluyendo `_meta/` y `assets/`), la prosa
narrativa —excluyendo frontmatter, tablas, bloques Mermaid, epígrafes y cuerpos de callout— suma
**≈6.960 palabras** (`wc` aplicado el 2026-07-28), por debajo de la estimación inicial de diseño
de ≈10.800 palabras. La diferencia se explica por notas con mucho contenido tabular/diagramado y
poca prosa de enlace (09, 10, 13, 14), una elección de estilo documentada, no un faltante de
contenido: cada una de esas notas de todos modos cubre íntegramente los elementos MUST de su fila
de rúbrica (ver [[Indice]]).

Sumando la prosa (≈6.960 ÷ 320 palabras/página ≈ 21,8 páginas) más las 37 figuras (× 0,30 ≈ 11,1
páginas) más las 59 tablas (× 0,25 ≈ 14,8 páginas), la extensión total estimada del documento
exportado a PDF es de **≈47,6 páginas**, dentro de la banda de 25–75 páginas exigida por la
rúbrica académica, con margen en ambos sentidos.

---
[[Indice|Índice]] · [[00-Portada-y-Ficha]] · [[Datos-Verificables]] · [[Pendientes]]
