import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Heart, Search } from 'lucide-react'

export function MisFavoritosPage() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-10">
      <div className="mb-8">
        <h1 className="text-[28px] font-extrabold text-foreground tracking-tight">Mis Favoritos</h1>
        <p className="mt-1 text-[14px] text-muted-foreground">
          Los salones que guardaste para ver después.
        </p>
      </div>

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
    </div>
  )
}
