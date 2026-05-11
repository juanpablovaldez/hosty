import { useState, useMemo } from 'react';
import { Link } from '@tanstack/react-router';
import { Heart, MapPin, Calendar, Users, Search, SlidersHorizontal, X, ChevronLeft, ChevronRight, Star, Map } from 'lucide-react';

/* ─── Tipos locales ──────────────────────────────────────── */
type Badge = 'Top' | 'Nuevo' | 'Premium' | null;

interface SalonBusqueda {
  id: number;
  nombre: string;
  zona: string;
  distanciaKm: number;
  tipos: string;
  capacidad: number;
  precio: number;
  rating: number;
  reviews: number;
  isVerified: boolean;
  isFavorite: boolean;
  badge: Badge;
  badgeVariant: 'coral' | 'ambar';
  amenities: string[];
  fotos: number;
  gradient: 'coral' | 'ambar' | 'dark';
}

/* ─── Datos estáticos ────────────────────────────────────── */
const SALONES: SalonBusqueda[] = [
  {
    id: 1,
    nombre: 'Salón Los Jazmines',
    zona: 'Yerba Buena',
    distanciaKm: 2.4,
    tipos: 'Casamientos · Cumpleaños',
    capacidad: 180,
    precio: 85000,
    rating: 4.9,
    reviews: 42,
    isVerified: true,
    isFavorite: false,
    badge: 'Top',
    badgeVariant: 'coral',
    amenities: ['Estacionamiento', 'Aire acondicionado', 'Catering opcional'],
    fotos: 14,
    gradient: 'coral',
  },
  {
    id: 2,
    nombre: 'Quinta La Palmera',
    zona: 'Yerba Buena',
    distanciaKm: 3.1,
    tipos: 'Casamientos · jardín exterior',
    capacidad: 250,
    precio: 145000,
    rating: 4.8,
    reviews: 28,
    isVerified: true,
    isFavorite: false,
    badge: 'Premium',
    badgeVariant: 'ambar',
    amenities: ['Pileta', 'Estacionamiento', 'Catering opcional'],
    fotos: 21,
    gradient: 'ambar',
  },
  {
    id: 3,
    nombre: 'Patio del Árbol',
    zona: 'Centro',
    distanciaKm: 0.8,
    tipos: 'Cumpleaños · Egresos',
    capacidad: 80,
    precio: 48000,
    rating: 4.7,
    reviews: 15,
    isVerified: true,
    isFavorite: false,
    badge: 'Nuevo',
    badgeVariant: 'coral',
    amenities: ['Aire acondicionado', 'Sonido + luces', 'Catering opcional'],
    fotos: 8,
    gradient: 'coral',
  },
  {
    id: 4,
    nombre: 'Estudio Luna Negra',
    zona: 'Tafí Viejo',
    distanciaKm: 6.2,
    tipos: 'Corporativo · Eventos íntimos',
    capacidad: 40,
    precio: 62000,
    rating: 5.0,
    reviews: 9,
    isVerified: true,
    isFavorite: false,
    badge: null,
    badgeVariant: 'coral',
    amenities: ['Proyector', 'Acceso discapacitados', 'Catering opcional'],
    fotos: 6,
    gradient: 'dark',
  },
];

const CHIPS_TIPO = ['Todos los tipos', 'Cumpleaños', 'Casamientos', 'Corporativo', 'Egresos', 'Infantiles'];
const ZONAS = ['Centro', 'Yerba Buena', 'Tafí Viejo', 'Banda del Río Salí'];
const SERVICIOS = ['Catering opcional', 'Estacionamiento', 'Aire acondicionado', 'Sonido + luces', 'Acceso discapacitados'];

const ITEMS_PER_PAGE = 2;

/* ─── Helpers ────────────────────────────────────────────── */
function gradientClass(g: SalonBusqueda['gradient']) {
  if (g === 'ambar') return 'bg-gradient-to-br from-amber-100 to-amber-300';
  if (g === 'dark') return 'bg-gradient-to-br from-ink-light to-ink';
  return 'bg-gradient-to-br from-coral/20 to-bone-dark';
}

function BadgeLabel({ badge, variant }: { badge: NonNullable<Badge>; variant: 'coral' | 'ambar' }) {
  const cls =
    variant === 'ambar'
      ? 'bg-accent text-foreground'
      : 'bg-primary text-primary-foreground';
  return (
    <span className={`${cls} text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full`}>
      {badge}
    </span>
  );
}

function VerificadoBadge() {
  return (
    <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-[11px] font-bold px-2.5 py-1 rounded-full">
      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clipRule="evenodd"
        />
      </svg>
      Verificado
    </span>
  );
}

/* ─── Card de resultado ──────────────────────────────────── */
function CardResultado({ salon }: { salon: SalonBusqueda }) {
  const [fav, setFav] = useState(salon.isFavorite);

  return (
    <article className="group cursor-pointer bg-card rounded-[20px] overflow-hidden shadow-[0_1px_3px_rgba(28,43,58,0.06),0_8px_24px_-12px_rgba(28,43,58,0.12)] hover:shadow-[0_4px_12px_rgba(28,43,58,0.08),0_16px_40px_-16px_rgba(28,43,58,0.18)] transition border border-border">
      {/* Imagen */}
      <div className={`${gradientClass(salon.gradient)} aspect-[4/3] relative`}>
        {/* Badge top-left */}
        {salon.badge && (
          <div className="absolute top-3 left-3">
            <BadgeLabel badge={salon.badge} variant={salon.badgeVariant} />
          </div>
        )}
        {/* Favorito top-right */}
        <div className="absolute top-3 right-3">
          <button
            type="button"
            aria-label={fav ? 'Quitar de favoritos' : 'Guardar en favoritos'}
            onClick={() => setFav(!fav)}
            className="w-9 h-9 rounded-full bg-white/95 hover:bg-white flex items-center justify-center transition"
          >
            <Heart
              className={`w-5 h-5 transition ${fav ? 'fill-red-500 text-red-500' : 'text-foreground/70'}`}
            />
          </button>
        </div>
        {/* Contador fotos */}
        <div className="absolute bottom-3 left-3">
          <span className="bg-foreground/70 backdrop-blur-sm text-white text-[12px] font-medium px-2.5 py-1 rounded-full">
            1 / {salon.fotos}
          </span>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-5">
        {/* Nombre + rating */}
        <div className="flex items-start justify-between gap-3 mb-1">
          <h3 className="font-bold text-[17px] text-foreground leading-tight">{salon.nombre}</h3>
          <div className="flex items-center gap-1 flex-shrink-0">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="font-bold text-[14px] text-foreground">{salon.rating}</span>
            <span className="text-muted-foreground text-[13px]">({salon.reviews})</span>
          </div>
        </div>

        {/* Zona + distancia + verificado */}
        <div className="flex items-center flex-wrap gap-1 text-[13px] text-muted-foreground mb-2">
          <MapPin className="w-4 h-4 flex-shrink-0" />
          <span>{salon.zona} · {salon.distanciaKm} km</span>
          <span className="mx-1">·</span>
          {salon.isVerified && <VerificadoBadge />}
        </div>

        {/* Tipos */}
        <p className="text-[13px] text-muted-foreground">
          {salon.tipos} · hasta {salon.capacidad} personas
        </p>

        {/* Amenities */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {salon.amenities.map((a) => (
            <span
              key={a}
              className="bg-background text-foreground text-[11px] font-medium px-2.5 py-1 rounded-full border border-border"
            >
              {a}
            </span>
          ))}
        </div>

        {/* Precio + CTA */}
        <div className="mt-4 flex items-end justify-between pt-4 border-t border-border">
          <div>
            <span className="text-[11px] text-muted-foreground uppercase tracking-wider">desde</span>
            <div className="font-bold text-[20px] leading-tight text-foreground">
              $ {salon.precio.toLocaleString('es-AR')}{' '}
              <span className="text-[12px] font-medium text-muted-foreground">/ evento</span>
            </div>
          </div>
          <Link
            to="/salones"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl px-4 py-2 text-[13px] transition"
          >
            Ver más
          </Link>
        </div>
      </div>
    </article>
  );
}

/* ─── Página principal ───────────────────────────────────── */
export function SalonesPage() {
  const [chipActivo, setChipActivo] = useState('Todos los tipos');
  const [zonasActivas, setZonasActivas] = useState<string[]>([]);
  const [serviciosActivos, setServiciosActivos] = useState<string[]>([]);
  const [capacidadMin, setCapacidadMin] = useState(20);
  const [capacidadMax, setCapacidadMax] = useState(300);
  const [ordenamiento, setOrdenamiento] = useState('Relevancia');
  const [vistaLista, setVistaLista] = useState(true);
  const [paginaActual, setPaginaActual] = useState(1);

  /* ─── Conteo de salones por zona (derivado) ─── */
  const zonaCounts = useMemo(
    () =>
      SALONES.reduce<Record<string, number>>((acc, s) => {
        acc[s.zona] = (acc[s.zona] ?? 0) + 1;
        return acc;
      }, {}),
    [],
  );

  /* ─── Filtros activos (derivado) ─── */
  const filtrosActivos = useMemo(
    () => [...zonasActivas, ...serviciosActivos],
    [zonasActivas, serviciosActivos],
  );

  /* ─── Salones filtrados y ordenados (derivado) ─── */
  const salonesFilteredAndSorted = useMemo(() => {
    let result = SALONES.filter((s) => {
      if (chipActivo !== 'Todos los tipos' && !s.tipos.toLowerCase().includes(chipActivo.toLowerCase())) {
        return false;
      }
      if (zonasActivas.length > 0 && !zonasActivas.includes(s.zona)) {
        return false;
      }
      if (s.capacidad < capacidadMin || s.capacidad > capacidadMax) {
        return false;
      }
      if (serviciosActivos.length > 0) {
        const allMatch = serviciosActivos.every((sv) =>
          s.amenities.some((a) => a.toLowerCase().includes(sv.toLowerCase().split(' ')[0])),
        );
        if (!allMatch) return false;
      }
      return true;
    });

    if (ordenamiento === 'Mejor puntuados') {
      result = [...result].sort((a, b) => b.rating - a.rating);
    } else if (ordenamiento === 'Precio: menor a mayor') {
      result = [...result].sort((a, b) => a.precio - b.precio);
    } else if (ordenamiento === 'Precio: mayor a menor') {
      result = [...result].sort((a, b) => b.precio - a.precio);
    } else if (ordenamiento === 'Capacidad') {
      result = [...result].sort((a, b) => b.capacidad - a.capacidad);
    }

    return result;
  }, [chipActivo, zonasActivas, serviciosActivos, capacidadMin, capacidadMax, ordenamiento]);

  /* ─── Paginación ─── */
  const totalPaginas = Math.max(1, Math.ceil(salonesFilteredAndSorted.length / ITEMS_PER_PAGE));
  const paginaSegura = Math.min(paginaActual, totalPaginas);
  const salonesPagina = salonesFilteredAndSorted.slice(
    (paginaSegura - 1) * ITEMS_PER_PAGE,
    paginaSegura * ITEMS_PER_PAGE,
  );
  const inicio = salonesFilteredAndSorted.length === 0 ? 0 : (paginaSegura - 1) * ITEMS_PER_PAGE + 1;
  const fin = Math.min(paginaSegura * ITEMS_PER_PAGE, salonesFilteredAndSorted.length);

  const toggleZona = (zona: string) => {
    setPaginaActual(1);
    setZonasActivas((prev) =>
      prev.includes(zona) ? prev.filter((z) => z !== zona) : [...prev, zona],
    );
  };

  const toggleServicio = (servicio: string) => {
    setPaginaActual(1);
    setServiciosActivos((prev) =>
      prev.includes(servicio) ? prev.filter((s) => s !== servicio) : [...prev, servicio],
    );
  };

  const quitarFiltro = (filtro: string) => {
    setZonasActivas((prev) => prev.filter((z) => z !== filtro));
    setServiciosActivos((prev) => prev.filter((s) => s !== filtro));
    setPaginaActual(1);
  };

  const limpiarFiltros = () => {
    setZonasActivas([]);
    setServiciosActivos([]);
    setChipActivo('Todos los tipos');
    setCapacidadMin(20);
    setCapacidadMax(300);
    setPaginaActual(1);
  };

  return (
    <>
      {/* ── Barra de búsqueda refinada ─── */}
      <div className="bg-card border-b border-border sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 py-4 flex items-center gap-3 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {/* Ubicación */}
          <button
            type="button"
            className="flex items-center gap-2 bg-muted rounded-full px-4 py-2.5 min-w-fit hover:bg-muted/80 transition"
          >
            <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
            <span className="text-[14px] font-medium whitespace-nowrap">San Miguel de Tucumán</span>
          </button>
          {/* Fecha */}
          <button
            type="button"
            className="flex items-center gap-2 bg-muted rounded-full px-4 py-2.5 min-w-fit hover:bg-muted/80 transition"
          >
            <Calendar className="w-5 h-5 text-muted-foreground flex-shrink-0" />
            <span className="text-[14px] font-medium whitespace-nowrap">Sáb · 15 may</span>
          </button>
          {/* Invitados */}
          <button
            type="button"
            className="flex items-center gap-2 bg-muted rounded-full px-4 py-2.5 min-w-fit hover:bg-muted/80 transition"
          >
            <Users className="w-5 h-5 text-muted-foreground flex-shrink-0" />
            <span className="text-[14px] font-medium whitespace-nowrap">50 invitados</span>
          </button>
          {/* Buscar */}
          <button
            type="button"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-full px-4 py-2.5 min-w-fit text-[14px] transition"
          >
            <Search className="w-5 h-5" />
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
            onClick={() => { setChipActivo(chip); setPaginaActual(1); }}
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
          Mostrando <strong className="text-foreground">{salonesFilteredAndSorted.length}</strong> salones
        </span>
      </div>

      {/* ── Layout principal ─── */}
      <div className="max-w-7xl mx-auto px-5 lg:px-8 py-6 grid lg:grid-cols-[280px_1fr] gap-8">

        {/* ── Sidebar filtros ─── */}
        <aside className="hidden lg:block">
          <div className="sticky top-40 space-y-6">

            {/* Card filtros */}
            <div className="bg-card rounded-[20px] p-5 shadow-[0_1px_3px_rgba(28,43,58,0.06),0_8px_24px_-12px_rgba(28,43,58,0.12)] border border-border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-[16px] text-foreground flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4" />
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
                      value={capacidadMin}
                      onChange={(e) => { setCapacidadMin(Number(e.target.value)); setPaginaActual(1); }}
                      className="w-full bg-transparent text-[14px] font-semibold focus:outline-none text-foreground"
                    />
                  </div>
                  <div className="flex-1 flex items-center gap-1 border border-border rounded-lg p-2">
                    <span className="text-[11px] text-muted-foreground">Máx</span>
                    <input
                      type="number"
                      value={capacidadMax}
                      onChange={(e) => { setCapacidadMax(Number(e.target.value)); setPaginaActual(1); }}
                      className="w-full bg-transparent text-[14px] font-semibold focus:outline-none text-foreground"
                    />
                  </div>
                </div>
              </div>

              {/* Precio */}
              <div className="mb-6">
                <label className="block text-[13px] font-semibold text-muted-foreground mb-2 tracking-wide">
                  Precio por evento
                </label>
                <div className="relative py-3">
                  <div className="h-1 bg-muted rounded-full relative">
                    <div
                      className="absolute top-0 h-1 bg-primary rounded-full"
                      style={{ left: '20%', right: '25%' }}
                    />
                    <div
                      className="absolute w-4 h-4 bg-card border-2 border-primary rounded-full -top-1.5"
                      style={{ left: 'calc(20% - 8px)' }}
                    />
                    <div
                      className="absolute w-4 h-4 bg-card border-2 border-primary rounded-full -top-1.5"
                      style={{ right: 'calc(25% - 8px)' }}
                    />
                  </div>
                  <div className="flex justify-between mt-3 text-[12px] text-muted-foreground font-medium">
                    <span>$ 30.000</span>
                    <span>$ 120.000</span>
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
                      <span className="ml-auto text-muted-foreground text-[12px]">
                        {zonaCounts[zona] ?? 0}
                      </span>
                    </label>
                  ))}
                  <button type="button" className="text-[13px] font-semibold text-primary hover:text-primary/80 mt-1 transition">
                    + Ver todas
                  </button>
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
                <Star className="w-5 h-5 fill-amber-400 text-amber-400 flex-shrink-0" />
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
              <p className="text-[13px] text-muted-foreground mt-1">Ordenado por {ordenamiento.toLowerCase()}</p>
            </div>
            <div className="flex items-center gap-2">
              {/* Toggle lista/mapa */}
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
                  <Map className="w-4 h-4" />
                  Mapa
                </button>
              </div>
              {/* Ordenamiento */}
              <select
                value={ordenamiento}
                onChange={(e) => { setOrdenamiento(e.target.value); setPaginaActual(1); }}
                className="w-auto px-3 py-2 rounded-xl border border-border bg-card text-foreground text-[13px] font-medium focus:outline-none focus:border-primary"
              >
                <option>Relevancia</option>
                <option>Mejor puntuados</option>
                <option>Precio: menor a mayor</option>
                <option>Precio: mayor a menor</option>
                <option>Capacidad</option>
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
                  <X className="w-4 h-4" />
                </button>
              ))}
            </div>
          )}

          {/* Grid de resultados o estado vacío */}
          {salonesPagina.length > 0 ? (
            <div className="grid sm:grid-cols-2 gap-6">
              {salonesPagina.map((salon) => (
                <CardResultado key={salon.id} salon={salon} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center">
              <p className="text-[18px] font-semibold text-foreground mb-2">Sin resultados</p>
              <p className="text-[14px] text-muted-foreground">
                Probá ajustando los filtros para ver más salones.
              </p>
            </div>
          )}

          {/* Paginación */}
          {totalPaginas > 1 && (
            <div className="mt-10 flex items-center justify-between">
              <p className="text-[13px] text-muted-foreground">
                Mostrando <strong className="text-foreground">{inicio}–{fin}</strong> de{' '}
                <strong className="text-foreground">{salonesFilteredAndSorted.length}</strong> salones
              </p>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={paginaSegura === 1}
                  onClick={() => setPaginaActual((p) => Math.max(1, p - 1))}
                  className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground disabled:opacity-40 hover:bg-muted transition"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPaginaActual(p)}
                    className={`w-9 h-9 rounded-lg text-[14px] font-semibold transition ${
                      paginaSegura === p
                        ? 'bg-primary text-primary-foreground'
                        : 'border border-border hover:bg-muted text-foreground'
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  type="button"
                  disabled={paginaSegura === totalPaginas}
                  onClick={() => setPaginaActual((p) => Math.min(totalPaginas, p + 1))}
                  className="w-9 h-9 rounded-lg border border-border flex items-center justify-center hover:bg-muted transition disabled:opacity-40"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
