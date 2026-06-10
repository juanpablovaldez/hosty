import { useState } from 'react'
import { Filter } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { cn } from '@/shared/lib/utils'
import type { Salon } from '@/features/salones/types'
import type { Booking } from '../types'
import { BookingCard } from './BookingCard'
import { STATUS_LABELS } from '../lib/booking-status'

type Filtro = 'all' | Booking['status']

const FILTERS: { id: Filtro; label: string }[] = [
  { id: 'all', label: 'Todas' },
  { id: 'pending', label: STATUS_LABELS.pending },
  { id: 'confirmed', label: STATUS_LABELS.confirmed },
  { id: 'declined', label: STATUS_LABELS.declined },
  { id: 'cancelled', label: STATUS_LABELS.cancelled },
]

export function ReservasView({
  salones,
  bookings,
  onOpen,
}: {
  salones: Salon[]
  bookings: Booking[]
  onOpen: (booking: Booking) => void
}) {
  const [filtro, setFiltro] = useState<Filtro>('all')
  const [salonId, setSalonId] = useState<string>('all')
  const [query, setQuery] = useState('')

  const salonNameById = new Map(salones.map((s) => [s.id, s.name]))
  const counts: Record<Filtro, number> = {
    all: bookings.length,
    pending: 0,
    confirmed: 0,
    declined: 0,
    cancelled: 0,
  }
  for (const b of bookings) counts[b.status]++

  const q = query.trim().toLowerCase()
  const list = bookings
    .filter((b) => (filtro === 'all' ? true : b.status === filtro))
    .filter((b) => (salonId === 'all' ? true : b.salonId === salonId))
    .filter((b) => (q ? (b.contactName ?? '').toLowerCase().includes(q) : true))
    .sort((a, b) => a.eventDate.localeCompare(b.eventDate))

  const today = new Date().toLocaleDateString('en-CA')
  const upcoming = list.filter((b) => b.eventDate >= today)
  const past = list.filter((b) => b.eventDate < today).reverse()

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFiltro(f.id)}
              className={cn(
                'rounded-full border px-3.5 py-1.5 text-[13px] font-semibold transition-colors',
                filtro === f.id
                  ? 'border-foreground bg-foreground text-background'
                  : 'border-border bg-card text-muted-foreground hover:text-foreground',
              )}
            >
              {f.label}
              <span className="ml-1.5 opacity-65 font-bold">{counts[f.id]}</span>
            </button>
          ))}
        </div>

        <div className="flex flex-1 flex-wrap justify-end gap-2.5">
          <Select value={salonId} onValueChange={setSalonId}>
            <SelectTrigger className="w-auto min-w-[180px]">
              <SelectValue placeholder="Todos los salones" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los salones</SelectItem>
              {salones.map((s) => (
                <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            type="search"
            placeholder="Buscar por cliente…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full sm:w-56"
          />
        </div>
      </div>

      {list.length > 0 ? (
        <div className="space-y-8">
          {upcoming.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-[13px] font-bold uppercase tracking-wide text-muted-foreground">Próximas</h3>
              {upcoming.map((b) => (
                <BookingCard key={b.id} booking={b} salonName={salonNameById.get(b.salonId) ?? ''} onOpen={onOpen} />
              ))}
            </div>
          )}
          {past.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-[13px] font-bold uppercase tracking-wide text-muted-foreground">Pasadas</h3>
              <div className="space-y-4 opacity-70">
                {past.map((b) => (
                  <BookingCard key={b.id} booking={b} salonName={salonNameById.get(b.salonId) ?? ''} onOpen={onOpen} />
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-[18px] border border-border bg-card flex flex-col items-center gap-2 py-16 text-center">
          <div className="w-[72px] h-[72px] rounded-full bg-muted flex items-center justify-center text-muted-foreground mb-2">
            <Filter className="w-7 h-7" strokeWidth={1.5} />
          </div>
          <h3 className="text-[17px] font-bold text-foreground">No encontramos reservas</h3>
          <p className="text-sm text-muted-foreground max-w-sm">Probá ajustando los filtros o la búsqueda.</p>
        </div>
      )}
    </div>
  )
}
