import { useMemo, useState } from 'react'
import { useSearch, useNavigate } from '@tanstack/react-router'
import { MapPin, Calendar, Users, Search, SlidersHorizontal, X, ChevronLeft, ChevronRight, Star, Map } from 'lucide-react'
import { useSearchSalones } from '../api/salones.queries'
import { CardSalon } from './CardSalon'
import type { SalonSearchParams } from '../types'

/* ─── Constantes ─────────────────────────────────────────── */
const CHIPS_TIPO = ['Todos los tipos', 'Cumpleaños', 'Casamientos', 'Corporativo', 'Egresos', 'Infantiles']
const ZONAS = ['Centro', 'Yerba Buena', 'Tafí Viejo', 'Banda del Río Salí']
const SERVICIOS = ['Catering', 'Estacionamiento', 'Climatización', 'Sonido', 'Wi-Fi', 'Iluminación']
const ITEMS_PER_PAGE = 4

const SORT_OPTIONS = [
  { value: 'rating', label: 'Relevancia' },
  { value: 'price_asc', label: 'Precio: menor a mayor' },
  { value: 'price_desc', label: 'Precio: mayor a menor' },
  { value: 'capacity', label: 'Capacidad' },
] as const

type SortValue = typeof SORT_OPTIONS[number]['value']

/* ─── Paginación con elipsis ─────────────────────────────── */
function Pagination({ paginaActual, totalPaginas, onPageChange }: { paginaActual: number; totalPaginas: number; onPageChange: (p: number) => void }) {
  if (totalPaginas <= 1) return null

  function getPages(): (number | '...')[] {
    if (totalPaginas <= 7) return Array.from({ length: totalPaginas }, (_, i) => i + 1)
    const pages: (number | '...')[] = [1]
    if (paginaActual > 3) pages.push('...')
    for (let i = Math.max(2, paginaActual - 1); i <= Math.min(totalPaginas - 1, paginaActual + 1); i++) pages.push(i)
    if (paginaActual < totalPaginas - 2) pages.push('...')
    pages.push(totalPaginas)
    return pages
  }

  return (
    <div className="mt-10 flex items-center gap-1">
      <button type="button" disabled={paginaActual === 1} onClick={() => onPageChange(paginaActual - 1)}
        className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground disabled:opacity-40 hover:bg-muted transition" aria-label="Página anterior">
        <ChevronLeft className="w-5 h-5" strokeWidth={1.5} />
      </button>
      {getPages().map((p, idx) =>
        p === '...' ? (
          <span key={`e-${idx}`} className="w-9 h-9 flex items-center justify-center text-muted-foreground text-[14px]">…</span>
        ) : (
          <button key={p} type="button" onClick={() => onPageChange(p)} aria-current={paginaActual === p ? 'page' : undefined}
            className={`w-9 h-9 rounded-lg text-[14px] font-semibold transition ${paginaActual === p ? 'bg-primary text-primary-foreground shadow-sm' : 'border border-border hover:bg-muted text-foreground'}`}>
            {p}
          </button>
        ),
      )}
      <button type="button" disabled={paginaActual === totalPaginas} onClick={() => onPageChange(paginaActual + 1)}
        className="w-9 h-9 rounded-lg border border-border flex items-center justify-center hover:bg-muted transition disabled:opacity-40" aria-label="Página siguiente">
        <ChevronRight className="w-5 h-5" strokeWidth={1.5} />
      </button>
    </div>
  )
}

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

/* ─── Página principal ───────────────────────────────────── */
export function SalonesPage() {
  const search = useSearch({ from: '/salones/' })
  const navigate = useNavigate({ from: '/salones/' })

  const busqueda = search.busqueda ?? ''
  const chipActivo = search.tipoEvento ?? 'Todos los tipos'
  const zonasActivas = search.zonas ?? []
  const serviciosActivos = search.servicios ?? []
  const capacidadMin = search.capacidadMin ?? 0
  const capacidadMax = search.capacidadMax ?? 500
  const sortBy = (search.sortBy ?? 'rating') as SortValue
  const vistaLista = true
  const paginaActual = search.page ?? 1

  // Estado draft: el input actualiza esto; solo se aplica al hacer click en "Buscar"
  const [busquedaDraft, setBusquedaDraft] = useState(busqueda)

  function setFilter(patch: Record<string, unknown>) {
    navigate({ search: (prev) => ({ ...prev, ...patch }), replace: true })
  }

  function setPage(p: number) {
    navigate({ search: (prev) => ({ ...prev, page: p === 1 ? undefined : p }) })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function setSortBy(value: SortValue) {
    navigate({ search: (prev) => ({ ...prev, sortBy: value === 'rating' ? undefined : value, page: undefined }) })
  }

  /* ─── Parámetros para Supabase (server-side filters + pagination) ─── */
  const params: SalonSearchParams = useMemo(() => ({
    name: busqueda.trim() || undefined,
    locations: zonasActivas.length > 0 ? zonasActivas : undefined,
    eventTypes: chipActivo !== 'Todos los tipos' ? [chipActivo] : undefined,
    capacity: capacidadMin > 0 ? capacidadMin : undefined,
    ...(capacidadMax < 500 ? { maxCapacity: capacidadMax } : {}),
    amenities: serviciosActivos.length > 0 ? serviciosActivos : undefined,
    sortBy,
    page: paginaActual,
    pageSize: ITEMS_PER_PAGE,
  }), [busqueda, zonasActivas, chipActivo, capacidadMin, capacidadMax, serviciosActivos, sortBy, paginaActual])

  const { data, isLoading, isError } = useSearchSalones(params)

  const salonesFiltrados = data?.salones ?? []
  const totalPaginas = data?.totalPages ?? 1
  const paginaSegura = Math.min(paginaActual, totalPaginas)
  const salonesPagina = salonesFiltrados

  /* ─── Filtros activos (derivado) ─── */
  const filtrosActivos = useMemo(
    () => [...zonasActivas, ...serviciosActivos],
    [zonasActivas, serviciosActivos],
  )


  const toggleZona = (zona: string) => {
    const next = zonasActivas.includes(zona)
      ? zonasActivas.filter((z) => z !== zona)
      : [...zonasActivas, zona]
    setFilter({ zonas: next.length ? next : undefined, page: undefined })
  }

  const toggleServicio = (servicio: string) => {
    const next = serviciosActivos.includes(servicio)
      ? serviciosActivos.filter((s) => s !== servicio)
      : [...serviciosActivos, servicio]
    setFilter({ servicios: next.length ? next : undefined, page: undefined })
  }

  const quitarFiltro = (filtro: string) => {
    const nextZonas = zonasActivas.filter((z) => z !== filtro)
    const nextServicios = serviciosActivos.filter((s) => s !== filtro)
    setFilter({
      zonas: nextZonas.length ? nextZonas : undefined,
      servicios: nextServicios.length ? nextServicios : undefined,
      page: undefined,
    })
  }

  const limpiarFiltros = () => {
    navigate({
      search: {},
      replace: true,
    })
  }

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
            onClick={() => setFilter({ busqueda: busquedaDraft.trim() || undefined, page: undefined })}
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
            onClick={() => setFilter({ tipoEvento: chip === 'Todos los tipos' ? undefined : chip, page: undefined })}
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
        <span className="ml-auto text-[13px] text-muted-foreground hidden md:inline">
          Mostrando <strong className="text-foreground">{isLoading ? '…' : salonesFiltrados.length}</strong> salones
        </span>
      </div>

      {/* ── Buscador por nombre ─── */}
      <div className="max-w-7xl mx-auto px-5 lg:px-8 mt-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" strokeWidth={1.5} />
          <input
            type="text"
            placeholder="Buscar por nombre de salón..."
            value={busquedaDraft}
            onChange={(e) => setBusquedaDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') setFilter({ busqueda: busquedaDraft.trim() || undefined, page: undefined })
            }}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-border bg-card text-foreground text-[15px] placeholder:text-muted-foreground focus:outline-none focus:border-primary transition"
          />
          {busquedaDraft && (
            <button
              type="button"
              aria-label="Limpiar búsqueda"
              onClick={() => { setBusquedaDraft(''); setFilter({ busqueda: undefined, page: undefined }) }}
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
        <aside
          className="hidden lg:block rounded-xl border border-border sticky top-[152px] overflow-hidden self-start"
          style={{ background: 'var(--surface-warm)' }}
        >
          <div className="p-5 space-y-6">
            <div>
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
                      onChange={(e) => setFilter({ capacidadMin: Number(e.target.value) || undefined, page: undefined })}
                      className="w-full bg-transparent text-[14px] font-semibold focus:outline-none text-foreground"
                    />
                  </div>
                  <div className="flex-1 flex items-center gap-1 border border-border rounded-lg p-2">
                    <span className="text-[11px] text-muted-foreground">Máx</span>
                    <input
                      type="number"
                      value={capacidadMax === 500 ? '' : capacidadMax}
                      placeholder="Sin límite"
                      onChange={(e) => setFilter({ capacidadMax: e.target.value ? Number(e.target.value) : undefined, page: undefined })}
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
                Ordenado por {(SORT_OPTIONS.find((o) => o.value === sortBy)?.label ?? 'Relevancia').toLowerCase()}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden md:flex bg-card rounded-full border border-border p-1">
                <button
                  type="button"
                  className={`px-3 py-1.5 text-[13px] font-semibold rounded-full transition ${
                    vistaLista ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Lista
                </button>
                <button
                  type="button"
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
            salonesPagina.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-6">
                {salonesPagina.map((salon) => (
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

          {/* Paginación */}
          {!isLoading && !isError && salonesFiltrados.length > 0 && (
            <Pagination paginaActual={paginaSegura} totalPaginas={totalPaginas} onPageChange={setPage} />
          )}
        </div>
      </div>
    </>
  )
}
