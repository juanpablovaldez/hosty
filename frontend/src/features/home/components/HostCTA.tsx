import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { ArrowRight, Building2 } from 'lucide-react'

export function HostCTA() {
  return (
    <section
      className="py-20"
      style={{ background: 'linear-gradient(135deg, var(--color-coral) 0%, var(--color-ink) 100%)' }}
    >
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-8 px-6 text-center md:flex-row md:justify-between md:text-left">
        <div className="flex items-start gap-5">
          <div className="hidden rounded-2xl bg-white/10 p-3.5 md:flex">
            <Building2 className="h-8 w-8 text-white" strokeWidth={1.5} />
          </div>
          <div>
            <p className="mb-1 text-xs font-bold uppercase tracking-[0.15em] text-white/60">
              Para anfitriones
            </p>
            <h2 className="text-2xl font-bold text-white md:text-3xl">
              ¿Tenés un salón?
            </h2>
            <p className="mt-2 text-white/75 max-w-md">
              Publicalo gratis y llegá a cientos de organizadores en Tucumán.
            </p>
          </div>
        </div>
        <Button
          asChild
          size="lg"
          className="shrink-0 gap-2 bg-white text-coral hover:bg-white/90 font-bold shadow-lg"
        >
          <Link to="/">
            Publicar mi salón
            <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
          </Link>
        </Button>
      </div>
    </section>
  )
}
