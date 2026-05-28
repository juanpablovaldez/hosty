import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Home, Search } from 'lucide-react'

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-5 py-20 text-center">
      <p
        className="font-extrabold text-primary leading-none mb-6 select-none"
        style={{ fontSize: 'clamp(96px, 18vw, 180px)', letterSpacing: '-0.04em', opacity: 0.15 }}
        aria-hidden
      >
        404
      </p>

      <div className="-mt-8 mb-8">
        <h1 className="text-[28px] sm:text-[36px] font-extrabold text-foreground tracking-tight mb-3">
          Página no encontrada
        </h1>
        <p className="text-[15px] text-muted-foreground max-w-[380px] leading-relaxed">
          El link que seguiste no existe o fue movido. Podés volver al inicio o buscar salones.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button asChild size="lg" className="gap-2 font-semibold rounded-xl">
          <Link to="/">
            <Home className="h-4 w-4" strokeWidth={1.5} />
            Ir al inicio
          </Link>
        </Button>
        <Button asChild size="lg" variant="outline" className="gap-2 font-semibold rounded-xl">
          <Link to="/salones">
            <Search className="h-4 w-4" strokeWidth={1.5} />
            Buscar salones
          </Link>
        </Button>
      </div>
    </div>
  )
}
