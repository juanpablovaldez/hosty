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
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="mb-10 text-center text-2xl font-bold text-foreground md:text-3xl">
          Tu evento, sin complicaciones
        </h2>
        <div className="grid gap-8 sm:grid-cols-3">
          {PROPS.map(({ icon: Icon, title, description }) => (
            <div key={title} className="flex flex-col items-center gap-4 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                <Icon className="h-7 w-7 text-primary" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-semibold text-foreground">{title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
