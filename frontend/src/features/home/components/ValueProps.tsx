import { ShieldCheck, BadgeDollarSign, Clock } from 'lucide-react'

const PROPS = [
  {
    icon: ShieldCheck,
    title: 'Salones verificados',
    description: 'Cada espacio pasa por un proceso de verificación. Reservás con garantía.',
  },
  {
    icon: BadgeDollarSign,
    title: 'Precios claros',
    description: 'Sin sorpresas. Ves el precio total antes de confirmar tu reserva.',
  },
  {
    icon: Clock,
    title: 'Reserva en minutos',
    description: 'Encontrá, elegí y confirmá. Sin llamadas, sin ida y vuelta.',
  },
] as const

export function ValueProps() {
  return (
    <section className="py-20 bg-background">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 text-center">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.15em] text-primary">
            Por qué Hosty
          </p>
          <h2 className="text-2xl font-bold text-foreground md:text-3xl">
            Tu evento, sin complicaciones
          </h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-3">
          {PROPS.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="group flex flex-col gap-5 rounded-2xl border border-border bg-card p-7 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/15">
                <Icon className="h-6 w-6 text-primary" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="mb-1.5 text-[17px] font-semibold text-foreground">{title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
