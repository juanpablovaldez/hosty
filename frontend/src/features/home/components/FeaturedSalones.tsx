import { Link } from '@tanstack/react-router'
import { useFeaturedSalones } from '@/features/salones/api/salones.queries'
import { CardSalon } from '@/features/salones/components/CardSalon'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

/* El mismo grain que ValueProps — en dark mode sobre bg-background (ink) se
   siente rico y editorial, no flat. Opacidad más baja (1.8%) para no competir. */
const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E")`

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
  const { data: salones, isLoading, isError, refetch } = useFeaturedSalones()

  return (
    <section className="bg-background py-16 relative overflow-hidden">

      {/* Grain — sutil textura que rompe la planeza, especialmente en dark mode */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none select-none"
        style={{ backgroundImage: GRAIN, backgroundSize: '200px 200px', opacity: 0.018 }}
      />

      {/* Glow coral en esquina inferior-izquierda — espeja el del hero (top-right)
          crea profundidad y continuidad visual entre secciones */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(ellipse 55% 45% at 5% 100%, rgba(232,69,42,0.055) 0%, transparent 60%)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="mb-1 text-xs font-bold uppercase tracking-[0.15em] text-primary">
              Disponibles ahora
            </p>
            <h2 className="text-2xl font-bold text-foreground md:text-3xl">Salones destacados</h2>
            <p className="mt-1.5 text-muted-foreground">Verificados y listos para tu próximo evento</p>
          </div>
          <Button asChild variant="ghost" className="hidden gap-1 sm:flex text-primary hover:text-primary">
            <Link to="/salones">
              Ver todos
              <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
            </Link>
          </Button>
        </div>

        {isError && (
          <div className="flex flex-col items-center gap-3 py-12 text-center">
            <p className="text-muted-foreground">No pudimos cargar los salones.</p>
            <Button variant="outline" size="sm" onClick={() => void refetch()}>
              Reintentar
            </Button>
          </div>
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
