import { Search, CalendarCheck, PartyPopper } from 'lucide-react'

const STEPS = [
  {
    icon: Search,
    num: '01',
    title: 'Buscá tu espacio',
    description:
      'Filtrá por tipo de evento, capacidad y zona. Encontrás todos los salones disponibles en Tucumán en un solo lugar.',
  },
  {
    icon: CalendarCheck,
    num: '02',
    title: 'Elegí y reservá',
    description:
      'Revisá fotos, precios y disponibilidad. Cuando te decidís, reservás online en minutos sin llamadas ni idas y vueltas.',
  },
  {
    icon: PartyPopper,
    num: '03',
    title: 'Disfrutá el evento',
    description:
      'Recibís la confirmación en menos de 24 horas. El día del evento solo te preocupás por festejar.',
  },
] as const

export function ComoFunciona() {
  return (
    <section id="como-funciona" className="bg-background py-[84px]">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">

        <div className="flex items-center gap-4 mb-14">
          <div className="h-px bg-border w-8 shrink-0" />
          <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-muted-foreground whitespace-nowrap">
            Cómo funciona
          </span>
          <div className="h-px bg-border flex-1" />
        </div>

        <div className="grid md:grid-cols-3 gap-10 lg:gap-16">
          {STEPS.map(({ icon: Icon, num, title, description }) => (
            <div key={title} className="relative">
              <span
                aria-hidden
                className="absolute -top-3 -left-1 font-extrabold leading-none select-none pointer-events-none text-foreground"
                style={{ fontSize: '100px', opacity: 0.04, letterSpacing: '-0.05em' }}
              >
                {num}
              </span>

              <div className="relative z-10">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                  <Icon className="w-5 h-5 text-primary" strokeWidth={1.5} />
                </div>
                <h3 className="text-[17px] font-bold text-foreground mb-2">{title}</h3>
                <p className="text-[13px] text-muted-foreground leading-[1.74]">{description}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
