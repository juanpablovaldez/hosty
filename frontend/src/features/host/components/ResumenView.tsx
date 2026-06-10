import type { ReactNode } from 'react'
import { Clock, CheckCircle, DollarSign, TrendingUp, ChevronRight } from 'lucide-react'
import type { Salon } from '@/features/salones/types'
import type { Booking } from '../types'
import { BookingCard } from './BookingCard'
import { SalonRow } from './SalonRow'
import { formatARS, effectivePrice } from '../lib/booking-status'

function StatCard({
  icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: ReactNode
  label: string
  value: string
  sub: ReactNode
  accent?: string
}) {
  return (
    <div className="relative rounded-[18px] border border-border bg-card p-5 shadow-[0_1px_3px_rgba(28,43,58,0.06)]">
      <span className="absolute top-5 right-5 text-muted-foreground/55">{icon}</span>
      <p className="text-[12.5px] font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
        {label}
      </p>
      <p className={`mt-2.5 text-[30px] font-extrabold leading-none tracking-tight ${accent ?? 'text-foreground'}`}>
        {value}
      </p>
      <p className="mt-2.5 text-[12.5px] text-muted-foreground">{sub}</p>
    </div>
  )
}

function isThisMonth(eventDate: string, monthPrefix: string): boolean {
  return eventDate.startsWith(monthPrefix)
}

export function ResumenView({
  salones,
  bookings,
  onGoToReservas,
  onGoToSalones,
  onOpen,
}: {
  salones: Salon[]
  bookings: Booking[]
  onGoToReservas: () => void
  onGoToSalones: () => void
  onOpen: (booking: Booking) => void
}) {
  const now = new Date()
  const today = now.toLocaleDateString('en-CA')
  const monthPrefix = today.slice(0, 7)
  const in30Date = new Date(now)
  in30Date.setDate(in30Date.getDate() + 30)
  const in30 = in30Date.toLocaleDateString('en-CA')

  const salonNameById = new Map(salones.map((s) => [s.id, s.name]))
  const pending = bookings.filter((b) => b.status === 'pending')
  const confirmedThisMonth = bookings.filter((b) => b.status === 'confirmed' && isThisMonth(b.eventDate, monthPrefix))
  const ingresos = confirmedThisMonth.reduce((acc, b) => acc + (effectivePrice(b) ?? 0), 0)
  const proximos = bookings.filter((b) => b.status === 'confirmed' && b.eventDate >= today && b.eventDate <= in30).length

  return (
    <div className="space-y-11">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Clock className="w-[18px] h-[18px]" strokeWidth={1.5} />}
          label="Pendientes"
          value={String(pending.length)}
          accent="text-amber-600 dark:text-amber-400"
          sub={
            <span className="rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 px-2.5 py-1 text-[11px] font-semibold">
              Requieren acción
            </span>
          }
        />
        <StatCard
          icon={<CheckCircle className="w-[18px] h-[18px]" strokeWidth={1.5} />}
          label="Confirmadas"
          value={String(confirmedThisMonth.length)}
          sub="este mes"
        />
        <StatCard
          icon={<DollarSign className="w-[18px] h-[18px]" strokeWidth={1.5} />}
          label="Ingresos"
          value={formatARS(ingresos)}
          sub="este mes · confirmadas"
        />
        <StatCard
          icon={<TrendingUp className="w-[18px] h-[18px]" strokeWidth={1.5} />}
          label="Próximos eventos"
          value={String(proximos)}
          sub="en los próximos 30 días"
        />
      </div>

      <section>
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="text-[19px] font-bold tracking-tight text-foreground flex items-center gap-2.5">
            Solicitudes pendientes
            {pending.length > 0 && (
              <span className="rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 px-2.5 py-1 text-[11px] font-semibold">
                {pending.length}
              </span>
            )}
          </h2>
          <button
            type="button"
            onClick={onGoToReservas}
            className="inline-flex items-center gap-1 text-[13.5px] font-semibold text-primary hover:text-primary/80 transition"
          >
            Ver todas
            <ChevronRight className="w-3.5 h-3.5" strokeWidth={1.5} />
          </button>
        </div>

        {pending.length > 0 ? (
          <div className="space-y-4">
            {pending.map((b) => (
              <BookingCard key={b.id} booking={b} salonName={salonNameById.get(b.salonId) ?? ''} onOpen={onOpen} />
            ))}
          </div>
        ) : (
          <div className="rounded-[18px] border border-border bg-card flex flex-col items-center gap-2 py-16 text-center">
            <div className="w-[72px] h-[72px] rounded-full bg-muted flex items-center justify-center text-muted-foreground mb-2">
              <CheckCircle className="w-8 h-8" strokeWidth={1.5} />
            </div>
            <h3 className="text-[17px] font-bold text-foreground">Estás al día</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              No tenés solicitudes pendientes de respuesta. Te avisamos cuando llegue una nueva.
            </p>
          </div>
        )}
      </section>

      <section>
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="text-[19px] font-bold tracking-tight text-foreground">Mis salones</h2>
          <button
            type="button"
            onClick={onGoToSalones}
            className="inline-flex items-center gap-1 text-[13.5px] font-semibold text-primary hover:text-primary/80 transition"
          >
            Gestionar
            <ChevronRight className="w-3.5 h-3.5" strokeWidth={1.5} />
          </button>
        </div>
        <div className="space-y-4">
          {salones.map((salon) => (
            <SalonRow
              key={salon.id}
              salon={salon}
              bookings={bookings.filter((b) => b.salonId === salon.id)}
              onOpen={onOpen}
            />
          ))}
        </div>
      </section>
    </div>
  )
}
