import { useState, useEffect, useMemo } from 'react'
import { useParams, Link } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import {
  CalendarIcon, ChevronLeft, ChevronRight, Check, Users, FileText,
  LogIn, AlertCircle, Clock, MapPin, Star, Minus, Plus, Sparkles,
} from 'lucide-react'
import { useSalon } from '@/features/salones/api/salones.queries'
import { useCreateBooking } from '../api/bookings.mutations'
import { useSalonBookings } from '../api/bookings.queries'
import { supabase } from '@/shared/lib/supabase'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Calendar } from '@/components/ui/calendar'
import { cn } from '@/shared/lib/utils'

/* ─── Constants ───────────────────────────────────────────── */

const EVENT_TYPES = [
  { label: 'Cumpleaños', emoji: '🎂' },
  { label: 'Casamiento', emoji: '💒' },
  { label: 'Corporativo', emoji: '💼' },
  { label: 'Baby shower', emoji: '👶' },
  { label: 'Quince años', emoji: '👑' },
  { label: 'Graduación', emoji: '🎓' },
] as const

const TIME_SLOTS = Array.from({ length: 32 }, (_, i) => {
  const mins = 8 * 60 + i * 30
  const h = Math.floor(mins / 60).toString().padStart(2, '0')
  const m = (mins % 60 === 0 ? '00' : '30')
  return `${h}:${m}`
})

const STEPS = [
  { label: 'Fecha y hora', icon: CalendarIcon },
  { label: 'Tu evento', icon: Users },
  { label: 'Confirmar', icon: FileText },
] as const

/* ─── Schemas ─────────────────────────────────────────────── */

const step1Schema = z.object({
  eventDate: z.date({ required_error: 'Seleccioná una fecha' }),
  startTime: z.string().min(1, 'Seleccioná hora de inicio'),
  endTime: z.string().min(1, 'Seleccioná hora de fin'),
}).refine((d) => d.startTime < d.endTime, {
  message: 'La hora de fin debe ser posterior a la de inicio',
  path: ['endTime'],
})

const step2Schema = z.object({
  eventType: z.string().min(1, 'Seleccioná el tipo de evento'),
  attendees: z.coerce.number().min(1, 'Al menos 1 asistente'),
  notes: z.string(),
})

/* ─── Helpers ─────────────────────────────────────────────── */

function calcHours(start: string, end: string) {
  if (!start || !end) return 0
  const [sh, sm] = start.split(':').map(Number)
  const [eh, em] = end.split(':').map(Number)
  return Math.max(0, (eh * 60 + em - (sh * 60 + sm)) / 60)
}

function timeToMinutes(t: string) {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}

function formatCurrency(n: number) {
  return n.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 })
}

/* ─── Sub-components ──────────────────────────────────────── */

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="mb-8 flex items-center gap-0">
      {STEPS.map(({ label, icon: Icon }, i) => (
        <div key={i} className="flex flex-1 items-center">
          <div className="flex flex-col items-center gap-1.5">
            <div
              className={cn(
                'relative z-10 flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-all duration-500',
                i < current
                  ? 'bg-primary text-primary-foreground shadow-md shadow-primary/30'
                  : i === current
                    ? 'border-2 border-primary bg-background text-primary shadow-sm ring-4 ring-primary/10'
                    : 'border-2 border-muted bg-background text-muted-foreground',
              )}
            >
              {i < current ? <Check className="h-4 w-4" strokeWidth={2.5} /> : <Icon className="h-4 w-4" strokeWidth={1.5} />}
            </div>
            <span className={cn('text-xs font-medium transition-colors', i === current ? 'text-foreground' : 'text-muted-foreground')}>
              {label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div className="relative mx-1 mb-5 h-0.5 flex-1">
              <div className="absolute inset-0 rounded-full bg-muted" />
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-primary transition-all duration-500 ease-out"
                style={{ width: i < current ? '100%' : '0%' }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function SalonSidebar({
  salon,
  eventDate,
  startTime,
  endTime,
}: {
  salon: { name: string; images: string[]; location: string; pricePerHour: number; capacity: number; rating: { value: number; count: number } | null }
  eventDate: Date | undefined
  startTime: string
  endTime: string
}) {
  const hours = calcHours(startTime, endTime)
  const total = salon.pricePerHour * hours
  const coverImage = salon.images[0]

  return (
    <aside className="hidden lg:block">
      <div className="sticky top-24 space-y-5">
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
          {coverImage && (
            <div className="aspect-[16/9] overflow-hidden">
              <img src={coverImage} alt={salon.name} className="h-full w-full object-cover" />
            </div>
          )}
          <div className="p-5">
            <h3 className="text-lg font-bold text-foreground">{salon.name}</h3>
            <div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" strokeWidth={1.5} />
                {salon.location}
              </span>
              {salon.rating && (
                <span className="flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" strokeWidth={1.5} />
                  <span className="font-semibold text-foreground">{salon.rating.value.toFixed(1)}</span>
                </span>
              )}
            </div>

            <Separator className="my-4" />

            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tu reserva</p>
            <div className="space-y-2.5 text-sm">
              <div className="flex items-center gap-2.5">
                <CalendarIcon className="h-4 w-4 text-primary" strokeWidth={1.5} />
                {eventDate ? (
                  <span className="font-medium text-foreground">{format(eventDate, "d 'de' MMMM, yyyy", { locale: es })}</span>
                ) : (
                  <span className="text-muted-foreground">Seleccioná fecha</span>
                )}
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="h-4 w-4 text-primary" strokeWidth={1.5} />
                {startTime && endTime ? (
                  <span className="font-medium text-foreground">{startTime} – {endTime} ({hours}h)</span>
                ) : (
                  <span className="text-muted-foreground">Seleccioná horario</span>
                )}
              </div>
            </div>

            <Separator className="my-4" />

            <div className="space-y-1.5">
              {hours > 0 && (
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{formatCurrency(salon.pricePerHour)}/h × {hours}h</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold">
                <span className="text-foreground">Total</span>
                <span className={cn('transition-all duration-300', total > 0 ? 'text-primary' : 'text-muted-foreground')}>
                  {total > 0 ? formatCurrency(total) : '—'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          Sin cargo hasta confirmar la reserva
        </p>
      </div>
    </aside>
  )
}

function TimeSlotGrid({
  label,
  value,
  onChange,
  occupiedSlots,
  disabledBefore,
}: {
  label: string
  value: string
  onChange: (t: string) => void
  occupiedSlots: Set<string>
  disabledBefore?: string
}) {
  const disabledBeforeMin = disabledBefore ? timeToMinutes(disabledBefore) : -1

  return (
    <div className="flex flex-col gap-2">
      <Label className="flex items-center gap-1.5 text-sm font-semibold">
        <Clock className="h-4 w-4 text-primary" strokeWidth={1.5} />
        {label}
      </Label>
      <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-6">
        {TIME_SLOTS.map((slot) => {
          const isOccupied = occupiedSlots.has(slot)
          const isTooEarly = timeToMinutes(slot) <= disabledBeforeMin
          const isDisabled = isOccupied || isTooEarly
          const isSelected = value === slot

          return (
            <button
              key={slot}
              type="button"
              disabled={isDisabled}
              onClick={() => onChange(slot)}
              className={cn(
                'rounded-lg px-2 py-2 text-[13px] font-medium transition-all duration-150',
                isSelected
                  ? 'bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/30 ring-2 ring-primary ring-offset-2 scale-105 z-10'
                  : isOccupied
                    ? 'bg-destructive/10 text-destructive/50 line-through cursor-not-allowed'
                    : isDisabled
                      ? 'bg-muted/50 text-muted-foreground/40 cursor-not-allowed'
                      : 'border border-border bg-card text-foreground hover:border-primary hover:bg-primary/5 hover:text-primary',
              )}
            >
              {slot}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function GuestStepper({
  value,
  onChange,
  max,
  min = 1,
}: {
  value: number
  onChange: (n: number) => void
  max: number
  min?: number
}) {
  const pct = Math.min(100, (value / max) * 100)
  const barColor = pct > 80 ? 'bg-destructive' : pct > 50 ? 'bg-accent' : 'bg-primary'

  const [inputValue, setInputValue] = useState(value.toString())

  useEffect(() => {
    setInputValue(value.toString())
  }, [value])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    if (val !== '' && !/^\d+$/.test(val)) return

    setInputValue(val)

    if (val === '') return

    const parsed = parseInt(val, 10)
    if (!isNaN(parsed)) {
      onChange(parsed)
    }
  }

  const handleBlur = () => {
    const parsed = parseInt(inputValue, 10)
    if (isNaN(parsed) || parsed < min) {
      onChange(min)
      setInputValue(min.toString())
    } else {
      onChange(parsed)
      setInputValue(parsed.toString())
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <Label className="flex items-center gap-1.5 text-sm font-semibold">
          <Users className="h-4 w-4 text-primary" strokeWidth={1.5} />
          Cantidad de invitados
        </Label>
        <span className="text-xs font-medium text-muted-foreground">Máx: {max}</span>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-card text-foreground transition-all hover:border-primary hover:bg-primary/5 hover:text-primary disabled:opacity-40 disabled:hover:border-border disabled:hover:bg-card disabled:hover:text-foreground"
        >
          <Minus className="h-4 w-4" strokeWidth={1.5} />
        </button>
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleBlur}
          className="flex h-10 flex-1 min-w-[60px] text-center rounded-xl border border-border bg-card text-lg font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary hover:border-primary transition-all tabular-nums"
        />
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-card text-foreground transition-all hover:border-primary hover:bg-primary/5 hover:text-primary disabled:opacity-40 disabled:hover:border-border disabled:hover:bg-card disabled:hover:text-foreground"
        >
          <Plus className="h-4 w-4" strokeWidth={1.5} />
        </button>
      </div>
      <div className="space-y-1">
        <div className="h-2 overflow-hidden rounded-full bg-muted">
          <div
            className={cn('h-full rounded-full transition-all duration-500 ease-out', barColor)}
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="flex justify-between text-xs">
          <span className={cn('font-medium', pct > 80 ? 'text-destructive' : 'text-muted-foreground')}>
            {value} / {max} personas ({Math.round(pct)}%)
          </span>
          {pct > 80 && <span className="font-medium text-destructive">Casi lleno</span>}
        </div>
      </div>
    </div>
  )
}

function SuccessScreen({ salonName, salonId }: { salonName: string; salonId: string }) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-6">
      <div className="flex max-w-md flex-col items-center gap-6 text-center animate-in fade-in zoom-in-95 duration-500">
        <div className="relative">
          <div className="absolute inset-0 animate-ping rounded-full bg-emerald-400/20" />
          <div className="absolute -inset-3 animate-pulse rounded-full bg-emerald-400/10" />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-xl shadow-emerald-500/30">
            <Check className="h-10 w-10 text-white" strokeWidth={2.5} />
          </div>
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">¡Reserva confirmada!</h2>
          <p className="text-muted-foreground">
            Tu solicitud para reservar <span className="font-semibold text-foreground">{salonName}</span> fue enviada con éxito.
            Te notificaremos cuando sea aprobada.
          </p>
        </div>
        <div className="flex w-full flex-col gap-3 pt-2">
          <Button asChild size="lg" className="w-full gap-2 shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98]">
            <Link to="/salones/$id" params={{ id: salonId }}>Volver al salón</Link>
          </Button>
          <Button asChild variant="ghost" className="w-full">
            <Link to="/salones">Explorar más salones</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

/* ─── Main component ──────────────────────────────────────── */

export function BookingFlow() {
  const { id } = useParams({ from: '/salones/$id_/reservar' })
  const { data: salon, isLoading } = useSalon(id)
  const createBooking = useCreateBooking()
  const { data: existingBookings } = useSalonBookings(id)

  const [step, setStep] = useState(0)
  const [userId, setUserId] = useState<string | null>(null)
  const [authChecked, setAuthChecked] = useState(false)
  const [overlapError, setOverlapError] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)

  const [step1Snapshot, setStep1Snapshot] = useState<{ eventDate: Date | undefined; startTime: string; endTime: string }>({
    eventDate: undefined,
    startTime: '',
    endTime: '',
  })
  const [step2Snapshot, setStep2Snapshot] = useState({ eventType: '', attendees: 1, notes: '' })

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? 'mock-user-1234')
      setAuthChecked(true)
    })
  }, [])

  const hours = calcHours(step1Snapshot.startTime, step1Snapshot.endTime)
  const totalPrice = salon ? salon.pricePerHour * hours : 0

  const occupiedSlotsForDate = useMemo(() => {
    const set = new Set<string>()
    if (!existingBookings || !selectedDate) return set

    const dateStr = format(selectedDate, 'yyyy-MM-dd')
    existingBookings
      .filter((b) => b.event_date === dateStr)
      .forEach((b) => {
        const start = timeToMinutes(b.start_time)
        const end = timeToMinutes(b.end_time)
        TIME_SLOTS.forEach((slot) => {
          const slotMin = timeToMinutes(slot)
          if (slotMin >= start && slotMin < end) set.add(slot)
        })
      })
    return set
  }, [existingBookings, selectedDate])

  const bookedDates = useMemo(() => {
    if (!existingBookings) return [] as Date[]
    const dateSet = new Set<string>()
    existingBookings.forEach((b) => dateSet.add(b.event_date))
    return Array.from(dateSet).map((d) => new Date(d + 'T12:00:00'))
  }, [existingBookings])

  const checkAvailability = (date: Date, start: string, end: string) => {
    if (!existingBookings || !date || !start || !end) return null

    const formattedDate = format(date, 'yyyy-MM-dd')
    const newStart = timeToMinutes(start)
    const newEnd = timeToMinutes(end)

    if (newEnd <= newStart) return 'El horario de fin debe ser posterior al de inicio'

    const hasOverlap = existingBookings.some((booking) => {
      if (booking.event_date !== formattedDate) return false
      const existingStart = timeToMinutes(booking.start_time)
      const existingEnd = timeToMinutes(booking.end_time)
      return (newStart < existingEnd + 60) && (newEnd > existingStart - 60)
    })

    if (hasOverlap) return 'El salón ya tiene un compromiso en esa franja horaria (considerando tiempos de limpieza).'
    return null
  }

  const form1 = useForm({
    defaultValues: step1Snapshot,
    validators: { onSubmit: step1Schema },
    onSubmit: ({ value }) => {
      if (!value.eventDate) return
      const error = checkAvailability(value.eventDate, value.startTime, value.endTime)
      if (error) { setOverlapError(error); return }
      setOverlapError(null)
      setStep1Snapshot(value)
      setStep(1)
    },
  })

  const form2 = useForm({
    defaultValues: step2Snapshot,
    validators: { onSubmit: step2Schema },
    onSubmit: ({ value }) => {
      if (salon && value.attendees > salon.capacity) return
      setStep2Snapshot(value)
      setStep(2)
    },
  })

  async function confirmBooking() {
    if (!userId || !salon || !step1Snapshot.eventDate) return
    try {
      if (userId === 'mock-user-1234') {
        await new Promise((r) => setTimeout(r, 1000))
        setStep(3)
        return
      }
      await createBooking.mutateAsync({
        salonId: salon.id,
        userId,
        eventDate: format(step1Snapshot.eventDate, 'yyyy-MM-dd'),
        startTime: step1Snapshot.startTime,
        endTime: step1Snapshot.endTime,
        attendees: step2Snapshot.attendees,
        eventType: step2Snapshot.eventType,
        notes: step2Snapshot.notes,
        totalPrice,
      })
      setStep(3)
    } catch {
      alert('No pudimos procesar tu reserva. Intentá de nuevo.')
    }
  }

  /* ── Loading ── */
  if (isLoading || !authChecked) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-12">
        <Skeleton className="mb-6 h-8 w-64" />
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="space-y-4">
            <Skeleton className="h-12 w-full rounded-2xl" />
            <Skeleton className="h-80 w-full rounded-2xl" />
          </div>
          <Skeleton className="hidden h-96 rounded-2xl lg:block" />
        </div>
      </div>
    )
  }

  /* ── Auth guard ── */
  if (!userId) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-6 px-6 py-20 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <LogIn className="h-8 w-8 text-primary" strokeWidth={1.5} />
        </div>
        <h2 className="text-xl font-bold text-foreground">Iniciá sesión para reservar</h2>
        <Button asChild size="lg" className="w-full gap-2 transition-transform hover:scale-105 active:scale-95">
          <Link to="/"><LogIn className="h-4 w-4" strokeWidth={1.5} />Iniciar sesión</Link>
        </Button>
        <Button asChild variant="ghost">
          <Link to="/salones/$id" params={{ id }}>Volver al salón</Link>
        </Button>
      </div>
    )
  }

  /* ── Success ── */
  if (step === 3) {
    return <SuccessScreen salonName={salon?.name ?? ''} salonId={id} />
  }

  /* ── Main flow ── */
  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      {/* Back link */}
      <Link
        to="/salones/$id"
        params={{ id }}
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
      >
        <ChevronLeft className="h-4 w-4" strokeWidth={1.5} />
        Volver a {salon?.name}
      </Link>

      <h1 className="mb-2 text-2xl font-bold text-foreground md:text-3xl">
        Reservar salón<span className="text-primary">.</span>
      </h1>
      <p className="mb-8 text-sm text-muted-foreground">Completá los datos para solicitar tu reserva</p>

      {/* Stepper */}
      <StepIndicator current={step} />

      {/* Two-column layout */}
      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        {/* Form area */}
        <div>
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            {/* ────────── STEP 0: Date & Time ────────── */}
            {step === 0 && (
              <form
                onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); void form1.handleSubmit() }}
                className="flex flex-col gap-6 p-6 animate-in fade-in slide-in-from-right-4 duration-300"
              >
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5 text-primary" strokeWidth={1.5} />
                  <h2 className="text-lg font-bold text-foreground">Fecha y hora</h2>
                </div>

                {/* Inline Calendar */}
                <form1.Field name="eventDate">
                  {(field) => (
                    <div className="flex flex-col gap-2">
                      <Label className="text-sm font-semibold">Fecha del evento</Label>
                      <div className="flex justify-center rounded-xl border border-border bg-background p-3">
                        <Calendar
                          mode="single"
                          selected={field.state.value}
                          onSelect={(date) => { field.handleChange(date as Date); setSelectedDate(date as Date); setOverlapError(null) }}
                          disabled={(date) => {
                            const today = new Date()
                            today.setHours(0, 0, 0, 0)
                            return date < today
                          }}
                          modifiers={{
                            booked: bookedDates,
                          }}
                          modifiersClassNames={{
                            booked: 'relative after:absolute after:bottom-0.5 after:left-1/2 after:-translate-x-1/2 after:h-1 after:w-1 after:rounded-full after:bg-destructive',
                          }}
                          className="w-full [--cell-size:2.5rem]"
                        />
                      </div>
                      {bookedDates.length > 0 && (
                        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <span className="inline-block h-1.5 w-1.5 rounded-full bg-destructive" />
                          Los puntos rojos indican fechas con reservas existentes
                        </p>
                      )}
                      {field.state.meta.errors[0] && (
                        <p className="text-xs text-destructive">{String(field.state.meta.errors[0])}</p>
                      )}
                    </div>
                  )}
                </form1.Field>

                <Separator />

                {/* Time Slot Grids */}
                <form1.Field name="startTime">
                  {(field) => (
                    <div>
                      <TimeSlotGrid
                        label="Hora de inicio"
                        value={field.state.value}
                        onChange={(val) => { field.handleChange(val); setOverlapError(null) }}
                        occupiedSlots={occupiedSlotsForDate}
                      />
                      {field.state.meta.errors[0] && (
                        <p className="mt-1 text-xs text-destructive">{String(field.state.meta.errors[0])}</p>
                      )}
                    </div>
                  )}
                </form1.Field>

                <form1.Field name="endTime">
                  {(field) => (
                    <div>
                      <TimeSlotGrid
                        label="Hora de fin"
                        value={field.state.value}
                        onChange={(val) => { field.handleChange(val); setOverlapError(null) }}
                        occupiedSlots={occupiedSlotsForDate}
                        disabledBefore={form1.state.values.startTime}
                      />
                      {field.state.meta.errors[0] && (
                        <p className="mt-1 text-xs text-destructive">{String(field.state.meta.errors[0])}</p>
                      )}
                    </div>
                  )}
                </form1.Field>

                {/* Overlap error */}
                {overlapError && (
                  <div className="flex items-start gap-2 rounded-xl bg-destructive/10 p-4 text-sm text-destructive animate-in fade-in zoom-in-95 duration-200">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.5} />
                    <p>{overlapError}</p>
                  </div>
                )}

                {/* Duration preview */}
                {form1.state.values.startTime && form1.state.values.endTime && !overlapError && (
                  <div className="flex items-center gap-2 rounded-xl bg-primary/5 border border-primary/10 p-4 text-sm text-primary animate-in fade-in zoom-in-95 duration-200">
                    <Clock className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                    <p className="font-medium">
                      {form1.state.values.startTime} – {form1.state.values.endTime}
                      {' · '}
                      {calcHours(form1.state.values.startTime, form1.state.values.endTime)}h
                      {salon && ` · ${formatCurrency(salon.pricePerHour * calcHours(form1.state.values.startTime, form1.state.values.endTime))}`}
                    </p>
                  </div>
                )}

                <div className="flex justify-end pt-2">
                  <Button
                    type="submit"
                    className="gap-2 shadow-sm transition-transform hover:scale-[1.02] active:scale-[0.98]"
                    disabled={!!overlapError}
                  >
                    Siguiente
                    <ChevronRight className="h-4 w-4" strokeWidth={1.5} />
                  </Button>
                </div>
              </form>
            )}

            {/* ────────── STEP 1: Event Details ────────── */}
            {step === 1 && (
              <form
                onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); void form2.handleSubmit() }}
                className="flex flex-col gap-6 p-6 animate-in fade-in slide-in-from-right-4 duration-300"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" strokeWidth={1.5} />
                  <h2 className="text-lg font-bold text-foreground">Datos del evento</h2>
                </div>

                {/* Event Type Chips */}
                <form2.Field name="eventType">
                  {(field) => (
                    <div className="flex flex-col gap-3">
                      <Label className="text-sm font-semibold">Tipo de evento</Label>
                      <div className="flex flex-wrap gap-2">
                        {EVENT_TYPES.map(({ label, emoji }) => {
                          const isSelected = field.state.value === label
                          return (
                            <button
                              key={label}
                              type="button"
                              onClick={() => field.handleChange(label)}
                              className={cn(
                                'inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-all duration-200 border-2',
                                isSelected
                                  ? 'border-primary bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-105'
                                  : 'border-border bg-card hover:border-primary/50 hover:bg-primary/5',
                              )}
                            >
                              <span className="text-base">{emoji}</span>
                              {label}
                            </button>
                          )
                        })}
                      </div>
                      {field.state.meta.errors[0] && (
                        <p className="text-xs text-destructive">{String(field.state.meta.errors[0])}</p>
                      )}
                    </div>
                  )}
                </form2.Field>

                <Separator />

                {/* Guest Stepper */}
                <form2.Field name="attendees">
                  {(field) => (
                    <div className="flex flex-col gap-1.5">
                      <GuestStepper
                        value={field.state.value}
                        onChange={field.handleChange}
                        max={salon?.capacity ?? 500}
                      />
                      {salon && field.state.value > salon.capacity && (
                        <p className="text-xs text-destructive animate-in fade-in slide-in-from-top-1">
                          La cantidad excede la capacidad máxima del salón ({salon.capacity}).
                        </p>
                      )}
                      {field.state.meta.errors[0] && (
                        <p className="text-xs text-destructive">{String(field.state.meta.errors[0])}</p>
                      )}
                    </div>
                  )}
                </form2.Field>

                <Separator />

                {/* Notes */}
                <form2.Field name="notes">
                  {(field) => (
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="notes" className="text-sm font-semibold">Notas adicionales (opcional)</Label>
                        <span className="text-xs text-muted-foreground">{field.state.value.length}/500</span>
                      </div>
                      <textarea
                        id="notes"
                        rows={3}
                        maxLength={500}
                        placeholder="Decoración, requerimientos especiales, alergias..."
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        className="flex w-full rounded-xl border border-input bg-background px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 hover:border-primary transition-colors resize-none"
                      />
                    </div>
                  )}
                </form2.Field>

                <div className="flex justify-between pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(0)}
                    className="gap-2 transition-transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <ChevronLeft className="h-4 w-4" strokeWidth={1.5} />
                    Atrás
                  </Button>
                  <Button
                    type="submit"
                    className="gap-2 shadow-sm transition-transform hover:scale-[1.02] active:scale-[0.98]"
                    disabled={!!(salon && form2.state.values.attendees > salon.capacity)}
                  >
                    Siguiente
                    <ChevronRight className="h-4 w-4" strokeWidth={1.5} />
                  </Button>
                </div>
              </form>
            )}

            {/* ────────── STEP 2: Confirmation ────────── */}
            {step === 2 && (
              <div className="flex flex-col gap-6 p-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" strokeWidth={1.5} />
                  <h2 className="text-lg font-bold text-foreground">Confirmar reserva</h2>
                </div>

                <div className="overflow-hidden rounded-xl border border-border">
                  {/* Salon header */}
                  <div className="bg-gradient-to-r from-primary/5 to-accent/5 p-5">
                    <p className="text-lg font-bold text-foreground">{salon?.name}</p>
                    <p className="text-sm text-muted-foreground">{salon?.location}</p>
                  </div>

                  {/* Details grid */}
                  <div className="divide-y divide-border">
                    {([
                      ['📅', 'Fecha', step1Snapshot.eventDate ? format(step1Snapshot.eventDate, "EEEE d 'de' MMMM, yyyy", { locale: es }) : ''],
                      ['🕐', 'Horario', `${step1Snapshot.startTime} – ${step1Snapshot.endTime} (${hours}h)`],
                      ['🎉', 'Tipo de evento', step2Snapshot.eventType],
                      ['👥', 'Asistentes', `${step2Snapshot.attendees} personas`],
                      ...(step2Snapshot.notes ? [['📝', 'Notas', step2Snapshot.notes]] : []),
                    ] as [string, string, string][]).map(([icon, label, value]) => (
                      <div key={label} className="flex items-start gap-3 px-5 py-3.5">
                        <span className="text-base">{icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-muted-foreground">{label}</p>
                          <p className="text-sm font-medium text-foreground break-words">{value}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Price */}
                  <div className="bg-gradient-to-r from-primary/5 to-primary/10 p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">{formatCurrency(salon?.pricePerHour ?? 0)}/h × {hours}h</p>
                        <p className="text-sm font-bold text-foreground">Total estimado</p>
                      </div>
                      <p className="text-2xl font-bold text-primary">{formatCurrency(totalPrice)}</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="gap-2 transition-transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <ChevronLeft className="h-4 w-4" strokeWidth={1.5} />
                    Atrás
                  </Button>
                  <Button
                    onClick={confirmBooking}
                    disabled={createBooking.isPending || hours <= 0}
                    className="gap-2 shadow-lg shadow-primary/20 transition-transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {createBooking.isPending ? 'Procesando...' : 'Confirmar reserva'}
                    {!createBooking.isPending && <Check className="h-4 w-4" strokeWidth={2} />}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile price bar */}
          {step < 3 && (
            <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 backdrop-blur-md p-4 lg:hidden">
              <div className="mx-auto flex max-w-6xl items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Total estimado</p>
                  <p className="text-lg font-bold text-primary">
                    {totalPrice > 0 ? formatCurrency(totalPrice) : '—'}
                  </p>
                </div>
                {hours > 0 && (
                  <p className="text-xs text-muted-foreground">
                    {formatCurrency(salon?.pricePerHour ?? 0)}/h × {hours}h
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        {salon && (
          <SalonSidebar
            salon={salon}
            eventDate={step >= 1 ? step1Snapshot.eventDate : form1.state.values.eventDate}
            startTime={step >= 1 ? step1Snapshot.startTime : form1.state.values.startTime}
            endTime={step >= 1 ? step1Snapshot.endTime : form1.state.values.endTime}
          />
        )}
      </div>
    </div>
  )
}
