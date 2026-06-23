import { Link, useNavigate } from '@tanstack/react-router'
import type { Salon } from '../types'
import { salonPriceDisplay } from '../lib/pricing'
import { Heart, Users, Star, MapPin, Sparkles } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { HostyBadge } from '@/components/ui/hosty-badge'
import { cn } from '@/shared/lib/utils'
import { useAuthStore } from '@/features/auth/store/auth.store'
import { useToggleFavorite } from '@/features/favorites/api/favorites.mutations'

interface CardSalonProps {
  salon: Salon
}

const AVAILABILITY_STYLES = {
  disponible: 'bg-primary text-primary-foreground',
  reservado: 'bg-muted-foreground text-background',
  'no disponible': 'bg-muted text-muted-foreground',
} as const

export function CardSalon({ salon }: CardSalonProps) {
  const coverImage = salon.images[0] ?? '/placeholder-salon.jpg'
  const price = salonPriceDisplay(salon)
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const toggleFavorite = useToggleFavorite(user?.id ?? null)

  function handleFavorite(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (!user) {
      navigate({ to: '/login' })
      return
    }
    toggleFavorite.mutate({ salonId: salon.id, isFavorite: salon.isFavorite })
  }

  return (
    <article
      className="group cursor-pointer bg-card rounded-[14px] overflow-hidden border border-border transition-all duration-[250ms] hover:-translate-y-[5px] hover:border-primary/20"
      style={{ boxShadow: 'var(--shadow-sm)' }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-lg)' }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-sm)' }}
    >
      <Link
        to="/salones/$id"
        params={{ id: salon.id }}
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-[14px]"
      >
        {/* Imagen */}
        <div className="relative h-[214px] overflow-hidden bg-muted">
          <div className="w-full h-full transition-transform duration-[550ms] ease-in-out group-hover:scale-[1.05]">
          <img
            src={coverImage}
            alt={salon.name}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
          </div>

          {/* Badge destacado */}
          {salon.isFeatured && (
            <div className="absolute top-3 left-3">
              <span className="flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-[11px] font-semibold text-primary-foreground">
                <Sparkles className="w-3 h-3" strokeWidth={1.5} />
                Destacado
              </span>
            </div>
          )}

          {/* Badge verificado */}
          {salon.isVerified && !salon.isFeatured && (
            <div className="absolute top-3 left-3">
              <HostyBadge variant="verificado" size="sm" />
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
            aria-label={salon.isFavorite ? 'Quitar de favoritos' : 'Guardar en favoritos'}
            onClick={handleFavorite}
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-card/95 hover:bg-card flex items-center justify-center transition shadow-sm backdrop-blur-sm"
          >
            <Heart
              className={cn(
                'w-5 h-5 transition',
                salon.isFavorite ? 'fill-red-500 text-red-500' : 'text-foreground/70',
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
            {price.label && (
              <span className="text-[11px] text-muted-foreground uppercase tracking-wider">{price.label}</span>
            )}
            <div className="font-bold text-[20px] leading-tight text-foreground">
              {price.main}
              {price.suffix && (
                <span className="text-[12px] font-medium text-muted-foreground"> {price.suffix}</span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </article>
  )
}
