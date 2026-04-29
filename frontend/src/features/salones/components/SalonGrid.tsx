import { CardSalon } from './CardSalon'
import { Skeleton } from '@/components/ui/skeleton'
import type { Salon } from '../types'
import { Building2 } from 'lucide-react'

function CardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <Skeleton className="aspect-[4/3] w-full" />
      <div className="flex flex-col gap-3 p-4">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-1/3" />
        <div className="flex gap-1">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
      </div>
      <div className="border-t px-4 py-3">
        <Skeleton className="h-5 w-28" />
      </div>
    </div>
  )
}

interface SalonGridProps {
  salones: Salon[] | undefined
  isLoading: boolean
  isError: boolean
}

export function SalonGrid({ salones, isLoading, isError }: SalonGridProps) {
  if (isError) {
    return (
      <div className="flex flex-col items-center gap-3 py-20 text-center">
        <Building2 className="h-12 w-12 text-muted-foreground/40" strokeWidth={1} />
        <p className="font-medium text-muted-foreground">No pudimos cargar los salones.</p>
        <p className="text-sm text-muted-foreground">Verificá tu conexión e intentá de nuevo.</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
      </div>
    )
  }

  if (!salones?.length) {
    return (
      <div className="flex flex-col items-center gap-3 py-20 text-center">
        <Building2 className="h-12 w-12 text-muted-foreground/40" strokeWidth={1} />
        <p className="font-medium text-muted-foreground">No encontramos salones con esos filtros.</p>
        <p className="text-sm text-muted-foreground">Probá ajustar la búsqueda.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {salones.map((salon) => (
        <CardSalon key={salon.id} salon={salon} />
      ))}
    </div>
  )
}
