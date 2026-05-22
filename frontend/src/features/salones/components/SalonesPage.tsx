import { useState, useMemo } from 'react'
import { useNavigate, useSearch } from '@tanstack/react-router'
import {
  MapPin, Calendar, Users, Search, SlidersHorizontal, X,
  ChevronLeft, ChevronRight, Star, Map,
} from 'lucide-react'
import { useSearchSalones } from '../api/salones.queries'
import { CardSalon } from './CardSalon'

/* ─── Constantes ─────────────────────────────────────────── */
const CHIPS_TIPO = ['Todos los tipos', 'Cumpleaños', 'Casamientos', 'Corporativo', 'Egresos', 'Infantiles']
const ZONAS = ['Centro', 'Yerba Buena', 'Tafí Viejo', 'Banda del Río Salí']
const SERVICIOS = ['Catering', 'Estacionamiento', 'Climatización', 'Sonido', 'Wi-Fi', 'Iluminación']
const PAGE_SIZE = 20

/* ─── Skeleton card ──────────────────────────────────────── */
function CardSkeleton() {
  return (
    <div className="bg-card rounded-[20px] overflow-hidden border border-border animate-pulse">
      <div className="aspect-[4/3] bg-muted" />
      <div className="p-5 space-y-3">
        <div className="h-5 bg-muted rounded w-3/4" />
        <div className="h-4 bg-muted rounded w-1/2" />
        <div className="h-4 bg-muted rounded w-1/3" />
        <div className="flex gap-2 mt-2">
          <div className="h-6 bg-muted rounded-full w-20" />
          <div className="h-6 bg-muted rounded-full w-24" />
        </div>
        <div className="h-8 bg-muted rounded w-28 mt-4" />
      </div>
    </div>
  )
}

/* ─── Componente de paginación con elipsis ───────────────── */
interface PaginationProps {
  paginaActual: number
  totalPaginas: number
  onPageChange: (p: number) => void
}

function Pagination({ paginaActual, totalPaginas, onPageChange }: PaginationProps) {
  if (totalPaginas <= 1) return null

  // Genera el array de páginas con elipsis
  function getPages(): (number | '...')[] {
    if (totalPaginas <= 7) {
      return Array.from({ length: totalPaginas }, (_, i) => i + 1)
    }
    const pages: (number | '...')[] = [1]
    if (paginaActual > 3) pages.push('...')
    for (
      let i = Math.max(2, paginaActual - 1);
      i <= Math.min(totalPaginas - 1, paginaActual + 1);
      i++
    ) {
      pages.push(i)
    }
    if (paginaActual < totalPaginas - 2) pages.push('...')
    pages.push(totalPaginas)
    return pages
  }

  const pages = getPages()

  return (
    <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
      {/* Navegación */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          id="pagination-prev"
          disabled={paginaActual === 1}
          onClick={() => onPageChange(paginaActual - 1)}
          className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground disabled:opacity-40 hover:bg-muted transition"
          aria-label="Página anterior"
        >
          <ChevronLeft className="w-5 h-5" strokeWidth={1.5} />
        </button>

        {pages.map((p, idx) =>
          p === '...' ? (
            <span
              key={`ellipsis-${idx}`}
              className="w-9 h-9 flex items-center justify-center text-muted-foreground text-[14px] select-none"
            >
              …
            </span>
          ) : (
            <button
              key={p}
              type="button"
              id={`pagination-page-${p}`}
              onClick={() => onPageChange(p)}
              aria-current={paginaActual === p ? 'page' : undefined}
              className={`w-9 h-9 rounded-lg text-[14px] font-semibold transition ${
                paginaActual === p
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'border border-border hover:bg-muted text-foreground'
              }`}
            >
              {p}
            </button>
          ),
        )}

        <button
          type="button"
          id="pagination-next"
          disabled={paginaActual === totalPaginas}
          onClick={() => onPageChange(paginaActual + 1)}
          className="w-9 h-9 rounded-lg border border-border flex items-center justify-center hover:bg-muted transition disabled:opacity-40"
          aria-label="Página siguiente"
        >
          <ChevronRight className="w-5 h-5" strokeWidth={1.5} />
        </button>
      </div>
    </div>
  )
}

/* ─── Mapeo de label de ordenamiento ─── */
const SORT_OPTIONS = [
  { value: 'rating', label: 'Relevancia' },
  { value: 'price_asc', label: 'Precio: menor a mayor' },
  { value: 'price_desc', label: 'Precio: mayor a menor' },
  { value: 'capacity', label: 'Capacidad' },
] as const

type SortValue = typeof SORT_OPTIONS[number]['value']

/* ─── Página principal ───────────────────────────────────── */
export function SalonesPage() {
  const navigate = useNavigate({ from: '/salones/' })
  const search = useSearch({ from: '/salones/' })

  // Estado local — solo lo que NO necesita ser bookmarkeable
  const [busqueda, setBusqueda] = useState('')
  const [chipActivo, setChipActivo] = useState('Todos los tipos')
  const [zonasActivas, setZonasActivas] = useState<string[]>([])
  const [serviciosActivos, setServiciosActivos] = useState<string[]>([])
  const [capacidadMin, setCapacidadMin] = useState(0)
  const [capacidadMax, setCapacidadMax] = useState(500)
  const [vistaLista, setVistaLista] = useState(true)

  // Estado en URL — página y ordenamiento
  const paginaActual = search.page ?? 1
  const sortBy = (search.sortBy ?? 'rating') as SortValue

  function setPage(p: number) {
    navigate({ search: (prev) => ({ ...prev, page: p === 1 ? undefined : p }) })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function setSortBy(value: SortValue) {
    navigate({ search: (prev) => ({ ...prev, sortBy: value === 'rating' ? undefined : value, page: undefined }) })
  }

  /* ─── Parámetros para Supabase ─── */
  const params = useMemo(() => ({
    name: busqueda.trim() || undefined,
    locations: zonasActivas.length > 0 ? zonasActivas : undefined,
    eventTypes: chipActivo !== 'Todos los tipos' ? [chipActivo] : undefined,
    capacity: capacidadMin > 0 ? capacidadMin : undefined,
    amenities: serviciosActivos.length > 0 ? serviciosActivos : undefined,
    // Capacidad máx server-side
    ...(capacidadMax < 500 ? { maxCapacity: capacidadMax } : {}),
    sortBy,
    page: paginaActual,
    pageSize: PAGE_SIZE,
  }), [busqueda, zonasActivas, chipActivo, capacidadMin, capacidadMax, serviciosActivos, sortBy, paginaActual])

  const { data, isLoading, isError } = useSearchSalones(params)

  const salones = data?.salones ?? []
  const total = data?.total ?? 0
  const totalPaginas = data?.totalPages ?? 1

  // Indicador de rango visible
  const inicio = total === 0 ? 0 : (paginaActual - 1) * PAGE_SIZE + 1
  const fin = Math.min(paginaActual * PAGE_SIZE, total)

  /* ─── Filtros activos (para chips removibles) ─── */
  const filtrosActivos = useMemo(
    () => [...zonasActivas, ...serviciosActivos],
    [zonasActivas, serviciosActivos],
  )

  const toggleZona = (zona: string) => {
    setZonasActivas((prev) =>
      prev.includes(zona) ? prev.filter((z) => z !== zona) : [...prev, zona],
    )
    setPage(1)
  }

  const toggleServicio = (servicio: string) => {
    setServiciosActivos((prev) =>
      prev.includes(servicio) ? prev.filter((s) => s !== servicio) : [...prev, servicio],
    )
    setPage(1)
  }

  const quitarFiltro = (filtro: string) => {
    setZonasActivas((prev) => prev.filter((z) => z !== filtro))
    setServiciosActivos((prev) => prev.filter((s) => s !== filtro))
    setPage(1)
  }

  const limpiarFiltros = () => {
    setBusqueda('')
    setZonasActivas([])
    setServiciosActivos([])
    setChipActivo('Todos los tipos')
    setCapacidadMin(0)
    setCapacidadMax(500)
    setPage(1)
  }

  const sortLabel = SORT_OPTIONS.find((o) => o.value === sortBy)?.label ?? 'Relevancia'

  return (
    <>
      {/* ── Barra de búsqueda sticky ─── */}
      <div className="bg-card border-b border-border sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 py-4 flex items-center gap-3 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <button
            type="button"
            className="flex items-center gap-2 bg-muted rounded-full px-4 py-2.5 min-w-fit hover:bg-muted/80 transition"
          >
            <MapPin className="w-5 h-5 text-primary flex-shrink-0" strokeWidth={1.5} />
            <span className="text-[14px] font-medium whitespace-nowrap">San Miguel de Tucumán</span>
          </button>
          <button
            type="button"
            className="flex items-center gap-2 bg-muted rounded-full px-4 py-2.5 min-w-fit hover:bg-muted/80 transition"
          >
            <Calendar className="w-5 h-5 text-muted-foreground flex-shrink-0" strokeWidth={1.5} />
            <span className="text-[14px] font-medium whitespace-nowrap">Elegí una fecha</span>
          </button>
          <button
            type="button"
            className="flex items-center gap-2 bg-muted rounded-full px-4 py-2.5 min-w-fit hover:bg-muted/80 transition"
          >
            <Users className="w-5 h-5 text-muted-foreground flex-shrink-0" strokeWidth={1.5} />
            <span className="text-[14px] font-medium whitespace-nowrap">¿Cuántos invitados?</span>
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-full px-4 py-2.5 min-w-fit text-[14px] transition"
          >
            <Search className="w-5 h-5" strokeWidth={1.5} />
            Buscar
          </button>
        </div>
      </div>

      {/* ── Chips de tipo de evento ─── */}
      <div className="max-w-7xl mx-auto px-5 lg:px-8 pt-5 flex flex-wrap gap-2 items-center">
        {CHIPS_TIPO.map((chip) => (
          <button
            key={chip}
            type="button"
            onClick={() => { setChipActivo(chip); setPage(1) }}
            aria-pressed={chipActivo === chip}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border text-[14px] font-medium transition cursor-pointer ${
              chipActivo === chip
                ? 'bg-foreground text-background border-foreground'
                : 'bg-card text-foreground border-border hover:border-primary hover:text-primary'
            }`}
          >
            {chip}
          </button>
        ))}
      </div>

      {/* ── Buscador por nombre ─── */}
      <div className="max-w-7xl mx-auto px-5 lg:px-8 mt-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" strokeWidth={1.5} />
          <input
            id="salones-search-input"
            type="text"
            placeholder="Buscar por nombre de salón..."
            value={busqueda}
            onChange={(e) => { setBusqueda(e.target.value); setPage(1) }}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-border bg-card text-foreground text-[15px] placeholder:text-muted-foreground focus:outline-none focus:border-primary transition"
          />
          {busqueda && (
            <button
              type="button"
              aria-label="Limpiar búsqueda"
              onClick={() => { setBusqueda(''); setPage(1) }}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-full hover:bg-muted transition"
            >
              <X className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
            </button>
          )}
        </div>
      </div>

      {/* ── Layout principal ─── */}
      <div className="max-w-7xl mx-auto px-5 lg:px-8 py-6 grid lg:grid-cols-[280px_1fr] gap-8">

        {/* ── Sidebar filtros ─── */}
        <aside className="hidden lg:block">
          <div className="sticky top-40 space-y-6">
            <div className="bg-card rounded-[20px] p-5 shadow-[0_1px_3px_rgba(28,43,58,0.06),0_8px_24px_-12px_rgba(28,43,58,0.12)] border border-border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-[16px] text-foreground flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4" strokeWidth={1.5} />
                  Filtros
                </h3>
                <button
                  type="button"
                  onClick={limpiarFiltros}
                  className="text-[13px] font-semibold text-primary hover:text-primary/80 transition"
                >
                  Limpiar
                </button>
              </div>

              {/* Capacidad */}
              <div className="mb-6">
                <label className="block text-[13px] font-semibold text-muted-foreground mb-2 tracking-wide">
                  Capacidad
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 flex items-center gap-1 border border-border rounded-lg p-2">
                    <span className="text-[11px] text-muted-foreground">Mín</span>
                    <input
                      type="number"
                      value={capacidadMin || ''}
                      placeholder="0"
                      onChange={(e) => { setCapacidadMin(Number(e.target.value)); setPage(1) }}
                      className="w-full bg-transparent text-[14px] font-semibold focus:outline-none text-foreground"
                    />
                  </div>
                  <div className="flex-1 flex items-center gap-1 border border-border rounded-lg p-2">
                    <span className="text-[11px] text-muted-foreground">Máx</span>
                    <input
                      type="number"
                      value={capacidadMax === 500 ? '' : capacidadMax}
                      placeholder="Sin límite"
                      onChange={(e) => { setCapacidadMax(e.target.value ? Number(e.target.value) : 500); setPage(1) }}
                      className="w-full bg-transparent text-[14px] font-semibold focus:outline-none text-foreground"
                    />
                  </div>
                </div>
              </div>

              {/* Zona */}
              <div className="mb-6">
                <label className="block text-[13px] font-semibold text-muted-foreground mb-2 tracking-wide">
                  Zona
                </label>
                <div className="space-y-2">
                  {ZONAS.map((zona) => (
                    <label key={zona} className="flex items-center gap-2 text-[14px] cursor-pointer text-foreground">
                      <input
                        type="checkbox"
                        checked={zonasActivas.includes(zona)}
                        onChange={() => toggleZona(zona)}
                        className="w-4 h-4 accent-primary"
                      />
                      {zona}
                    </label>
                  ))}
                </div>
              </div>

              {/* Servicios */}
              <div>
                <label className="block text-[13px] font-semibold text-muted-foreground mb-2 tracking-wide">
                  Servicios incluidos
                </label>
                <div className="space-y-2">
                  {SERVICIOS.map((servicio) => (
                    <label key={servicio} className="flex items-center gap-2 text-[14px] cursor-pointer text-foreground">
                      <input
                        type="checkbox"
                        checked={serviciosActivos.includes(servicio)}
                        onChange={() => toggleServicio(servicio)}
                        className="w-4 h-4 accent-primary"
                      />
                      {servicio}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Upsell premium */}
            <div className="bg-foreground text-background rounded-[20px] p-5">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-5 h-5 fill-amber-400 text-amber-400 flex-shrink-0" strokeWidth={1.5} />
                <h4 className="font-bold text-[14px]">Salones Premium primero</h4>
              </div>
              <p className="text-[12px] opacity-60 leading-relaxed">
                Los salones con plan Premium aparecen en las primeras posiciones — siempre con su badge visible.
              </p>
            </div>
          </div>
        </aside>

        {/* ── Resultados ─── */}
        <div>
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <h1 className="text-[28px] lg:text-[34px] font-bold tracking-tight text-foreground">
                Salones cerca tuyo<span className="text-primary">.</span>
              </h1>
              <p className="text-[13px] text-muted-foreground mt-1">
                Ordenado por {sortLabel.toLowerCase()}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden md:flex bg-card rounded-full border border-border p-1">
                <button
                  type="button"
                  onClick={() => setVistaLista(true)}
                  className={`px-3 py-1.5 text-[13px] font-semibold rounded-full transition ${
                    vistaLista ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Lista
                </button>
                <button
                  type="button"
                  onClick={() => setVistaLista(false)}
                  className={`px-3 py-1.5 text-[13px] font-medium rounded-full flex items-center gap-1 transition ${
                    !vistaLista ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Map className="w-4 h-4" strokeWidth={1.5} />
                  Mapa
                </button>
              </div>
              <select
                id="salones-sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortValue)}
                className="w-auto px-3 py-2 rounded-xl border border-border bg-card text-foreground text-[13px] font-medium focus:outline-none focus:border-primary"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* ── Indicador de total — siempre visible ─── */}
          <div className="flex items-center justify-between mb-5">
            <p className="text-[13px] text-muted-foreground" id="salones-total-indicator">
              {isLoading ? (
                <span className="inline-block h-4 w-48 bg-muted animate-pulse rounded" />
              ) : isError ? null : (
                <>
                  Mostrando{' '}
                  <strong className="text-foreground">{inicio}–{fin}</strong>
                  {' '}de{' '}
                  <strong className="text-foreground">{total.toLocaleString('es-AR')}</strong>
                  {' '}salones
                </>
              )}
            </p>
            {totalPaginas > 1 && !isLoading && (
              <p className="text-[13px] text-muted-foreground">
                Página <strong className="text-foreground">{paginaActual}</strong> de{' '}
                <strong className="text-foreground">{totalPaginas}</strong>
              </p>
            )}
          </div>

          {/* Filtros activos */}
          {filtrosActivos.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-5">
              {filtrosActivos.map((filtro) => (
                <button
                  key={filtro}
                  type="button"
                  onClick={() => quitarFiltro(filtro)}
                  className="inline-flex items-center gap-1.5 bg-primary/10 text-primary border border-primary/20 text-[14px] font-medium px-3.5 py-2 rounded-full transition hover:bg-primary/20"
                >
                  {filtro}
                  <X className="w-4 h-4" strokeWidth={1.5} />
                </button>
              ))}
            </div>
          )}

          {/* Estado de error */}
          {isError && (
            <div className="py-20 text-center">
              <p className="text-[18px] font-semibold text-foreground mb-2">No pudimos cargar los salones</p>
              <p className="text-[14px] text-muted-foreground">Verificá tu conexión e intentá de nuevo.</p>
            </div>
          )}

          {/* Skeletons de carga */}
          {isLoading && (
            <div className="grid sm:grid-cols-2 gap-6">
              {Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}
            </div>
          )}

          {/* Grid de resultados */}
          {!isLoading && !isError && (
            salones.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-6">
                {salones.map((salon) => (
                  <CardSalon key={salon.id} salon={salon} />
                ))}
              </div>
            ) : (
              <div className="py-20 text-center">
                <p className="text-[18px] font-semibold text-foreground mb-2">Sin resultados</p>
                <p className="text-[14px] text-muted-foreground">
                  Probá ajustando los filtros para ver más salones.
                </p>
              </div>
            )
          )}

          {/* Paginación con elipsis */}
          {!isLoading && !isError && salones.length > 0 && (
            <Pagination
              paginaActual={paginaActual}
              totalPaginas={totalPaginas}
              onPageChange={setPage}
            />
          )}
        </div>
      </div>
    </>
  )
}
