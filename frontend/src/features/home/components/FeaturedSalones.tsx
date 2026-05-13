import { Link } from '@tanstack/react-router'
import { useFeaturedSalones } from '@/features/salones/api/salones.queries'
import { CardSalon } from '@/features/salones/components/CardSalon'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

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

export function FeaturedSalones() {
  const { data: salones, isLoading, isError } = useFeaturedSalones()

  return (
    <section className="bg-muted/30 py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground md:text-3xl">Salones destacados</h2>
            <p className="mt-1 text-muted-foreground">Verificados y listos para tu próximo evento</p>
          </div>
          <Button asChild variant="ghost" className="hidden gap-1 sm:flex">
            <Link to="/salones">
              Ver todos
              <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
            </Link>
          </Button>
        </div>

        {isError && (
          <p className="py-12 text-center text-muted-foreground">
            No pudimos cargar los salones. Intentá de nuevo más tarde.
          </p>
        )}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)
            : salones?.length
              ? salones.map((salon) => <CardSalon key={salon.id} salon={salon} />)
              : !isError && (
                  <p className="col-span-full py-12 text-center text-muted-foreground">
                    Aún no hay salones disponibles. ¡Volvé pronto!
                  </p>
                )}
        </div>

        <div className="mt-8 flex justify-center sm:hidden">
          <Button asChild variant="outline" className="gap-2">
            <Link to="/salones">
              Ver todos los salones
              <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
