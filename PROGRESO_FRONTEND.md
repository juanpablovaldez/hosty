# Hosty — Progreso Frontend

Documentación de todo lo construido en el frontend hasta la fecha.
Última actualización: Mayo 2026.

---

## Stack técnico

- **Framework:** React + Vite + TypeScript (strict mode)
- **Router:** TanStack Router (file-based routing)
- **Estilos:** Tailwind CSS v4 (configuración CSS-first con `@theme`)
- **Fuente:** Plus Jakarta Sans (Google Fonts)
- **Linting:** ESLint 9+ con `@typescript-eslint/no-explicit-any` como error
- **Formato:** Prettier (comillas simples, trailing commas)
- **Package manager:** pnpm (nombre del paquete: `hosty-frontend`)
- **Arquitectura:** Screaming Architecture (`src/features/<nombre>`)

---

## Sistema de diseño

### Colores (definidos en `src/index.css`)

| Token | Valor | Uso |
|---|---|---|
| `--color-primary` | `#E8452A` | Coral Vivo — acciones, CTAs, énfasis |
| `--color-accent` | `#F5A623` | Ámbar — badges Premium, highlights |
| `--color-foreground` | `#1C2B3A` | Ink — texto principal |
| `--color-background` | `#F8F4EF` | Bone — fondo general |
| `--color-card` | `#FFFFFF` | Blanco — cards y superficies |
| `--color-muted-foreground` | `#6B7A8D` | Texto secundario |
| `--color-border` | `#E5DED4` | Bordes suaves |

El modo oscuro invierte los tokens mediante la clase `.dark` en el `<html>`.

### Fuente
Plus Jakarta Sans cargada vía Google Fonts en `index.css`. Aplicada globalmente como `font-family` base.

---

## Archivos creados / modificados

### Configuración global

**`frontend/src/index.css`**
- Definición completa de tokens de color con `@theme` (modo claro y oscuro)
- Import de Plus Jakarta Sans
- Se eliminó import duplicado de Google Fonts (fix CodeRabbit)

**`frontend/.env.example`**
- Corregido: `VITE_API_URL=http://localhost:3000` (sin comillas, fix CodeRabbit)

---

### Layout

**`frontend/src/components/layout/RootLayout.tsx`**
- Layout raíz que envuelve todas las páginas
- Incluye `<Header />` y el `<Outlet />` de TanStack Router

**`frontend/src/components/layout/Header.tsx`** *(creado + fixes CodeRabbit)*
- Navbar con logo "Hosty", navegación desktop y menú hamburguesa mobile
- Links: Inicio, Salones, Cómo funciona, Contacto
- Botones: Iniciar sesión / Publicar salón
- `ThemeToggle` integrado
- **Fixes aplicados:** todos los `<a href>` reemplazados por `<Link>` de TanStack Router, `type="button"` en el botón hamburguesa, `aria-expanded`, `aria-controls="mobile-nav"`, `aria-label` dinámico, `id="mobile-nav"` en el panel mobile, `onClick={closeMenu}` en cada link del menú

**`frontend/src/components/layout/ThemeToggle.tsx`** *(fix CodeRabbit)*
- Botón para alternar modo claro/oscuro
- **Fix aplicado:** agregados handlers `onFocus`/`onBlur` para el ring de foco con el color coral (#E8452A)

---

### Componentes UI base

**`frontend/src/components/ui/button.tsx`** *(fix CodeRabbit)*
- Componente Button con variantes (default, outline, ghost, etc.)
- **Fix aplicado:** `type="button"` como default cuando no se usa `asChild`

**`frontend/src/components/ui/badge.tsx`** *(fix CodeRabbit)*
- Componente Badge con variantes de color
- **Fix aplicado:** reformateado a comillas simples + trailing commas (Prettier)

**`frontend/src/components/ui/card.tsx`** *(fix CodeRabbit)*
- Componente Card con sub-componentes (Header, Content, Footer)
- **Fix aplicado:** reformateado a comillas simples + trailing commas (Prettier)

---

### Página de inicio (`/`)

**`frontend/src/routes/index.tsx`**
- Ruta raíz de TanStack Router, renderiza `HomePage`

**`frontend/src/features/home/components/HomePage.tsx`** *(creado + fixes)*

Secciones:
1. **Hero** — título "Celebrá cerca.", bajada, mancha coral decorativa
2. **Buscador tipo card** — campos Dónde / Fecha / Invitados + botón Buscar
   - Botón "Buscar" navega a `/salones` via `useNavigate`
3. **Chips de tipo de evento** — Todos, Cumpleaños, Casamientos, Graduaciones, Corporativo, Infantiles (con estado `chipActivo`)
4. **Trust indicators** — +120 salones verificados, confirmación 24h, precios claros
5. **Visual hero** (columna derecha, desktop) — card decorativa con mini-preview de salón y floating card "Reserva confirmada"
6. **Sección "Salones destacados"** — grid de 3 cards con datos estáticos

**Fixes CodeRabbit aplicados:**
- `type="button"` + `aria-pressed` en chips
- `aria-label` en botones de favorito
- `<a href="/salones">` → `<Link to="/salones">`

---

### Página de listado de salones (`/salones`)

**`frontend/src/routes/salones.tsx`**
- Ruta de TanStack Router para `/salones`, renderiza `SalonesPage`

**`frontend/src/features/salones/types.ts`** *(preexistente, no modificado)*
- Interface `Salon` genérica del dominio

**`frontend/src/features/salones/components/SalonesPage.tsx`** *(creado + fixes)*

#### Datos estáticos (mock)
4 salones de prueba con todos los campos necesarios: nombre, zona, capacidad, precio, rating, amenities, badge, gradient.

#### Componentes internos
- `BadgeLabel` — badge Top/Nuevo/Premium en coral o ámbar
- `VerificadoBadge` — badge verde con checkmark SVG
- `CardResultado` — card de resultado de búsqueda con imagen (gradiente), favorito, badge, rating, zona, tipos, amenities, precio y CTA

#### Estado y lógica

| Estado | Tipo | Descripción |
|---|---|---|
| `busqueda` | `string` | Texto libre para filtrar por nombre |
| `chipActivo` | `string` | Tipo de evento seleccionado |
| `zonasActivas` | `string[]` | Zonas chequeadas en el sidebar |
| `serviciosActivos` | `string[]` | Servicios chequeados en el sidebar |
| `capacidadMin` | `number` | Inputs controlados de capacidad mínima |
| `capacidadMax` | `number` | Inputs controlados de capacidad máxima |
| `ordenamiento` | `string` | Select de ordenamiento |
| `vistaLista` | `boolean` | Toggle lista / mapa |
| `paginaActual` | `number` | Página actual |

#### Derivados con `useMemo`
- `zonaCounts` — conteo de salones por zona calculado con `SALONES.reduce()`
- `filtrosActivos` — derivado de `[...zonasActivas, ...serviciosActivos]` (nunca se desincroniza)
- `salonesFilteredAndSorted` — aplica todos los filtros + ordenamiento
- `totalPaginas`, `paginaSegura`, `salonesPagina` — paginación real con `slice()`

#### Secciones UI
1. **Barra de búsqueda sticky** — ubicación, fecha, invitados (estáticos hasta backend), botón Buscar
2. **Chips de tipo de evento** — con contador real de resultados
3. **Input de búsqueda por nombre** — con ícono lupa y botón X para limpiar
4. **Sidebar de filtros** (desktop) — capacidad (inputs controlados), precio (decorativo), zona (checkboxes con conteo derivado), servicios (checkboxes)
5. **Toolbar de resultados** — título, toggle lista/mapa, select de ordenamiento
6. **Filtros activos** — pills con X que actualizan el estado subyacente al hacer click
7. **Grid de resultados** — 2 columnas, renderiza `salonesPagina` (no todos)
8. **Estado vacío** — mensaje cuando ningún salón matchea los filtros
9. **Paginación dinámica** — se genera en base a `totalPaginas`, oculta si solo hay 1 página

**Fixes CodeRabbit aplicados:**
- Filtros y ordenamiento conectados al render via `useMemo`
- Paginación real con `slice()`
- `filtrosActivos` derivado (eliminado el `useState` independiente)
- Inputs de capacidad controlados
- Conteos de zona derivados de datos reales
- `<Link to="/salones">` en lugar de `/salones/:id` (ruta de detalle pendiente)
- `setPaginaActual(1)` en cada cambio de filtro/orden
- `limpiarFiltros` limpia todos los estados incluyendo `busqueda`

---

**`frontend/src/features/salones/components/CardSalon.tsx`** *(fix CodeRabbit)*
- Card genérica reutilizable (distinta de `CardResultado`)
- **Fixes aplicados:** `salon.rating != null` en lugar de `salon.rating &&`, `aria-label` en botón de favorito

---

## Tareas completadas por PR

### PR #10 — `feat/front-02-ui-components`

| Task | Estado |
|---|---|
| UI-01: Plus Jakarta Sans + colores del brandbook | ✅ Completo |
| UI-01: SearchBar con navegación a /salones | ✅ Completo |
| UI-01: Chips de tipo de evento con estado | ✅ Completo |
| UI-01: Responsivo mobile/desktop | ✅ Completo |
| UI-02: Cards con VerificadoBadge | ✅ Completo |
| UI-02: Página de listado /salones completa | ✅ Completo |
| UI-02: Filtros, ordenamiento y paginación client-side | ✅ Completo |
| Fix Header (CodeRabbit) | ✅ Completo |
| Fix HomePage (CodeRabbit) | ✅ Completo |
| Fix CardSalon (CodeRabbit) | ✅ Completo |
| Fix componentes UI base (CodeRabbit) | ✅ Completo |
| Fix index.css + ThemeToggle + .env (CodeRabbit) | ✅ Completo |
| Fix SalonesPage (CodeRabbit — segunda revisión) | ✅ Completo |

---

## Pendiente

| Task | Descripción |
|---|---|
| SALON-01 | Página de detalle de salón (`/salones/:id`) — galería, amenities, mapa |
| PERF-01 | Optimización: lazy loading, WebP, code splitting, meta tags / SEO |
| UI-01 (parcial) | Barra de búsqueda (ubicación, fecha, invitados) — requiere backend |
| General | Conectar todo al backend cuando las APIs estén listas |

---

## Comandos útiles

```bash
# Levantar el frontend
pnpm --filter hosty-frontend dev

# Verificar tipos sin compilar
cd frontend && npx tsc --noEmit

# Build de producción
pnpm --filter hosty-frontend build
```
