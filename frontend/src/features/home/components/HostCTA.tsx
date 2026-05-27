import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { HostyIso } from '@/components/ui/hosty-badge'
import { ArrowRight } from 'lucide-react'

export function HostCTA() {
  return (
    <section className="relative overflow-hidden bg-amber">
      {/* Textura diagonal — stripes sutiles en tinta */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'repeating-linear-gradient(-52deg, rgba(28,43,58,0.034) 0, rgba(28,43,58,0.034) 1px, transparent 1px, transparent 14px)',
        }}
      />

      {/* Logo Hosty grande — se asoma por la derecha como watermark de marca */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 top-1/2 -translate-y-1/2 select-none"
        style={{ opacity: 0.07 }}
      >
        <HostyIso size={320} color="#1C2B3A" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-5 lg:px-8 py-[84px]">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-10 md:gap-16">

          {/* Izquierda — headline + bajada */}
          <div>
            <h2
              className="font-extrabold text-ink leading-none tracking-tight mb-4"
              style={{ fontSize: 'clamp(42px, 4vw, 64px)', letterSpacing: '-0.052em' }}
            >
              ¿Tenés<br />
              un{' '}
              <em
                className="not-italic"
                style={{
                  fontFamily: 'var(--font-serif-accent)',
                  fontStyle: 'italic',
                  letterSpacing: '-0.02em',
                }}
              >
                salón?
              </em>
            </h2>

            <p className="text-[15.5px] text-ink/60 leading-[1.72] max-w-[420px]">
              Publicá tu espacio en Hosty y empezá a recibir reservas desde el primer día.
              Sin comisiones ni trámites.
            </p>
          </div>

          {/* Derecha — botones */}
          <div className="flex flex-col items-start md:items-end gap-2.5 shrink-0">
            <Button
              asChild
              variant="dark"
              size="lg"
              className="gap-2 font-bold"
              style={{ boxShadow: 'var(--shadow-sm)' }}
            >
              <Link to="/">
                Publicar mi salón
                <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
              </Link>
            </Button>

            <a
              href="/#como-funciona"
              className="text-[14px] font-semibold text-ink/56 hover:text-ink border border-ink/18 hover:border-ink/40 rounded-md px-6 py-2.5 transition-colors duration-[180ms]"
            >
              Saber más →
            </a>

            <p className="text-[11.5px] text-ink/40 mt-0.5">Sin tarjeta de crédito requerida</p>
          </div>
        </div>
      </div>
    </section>
  )
}
