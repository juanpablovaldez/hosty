import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import type { Salon } from '../types'
import { Heart, Users, Star, MapPin } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
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
  const [fav, setFav] = useState(salon.isFavorite)
  const coverImage = salon.images[0] ?? '/placeholder-salon.jpg'

  function handleFavorite(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    setFav(!fav)
    onFavoriteToggle?.(salon.id)
  }

  return (
    <article className="group cursor-pointer bg-card rounded-[20px] overflow-hidden shadow-[0_1px_3px_rgba(28,43,58,0.06),0_8px_24px_-12px_rgba(28,43,58,0.12)] hover:shadow-[0_4px_12px_rgba(28,43,58,0.08),0_16px_40px_-16px_rgba(28,43,58,0.18)] transition border border-border">
      <Link
        to="/salones/$id"
        params={{ id: salon.id }}
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-[20px]"
      >
        {/* Imagen */}
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <img
            src={coverImage}
            alt={salon.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />

          {/* Badge verificado */}
          {salon.isVerified && (
            <div className="absolute top-3 left-3 flex items-center gap-1 bg-background/90 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-sm">
              <svg className="w-3 h-3 text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-xs font-semibold text-primary">Verificado</span>
            </div>
          )}

          {/* Pill de disponibilidad */}
          <div className="absolute bottom-3 left-3">
            <span
              className={cn(
                'rounded-full px-2.5 py-1 text-[11px] font-semibold',
                AVAILABILITY_STYLES[salon.availabilityStatus],
              )}
            >
              {salon.availabilityStatus}
            </span>
          </div>

          {/* Botón favorito */}
          <button
            type="button"
            aria-label={fav ? 'Quitar de favoritos' : 'Guardar en favoritos'}
            onClick={handleFavorite}
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/95 hover:bg-white flex items-center justify-center transition shadow-sm"
          >
            <Heart
              className={cn(
                'w-5 h-5 transition',
                fav ? 'fill-red-500 text-red-500' : 'text-foreground/70',
              )}
              strokeWidth={1.5}
            />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-5">
          {/* Nombre + rating */}
          <div className="flex items-start justify-between gap-3 mb-1">
            <h3 className="font-bold text-[17px] text-foreground leading-tight line-clamp-1">
              {salon.name}
            </h3>
            {salon.rating != null && (
              <div className="flex items-center gap-1 flex-shrink-0">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" strokeWidth={1.5} />
                <span className="font-bold text-[14px] text-foreground">
                  {salon.rating.value.toFixed(1)}
                </span>
                <span className="text-muted-foreground text-[13px]">({salon.rating.count})</span>
              </div>
            )}
          </div>

          {/* Ubicación */}
          <div className="flex items-center gap-1 text-[13px] text-muted-foreground mb-2">
            <MapPin className="w-4 h-4 flex-shrink-0" strokeWidth={1.5} />
            <span className="line-clamp-1">{salon.location}</span>
          </div>

          {/* Capacidad */}
          <div className="flex items-center gap-1 text-[13px] text-muted-foreground mb-3">
            <Users className="w-4 h-4 flex-shrink-0" strokeWidth={1.5} />
            <span>hasta {salon.capacity} personas</span>
          </div>

          {/* Badges de tipo de evento */}
          <div className="flex flex-wrap gap-1.5">
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

          {/* Precio */}
          <div className="mt-4 pt-4 border-t border-border">
            <span className="text-[11px] text-muted-foreground uppercase tracking-wider">desde</span>
            <div className="font-bold text-[20px] leading-tight text-foreground">
              {salon.pricePerHour.toLocaleString('es-AR', {
                style: 'currency',
                currency: 'ARS',
                maximumFractionDigits: 0,
              })}{' '}
              <span className="text-[12px] font-medium text-muted-foreground">/ hora</span>
            </div>
          </div>
        </div>
      </Link>
    </article>
  )
}
