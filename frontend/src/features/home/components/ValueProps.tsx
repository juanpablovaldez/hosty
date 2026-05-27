import { CheckCircle2, CircleDollarSign, Timer } from 'lucide-react'

/* ─── Grain texture — fractalNoise SVG via data URI ──────────
   Aplicado a 3% opacity da tacto de papel, rompe la planeza
   del fondo arena sin agregar peso visual.
─────────────────────────────────────────────────────────── */
const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E")`

const PROPS = [
  {
    icon: CheckCircle2,
    num: '01',
    stat: '+120',
    title: 'Salones verificados',
    description:
      'Cada espacio pasa por un proceso de verificación antes de publicarse. Reservás con garantía real.',
  },
  {
    icon: CircleDollarSign,
    num: '02',
    stat: '100%',
    title: 'Precios claros',
    description:
      'Ves el precio total antes de confirmar. Sin costos ocultos ni sorpresas al momento de reservar.',
  },
  {
    icon: Timer,
    num: '03',
    stat: '<24h',
    title: 'Confirmación rápida',
    description:
      'Encontrá, elegí y confirmá tu espacio. Sin llamadas, sin idas y vueltas. Todo online.',
  },
] as const

export function ValueProps() {
  return (
    <section className="relative overflow-hidden">

      {/* Fondo: surface-warm semántico (arena en light, dark muted en dark) */}
      <div className="absolute inset-0" style={{ background: 'var(--surface-warm)' }} />

      {/* Grain — papel, autenticidad */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none select-none"
        style={{ backgroundImage: GRAIN, backgroundSize: '200px 200px', opacity: 0.032 }}
      />

      {/* Línea coral superior — acento visual */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-primary" style={{ opacity: 0.55 }} />

      <div className="relative z-10 mx-auto max-w-7xl px-5 lg:px-8 py-[84px]">

        {/* Label de sección — estilo editorial con líneas flanqueantes */}
        <div className="flex items-center gap-4 mb-14">
          <div className="h-px bg-border w-8 shrink-0" />
          <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-muted-foreground whitespace-nowrap">
            Por qué Hosty
          </span>
          <div className="h-px bg-border flex-1" />
        </div>

        {/* Grid — gap-px sobre bg-border crea divisores perfectamente delgados */}
        <div
          className="grid md:grid-cols-3 gap-px"
          style={{ background: 'hsl(var(--border))' }}
        >
          {PROPS.map(({ icon: Icon, num, stat, title, description }) => (
            <div
              key={title}
              className="relative overflow-hidden px-8 py-10 group"
              style={{ background: 'var(--surface-warm)' }}
            >
              {/* Watermark — número grande de fondo casi invisible */}
              <span
                aria-hidden
                className="absolute -top-4 -right-1 font-extrabold leading-none select-none pointer-events-none text-foreground"
                style={{ fontSize: '118px', opacity: 0.04, letterSpacing: '-0.05em' }}
              >
                {num}
              </span>

              {/* Barra coral inferior — se despliega en hover desde la izquierda */}
              <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-primary scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-[350ms]" />

              <div className="relative z-10">

                {/* Stat — elemento hero de la celda */}
                <p
                  className="font-extrabold text-foreground leading-none mb-5"
                  style={{ fontSize: 'clamp(40px, 4vw, 54px)', letterSpacing: '-0.048em' }}
                >
                  {stat}
                </p>

                {/* Icon + título */}
                <div className="flex items-center gap-2 mb-2.5">
                  <Icon className="h-4 w-4 text-primary shrink-0" strokeWidth={1.5} />
                  <strong className="text-[15px] font-bold text-foreground">{title}</strong>
                </div>

                <p className="text-[13px] text-muted-foreground leading-[1.74]">{description}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
