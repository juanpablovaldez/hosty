---
title: "Exportar el informe a PDF para imprimir"
seccion: "meta"
tipo: meta
tags: [hosty, informe-final, pdf, impresion]
estado: completo
updated: 2026-08-02
---

# Exportar el informe a PDF para imprimir

El informe se entrega impreso y encuadernado. Esta nota deja fijo el procedimiento para que
cualquier integrante genere exactamente el mismo PDF, sin depender de cómo tenga configurado
su Obsidian.

## Antes de exportar: regenerar el consolidado

El PDF se exporta desde `Hosty-Informe-Final.md`, que es un archivo **generado**. Nunca se edita a
mano: se corrigen las notas de contenido y se vuelve a generar.

```
node documentacion-final-unico/generar-consolidado.mjs
```

El generador hace tres cosas que importan para la impresión:

1. **Reorienta los diagramas anchos.** Un `flowchart LR` con muchas etiquetas se desborda del ancho
   útil de una A4 y mermaid lo reescala hasta volverlo ilegible. Los que superan el umbral pasan a
   orientación vertical (`TD`): mismo contenido, distinta distribución en la página.
2. **Convierte los *callouts* de Obsidian en citas planas.** En el vault, las notas de fuente y los
   avisos de dato reconstruido se escriben como `> [!info]` y `> [!warning]`, que al exportar se
   renderizan como recuadros de color con un ícono. Son cómodos para editar, pero setenta y tres
   bloques de color en un documento encuadernado compiten con el texto y le dan aspecto de wiki.
   El generador los reescribe como `> **Fuente.**` y `> **Dato simulado (SIM-##) — …**`: se conserva
   íntegra la distinción entre dato verificable y dato reconstruido —que es lo que sostiene la
   trazabilidad del informe— y se pierde sólo el color.
3. **Elimina emoji** y avisa por consola si encontró alguno, para que no se cuele ninguno al papel.

Si el generador reporta *"Callouts sin regla de formalización"*, hay un tipo de *callout* nuevo en
alguna nota: agregá la regla en `generar-consolidado.mjs` antes de exportar, o quedará impreso como
"Nota." genérica.

## La hoja de estilos de impresión

`_meta/impresion-formal.css` define la estética del documento impreso: cuerpo con serif justificado,
títulos en sans, cada sección numerada arrancando en hoja nueva, tablas con filete gris y encabezado
repetido en cada página, epígrafes de tabla y figura centrados en cuerpo menor, y enlaces en negro
sin subrayado.

Obsidian sólo lee los fragmentos que estén dentro de la carpeta de configuración de la bóveda, que
**no se versiona** (está en `.gitignore`). Por eso el archivo vive en `_meta/` y hay que copiarlo:

```
copy documentacion-final\_meta\impresion-formal.css documentacion-final\.obsidian\snippets\
```

Después, en Obsidian: **Configuración → Apariencia → Fragmentos CSS → recargar** y encender
**impresion-formal**. En la máquina donde se preparó esta versión ya quedó activado.

Todo el fragmento está dentro de `@media print`: no cambia cómo se ve el vault mientras se edita,
sólo cómo se imprime.

## Exportar

1. Abrir `Hosty-Informe-Final.md` en Obsidian.
2. **Recorrer el documento entero de arriba abajo** antes de exportar. Los diagramas de mermaid se
   renderizan de forma perezosa: los que no se hayan mostrado en pantalla salen en blanco en el PDF.
   Son 33 diagramas; conviene bajar despacio y confirmar que todos se dibujaron.
3. `Ctrl+P` → **Exportar a PDF**.
4. En el diálogo: tamaño **A4**, y **destildar** "Incluir el nombre del archivo como título" (el
   documento ya tiene su propia portada).

## Revisión antes de mandar a imprimir

- [ ] Ningún diagrama en blanco (el error más frecuente, y sólo se ve en el PDF final)
- [ ] Ninguna tabla cortada al medio de una fila
- [ ] Ninguna figura partida entre dos páginas
- [ ] La portada no arranca con una hoja en blanco antes
- [ ] Los epígrafes (*Tabla ## — …*, *Figura ## — …*) quedaron pegados a su tabla o figura, no
      huérfanos al pie de la hoja anterior
- [ ] Ningún bloque de color ni emoji

## Por qué no se usa otra cadena de herramientas

Una salida tipográficamente superior saldría de Pandoc con LaTeX: numeración automática de
secciones, encabezados corridos e índice con números de página reales. No se adoptó porque los
33 diagramas de mermaid habría que prerrenderizarlos a imágenes en un paso aparte, y la cadena
completa —Pandoc, una distribución de LaTeX y un renderizador de mermaid— es más superficie de la
que conviene montar a días de la defensa. Obsidian los renderiza de forma nativa y el resultado,
con esta hoja de estilos, es suficiente para un informe encuadernado.

---
`Guia-de-Presentacion` · `Entrega-Pendrive` · [[Indice|Índice]]
