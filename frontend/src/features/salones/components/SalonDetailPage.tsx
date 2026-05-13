import { useState } from 'react'
import { useParams, Link } from '@tanstack/react-router'
import { useSalon } from '../api/salones.queries'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  MapPin, Users, Star, ShieldCheck, Wifi, Car, Utensils,
  Music, Thermometer, Lightbulb, ChevronLeft, ChevronRight,
  Calendar, Images, X,
} from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import type { Salon } from '../types'

/* ─── Amenity icons map ──────────────────────────────────── */
const AMENITY_ICONS: Record<string, React.ElementType> = {
  'Wi-Fi': Wifi,
  Estacionamiento: Car,
  Catering: Utensils,
  Sonido: Music,
  Climatización: Thermometer,
  Iluminación: Lightbulb,
}

/* ─── Galería con lightbox ───────────────────────────────── */
function Gallery({ images, name }: { images: string[]; name: string }) {
  const [activeIdx, setActiveIdx] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  const prev = () => setActiveIdx((i) => (i - 1 + images.length) % images.length)
  const next = () => setActiveIdx((i) => (i + 1) % images.length)

  if (images.length === 0) {
    return (
      <div className="aspect-[16/7] w-full rounded-[24px] bg-muted flex items-center justify-center text-muted-foreground text-sm">
        Sin imágenes disponibles
      </div>
    )
  }

  return (
    <>
      {/* Grid principal */}
      <div className="grid gap-2 md:grid-cols-[2fr_1fr] mb-8">
        {/* Imagen principal */}
        <div
          className="relative aspect-[4/3] md:aspect-auto md:h-[420px] overflow-hidden rounded-[20px] bg-muted cursor-pointer group"
          onClick={() => setLightboxOpen(true)}
        >
          <img
            src={images[activeIdx]}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />

          {/* Navegación */}
          {images.length > 1 && (
            <>
              <button
                type="button"
                aria-label="Imagen anterior"
                onClick={(e) => { e.stopPropagation(); prev() }}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center shadow hover:bg-background transition"
              >
                <ChevronLeft className="w-5 h-5 text-foreground" strokeWidth={1.5} />
              </button>
              <button
                type="button"
                aria-label="Imagen siguiente"
                onClick={(e) => { e.stopPropagation(); next() }}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center shadow hover:bg-background transition"
              >
                <ChevronRight className="w-5 h-5 text-foreground" strokeWidth={1.5} />
              </button>
            </>
          )}

          {/* Contador */}
          <div className="absolute bottom-3 left-3 bg-background/90 backdrop-blur-sm rounded-full px-2.5 py-1 text-[12px] font-semibold text-foreground">
            {activeIdx + 1} / {images.length}
          </div>

          {/* Ver todas */}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setLightboxOpen(true) }}
            className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 bg-background/90 backdrop-blur-sm rounded-full px-3 py-1.5 text-[12px] font-semibold text-foreground hover:bg-background transition shadow"
          >
            <Images className="w-4 h-4" strokeWidth={1.5} />
            Ver todas ({images.length})
          </button>
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="hidden md:grid grid-rows-2 gap-2">
            {images.slice(1, 3).map((img, i) => (
              <div
                key={i}
                className={cn(
                  'overflow-hidden rounded-[16px] bg-muted cursor-pointer relative',
                  activeIdx === i + 1 && 'ring-2 ring-primary',
                )}
                onClick={() => setActiveIdx(i + 1)}
              >
                <img
                  src={img}
                  alt={`${name} foto ${i + 2}`}
                  className="h-full w-full object-cover hover:scale-[1.03] transition-transform duration-300"
                />
                {i === 1 && images.length > 3 && (
                  <div
                    className="absolute inset-0 bg-black/50 flex items-center justify-center cursor-pointer"
                    onClick={(e) => { e.stopPropagation(); setLightboxOpen(true) }}
                  >
                    <span className="text-white font-bold text-lg">+{images.length - 3}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Thumbnails strip — mobile */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 md:hidden [&::-webkit-scrollbar]:hidden">
          {images.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveIdx(i)}
              className={cn(
                'flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition',
                activeIdx === i ? 'border-primary' : 'border-transparent',
              )}
            >
              <img src={img} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            type="button"
            aria-label="Cerrar galería"
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
          >
            <X className="w-5 h-5 text-white" strokeWidth={1.5} />
          </button>

          <div className="relative max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={images[activeIdx]}
              alt={name}
              className="w-full max-h-[80vh] object-contain rounded-xl"
            />
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  aria-label="Imagen anterior"
                  onClick={prev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
                >
                  <ChevronLeft className="w-6 h-6 text-white" strokeWidth={1.5} />
                </button>
                <button
                  type="button"
                  aria-label="Imagen siguiente"
                  onClick={next}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
                >
                  <ChevronRight className="w-6 h-6 text-white" strokeWidth={1.5} />
                </button>
              </>
            )}
            <p className="text-center text-white/60 text-sm mt-3">
              {activeIdx + 1} de {images.length}
            </p>
          </div>
        </div>
      )}
    </>
  )
}

/* ─── Amenity badge ──────────────────────────────────────── */
function AmenityBadge({ amenity }: { amenity: string }) {
  const Icon = AMENITY_ICONS[amenity]
  return (
    <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-[14px] font-medium text-foreground shadow-[0_1px_3px_rgba(28,43,58,0.06)]">
      {Icon
        ? <Icon className="h-4 w-4 text-primary flex-shrink-0" strokeWidth={1.5} />
        : <span className="w-4 h-4 rounded-full bg-primary/20 flex-shrink-0" />
      }
      {amenity}
    </div>
  )
}

/* ─── Panel de reserva ───────────────────────────────────── */
function BookingPanel({ salon }: { salon: Salon }) {
  return (
    <div className="flex flex-col gap-5 rounded-[24px] border border-border bg-card p-6 shadow-[0_4px_12px_rgba(28,43,58,0.08),0_16px_40px_-16px_rgba(28,43,58,0.18)]">
      <div>
        <p className="text-[12px] text-muted-foreground uppercase tracking-wider mb-1">desde</p>
        <p className="text-[32px] font-extrabold text-foreground leading-tight">
          {salon.pricePerHour.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 })}
        </p>
        <p className="text-[13px] text-muted-foreground">por hora</p>
      </div>

      <Separator />

      <div className="flex flex-col gap-3 text-[14px]">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Capacidad</span>
          <span className="font-semibold text-foreground flex items-center gap-1">
            <Users className="w-4 h-4 text-primary" strokeWidth={1.5} />
            {salon.capacity} personas
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Tiempo mínimo</span>
          <span className="font-semibold text-foreground">{salon.rentTimeHours}h</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Disponibilidad</span>
          <span
            className={cn(
              'rounded-full px-3 py-1 text-[12px] font-semibold',
              salon.availabilityStatus === 'disponible'
                ? 'bg-primary/10 text-primary'
                : 'bg-muted text-muted-foreground',
            )}
          >
            {salon.availabilityStatus}
          </span>
        </div>
      </div>

      <Button
        asChild
        size="lg"
        className="w-full gap-2 rounded-xl text-[15px] font-semibold"
        disabled={salon.availabilityStatus !== 'disponible'}
      >
        <Link to="/salones/$id/reservar" params={{ id: salon.id }}>
          <Calendar className="h-4 w-4" strokeWidth={1.5} />
          {salon.availabilityStatus === 'disponible' ? 'Reservar ahora' : 'No disponible'}
        </Link>
      </Button>

      <p className="text-center text-[12px] text-muted-foreground">
        Sin cargo hasta confirmar la reserva
      </p>
    </div>
  )
}

/* ─── Skeleton ───────────────────────────────────────────── */
function DetailSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="aspect-[16/7] w-full rounded-[24px] bg-muted" />
      <div className="space-y-3">
        <div className="h-8 bg-muted rounded w-2/3" />
        <div className="h-5 bg-muted rounded w-1/3" />
        <div className="flex gap-2">
          <div className="h-6 bg-muted rounded-full w-20" />
          <div className="h-6 bg-muted rounded-full w-24" />
        </div>
      </div>
    </div>
  )
}

/* ─── Página principal ───────────────────────────────────── */
export function SalonDetailPage() {
  const { id } = useParams({ from: '/salones/$id' })
  const { data: salon, isLoading, isError } = useSalon(id)

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-5 lg:px-8 py-8">
        <DetailSkeleton />
      </div>
    )
  }

  if (isError || !salon) {
    return (
      <div className="flex flex-col items-center gap-4 py-20 text-center">
        <p className="text-[18px] font-semibold text-foreground">Salón no encontrado</p>
        <Button asChild variant="outline">
          <Link to="/salones">Volver a la búsqueda</Link>
        </Button>
      </div>
    )
  }

  const mapQuery = encodeURIComponent(`${salon.address}, Tucumán, Argentina`)

  return (
    <div className="max-w-7xl mx-auto px-5 lg:px-8 py-8">

      {/* Back */}
      <Link
        to="/salones"
        className="inline-flex items-center gap-1 text-[14px] text-muted-foreground hover:text-foreground transition mb-6"
      >
        <ChevronLeft className="h-4 w-4" strokeWidth={1.5} />
        Volver a resultados
      </Link>

      {/* Header */}
      <div className="mb-6 flex flex-col gap-3">
        <div className="flex flex-wrap items-start gap-3">
          <h1 className="text-[28px] lg:text-[36px] font-extrabold text-foreground tracking-tight leading-tight">
            {salon.name}
          </h1>
          {salon.isVerified && (
            <div className="mt-1 flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 flex-shrink-0">
              <ShieldCheck className="h-4 w-4 text-primary" strokeWidth={1.5} />
              <span className="text-[12px] font-semibold text-primary">Verificado</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-4 text-[14px] text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4 flex-shrink-0" strokeWidth={1.5} />
            {salon.address}, {salon.location}
          </div>
          {salon.rating && (
            <div className="flex items-center gap-1.5">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" strokeWidth={1.5} />
              <span className="font-bold text-foreground">{salon.rating.value.toFixed(1)}</span>
              <span>({salon.rating.count} reseñas)</span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <Users className="h-4 w-4 flex-shrink-0" strokeWidth={1.5} />
            hasta {salon.capacity} personas
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {salon.eventTypes.map((tipo) => (
            <Badge key={tipo} variant="secondary" className="text-[13px]">{tipo}</Badge>
          ))}
        </div>
      </div>

      {/* Gallery + Booking panel lado a lado */}
      <div className="flex flex-col lg:flex-row lg:items-start gap-6 mb-10">
        <div className="flex-1 min-w-0">
          <Gallery images={salon.images} name={salon.name} />
        </div>
        <div className="w-full lg:w-80 lg:shrink-0">
          <BookingPanel salon={salon} />
        </div>
      </div>

      {/* Contenido inferior — ancho completo */}
      <div className="space-y-10">

        {/* Descripción */}
        <section>
          <h2 className="text-[20px] font-bold text-foreground mb-3">
            Sobre el salón
          </h2>
          <p className="text-[15px] text-muted-foreground leading-relaxed">
            {salon.description ?? 'El anfitrión no ha agregado una descripción todavía.'}
          </p>
        </section>

        <Separator />

        {/* Servicios / amenities */}
        {salon.amenities.length > 0 && (
          <section>
            <h2 className="text-[20px] font-bold text-foreground mb-4">
              Servicios incluidos
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {salon.amenities.map((amenity) => (
                <AmenityBadge key={amenity} amenity={amenity} />
              ))}
            </div>
          </section>
        )}

        <Separator />

        {/* Mapa */}
        <section>
          <h2 className="text-[20px] font-bold text-foreground mb-2">
            Ubicación
          </h2>
          <p className="text-[14px] text-muted-foreground mb-4 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 flex-shrink-0" strokeWidth={1.5} />
            {salon.address}, {salon.location}
          </p>
          <div className="rounded-[20px] overflow-hidden border border-border shadow-[0_1px_3px_rgba(28,43,58,0.06)] h-72">
            <iframe
              title="Ubicación del salón"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              src={`https://maps.google.com/maps?q=${mapQuery}&output=embed&hl=es&z=15`}
            />
          </div>
          <a
            href={`https://maps.google.com/maps?q=${mapQuery}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 mt-3 text-[13px] text-primary hover:text-primary/80 transition font-medium"
          >
            Abrir en Google Maps
            <ChevronRight className="w-4 h-4" strokeWidth={1.5} />
          </a>
        </section>

      </div>
    </div>
  )
}
