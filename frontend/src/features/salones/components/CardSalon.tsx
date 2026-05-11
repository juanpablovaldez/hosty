import type { Salon } from '../types'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Heart, Users, Tag, Sparkles } from 'lucide-react'
import badgeVerificado from '@/logos/badges_verificado-gtia-seg/badges oficiales/hosty-badge-verificado.svg'

interface CardSalonProps {
  salon: Salon
}

export function CardSalon({ salon }: CardSalonProps) {
  return (
    <Card>
      <div className="relative">
        <img src={salon.image} alt={salon.name} className="w-full h-48 object-cover" />
        <div className="absolute top-2 left-2 flex gap-1">
          {salon.isVerified && (
            <img src={badgeVerificado} alt="Salón verificado" className="w-10 h-10" />
          )}

        </div>
      </div>
      <CardHeader>
        <CardTitle className='text-lg font-semibold'>{salon.name}</CardTitle>
        <p className='text-sm text-muted-foreground'>{salon.location}</p>
        {salon.rating != null && <p className='text-sm text-accent'>{salon.rating}</p>}
      </CardHeader>
      <CardContent className='flex flex-col gap-3'>
        <div className="flex items-center gap-1 flex-wrap">
          <Tag className="w-4 h-4 text-muted-foreground shrink-0" />
          {salon.eventType.map((tipo) => (
            <Badge key={tipo}>{tipo}</Badge>
          ))}
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <Users className="w-4 h-4" />
          <span>{salon.capacity} personas</span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Sparkles className="w-4 h-4 text-muted-foreground shrink-0" />
          {salon.amenities.map((amenity) => (
            <Badge key={amenity} variant="outline">{amenity}</Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className='flex items-center justify-between'>
        <p className='font-semibold text-lg'>
          {salon.price.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}</p>
        <Badge className={salon.availabilityStatus === 'disponible' ? 'bg-green-500' : 'bg-gray-400'}>
          {salon.availabilityStatus}
        </Badge>
        <Button variant="ghost" size="icon" aria-label={salon.isFavorite ? 'Quitar de favoritos' : 'Guardar en favoritos'}>
          <Heart className={salon.isFavorite ? 'fill-red-500 text-red-500' : 'text-muted-foreground'} />
        </Button>
      </CardFooter>
    </Card>
  )
}
