import { useSearch } from '@tanstack/react-router'
import { SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { useSearchSalones } from '../api/salones.queries'
import { SalonFilters } from './SalonFilters'
import { SalonGrid } from './SalonGrid'
import type { SalonSearchParams } from '../types'

export function SalonesPage() {
  const search = useSearch({ from: '/salones/' })

  const params: SalonSearchParams = {
    location: search.location,
    date: search.date,
    capacity: search.capacity,
    minPrice: search.minPrice,
    maxPrice: search.maxPrice,
    eventTypes: search.eventTypes,
    amenities: search.amenities,
    availability: search.availability,
  }

  const { data: salones, isLoading, isError } = useSearchSalones(params)

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {search.location ? `Salones en ${search.location}` : 'Todos los salones'}
          </h1>
          {!isLoading && !isError && (
            <p className="mt-1 text-sm text-muted-foreground">
              {salones?.length ?? 0} resultado{salones?.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        {/* Mobile filter trigger */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="gap-2 md:hidden">
              <SlidersHorizontal className="h-4 w-4" strokeWidth={1.5} />
              Filtros
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 overflow-y-auto">
            <SheetHeader className="mb-4">
              <SheetTitle>Filtros</SheetTitle>
            </SheetHeader>
            <SalonFilters />
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex gap-8">
        {/* Desktop sidebar */}
        <div className="hidden w-64 shrink-0 md:block">
          <div className="sticky top-20 rounded-xl border bg-card p-5">
            <SalonFilters />
          </div>
        </div>

        <Separator orientation="vertical" className="hidden md:block" />

        {/* Grid */}
        <div className="flex-1 min-w-0">
          <SalonGrid salones={salones} isLoading={isLoading} isError={isError} />
        </div>
      </div>
    </div>
  )
}
