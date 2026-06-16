import { useState } from 'react'
import { ChevronLeft, ChevronRight, Ban } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/shared/lib/utils'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import type { Salon } from '@/features/salones/types'
import type { Booking } from '../types'
import { useSalonBlocks } from '../api/host.queries'
import { useAddAvailabilityBlock, useRemoveAvailabilityBlock } from '../api/host.mutations'

const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]
const DOW = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

export function CalendarioView({
  bookings,
  salones,
  onOpen,
}: {
  bookings: Booking[]
  salones: Salon[]
  onOpen: (booking: Booking) => void
}) {
  const now = new Date()
  const [cursor, setCursor] = useState(() => ({ year: now.getFullYear(), month: now.getMonth() }))
  const [salonFilter, setSalonFilter] = useState<string>('all')

  const salonIds = salones.map((s) => s.id)
  const { data: blocks = [] } = useSalonBlocks(salonIds)
  const addBlock = useAddAvailabilityBlock()
  const removeBlock = useRemoveAvailabilityBlock()

  const canEdit = salonFilter !== 'all'
  const salonNameById = new Map(salones.map((s) => [s.id, s.name]))
  const monthPrefix = `${cursor.year}-${String(cursor.month + 1).padStart(2, '0')}`
  const dateStr = (day: number) => `${monthPrefix}-${String(day).padStart(2, '0')}`

  const eventsByDay = new Map<number, Booking[]>()
  for (const b of bookings) {
    if (
      (b.status === 'confirmed' || b.status === 'pending') &&
      b.eventDate.startsWith(monthPrefix) &&
      (salonFilter === 'all' || b.salonId === salonFilter)
    ) {
      const day = Number(b.eventDate.slice(8, 10))
      const list = eventsByDay.get(day) ?? []
      list.push(b)
      eventsByDay.set(day, list)
    }
  }

  const blockByDay = new Map<number, { id: string }>()
  for (const blk of blocks) {
    if (blk.date.startsWith(monthPrefix) && (salonFilter === 'all' || blk.salonId === salonFilter)) {
      blockByDay.set(Number(blk.date.slice(8, 10)), { id: blk.id })
    }
  }

  const firstDow = (new Date(cursor.year, cursor.month, 1).getDay() + 6) % 7
  const daysInMonth = new Date(cursor.year, cursor.month + 1, 0).getDate()
  const todayDay =
    now.getFullYear() === cursor.year && now.getMonth() === cursor.month ? now.getDate() : null

  function shift(delta: number) {
    setCursor((c) => {
      const m = c.month + delta
      if (m < 0) return { year: c.year - 1, month: 11 }
      if (m > 11) return { year: c.year + 1, month: 0 }
      return { year: c.year, month: m }
    })
  }

  function toggleDay(day: number) {
    if (!canEdit) {
      toast.info('Elegí un salón para gestionar su disponibilidad.')
      return
    }
    const existing = blocks.find((b) => b.salonId === salonFilter && b.date === dateStr(day))
    if (existing) {
      removeBlock.mutate({ id: existing.id })
    } else {
      addBlock.mutate({ salonId: salonFilter, date: dateStr(day) })
    }
  }

  const cells: (number | null)[] = [
    ...Array.from({ length: firstDow }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  return (
    <div className="rounded-[18px] border border-border bg-card p-5 sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1">
          <button
            type="button" onClick={() => shift(-1)} aria-label="Mes anterior"
            className="grid h-9 w-9 place-items-center rounded-lg text-foreground transition hover:bg-muted"
          >
            <ChevronLeft className="h-[18px] w-[18px]" strokeWidth={1.5} />
          </button>
          <h3 className="min-w-[150px] text-center text-[17px] font-bold text-foreground">
            {MESES[cursor.month]} <span className="font-normal text-muted-foreground">{cursor.year}</span>
          </h3>
          <button
            type="button" onClick={() => shift(1)} aria-label="Mes siguiente"
            className="grid h-9 w-9 place-items-center rounded-lg text-foreground transition hover:bg-muted"
          >
            <ChevronRight className="h-[18px] w-[18px]" strokeWidth={1.5} />
          </button>
        </div>
        <Select value={salonFilter} onValueChange={setSalonFilter}>
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
      </div>

      <p className="mb-4 text-[13px] text-muted-foreground">
        {canEdit
          ? 'Tocá un día para marcarlo (o desmarcarlo) como no disponible.'
          : 'Elegí un salón para marcar fechas no disponibles.'}
      </p>

      <div className="grid grid-cols-7 gap-1.5">
        {DOW.map((d) => (
          <div key={d} className="py-1.5 text-center text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
            {d}
          </div>
        ))}
        {cells.map((day, i) => {
          if (day === null) return <div key={`empty-${i}`} className="min-h-[86px] rounded-lg" />
          const events = eventsByDay.get(day) ?? []
          const blocked = blockByDay.get(day)
          const isToday = day === todayDay
          return (
            <div
              key={day}
              onClick={canEdit ? () => toggleDay(day) : undefined}
              className={cn(
                'flex min-h-[86px] flex-col gap-1 rounded-lg border border-border p-1.5',
                blocked ? 'bg-muted/70' : 'bg-card',
                canEdit && 'cursor-pointer hover:border-primary',
              )}
            >
              <div className="flex items-center justify-between">
                <span
                  className={cn(
                    'text-[12.5px] font-bold',
                    isToday
                      ? 'grid h-[22px] w-[22px] place-items-center rounded-full bg-primary text-primary-foreground'
                      : 'text-foreground',
                  )}
                >
                  {day}
                </span>
                {blocked && <Ban className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={1.5} />}
              </div>

              {blocked && <span className="text-[10px] font-semibold text-muted-foreground">No disponible</span>}

              {events.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={(e) => { e.stopPropagation(); onOpen(b) }}
                  title={`${b.eventType} · ${salonNameById.get(b.salonId) ?? ''}`}
                  className={cn(
                    'truncate rounded-md px-1.5 py-1 text-left text-[10.5px] font-semibold transition hover:opacity-80',
                    b.status === 'confirmed'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
                  )}
                >
                  {b.startTime.slice(0, 5)} {b.eventType}
                </button>
              ))}
            </div>
          )
        })}
      </div>

      <div className="mt-4 flex flex-wrap gap-5 text-[12.5px] text-muted-foreground">
        <span className="inline-flex items-center gap-2"><i className="h-2.5 w-2.5 rounded-sm bg-green-400" /> Confirmado</span>
        <span className="inline-flex items-center gap-2"><i className="h-2.5 w-2.5 rounded-sm bg-amber-400" /> Pendiente</span>
        <span className="inline-flex items-center gap-2"><i className="h-2.5 w-2.5 rounded-sm bg-primary" /> Hoy</span>
        <span className="inline-flex items-center gap-2"><Ban className="h-3 w-3" strokeWidth={1.5} /> No disponible</span>
      </div>
    </div>
  )
}
