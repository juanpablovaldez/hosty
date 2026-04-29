import { Link } from '@tanstack/react-router'
import type { Salon } from '../types'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Heart, Users, Star, ShieldCheck, MapPin } from 'lucide-react'
import { cn } from '@/shared/lib/utils'

interface CardSalonProps {
  salon: Salon
  onFavoriteToggle?: (id: string) => void
}

const AVAILABILITY_STYLES = {
  disponible: 'bg-primary text-primary-foreground',
  reservado: 'bg-muted-foreground text-background',
  'no disponible': 'bg-muted text-muted-foreground',
} as const

export function CardSalon({ salon, onFavoriteToggle }: CardSalonProps) {
  const coverImage = salon.images[0] ?? '/placeholder-salon.jpg'

  function handleFavorite(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    onFavoriteToggle?.(salon.id)
  }

  return (
    <article className="group h-full">
      <Link to="/salones/$id" params={{ id: salon.id }} className="block h-full focus-visible:outline-none">
        <Card className="h-full overflow-hidden transition-shadow group-hover:shadow-lg group-focus-visible:ring-2 group-focus-visible:ring-ring">
          {/* Image */}
          <div className="relative aspect-[4/3] overflow-hidden bg-muted">
            <img
              src={coverImage}
              alt={salon.name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />

            {/* Verified badge */}
            {salon.isVerified && (
              <div className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-background/90 px-2 py-1 shadow-sm backdrop-blur-sm">
                <ShieldCheck className="h-4 w-4 text-primary" strokeWidth={1.5} />
                <span className="text-xs font-semibold text-primary">Verificado</span>
              </div>
            )}

            {/* Availability pill */}
            <div className="absolute bottom-2 left-2">
              <span
                className={cn(
                  'rounded-full px-2.5 py-0.5 text-xs font-semibold',
                  AVAILABILITY_STYLES[salon.availabilityStatus],
                )}
              >
                {salon.availabilityStatus}
              </span>
            </div>

            {/* Favorite button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 bottom-2 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background"
              onClick={handleFavorite}
              aria-label={salon.isFavorite ? 'Quitar de favoritos' : 'Guardar como favorito'}
            >
              <Heart
                className={cn(
                  'h-4 w-4 transition-colors',
                  salon.isFavorite ? 'fill-primary text-primary' : 'text-muted-foreground',
                )}
              />
            </Button>
          </div>

          {/* Body */}
          <CardContent className="flex flex-col gap-2 p-4">
            <div className="flex items-start justify-between gap-2">
              <h3 className="line-clamp-1 text-base font-semibold leading-tight text-foreground">
                {salon.name}
              </h3>
              {salon.rating && (
                <div className="flex shrink-0 items-center gap-1 text-accent">
                  <Star className="h-3.5 w-3.5 fill-current" />
                  <span className="text-sm font-semibold">{salon.rating.value.toFixed(1)}</span>
                  <span className="text-xs text-muted-foreground">({salon.rating.count})</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 shrink-0" strokeWidth={1.5} />
              <span className="line-clamp-1">{salon.location}</span>
            </div>

            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Users className="h-3.5 w-3.5 shrink-0" strokeWidth={1.5} />
              <span>hasta {salon.capacity} personas</span>
            </div>

            {/* Event type badges */}
            <div className="flex flex-wrap gap-1">
              {salon.eventTypes.slice(0, 3).map((tipo) => (
                <Badge key={tipo} variant="secondary" className="text-xs">
                  {tipo}
                </Badge>
              ))}
              {salon.eventTypes.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{salon.eventTypes.length - 3}
                </Badge>
              )}
            </div>
          </CardContent>

          {/* Price */}
          <CardFooter className="border-t px-4 py-3">
            <p className="text-sm text-muted-foreground">
              <span className="text-lg font-bold text-foreground">
                {salon.pricePerHour.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 })}
              </span>
              {' '}/ hora
            </p>
          </CardFooter>
        </Card>
      </Link>
    </article>
  )
}
