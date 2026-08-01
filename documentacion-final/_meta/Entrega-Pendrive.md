---
title: "Entrega — contenido del pendrive"
seccion: "meta"
tipo: meta
tags: [hosty, entrega, pendrive, defensa]
estado: completo
updated: 2026-08-01
---

# Entrega — contenido del pendrive

El profesor pidió llevar **el código del proyecto en un pendrive** el viernes 7 de agosto. Este
documento define qué se copia exactamente, cómo se prepara y qué hay que revisar antes de entregarlo.

## Estructura a dejar en el pendrive

```
HOSTY-Proyecto-Final/
├── LEEME.txt                      ← cómo ejecutar el proyecto (se crea abajo)
├── Hosty-Informe-Final.pdf        ← el informe completo, en digital
├── codigo/                        ← el proyecto, listo para abrir
│   ├── frontend/                  ← la aplicación (React 19 + Vite + TypeScript)
│   ├── supabase/                  ← migraciones SQL de la base de datos
│   ├── infra/                     ← infraestructura como código (Terraform)
│   ├── .github/workflows/         ← los 3 workflows de CI/CD
│   ├── docs/                      ← brandbook y stack técnico
│   ├── package.json               ← configuración del workspace
│   └── README.md
└── repositorio-con-historial/     ← opcional pero recomendado (ver abajo)
    └── hosty.git/
```

**Peso total estimado: menos de 30 MB.** Cualquier pendrive sirve.

## Qué NO va

| No copiar | Por qué |
|---|---|
| `node_modules/` (404 MB entre la raíz y `frontend/`) | Son dependencias descargables. Multiplican por veinte el peso de la entrega y no aportan nada: se regeneran con `npm install`. |
| `frontend/dist/` | Salida de compilación, se regenera con `npm run build`. |
| Cualquier archivo `.env` | Contiene credenciales. En el repositorio sólo está `frontend/.env.example`, que es la plantilla sin valores reales — ese sí va. |
| `documentacion-final/assets/playwright-report-*/` | El reporte HTML de pruebas pesa 1,6 MB y ya está resumido en el Anexo V del informe. Copiarlo sólo si el profesor lo pide expresamente. |

## Cómo preparar la carpeta `codigo/`

La forma más limpia es dejar que Git haga el filtrado, porque respeta el `.gitignore` y excluye
automáticamente `node_modules`, `dist` y los `.env`. Desde la raíz del repositorio, en PowerShell:

```powershell
# 1. Exportar el proyecto limpio a una carpeta temporal
git archive --format=zip --output "$env:USERPROFILE\Desktop\hosty-codigo.zip" HEAD

# 2. Descomprimir ese zip dentro de HOSTY-Proyecto-Final\codigo\ en el pendrive
```

El resultado son unos **5 MB** y **223 archivos**: exactamente el código versionado, sin basura.

> Verificá antes de exportar que estás sobre la rama correcta y que no quedó trabajo sin commitear:
> `git status` tiene que estar limpio y `git log -1` tiene que mostrar el último commit que quieras
> entregar.

## El historial, que es la mejor prueba de proceso

Vale la pena llevar también el repositorio con su historial completo. Es lo que permite demostrar,
si lo piden, que el proyecto se construyó a lo largo de cuatro meses y no en una semana: 181
commits en la rama de trabajo, 5 contribuidores, ramas por *feature* y *pull requests*.

```powershell
# Copia del repositorio con todo su historial (unos 14 MB)
git clone --mirror . "E:\HOSTY-Proyecto-Final\repositorio-con-historial\hosty.git"
```

Reemplazá `E:` por la letra real del pendrive. Para inspeccionarlo después alcanza con
`git clone hosty.git hosty` en cualquier máquina con Git.

Si el profesor prefiere ver el historial en la web, el repositorio también está en
`https://github.com/juanpablovaldez/hosty`.

## El archivo `LEEME.txt`

Crear un archivo de texto plano en la raíz del pendrive con este contenido. Es lo primero que va a
abrir quien reciba la entrega, y evita que el proyecto "no arranque" por una razón trivial.

```text
HOSTY — Marketplace de salones de eventos en Tucumán
Proyecto Final · Tecnicatura en Desarrollo y Calidad de Software · UNSTA · 2026

Integrantes:
  Juan Pablo Valdez            UIA7 0262
  Juan Ignacio Mignone         UIA7 0298
  Lautaro Martinez Naglieri    UIA7 0286
  Juan Pablo Czurylo           UIA7 0331
  Benjamin Garma               UIA7 0362

------------------------------------------------------------------
CONTENIDO
------------------------------------------------------------------
  Hosty-Informe-Final.pdf     Informe final completo
  codigo/                     Codigo fuente del proyecto
  repositorio-con-historial/  Repositorio Git con el historial completo

------------------------------------------------------------------
LA APLICACION EN LINEA
------------------------------------------------------------------
  https://d1ako6y2uvskg7.cloudfront.net

  No hace falta instalar nada para probarla: esta desplegada y
  funcionando sobre AWS CloudFront, con Supabase como backend.

------------------------------------------------------------------
COMO EJECUTAR EL CODIGO LOCALMENTE
------------------------------------------------------------------
  Requisitos: Node.js 20 o superior.

  1) Abrir una terminal dentro de la carpeta codigo/

  2) Instalar las dependencias:
       npm --prefix frontend install

  3) Configurar las credenciales de la base de datos.
     Copiar frontend/.env.example a frontend/.env y completar
     las dos variables con los valores del proyecto Supabase:

       VITE_SUPABASE_URL
       VITE_SUPABASE_ANON_KEY

     (Sin este paso la aplicacion no arranca, por diseno: las
      credenciales no se versionan en el repositorio.)

  4) Levantar el servidor de desarrollo:
       npm --prefix frontend run dev

     Queda disponible en http://localhost:5173

------------------------------------------------------------------
COMO CORRER LAS PRUEBAS
------------------------------------------------------------------
  Pruebas unitarias y de componentes (73 casos):
       npm --prefix frontend run test -- --run

     (Sin "-- --run" queda en modo interactivo, esperando cambios
      en los archivos. Se sale con la tecla q.)

  Verificacion de tipos:
       npm --prefix frontend run typecheck

  Analisis estatico:
       npm --prefix frontend run lint

  Pruebas end-to-end (requieren la app desplegada):
       npm --prefix frontend run test:e2e

------------------------------------------------------------------
ESTRUCTURA DEL CODIGO
------------------------------------------------------------------
  frontend/src/features/   Cada funcionalidad, con sus componentes,
                           sus llamadas a la API y sus tipos
  frontend/src/routes/     Rutas de la aplicacion (14 rutas)
  frontend/src/shared/     Cliente de Supabase, tipos generados y
                           utilidades compartidas
  frontend/src/e2e/        Especificaciones de Playwright
  supabase/migrations/     Las 10 migraciones SQL de la base
  infra/                   Infraestructura en Terraform (S3 +
                           CloudFront)
  .github/workflows/       Los 3 workflows de integracion continua
```

## Revisión antes de entregar

Tres verificaciones concretas, en orden:

1. **Que no haya credenciales.** Buscar en el pendrive cualquier archivo `.env` (sin el sufijo
   `.example`). No debería aparecer ninguno; si aparece, borralo. La clave anónima de Supabase es
   pública por diseño y no es un riesgo, pero una clave de servicio sí lo sería.
2. **Que el proyecto abra.** Copiá la carpeta `codigo/` a otra máquina, corré `npm --prefix frontend
   install` y `npm --prefix frontend run build`. Si compila, la entrega está sana. Hacelo el jueves,
   no el viernes a la mañana.
3. **Que el PDF sea el correcto.** El del pendrive tiene que ser el mismo que el impreso. Verificá
   la fecha y que los diagramas se vean completos.

## Dos archivos que conviene decidir qué hacer con ellos

El repositorio versiona dos archivos de configuración de herramientas de asistencia por IA que se
usaron durante el desarrollo, y que quedarían incluidos en la exportación:

| Archivo | Qué contiene |
|---|---|
| `CLAUDE.md` | Convenciones del proyecto escritas como instrucciones para una herramienta de asistencia. El contenido técnico es correcto y útil, pero el formato deja explícito para qué fue escrito. |
| `.atl/skill-registry.md` | Archivo generado por una herramienta de andamiaje. Además incluye una ruta absoluta del sistema de archivos de una máquina personal (`/Users/vleonardojuanpablo/...`). |

**Es una decisión del equipo, no técnica.** Las tres alternativas razonables:

- **Dejarlos.** Usar herramientas de asistencia es habitual y declarado en muchas cátedras; el
  contenido técnico de `CLAUDE.md` es legítimo y describe convenciones reales del proyecto.
- **Convertir `CLAUDE.md` en `CONVENCIONES.md`**, reescrito como documento de equipo en vez de como
  instrucciones para una herramienta. Es el camino intermedio y probablemente el mejor: el
  contenido se conserva y el formato deja de llamar la atención.
- **Excluirlos de la exportación.**

En cualquiera de los tres casos, conviene al menos **borrar la ruta absoluta personal** de
`.atl/skill-registry.md`, que no aporta nada y expone la estructura de carpetas de una máquina
particular.

> Antes de decidir, verificá qué dice el reglamento de la cátedra sobre el uso de herramientas de
> asistencia. Si exige declararlo, declararlo es siempre mejor que omitirlo.

## Un archivo que está desactualizado

`PROGRESO_FRONTEND.md`, en la raíz del repositorio, dice "Última actualización: Mayo 2026" y no
incluye el panel del anfitrión, los favoritos, las reservas ni la geolocalización — todo lo
construido en los sprints 4 y 5. Si queda en el pendrive, alguien que lo lea va a tener una idea
incompleta del alcance real del proyecto.

Lo más rápido y honesto es **borrarlo** antes de exportar: su función la cumple hoy el informe
final, que sí está completo y actualizado. La alternativa es agregarle una línea al principio
aclarando que quedó superado por el informe.

---
[[Presentacion-Reparto-y-Fichas]] · [[Guia-de-Presentacion]] · [[Indice|Índice]]
