import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { ArrowRight, Building2 } from 'lucide-react'

export function HostCTA() {
  return (
    <section className="bg-primary py-16">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-6 text-center md:flex-row md:justify-between md:text-left">
        <div className="flex items-start gap-4">
          <div className="hidden rounded-2xl bg-primary-foreground/15 p-3 md:flex">
            <Building2 className="h-8 w-8 text-primary-foreground" strokeWidth={1.5} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-primary-foreground md:text-3xl">
              ¿Tenés un salón?
            </h2>
            <p className="mt-2 text-primary-foreground/80">
              Publicalo gratis y llegá a cientos de organizadores en Tucumán.
            </p>
          </div>
        </div>
        <Button
          asChild
          size="lg"
          className="shrink-0 gap-2 bg-primary-foreground text-primary hover:bg-primary-foreground/90"
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
