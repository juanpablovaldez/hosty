import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Heart, Search } from 'lucide-react'
import { useAuthStore } from '@/features/auth/store/auth.store'
import { useUserFavorites } from '../api/favorites.queries'
import { CardSalon } from '@/features/salones/components/CardSalon'

export function MisFavoritosPage() {
  const { user } = useAuthStore()
  const { data: salones = [], isLoading } = useUserFavorites(user?.id ?? null)

  return (
    <div className="mx-auto max-w-5xl px-5 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-[28px] font-extrabold text-foreground tracking-tight">
          Mis Favoritos<span className="text-primary">.</span>
        </h1>
        <p className="mt-1 text-[14px] text-muted-foreground">
          Los salones que guardaste para ver después.
        </p>
      </div>

      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-[340px] rounded-[14px]" />
          ))}
        </div>
      ) : salones.length === 0 ? (
        <div className="flex flex-col items-center gap-5 py-16 text-center">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center"
            style={{ background: 'var(--surface-warm)' }}
          >
            <Heart className="w-9 h-9 text-primary" strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-[18px] font-bold text-foreground mb-1">
              Todavía no guardaste ningún salón
            </p>
            <p className="text-[14px] text-muted-foreground max-w-[340px] leading-relaxed">
              Tocá el corazón en cualquier salón para guardarlo acá y encontrarlo fácil cuando lo necesites.
            </p>
          </div>
          <Button asChild size="lg" className="gap-2 rounded-xl font-semibold mt-2">
            <Link to="/salones">
              <Search className="h-4 w-4" strokeWidth={1.5} />
              Explorar salones
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {salones.map((salon) => (
            <CardSalon key={salon.id} salon={salon} />
          ))}
        </div>
      )}
    </div>
  )
}
