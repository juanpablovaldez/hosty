import { Search, CalendarCheck, PartyPopper } from 'lucide-react'

const PASOS = [
  {
    icon: Search,
    numero: '01',
    titulo: 'Buscá tu salón',
    descripcion:
      'Filtrá por zona, capacidad y tipo de evento. Encontrá el espacio ideal entre más de 120 salones verificados en Tucumán.',
  },
  {
    icon: CalendarCheck,
    numero: '02',
    titulo: 'Reservá en minutos',
    descripcion:
      'Enviá tu solicitud con los detalles del evento. El dueño del salón te confirma en menos de 24 horas, sin burocracia.',
  },
  {
    icon: PartyPopper,
    numero: '03',
    titulo: 'Celebrá sin preocupaciones',
    descripcion:
      'Todo coordinado de antemano. Precios transparentes, sin costos ocultos. Solo llegás y disfrutás.',
  },
]

export function ComoFunciona() {
  return (
    <section id="como-funciona" className="bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="mb-14 max-w-xl">
          <p className="mb-3 text-[13px] font-bold uppercase tracking-[0.12em] text-primary">
            Cómo funciona
          </p>
          <h2 className="text-[32px] font-extrabold leading-tight tracking-tight text-foreground lg:text-[42px]">
            De la búsqueda<br />
            a la celebración<span className="text-primary">.</span>
          </h2>
          <p className="mt-4 text-[16px] text-muted-foreground leading-relaxed">
            Tres pasos simples para reservar el lugar perfecto para tu próximo evento.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {PASOS.map((paso, idx) => {
            const Icon = paso.icon
            return (
              <div
                key={paso.numero}
                className="relative rounded-[24px] border border-border bg-card p-8"
              >
                <span
                  className="absolute right-6 top-5 font-extrabold text-[52px] leading-none text-foreground/[0.04] select-none"
                  aria-hidden
                >
                  {paso.numero}
                </span>

                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                  <Icon className="h-6 w-6 text-primary" strokeWidth={1.5} />
                </div>

                {idx < PASOS.length - 1 && (
                  <div className="absolute right-[-13px] top-1/2 hidden -translate-y-1/2 md:block">
                    <div className="h-px w-6 bg-border" />
                  </div>
                )}

                <h3 className="mb-2 text-[18px] font-bold text-foreground">{paso.titulo}</h3>
                <p className="text-[14.5px] text-muted-foreground leading-relaxed">{paso.descripcion}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
