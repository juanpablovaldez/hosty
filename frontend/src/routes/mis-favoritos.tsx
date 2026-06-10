/* eslint-disable react-refresh/only-export-components */
import { createFileRoute, Link } from '@tanstack/react-router'
import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { requireAuth } from '@/features/auth/lib/auth'

export const Route = createFileRoute('/mis-favoritos')({
  beforeLoad: ({ location }) => requireAuth(location),
  component: MisFavoritosPage,
})

// Simulamos lista vacía hasta que se conecte con el backend
const favoriteSalones: unknown[] = []

function MisFavoritosPage() {
  const isEmpty = favoriteSalones.length === 0

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
      <h1 className="mb-8 text-2xl font-bold tracking-tight">Mis favoritos</h1>

      {isEmpty && <FavoritosEmptyState />}
    </div>
  )
}

function FavoritosEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 rounded-2xl border border-dashed border-border bg-muted/40 px-8 py-20 text-center">
      {/* Ícono */}
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
        <Heart className="h-8 w-8 text-primary" strokeWidth={1.5} />
      </div>

      {/* Texto */}
      <div className="flex flex-col gap-2">
        <p className="text-lg font-semibold text-foreground">
          Todavía no guardaste ningún salón
        </p>
        <p className="max-w-sm text-sm text-muted-foreground">
          Explorá nuestra oferta y guardá los salones que más te gusten para
          encontrarlos fácilmente después.
        </p>
      </div>

      {/* CTA */}
      <Button asChild size="lg" className="font-semibold" style={{ boxShadow: '0 2px 10px rgba(232,69,42,.28)' }}>
        <Link to="/salones">Explorar salones</Link>
      </Button>
    </div>
  )
}
