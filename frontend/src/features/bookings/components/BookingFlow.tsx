import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { CalendarIcon, ChevronLeft, ChevronRight, Check, Users, FileText, LogIn, AlertCircle, Clock } from 'lucide-react'
import { useSalon } from '@/features/salones/api/salones.queries'
import { useCreateBooking } from '../api/bookings.mutations'
import { useSalonBookings } from '../api/bookings.queries'
import { supabase } from '@/shared/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/shared/lib/utils'

const EVENT_TYPES = ['Cumpleaños', 'Casamiento', 'Corporativo', 'Baby shower', 'Quince años', 'Graduación']

// Generate time slots (e.g., 08:00, 08:30, ...)
const TIME_SLOTS = Array.from({ length: 48 }).map((_, i) => {
  const h = Math.floor(i / 2).toString().padStart(2, '0')
  const m = i % 2 === 0 ? '00' : '30'
  return `${h}:${m}`
})

const step1Schema = z.object({
  eventDate: z.date({
    required_error: 'Seleccioná una fecha',
  }),
  startTime: z.string().min(1, 'Seleccioná hora de inicio'),
  endTime: z.string().min(1, 'Seleccioná hora de fin'),
}).refine((data) => {
  return data.startTime < data.endTime
}, { message: "La hora de fin debe ser posterior a la de inicio", path: ['endTime'] })

const step2Schema = z.object({
  eventType: z.string().min(1, 'Seleccioná el tipo de evento'),
  attendees: z.coerce.number().min(1, 'Al menos 1 asistente'),
  notes: z.string(),
})

const STEPS = [
  { label: 'Fecha y hora', icon: CalendarIcon },
  { label: 'Tu evento', icon: Users },
  { label: 'Confirmar', icon: FileText },
] as const

function calcHours(start: string, end: string) {
  if (!start || !end) return 0
  const [sh, sm] = start.split(':').map(Number)
  const [eh, em] = end.split(':').map(Number)
  return Math.max(0, (eh * 60 + em - (sh * 60 + sm)) / 60)
}

function timeToMinutes(timeStr: string) {
  const [h, m] = timeStr.split(':').map(Number)
  return h * 60 + m
}

export function BookingFlow() {
  const { id } = useParams({ from: '/salones/$id_/reservar' })
  const navigate = useNavigate()
  const { data: salon, isLoading } = useSalon(id)
  const createBooking = useCreateBooking()
  const { data: existingBookings } = useSalonBookings(id)

  const [step, setStep] = useState(0)
  const [userId, setUserId] = useState<string | null>(null)
  const [authChecked, setAuthChecked] = useState(false)
  const [overlapError, setOverlapError] = useState<string | null>(null)

  const [step1Snapshot, setStep1Snapshot] = useState<{eventDate: Date | undefined, startTime: string, endTime: string}>({ 
    eventDate: undefined, 
    startTime: '', 
    endTime: '' 
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

  const checkAvailability = (date: Date, start: string, end: string) => {
    if (!existingBookings || !date || !start || !end) return null
    
    const formattedDate = format(date, 'yyyy-MM-dd')
    const newStart = timeToMinutes(start)
    const newEnd = timeToMinutes(end)
    
    if (newEnd <= newStart) {
      return "El horario de fin debe ser posterior al de inicio"
    }
    
    const hasOverlap = existingBookings.some(booking => {
      if (booking.event_date !== formattedDate) return false
      
      const existingStart = timeToMinutes(booking.start_time)
      const existingEnd = timeToMinutes(booking.end_time)
      
      return (newStart < existingEnd + 60) && (newEnd > existingStart - 60)
    })
    
    if (hasOverlap) {
      return "El salón ya tiene un compromiso en esa franja horaria (considerando tiempos de limpieza)."
    }
    return null
  }

  const form1 = useForm({
    defaultValues: step1Snapshot,
    validators: { onSubmit: step1Schema },
    onSubmit: ({ value }) => {
      if (!value.eventDate) return
      
      const error = checkAvailability(value.eventDate, value.startTime, value.endTime)
      if (error) {
        setOverlapError(error)
        return
      }
      
      setOverlapError(null)
      setStep1Snapshot(value)
      setStep(1)
    },
  })

  useEffect(() => {
    setOverlapError(null)
  }, [form1.state.values.eventDate, form1.state.values.startTime, form1.state.values.endTime])

  const form2 = useForm({
    defaultValues: step2Snapshot,
    validators: { onSubmit: step2Schema },
    onSubmit: ({ value }) => {
      if (salon && value.attendees > salon.capacity) {
        return 
      }
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

  if (isLoading || !authChecked) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-12">
        <Skeleton className="mb-6 h-8 w-48" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    )
  }

  if (!userId) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-6 px-6 py-20 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <LogIn className="h-8 w-8 text-primary" strokeWidth={1.5} />
        </div>
        <h2 className="text-xl font-bold text-foreground">Iniciá sesión para reservar</h2>
        <Button asChild size="lg" className="w-full gap-2 transition-transform hover:scale-105 active:scale-95 hover:shadow-lg">
          <Link to="/">
            <LogIn className="h-4 w-4" strokeWidth={1.5} />
            Iniciar sesión
          </Link>
        </Button>
        <Button asChild variant="ghost" className="transition-transform hover:scale-105">
          <Link to="/salones/$id" params={{ id }}>Volver al salón</Link>
        </Button>
      </div>
    )
  }

  if (step === 3) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-6 px-6 py-20 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
          <Check className="h-10 w-10" strokeWidth={2} />
        </div>
        <h2 className="text-2xl font-bold text-foreground">¡Reserva confirmada!</h2>
        <p className="text-muted-foreground">
          Tu solicitud para reservar <span className="font-medium text-foreground">{salon?.name}</span> fue enviada con éxito.
        </p>
        <div className="mt-4 flex w-full flex-col gap-3">
          <Button asChild size="lg" className="w-full transition-transform hover:scale-105 active:scale-95 hover:shadow-lg">
            <Link to="/salones/$id" params={{ id }}>Volver al salón</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-8">
      <Link
        to="/salones/$id"
        params={{ id }}
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary hover:underline transition-colors"
      >
        <ChevronLeft className="h-4 w-4" strokeWidth={1.5} />
        Volver a {salon?.name}
      </Link>

      <h1 className="mb-8 text-2xl font-bold text-foreground">Reservar salón</h1>

      <div className="mb-10 flex items-center gap-2">
        {STEPS.map(({ label, icon: Icon }, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="flex flex-col items-center gap-1">
              <div
                className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition-colors duration-300',
                  i < step
                    ? 'bg-primary text-primary-foreground'
                    : i === step
                      ? 'border-2 border-primary bg-background text-primary shadow-sm'
                      : 'border-2 border-muted bg-background text-muted-foreground',
                )}
              >
                {i < step ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" strokeWidth={1.5} />}
              </div>
              <span className={cn('hidden text-xs sm:block transition-colors', i === step ? 'font-semibold text-foreground' : 'text-muted-foreground')}>
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={cn('mb-4 h-px flex-1 transition-colors duration-300', i < step ? 'bg-primary' : 'bg-muted')} />
            )}
          </div>
        ))}
      </div>

      <div className="rounded-2xl border bg-card p-6 shadow-sm">
        {step === 0 && (
          <form
            onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); void form1.handleSubmit() }}
            className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-300"
          >
            <h2 className="text-lg font-semibold text-foreground">Fecha y hora</h2>

            <form1.Field name="eventDate">
              {(field) => (
                <div className="flex flex-col gap-1.5">
                  <Label>Fecha del evento</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal transition-colors hover:border-primary hover:text-primary",
                          !field.state.value && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" strokeWidth={1.5} />
                        {field.state.value ? (
                          format(field.state.value, "PPP", { locale: es })
                        ) : (
                          <span>Elegí una fecha</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    {/* FIJAMOS EL ANCHO AQUÍ para que el calendario no colapse */}
                    <PopoverContent className="w-[300px] p-3 bg-[hsl(var(--background))] text-[hsl(var(--foreground))]" align="start">
                      <Calendar
                        mode="single"
                        selected={field.state.value}
                        onSelect={(date) => field.handleChange(date as Date)}
                        disabled={(date) => {
                          const today = new Date()
                          today.setHours(0, 0, 0, 0)
                          return date < today
                        }}
                        initialFocus
                        className="w-full"
                      />
                    </PopoverContent>
                  </Popover>
                  {field.state.meta.errors[0] && (
                    <p className="text-xs text-destructive">{String(field.state.meta.errors[0])}</p>
                  )}
                </div>
              )}
            </form1.Field>

            <div className="grid grid-cols-2 gap-4">
              <form1.Field name="startTime">
                {(field) => (
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="startTime">Hora de inicio</Label>
                    <Select value={field.state.value} onValueChange={field.handleChange}>
                      <SelectTrigger id="startTime" className="w-full hover:border-primary transition-colors">
                        <SelectValue placeholder="Seleccioná..." />
                      </SelectTrigger>
                      <SelectContent className="max-h-64 bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
                        {TIME_SLOTS.map((t) => (
                          <SelectItem key={t} value={t}>{t}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {field.state.meta.errors[0] && (
                      <p className="text-xs text-destructive">{String(field.state.meta.errors[0])}</p>
                    )}
                  </div>
                )}
              </form1.Field>

              <form1.Field name="endTime">
                {(field) => (
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="endTime">Hora de fin</Label>
                    <Select value={field.state.value} onValueChange={field.handleChange}>
                      <SelectTrigger id="endTime" className="w-full hover:border-primary transition-colors">
                        <SelectValue placeholder="Seleccioná..." />
                      </SelectTrigger>
                      <SelectContent className="max-h-64 bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
                        {TIME_SLOTS.map((t) => (
                          <SelectItem key={t} value={t}>{t}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {field.state.meta.errors[0] && (
                      <p className="text-xs text-destructive">{String(field.state.meta.errors[0])}</p>
                    )}
                  </div>
                )}
              </form1.Field>
            </div>

            {overlapError && (
              <div className="flex items-start gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive animate-in fade-in zoom-in-95">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.5} />
                <p>{overlapError}</p>
              </div>
            )}

            <div className="flex justify-end mt-4">
              <Button type="submit" className="gap-2 shadow-sm transition-transform hover:scale-105 active:scale-95" disabled={!!overlapError}>
                Siguiente
                <ChevronRight className="h-4 w-4" strokeWidth={1.5} />
              </Button>
            </div>
          </form>
        )}

        {step === 1 && (
          <form
            onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); void form2.handleSubmit() }}
            className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-300"
          >
            <h2 className="text-lg font-semibold text-foreground">Datos del evento</h2>

            <form2.Field name="eventType">
              {(field) => (
                <div className="flex flex-col gap-2">
                  <Label>Tipo de evento</Label>
                  <div className="flex flex-wrap gap-2">
                    {EVENT_TYPES.map((tipo) => {
                      const isSelected = field.state.value === tipo;
                      return (
                        <button
                          key={tipo}
                          type="button"
                          onClick={() => field.handleChange(tipo)}
                          className={cn(
                            'rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-200 border-2',
                            isSelected 
                              ? 'border-primary bg-primary text-primary-foreground shadow-md scale-105' 
                              : 'border-muted bg-background hover:border-primary/50 hover:bg-muted/50'
                          )}
                        >
                          {tipo}
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

            <form2.Field name="attendees">
              {(field) => {
                const exceedsCapacity = salon && field.state.value > salon.capacity;
                return (
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between">
                      <Label htmlFor="attendees">Cantidad de asistentes</Label>
                      {salon && <span className="text-xs font-medium text-accent">Máx: {salon.capacity} personas</span>}
                    </div>
                    <Input
                      id="attendees"
                      type="number"
                      min={1}
                      max={salon?.capacity}
                      value={field.state.value}
                      onChange={(e) => {
                        const val = e.target.value;
                        field.handleChange(val === '' ? '' as any : Number(val))
                      }}
                      onBlur={field.handleBlur}
                      className={cn(
                        "hover:border-primary transition-colors",
                        exceedsCapacity && "border-destructive focus-visible:ring-destructive"
                      )}
                    />
                    {exceedsCapacity ? (
                      <p className="text-xs text-destructive animate-in fade-in slide-in-from-top-1">La cantidad excede la capacidad máxima del salón ({salon.capacity}).</p>
                    ) : field.state.meta.errors[0] ? (
                      <p className="text-xs text-destructive animate-in fade-in slide-in-from-top-1">{String(field.state.meta.errors[0])}</p>
                    ) : null}
                  </div>
                )
              }}
            </form2.Field>

            <form2.Field name="notes">
              {(field) => (
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="notes">Notas adicionales (opcional)</Label>
                  <textarea
                    id="notes"
                    rows={3}
                    placeholder="Decoración, requerimientos especiales..."
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 hover:border-primary transition-colors"
                  />
                </div>
              )}
            </form2.Field>

            <div className="flex justify-between mt-4">
              <Button type="button" variant="outline" onClick={() => setStep(0)} className="gap-2 transition-transform hover:scale-105 active:scale-95 hover:bg-accent/10">
                <ChevronLeft className="h-4 w-4" strokeWidth={1.5} />
                Atrás
              </Button>
              <Button 
                type="submit" 
                className="gap-2 shadow-sm transition-transform hover:scale-105 active:scale-95"
                disabled={!!(salon && form2.state.values.attendees > salon.capacity)}
              >
                Siguiente
                <ChevronRight className="h-4 w-4" strokeWidth={1.5} />
              </Button>
            </div>
          </form>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-lg font-semibold text-foreground">Confirmación</h2>

            <div className="rounded-xl bg-muted/50 p-5 border shadow-sm">
              <p className="mb-4 font-semibold text-lg text-foreground">{salon?.name}</p>
              <div className="flex flex-col gap-3 text-sm">
                {([
                  ['Fecha', step1Snapshot.eventDate ? format(step1Snapshot.eventDate, "PPP", { locale: es }) : ''],
                  ['Horario', `${step1Snapshot.startTime} – ${step1Snapshot.endTime}`],
                  ['Duración', `${hours}h`],
                  ['Tipo de evento', step2Snapshot.eventType],
                  ['Asistentes', String(step2Snapshot.attendees)],
                  ...(step2Snapshot.notes ? [['Notas', step2Snapshot.notes]] : []),
                ] as [string, string][]).map(([label, value]) => (
                  <div key={label} className="flex justify-between items-center">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="max-w-xs text-right font-medium">{value}</span>
                  </div>
                ))}
              </div>

              <Separator className="my-5" />

              <div className="flex justify-between text-base font-bold text-foreground">
                <span>Total estimado</span>
                <span className="text-primary">
                  {totalPrice.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 })}
                </span>
              </div>
              <p className="mt-1 text-xs text-right text-muted-foreground">
                {salon?.pricePerHour.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 })}/h × {hours}h
              </p>
            </div>

            <div className="flex justify-between mt-4">
              <Button type="button" variant="outline" onClick={() => setStep(1)} className="gap-2 transition-transform hover:scale-105 active:scale-95 hover:bg-accent/10">
                <ChevronLeft className="h-4 w-4" strokeWidth={1.5} />
                Atrás
              </Button>
              <Button
                onClick={confirmBooking}
                disabled={createBooking.isPending || hours <= 0}
                className="gap-2 transition-transform hover:scale-105 active:scale-95 shadow-md"
              >
                {createBooking.isPending ? 'Procesando...' : 'Confirmar reserva'}
                {!createBooking.isPending && <Check className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
