/**
 * Genera el informe final consolidado a partir del vault `documentacion-final/`.
 *
 * Uso:  node documentacion-final-unico/generar-consolidado.mjs
 *
 * Produce dos salidas equivalentes desde una única fuente de verdad (el vault):
 *   1. documentacion-final/Hosty-Informe-Final.md
 *      Dentro del vault, para abrirlo en Obsidian y exportarlo a PDF: las rutas de
 *      imagen (`assets/...`) resuelven, y Obsidian renderiza mermaid y callouts nativamente.
 *   2. documentacion-final-unico/Hosty-Informe-Final.md
 *      Copia portable fuera del vault, con las rutas de imagen reescritas.
 *
 * Transformaciones aplicadas a cada nota (mismas convenciones que el consolidado original):
 *   - se elimina el frontmatter YAML
 *   - los wikilinks [[Nota]] y [[Nota|alias]] se convierten en anclas internas
 *   - se elimina el pie de navegación final
 *   - se normalizan las rutas de imagen relativas de los anexos (`../assets/` -> `assets/`)
 */

import { readFileSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..')
const vault = join(raiz, 'documentacion-final')

/** Orden de lectura canónico: 16 secciones + 5 anexos. */
const NOTAS = [
  '00-Portada-y-Ficha.md',
  '01-Resumen-Ejecutivo.md',
  '02-Acronimos.md',
  '03-Introduccion.md',
  '04-Objetivos.md',
  '05-Problema-a-Resolver.md',
  '06-Impacto-de-la-Solucion.md',
  '07-Equipo-y-Roles.md',
  '08-Diseno-y-Desarrollo.md',
  '09-Planificacion-Scrum.md',
  '10-Presupuesto.md',
  '11-Arquitectura.md',
  '12-Testing-y-Calidad.md',
  '13-Ejecucion-por-Sprint.md',
  '14-Metricas.md',
  '15-Conclusiones.md',
  '16-Bibliografia.md',
  'Anexos/Anexo-I-Modelo-de-Datos.md',
  'Anexos/Anexo-II-Diagramas-de-Flujo.md',
  'Anexos/Anexo-III-Backlog-User-Stories.md',
  'Anexos/Anexo-IV-API-y-Repositorio.md',
  'Anexos/Anexo-V-Evidencias-QA.md',
  'Anexos/Anexo-VI-Descubrimiento-y-Mercado.md',
]

/** nombre de nota -> [texto legible, ancla] para reescribir wikilinks. */
const DESTINOS = {
  '00-Portada-y-Ficha': ['la portada', 'hosty'],
  '01-Resumen-Ejecutivo': ['Resumen Ejecutivo', '1-resumen-ejecutivo'],
  '02-Acronimos': ['Acrónimos', '2-acronimos'],
  '03-Introduccion': ['Introducción', '3-introduccion'],
  '04-Objetivos': ['Objetivos', '4-objetivos'],
  '05-Problema-a-Resolver': ['Problema a Resolver', '5-problema-a-resolver'],
  '06-Impacto-de-la-Solucion': ['Impacto de la Solución', '6-impacto-de-la-solucion'],
  '07-Equipo-y-Roles': ['Equipo y Roles', '7-equipo-y-roles'],
  '08-Diseno-y-Desarrollo': ['Diseño y Desarrollo', '8-diseno-y-desarrollo'],
  '09-Planificacion-Scrum': ['Planificación Scrum', '9-planificacion-scrum'],
  '10-Presupuesto': ['Presupuesto', '10-presupuesto'],
  '11-Arquitectura': ['Arquitectura', '11-arquitectura'],
  '12-Testing-y-Calidad': ['Testing y Calidad', '12-testing-y-calidad'],
  '13-Ejecucion-por-Sprint': ['Ejecución por Sprint', '13-ejecucion-por-sprint'],
  '14-Metricas': ['Métricas', '14-metricas'],
  '15-Conclusiones': ['Conclusiones', '15-conclusiones'],
  '16-Bibliografia': ['Bibliografía', '16-bibliografia'],
  'Anexo-I-Modelo-de-Datos': ['Anexo I. Modelo de Datos', 'anexo-i-modelo-de-datos'],
  'Anexo-II-Diagramas-de-Flujo': [
    'Anexo II. Diagramas de Flujo Complementarios',
    'anexo-ii-diagramas-de-flujo-complementarios',
  ],
  'Anexo-III-Backlog-User-Stories': [
    'Anexo III. Backlog Completo de User Stories',
    'anexo-iii-backlog-completo-de-user-stories',
  ],
  'Anexo-IV-API-y-Repositorio': ['Anexo IV. API y Repositorio', 'anexo-iv-api-y-repositorio'],
  'Anexo-V-Evidencias-QA': ['Anexo V. Evidencias de QA', 'anexo-v-evidencias-de-qa'],
  'Anexo-VI-Descubrimiento-y-Mercado': [
    'Anexo VI. Descubrimiento de Producto y Mercado',
    'anexo-vi-descubrimiento-de-producto-y-mercado',
  ],
}

const sinFrontmatter = (texto) => texto.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '')

/** Ancla al estilo de Obsidian: minúsculas, sin diacríticos ni puntuación, espacios a guiones. */
const ancla = (titulo) =>
  titulo
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')

/**
 * Índices de contenido, tablas y figuras, construidos leyendo el documento ya armado. Se generan
 * en vez de mantenerse a mano porque una lista de 65 tablas escrita a mano se desincroniza en la
 * primera edición y nadie lo nota hasta que está impresa.
 *
 * No llevan número de página: el markdown no los conoce y Obsidian no los genera al exportar.
 * Cada entrada indica en cambio la sección donde vive, que es lo que permite encontrarla.
 */
function construirIndices(cuerpo) {
  const general = []
  const tablas = []
  const figuras = []
  let seccionActual = ''
  let enPreliminar = false

  for (const linea of cuerpo.split('\n')) {
    const h1 = linea.match(/^# (.+)$/)
    if (h1) {
      const titulo = h1[1].trim()
      // El H1 de la portada es el nombre del proyecto; como etiqueta de sección en los índices
      // de tablas y figuras no dice nada, así que se nombra por lo que es.
      enPreliminar = titulo === 'Hosty'
      seccionActual = enPreliminar ? 'Material preliminar' : titulo
      if (!enPreliminar) general.push({ nivel: 1, titulo, ancla: ancla(titulo) })
      continue
    }
    const h2 = linea.match(/^## (.+)$/)
    if (h2) {
      // El material preliminar —resumen, ficha técnica, control de versiones— va impreso justo
      // antes del índice: listarlo dentro de él es redundante y deja las entradas sin una
      // sección padre de la que colgar.
      if (!enPreliminar) general.push({ nivel: 2, titulo: h2[1].trim(), ancla: ancla(h2[1].trim()) })
      continue
    }
    const t = linea.match(/^\*Tabla (\d+[a-z]?) — (.+?)\.?\*$/)
    if (t) tablas.push({ n: t[1], titulo: t[2], seccion: seccionActual })
    const f = linea.match(/^\*Figura (\d+[a-z]?) — (.+?)\.?\*$/)
    if (f) figuras.push({ n: f[1], titulo: f[2], seccion: seccionActual })
  }

  // Dos espacios de sangría, no cuatro: con cuatro, markdown interpreta la línea como bloque de
  // código y el índice sale impreso como código fuente en vez de como lista.
  const indiceGeneral = general
    .map((e) => `${e.nivel === 2 ? '  - ' : '- '}[${e.titulo}](#${e.ancla})`)
    .join('\n')

  // Un epígrafe puede contener barras verticales —la Figura 33 enumera los estados de una reserva
  // como `pending` | `confirmed` | `declined`—, y sin escaparlas parten la fila del índice en
  // celdas de más.
  const celda = (s) => s.replace(/\|/g, '\\|')

  const listado = (items, etiqueta) =>
    items.length
      ? items
          .map((i) => `| ${etiqueta} ${i.n} | ${celda(i.titulo)} | ${celda(i.seccion)} |`)
          .join('\n')
      : `| — | (sin ${etiqueta.toLowerCase()}s) | — |`

  return {
    indiceGeneral,
    indiceTablas: listado(tablas, 'Tabla'),
    indiceFiguras: listado(figuras, 'Figura'),
    totales: { tablas: tablas.length, figuras: figuras.length },
  }
}

/**
 * Adaptación para impresión: un `flowchart LR` ancho se desborda del ancho útil de una hoja A4 y
 * mermaid lo reescala hasta volverlo ilegible. Cuando la suma de las etiquetas del diagrama supera
 * el umbral, se pasa a orientación vertical (TD): el contenido y las relaciones son idénticos,
 * sólo cambia cómo se distribuye en la página. Los diagramas angostos se dejan en LR.
 */
const UMBRAL_ANCHO_LR = 80

function adaptarMermaidParaImpresion(texto, nota) {
  return texto.replace(/```mermaid\r?\n([\s\S]*?)```/g, (bloque, cuerpo) => {
    if (!/^\s*(flowchart|graph)\s+(LR|RL)\b/m.test(cuerpo)) return bloque
    const etiquetas = cuerpo.match(/\[[^\]]*\]|\{[^}]*\}/g) || []
    const ancho = etiquetas.reduce((total, e) => total + e.length, 0)
    if (ancho <= UMBRAL_ANCHO_LR) return bloque
    convertidos.push(`  ${nota} (ancho ${ancho}) LR -> TD`)
    return bloque.replace(/^(\s*)(flowchart|graph)\s+(LR|RL)\b/m, '$1$2 TD')
  })
}

/** Quita el pie de navegación final (`---` + línea con enlaces al índice). */
const sinPieDeNavegacion = (texto) =>
  texto.replace(/\r?\n---\r?\n\[\[Indice[^\n]*\r?\n?$/, '\n').trimEnd()

/**
 * Estilo formal de impresión. En el vault, las notas de fuente y los avisos de dato simulado se
 * escriben como callouts de Obsidian (`> [!info]`, `> [!warning]`), que al exportar se renderizan
 * como recuadros de color con un ícono. Eso es útil para editar, pero en un documento impreso y
 * encuadernado 142 bloques de color compiten con el texto y le dan aspecto de wiki, no de informe.
 *
 * Aquí se convierten en citas planas con una entradilla en negrita: se conserva íntegro el
 * contenido y la distinción entre "fuente verificable" y "dato reconstruido" —que es lo que
 * sostiene la trazabilidad del informe— pero se pierde el color y el ícono.
 */
function formalizarCallouts(texto, nota) {
  let salida = texto
    .replace(/^> \[!info\][ \t]*Fuente[ \t]*—[ \t]*/gm, '> **Fuente.** ')
    .replace(
      /^> \[!warning\][ \t]*Dato simulado[ \t]+(SIM-\d+)[ \t]*—[ \t]*(.*)$/gm,
      (_, id, titulo) => `> **Dato simulado (${id}) — ${titulo.trim().replace(/\.\s*$/, '')}.**`,
    )
    .replace(/^> \[!warning\][ \t]*Dato simulado[ \t]*—[ \t]*/gm, '> **Dato simulado.** ')

  salida = salida.replace(/^> \[!(\w+)\][ \t]*/gm, (_, tipo) => {
    calloutsSinRegla.push(`  ${nota}: [!${tipo}] sin regla de formalización -> "Nota."`)
    return '> **Nota.** '
  })

  return salida
}

/** El documento impreso no lleva emoji: se detectan para que no pasen inadvertidos. */
const RANGO_EMOJI =
  /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}\u{2705}\u{274C}\u{26A0}]/gu

function detectarEmoji(texto, nota) {
  const encontrados = texto.match(RANGO_EMOJI)
  if (encontrados) {
    emojiDetectados.push(`  ${nota}: ${[...new Set(encontrados)].join(' ')}`)
  }
  return texto.replace(RANGO_EMOJI, '').replace(/[ \t]{2,}/g, ' ')
}

/** [[Nota]] y [[Nota|alias]] -> [texto](#ancla). */
function resolverWikilinks(texto, nota) {
  return texto.replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (crudo, destino, alias) => {
    const entrada = DESTINOS[destino.trim()]
    if (!entrada) {
      // Notas de apoyo (_meta/) que no forman parte del consolidado: quedan como texto plano.
      avisos.push(`  ${nota}: [[${destino}]] no es una nota del consolidado -> texto plano`)
      return `\`${alias ? alias.trim() : destino.trim()}\``
    }
    const [legible, ancla] = entrada
    return `[${alias ? alias.trim() : legible}](#${ancla})`
  })
}

const avisos = []
const convertidos = []
const calloutsSinRegla = []
const emojiDetectados = []

const cuerpos = NOTAS.map((nota) => {
  let texto = readFileSync(join(vault, nota), 'utf8')
  // Las notas del vault tienen finales de línea mixtos según quién las editó. Sin normalizar,
  // un `\r` residual queda dentro del título y produce anclas rotas, y hace que los epígrafes
  // de tabla y figura no se reconozcan al construir los índices.
  texto = texto.replace(/\r\n/g, '\n')
  texto = sinFrontmatter(texto)
  texto = sinPieDeNavegacion(texto)
  texto = resolverWikilinks(texto, nota)
  texto = adaptarMermaidParaImpresion(texto, nota)
  texto = formalizarCallouts(texto, nota)
  texto = detectarEmoji(texto, nota)
  return texto
})

// Fecha local, no UTC: generar el informe después de las 21 h en Argentina (UTC-3) lo fechaba al
// día siguiente y lo dejaba en contradicción con las fechas de verificación del propio documento.
const ahora = new Date()
const hoy = [
  ahora.getFullYear(),
  String(ahora.getMonth() + 1).padStart(2, '0'),
  String(ahora.getDate()).padStart(2, '0'),
].join('-')

// La primera nota es el material preliminar (portada, resumen, ficha técnica); el resto, el cuerpo
// numerado y los anexos. Los índices se intercalan entre ambos, que es donde van en un trabajo
// final: después del resumen y antes de la primera sección.
const preliminar = cuerpos[0].trim()
const cuerpoPrincipal = cuerpos.slice(1).join('\n\n---\n\n')

const { indiceGeneral, indiceTablas, indiceFiguras, totales } = construirIndices(
  `${preliminar}\n${cuerpoPrincipal}`,
)

const indices = `---

## Índice general

${indiceGeneral}

---

## Índice de tablas

Sin numeración de página: el documento se compone en markdown y la paginación la resuelve el
exportador. Cada entrada indica la sección donde se encuentra la tabla.

| N.º | Título | Sección |
|---|---|---|
${indiceTablas}

---

## Índice de figuras

| N.º | Título | Sección |
|---|---|---|
${indiceFiguras}
`

const documento = `${preliminar}\n\n${indices}\n---\n\n${cuerpoPrincipal}\n`

// 1. Dentro del vault: rutas `assets/...` tal como las resuelve Obsidian desde la raíz del vault.
const enVault = documento.replace(/\]\(\.\.\/assets\//g, '](assets/')
writeFileSync(join(vault, 'Hosty-Informe-Final.md'), enVault, 'utf8')

// 2. Copia portable fuera del vault: las imágenes viven un nivel más arriba.
const portable = enVault.replace(/\]\(assets\//g, '](../documentacion-final/assets/')
writeFileSync(join(raiz, 'documentacion-final-unico', 'Hosty-Informe-Final.md'), portable, 'utf8')

const lineas = enVault.split('\n').length
console.log(`OK — ${NOTAS.length} notas consolidadas, ${lineas} líneas`)
console.log(`  índices generados: ${totales.tablas} tablas, ${totales.figuras} figuras`)
console.log('  -> documentacion-final/Hosty-Informe-Final.md          (para exportar a PDF desde Obsidian)')
console.log('  -> documentacion-final-unico/Hosty-Informe-Final.md    (copia portable)')
if (convertidos.length) {
  console.log(`\nDiagramas reorientados para A4 (${convertidos.length}):`)
  console.log(convertidos.join('\n'))
}
if (avisos.length) {
  console.log(`\nEnlaces a notas de apoyo convertidos a texto plano (${avisos.length}):`)
  console.log([...new Set(avisos)].join('\n'))
}
if (calloutsSinRegla.length) {
  console.log(`\nCallouts sin regla de formalización (${calloutsSinRegla.length}) — revisar:`)
  console.log([...new Set(calloutsSinRegla)].join('\n'))
}
if (emojiDetectados.length) {
  console.log(`\nEmoji eliminados del documento impreso (${emojiDetectados.length}):`)
  console.log([...new Set(emojiDetectados)].join('\n'))
} else {
  console.log('\nSin emoji en el documento impreso.')
}
