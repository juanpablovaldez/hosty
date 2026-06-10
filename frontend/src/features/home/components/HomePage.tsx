import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { SearchBar } from './SearchBar'
import { FeaturedSalones } from './FeaturedSalones'
import { ValueProps } from './ValueProps'
import { HostCTA } from './HostCTA'
import { CheckCircle2, Zap, MapPin, Users, Star } from 'lucide-react'
import { HostyIso, HostyBadge } from '@/components/ui/hosty-badge'

const CHIPS = ['Todos', 'Cumpleaños', 'Casamientos', 'Graduaciones', 'Corporativo', 'Infantiles']

/* ─── Tarjeta decorativa del hero ───────────────────────────
   Muestra un preview estilizado de una venue card con el
   isotipo de fondo y badges del sistema.
─────────────────────────────────────────────────────────── */
function HeroCard() {
  return (
    <div className="hidden lg:block relative w-[240px] h-[290px] shrink-0 pb-1">
      {/* Carta de fondo — amber, rotada */}
      <div
        className="absolute top-4 right-0 w-[210px] rounded-[18px] overflow-hidden border border-amber/40"
        style={{
          transform: 'rotate(5deg)',
          background: 'var(--color-amber-light)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div
          className="h-[108px] flex items-center justify-center"
          style={{ background: 'linear-gradient(140deg, var(--color-amber-light), var(--color-amber))' }}
        >
          <HostyIso size={42} color="rgba(28,43,58,0.18)" />
        </div>
        <div className="px-4 py-3">
          <div className="h-2.5 rounded-full bg-ink/10 w-3/4 mb-2" />
          <div className="h-2 rounded-full bg-ink/7 w-1/2" />
        </div>
      </div>

      {/* Carta delantera — adaptable a dark mode */}
      <div
        className="absolute bottom-0 left-0 w-[210px] rounded-[18px] overflow-hidden bg-card border border-border"
        style={{ transform: 'rotate(-1.5deg)', boxShadow: 'var(--shadow-lg)' }}
      >
        {/* Imagen — gradiente coral */}
        <div
          className="h-[118px] relative flex items-end"
          style={{
            background: 'linear-gradient(135deg, var(--color-coral-light) 0%, var(--color-coral) 60%, var(--color-coral-dark) 100%)',
          }}
        >
          {/* Isotipo de fondo — watermark */}
          <div className="absolute right-3 bottom-2 opacity-[0.15]">
            <HostyIso size={56} color="white" />
          </div>
          {/* Badge */}
          <div className="absolute top-3 left-3">
            <HostyBadge variant="verificado" size="sm" />
          </div>
        </div>

        {/* Contenido */}
        <div className="px-4 pt-3 pb-4">
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <p className="text-[13px] font-bold text-foreground leading-tight">Palacio San Roque</p>
            <div className="flex items-center gap-0.5 shrink-0">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" strokeWidth={1.5} />
              <span className="text-[12px] font-bold text-foreground">4.9</span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-muted-foreground mb-3">
            <MapPin className="w-3 h-3 shrink-0" strokeWidth={1.5} />
            <span>Yerba Buena, Tucumán</span>
          </div>
          <div className="flex items-center justify-between pt-2.5 border-t border-border">
            <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <Users className="w-3 h-3 shrink-0" strokeWidth={1.5} />
              <span>hasta 200 personas</span>
            </div>
            <p className="text-[13px] font-extrabold text-foreground">$8.000/h</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export function HomePage() {
  const [chipActivo, setChipActivo] = useState('Todos')
  const navigate = useNavigate()

  function handleChip(chip: string) {
    setChipActivo(chip)
    navigate({
      to: '/salones',
      search: chip === 'Todos' ? {} : { tipoEvento: chip },
    })
  }

  return (
    <>
      {/* ══════════════════════════════════════════════
          HERO — bg-background (hueso)
      ══════════════════════════════════════════════ */}
      <section
        className="bg-background relative overflow-hidden"
        style={{
          backgroundImage:
            'radial-gradient(ellipse 70% 55% at 95% 0%, rgba(232,69,42,0.07) 0%, transparent 55%)',
        }}
      >
        <div className="mx-auto max-w-7xl px-5 lg:px-8 pt-16 pb-0 lg:pt-24">

          {/* Headline + decoración derecha */}
          <div className="grid lg:grid-cols-[1fr_auto] lg:items-end gap-8 lg:gap-12 pb-10 lg:pb-14">
            <div>
              <h1
                className="font-extrabold text-foreground leading-[1.0] tracking-tight"
                style={{ fontSize: 'clamp(44px, 5.8vw, 86px)' }}
              >
                El salón perfecto<br />
                para tu próximo<br />
                <span className="text-primary">evento.</span>
              </h1>
              <p className="mt-5 text-[16px] lg:text-[17px] text-muted-foreground leading-relaxed max-w-[480px]">
                Reservá espacios de eventos en Tucumán.
                Más de 120 salones verificados, confirmación en menos de 24 horas.
              </p>
            </div>

            {/* Tarjeta decorativa — solo desktop */}
            <HeroCard />
          </div>

          <div className="h-px bg-border" />

          {/* SearchBar + chips — grupo visual unificado */}
          <div className="pt-8 max-w-3xl">
            <SearchBar />

            {/* Chips — pegados al search bar */}
            <div className="flex flex-wrap gap-[7px] mt-3 pb-5">
              {CHIPS.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => handleChip(chip)}
                  aria-pressed={chipActivo === chip}
                  className={[
                    'inline-flex items-center px-[18px] py-2 rounded-full text-[13px] font-semibold border-[1.5px] transition-all duration-[180ms] cursor-pointer',
                    chipActivo === chip
                      ? 'bg-primary text-primary-foreground border-primary shadow-[0_2px_10px_rgba(232,69,42,0.24)]'
                      : 'bg-transparent text-muted-foreground border-border hover:border-primary hover:text-primary hover:bg-primary/5',
                  ].join(' ')}
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap items-center gap-4 lg:gap-6 pb-14 text-[13px] text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary shrink-0" strokeWidth={1.5} />
              <span>
                <strong className="text-foreground font-semibold">+120</strong> salones verificados
              </span>
            </div>
            <div className="h-3 w-px bg-border hidden sm:block" />
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary shrink-0" strokeWidth={1.5} />
              <span>
                Confirmación en <strong className="text-foreground font-semibold">menos de 24h</strong>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SECCIONES
      ══════════════════════════════════════════════ */}
      <ValueProps />
      <FeaturedSalones />
      <HostCTA />
    </>
  )
}
