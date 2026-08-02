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
  'Anexos/Anexo-I-Modelo-de-Datos.md',
  'Anexos/Anexo-II-Diagramas-de-Flujo.md',
  'Anexos/Anexo-III-Backlog-User-Stories.md',
  'Anexos/Anexo-IV-API-y-Repositorio.md',
  'Anexos/Anexo-V-Evidencias-QA.md',
]

/** nombre de nota -> [texto legible, ancla] para reescribir wikilinks. */
const DESTINOS = {
  '00-Portada-y-Ficha': ['Portada y Ficha Técnica', '00-portada-y-ficha-tecnica'],
  '01-Resumen-Ejecutivo': ['Resumen Ejecutivo', '01-resumen-ejecutivo'],
  '02-Acronimos': ['Acrónimos', '02-acronimos'],
  '03-Introduccion': ['Introducción', '03-introduccion'],
  '04-Objetivos': ['Objetivos', '04-objetivos'],
  '05-Problema-a-Resolver': ['Problema a Resolver', '05-problema-a-resolver'],
  '06-Impacto-de-la-Solucion': ['Impacto de la Solución', '06-impacto-de-la-solucion'],
  '07-Equipo-y-Roles': ['Equipo y Roles', '07-equipo-y-roles'],
  '08-Diseno-y-Desarrollo': ['Diseño y Desarrollo', '08-diseno-y-desarrollo'],
  '09-Planificacion-Scrum': ['Planificación Scrum', '09-planificacion-scrum'],
  '10-Presupuesto': ['Presupuesto', '10-presupuesto'],
  '11-Arquitectura': ['Arquitectura', '11-arquitectura'],
  '12-Testing-y-Calidad': ['Testing y Calidad', '12-testing-y-calidad'],
  '13-Ejecucion-por-Sprint': ['Ejecución por Sprint', '13-ejecucion-por-sprint'],
  '14-Metricas': ['Métricas', '14-metricas'],
  '15-Conclusiones': ['Conclusiones', '15-conclusiones'],
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
}

/** Títulos de la tabla de contenidos, en el mismo orden que NOTAS. */
const TOC = [
  ['00. Portada y Ficha Técnica', '00-portada-y-ficha-tecnica'],
  ['01. Resumen Ejecutivo', '01-resumen-ejecutivo'],
  ['02. Acrónimos', '02-acronimos'],
  ['03. Introducción', '03-introduccion'],
  ['04. Objetivos', '04-objetivos'],
  ['05. Problema a Resolver', '05-problema-a-resolver'],
  ['06. Impacto de la Solución', '06-impacto-de-la-solucion'],
  ['07. Equipo y Roles', '07-equipo-y-roles'],
  ['08. Diseño y Desarrollo', '08-diseno-y-desarrollo'],
  ['09. Planificación Scrum', '09-planificacion-scrum'],
  ['10. Presupuesto', '10-presupuesto'],
  ['11. Arquitectura', '11-arquitectura'],
  ['12. Testing y Calidad', '12-testing-y-calidad'],
  ['13. Ejecución por Sprint', '13-ejecucion-por-sprint'],
  ['14. Métricas', '14-metricas'],
  ['15. Conclusiones', '15-conclusiones'],
  ['Anexo I. Modelo de Datos', 'anexo-i-modelo-de-datos'],
  ['Anexo II. Diagramas de Flujo Complementarios', 'anexo-ii-diagramas-de-flujo-complementarios'],
  ['Anexo III. Backlog Completo de User Stories', 'anexo-iii-backlog-completo-de-user-stories'],
  ['Anexo IV. API y Repositorio', 'anexo-iv-api-y-repositorio'],
  ['Anexo V. Evidencias de QA', 'anexo-v-evidencias-de-qa'],
]

const sinFrontmatter = (texto) => texto.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '')

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

const cuerpos = NOTAS.map((nota) => {
  let texto = readFileSync(join(vault, nota), 'utf8')
  texto = sinFrontmatter(texto)
  texto = sinPieDeNavegacion(texto)
  texto = resolverWikilinks(texto, nota)
  texto = adaptarMermaidParaImpresion(texto, nota)
  return texto
})

const hoy = new Date().toISOString().slice(0, 10)

const encabezado = `# Hosty — Informe Final (versión consolidada)

**Documento consolidado — generado a partir del vault \`documentacion-final/\`, fecha: ${hoy}.**

Este archivo reúne, en un único documento portable, las 21 notas de contenido del informe final
de Hosty (16 secciones numeradas + 5 anexos), en su orden de lectura canónico. Es una
concatenación sin pérdida de esas notas: no reemplaza al vault de Obsidian. Las fuentes
editables e individuales de cada sección — y las notas de apoyo (\`_meta/\`) que este documento no
incluye — siguen viviendo en \`documentacion-final/\`; cualquier corrección de contenido debe
hacerse ahí y volver a generar este archivo con
\`node documentacion-final-unico/generar-consolidado.mjs\`.


---

## Tabla de contenidos

${TOC.map(([titulo, ancla]) => `- [${titulo}](#${ancla})`).join('\n')}


---

`

const documento = encabezado + cuerpos.join('\n\n---\n\n') + '\n'

// 1. Dentro del vault: rutas `assets/...` tal como las resuelve Obsidian desde la raíz del vault.
const enVault = documento.replace(/\]\(\.\.\/assets\//g, '](assets/')
writeFileSync(join(vault, 'Hosty-Informe-Final.md'), enVault, 'utf8')

// 2. Copia portable fuera del vault: las imágenes viven un nivel más arriba.
const portable = enVault.replace(/\]\(assets\//g, '](../documentacion-final/assets/')
writeFileSync(join(raiz, 'documentacion-final-unico', 'Hosty-Informe-Final.md'), portable, 'utf8')

const lineas = enVault.split('\n').length
console.log(`OK — ${NOTAS.length} notas consolidadas, ${lineas} líneas`)
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
