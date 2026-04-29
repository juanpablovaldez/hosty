import { useParams, Link } from '@tanstack/react-router'
import { useSalon } from '../api/salones.queries'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import {
  MapPin, Users, Star, ShieldCheck, Wifi, Car, Utensils,
  Music, Thermometer, Lightbulb, ChevronLeft, Calendar,
} from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import type { Salon } from '../types'

const AMENITY_ICONS: Record<string, React.ElementType> = {
  'Wi-Fi': Wifi,
  Estacionamiento: Car,
  Catering: Utensils,
  Sonido: Music,
  Climatización: Thermometer,
  Iluminación: Lightbulb,
}

function AmenityChip({ amenity }: { amenity: string }) {
  const Icon = AMENITY_ICONS[amenity]
  return (
    <div className="flex items-center gap-2 rounded-lg border bg-card px-3 py-2 text-sm">
      {Icon && <Icon className="h-4 w-4 text-primary" strokeWidth={1.5} />}
      <span>{amenity}</span>
    </div>
  )
}

function BookingPanel({ salon }: { salon: Salon }) {
  return (
    <div className="sticky top-20 flex flex-col gap-4 rounded-2xl border bg-card p-6 shadow-lg">
      <div>
        <p className="text-sm text-muted-foreground">Precio por hora</p>
        <p className="text-3xl font-bold text-foreground">
          {salon.pricePerHour.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 })}
        </p>
      </div>

      <Separator />

      <div className="flex flex-col gap-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Capacidad</span>
          <span className="font-medium">{salon.capacity} personas</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Tiempo mínimo</span>
          <span className="font-medium">{salon.rentTimeHours}h</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Disponibilidad</span>
          <span
            className={cn(
              'rounded-full px-2 py-0.5 text-xs font-semibold',
              salon.availabilityStatus === 'disponible'
                ? 'bg-primary/10 text-primary'
                : 'bg-muted text-muted-foreground',
            )}
          >
            {salon.availabilityStatus}
          </span>
        </div>
      </div>

      <Button asChild size="lg" className="w-full gap-2" disabled={salon.availabilityStatus !== 'disponible'}>
        <Link to="/salones/$id/reservar" params={{ id: salon.id }}>
          <Calendar className="h-4 w-4" strokeWidth={1.5} />
          {salon.availabilityStatus === 'disponible' ? 'Reservar ahora' : 'No disponible'}
        </Link>
      </Button>

      <p className="text-center text-xs text-muted-foreground">Sin cargo hasta confirmar</p>
    </div>
  )
}

function DetailSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <Skeleton className="aspect-[16/7] w-full rounded-2xl" />
      <div className="flex flex-col gap-3">
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-5 w-1/3" />
      </div>
    </div>
  )
}

export function SalonDetailPage() {
  const { id } = useParams({ from: '/salones/$id' })
  const { data: salon, isLoading, isError } = useSalon(id)

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-8">
        <DetailSkeleton />
      </div>
    )
  }

  if (isError || !salon) {
    return (
      <div className="flex flex-col items-center gap-4 py-20 text-center">
        <p className="text-lg font-semibold text-foreground">Salón no encontrado</p>
        <Button asChild variant="outline">
          <Link to="/salones">Volver a la búsqueda</Link>
        </Button>
      </div>
    )
  }

  const [mainImage, ...thumbs] = salon.images

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      {/* Back */}
      <Link
        to="/salones"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4" strokeWidth={1.5} />
        Volver
      </Link>

      {/* Gallery */}
      <div className="mb-8 grid gap-2 md:grid-cols-[2fr_1fr]">
        <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-muted md:aspect-auto md:h-96">
          {mainImage ? (
            <img src={mainImage} alt={salon.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">Sin imagen</div>
          )}
        </div>
        {thumbs.length > 0 && (
          <div className="hidden grid-rows-2 gap-2 md:grid">
            {thumbs.slice(0, 2).map((img, i) => (
              <div key={i} className="overflow-hidden rounded-xl bg-muted">
                <img src={img} alt={`${salon.name} ${i + 2}`} className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Layout: content + booking panel */}
      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="mb-6 flex flex-col gap-3">
            <div className="flex items-start gap-3">
              <h1 className="text-2xl font-bold text-foreground md:text-3xl">{salon.name}</h1>
              {salon.isVerified && (
                <div className="mt-1 flex shrink-0 items-center gap-1 rounded-full bg-primary/10 px-2 py-1">
                  <ShieldCheck className="h-4 w-4 text-primary" strokeWidth={1.5} />
                  <span className="text-xs font-semibold text-primary">Verificado</span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" strokeWidth={1.5} />
                {salon.address}, {salon.location}
              </div>
              {salon.rating && (
                <div className="flex items-center gap-1 text-accent">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="font-semibold text-foreground">{salon.rating.value.toFixed(1)}</span>
                  <span className="text-muted-foreground">({salon.rating.count} reseñas)</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" strokeWidth={1.5} />
                hasta {salon.capacity} personas
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {salon.eventTypes.map((tipo) => (
                <Badge key={tipo} variant="secondary">{tipo}</Badge>
              ))}
            </div>
          </div>

          <Separator className="mb-6" />

          {/* Tabs */}
          <Tabs defaultValue="descripcion">
            <TabsList className="mb-6">
              <TabsTrigger value="descripcion">Descripción</TabsTrigger>
              <TabsTrigger value="servicios">Servicios</TabsTrigger>
              <TabsTrigger value="resenas">Reseñas</TabsTrigger>
              <TabsTrigger value="mapa">Mapa</TabsTrigger>
            </TabsList>

            <TabsContent value="descripcion" className="prose prose-sm max-w-none text-muted-foreground">
              {salon.description ?? 'El anfitrión no ha agregado una descripción todavía.'}
            </TabsContent>

            <TabsContent value="servicios">
              <div className="flex flex-wrap gap-3">
                {salon.amenities.length
                  ? salon.amenities.map((a) => <AmenityChip key={a} amenity={a} />)
                  : <p className="text-sm text-muted-foreground">Sin servicios listados.</p>}
              </div>
            </TabsContent>

            <TabsContent value="resenas">
              <p className="text-sm text-muted-foreground">Las reseñas estarán disponibles próximamente.</p>
            </TabsContent>

            <TabsContent value="mapa">
              <div className="flex h-48 items-center justify-center rounded-xl bg-muted text-sm text-muted-foreground">
                Mapa próximamente disponible
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Booking panel */}
        <div className="w-full lg:w-80 lg:shrink-0">
          <BookingPanel salon={salon} />
        </div>
      </div>
    </div>
  )
}
