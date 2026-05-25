import { useState, useEffect, Fragment } from 'react'
import { useParams, Link } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import { toast } from 'sonner'
import { useSalon } from '@/features/salones/api/salones.queries'
import { useCreateBooking } from '../api/bookings.mutations'
import { supabase } from '@/shared/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { ChevronLeft, ChevronRight, Check, Calendar, Users, FileText, LogIn, CheckCircle2, ClipboardList, Home } from 'lucide-react'
import { cn } from '@/shared/lib/utils'

const EVENT_TYPES = ['Cumpleaños', 'Casamiento', 'Corporativo', 'Baby shower', 'Quince años', 'Graduación']

const step1Schema = z.object({
  eventDate: z.string().min(1, 'Seleccioná una fecha'),
  startTime: z.string().min(1, 'Seleccioná hora de inicio'),
  endTime: z.string().min(1, 'Seleccioná hora de fin'),
})

const step2Schema = z.object({
  eventType: z.string().min(1, 'Seleccioná el tipo de evento'),
  attendees: z.coerce.number().min(1, 'Al menos 1 asistente'),
  notes: z.string(),
})

const STEPS = [
  { label: 'Fecha y hora', icon: Calendar },
  { label: 'Tu evento', icon: Users },
  { label: 'Confirmar', icon: FileText },
] as const

function calcHours(start: string, end: string) {
  if (!start || !end) return 0
  const [sh, sm] = start.split(':').map(Number)
  const [eh, em] = end.split(':').map(Number)
  return Math.max(0, (eh * 60 + em - (sh * 60 + sm)) / 60)
}

export function BookingFlow() {
  const { id } = useParams({ from: '/salones/$id_/reservar' })
  const { data: salon, isLoading } = useSalon(id)
  const createBooking = useCreateBooking()

  const [step, setStep] = useState(0)
  const [userId, setUserId] = useState<string | null>(null)
  const [authChecked, setAuthChecked] = useState(false)
  const [bookingConfirmed, setBookingConfirmed] = useState(false)

  const [step1Snapshot, setStep1Snapshot] = useState({ eventDate: '', startTime: '', endTime: '' })
  const [step2Snapshot, setStep2Snapshot] = useState({ eventType: '', attendees: 1, notes: '' })

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null)
      setAuthChecked(true)
    })
  }, [])

  const hours = calcHours(step1Snapshot.startTime, step1Snapshot.endTime)
  const totalPrice = salon ? salon.pricePerHour * hours : 0

  const form1 = useForm({
    defaultValues: step1Snapshot,
    validators: { onSubmit: step1Schema },
    onSubmit: ({ value }) => {
      setStep1Snapshot(value)
      setStep(1)
    },
  })

  const form2 = useForm({
    defaultValues: step2Snapshot,
    validators: { onSubmit: step2Schema },
    onSubmit: ({ value }) => {
      setStep2Snapshot(value)
      setStep(2)
    },
  })

  async function confirmBooking() {
    if (!userId || !salon) return
    try {
      await createBooking.mutateAsync({
        salonId: salon.id,
        userId,
        eventDate: step1Snapshot.eventDate,
        startTime: step1Snapshot.startTime,
        endTime: step1Snapshot.endTime,
        attendees: step2Snapshot.attendees,
        eventType: step2Snapshot.eventType,
        notes: step2Snapshot.notes,
        totalPrice,
      })
      setBookingConfirmed(true)
      setStep(3)
    } catch {
      toast.error('No pudimos procesar tu reserva. Intentá de nuevo.')
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
        <p className="text-muted-foreground">
          Necesitás una cuenta para confirmar tu reserva en{' '}
          <span className="font-medium text-foreground">{salon?.name}</span>.
        </p>
        <Button asChild size="lg" className="w-full gap-2">
          <Link to="/">
            <LogIn className="h-4 w-4" strokeWidth={1.5} />
            Iniciar sesión
          </Link>
        </Button>
        <Button asChild variant="ghost">
          <Link to="/salones/$id" params={{ id }}>Volver al salón</Link>
        </Button>
      </div>
    )
  }

  if (bookingConfirmed) {
    return (
      <div className="mx-auto max-w-lg px-6 py-12">
        <div className="flex flex-col items-center gap-6 rounded-2xl border bg-card p-8 text-center shadow-sm">
          <div className="relative">
            <div className="absolute inset-0 animate-ping rounded-full bg-green-400/20" />
            <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10">
              <CheckCircle2 className="h-10 w-10 text-green-500" strokeWidth={1.5} />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold text-foreground">
              ¡Tu reserva fue enviada!
            </h2>
            <p className="text-sm text-muted-foreground">
              El salón revisará tu solicitud y te confirmaremos a la brevedad.
            </p>
          </div>

          <Badge className="border-amber-200 bg-amber-50 px-3 py-1 text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-400">
            Pendiente de confirmación
          </Badge>

          <div className="w-full rounded-xl bg-muted/50 p-4">
            <p className="mb-3 font-medium text-foreground">{salon?.name}</p>
            <div className="flex flex-col gap-2 text-sm">
              {([
                ['Fecha', new Date(step1Snapshot.eventDate + 'T12:00:00').toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })],
                ['Horario', `${step1Snapshot.startTime} – ${step1Snapshot.endTime}`],
                ['Tipo', step2Snapshot.eventType],
                ['Asistentes', String(step2Snapshot.attendees)],
              ] as [string, string][]).map(([label, value]) => (
                <div key={label} className="flex justify-between">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-medium">{value}</span>
                </div>
              ))}
              <Separator className="my-2" />
              <div className="flex justify-between text-base font-semibold text-foreground">
                <span>Total</span>
                <span>
                  {totalPrice.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 })}
                </span>
              </div>
            </div>
          </div>

          <div className="flex w-full flex-col gap-3 sm:flex-row">
            <Button
              asChild
              className="flex-1 gap-2"
            >
              <Link to="/mis-reservas">
                <ClipboardList className="h-4 w-4" strokeWidth={1.5} />
                Ver mis reservas
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="flex-1 gap-2"
            >
              <Link to="/">
                <Home className="h-4 w-4" strokeWidth={1.5} />
                Volver al inicio
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-8">
      <Link
        to="/salones/$id"
        params={{ id }}
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4" strokeWidth={1.5} />
        Volver a {salon?.name}
      </Link>

      <h1 className="mb-8 text-2xl font-bold text-foreground">Reservar salón</h1>

      {/* Steps indicator */}
      <div className="mb-10 flex items-center">
        {STEPS.map(({ label, icon: Icon }, i) => (
          <Fragment key={i}>
            <div className="flex flex-shrink-0 flex-col items-center gap-1">
              <div
                className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition-colors',
                  i < step
                    ? 'bg-primary text-primary-foreground'
                    : i === step
                      ? 'border-2 border-primary bg-background text-primary'
                      : 'border-2 border-muted bg-background text-muted-foreground',
                )}
              >
                {i < step ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" strokeWidth={1.5} />}
              </div>
              <span className={cn('hidden text-xs sm:block', i === step ? 'font-semibold text-foreground' : 'text-muted-foreground')}>
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={cn('mb-4 h-px flex-1', i < step ? 'bg-primary' : 'bg-muted')} />
            )}
          </Fragment>
        ))}
      </div>

      <div className="rounded-2xl border bg-card p-6 shadow-sm">
        {/* Step 1: Date & time */}
        {step === 0 && (
          <form
            onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); void form1.handleSubmit() }}
            className="flex flex-col gap-5"
          >
            <h2 className="text-lg font-semibold text-foreground">Fecha y hora</h2>

            <form1.Field name="eventDate">
              {(field) => (
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="eventDate">Fecha del evento</Label>
                  <Input
                    id="eventDate"
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                  />
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
                    <Input
                      id="startTime"
                      type="time"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                    />
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
                    <Input
                      id="endTime"
                      type="time"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                    />
                    {field.state.meta.errors[0] && (
                      <p className="text-xs text-destructive">{String(field.state.meta.errors[0])}</p>
                    )}
                  </div>
                )}
              </form1.Field>
            </div>

            <div className="flex justify-end">
              <Button type="submit" className="gap-2">
                Siguiente
                <ChevronRight className="h-4 w-4" strokeWidth={1.5} />
              </Button>
            </div>
          </form>
        )}

        {/* Step 2: Event info */}
        {step === 1 && (
          <form
            onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); void form2.handleSubmit() }}
            className="flex flex-col gap-5"
          >
            <h2 className="text-lg font-semibold text-foreground">Datos del evento</h2>

            <form2.Field name="eventType">
              {(field) => (
                <div className="flex flex-col gap-2">
                  <Label>Tipo de evento</Label>
                  <div className="flex flex-wrap gap-2">
                    {EVENT_TYPES.map((tipo) => (
                      <button
                        key={tipo}
                        type="button"
                        onClick={() => field.handleChange(tipo)}
                        className={cn(
                          'rounded-full border px-4 py-1.5 text-sm transition-colors',
                          field.state.value === tipo
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-border hover:border-primary hover:text-primary',
                        )}
                      >
                        {tipo}
                      </button>
                    ))}
                  </div>
                  {field.state.meta.errors[0] && (
                    <p className="text-xs text-destructive">{String(field.state.meta.errors[0])}</p>
                  )}
                </div>
              )}
            </form2.Field>

            <form2.Field name="attendees">
              {(field) => (
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="attendees">Cantidad de asistentes</Label>
                  <Input
                    id="attendees"
                    type="number"
                    min={1}
                    max={salon?.capacity}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(Number(e.target.value))}
                    onBlur={field.handleBlur}
                  />
                  {salon && <p className="text-xs text-muted-foreground">Máximo: {salon.capacity} personas</p>}
                  {field.state.meta.errors[0] && (
                    <p className="text-xs text-destructive">{String(field.state.meta.errors[0])}</p>
                  )}
                </div>
              )}
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
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                </div>
              )}
            </form2.Field>

            <div className="flex justify-between">
              <Button type="button" variant="outline" onClick={() => setStep(0)} className="gap-2">
                <ChevronLeft className="h-4 w-4" strokeWidth={1.5} />
                Atrás
              </Button>
              <Button type="submit" className="gap-2">
                Siguiente
                <ChevronRight className="h-4 w-4" strokeWidth={1.5} />
              </Button>
            </div>
          </form>
        )}

        {/* Step 3: Confirmation */}
        {step === 2 && (
          <div className="flex flex-col gap-5">
            <h2 className="text-lg font-semibold text-foreground">Confirmación</h2>

            <div className="rounded-xl bg-muted/50 p-4">
              <p className="mb-3 font-medium text-foreground">{salon?.name}</p>
              <div className="flex flex-col gap-2 text-sm">
                {([
                  ['Fecha', step1Snapshot.eventDate],
                  ['Horario', `${step1Snapshot.startTime} – ${step1Snapshot.endTime}`],
                  ['Duración', `${hours}h`],
                  ['Tipo de evento', step2Snapshot.eventType],
                  ['Asistentes', String(step2Snapshot.attendees)],
                  ...(step2Snapshot.notes ? [['Notas', step2Snapshot.notes]] : []),
                ] as [string, string][]).map(([label, value]) => (
                  <div key={label} className="flex justify-between">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="max-w-xs text-right font-medium">{value}</span>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between text-base font-semibold text-foreground">
                <span>Total estimado</span>
                <span>
                  {totalPrice.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 })}
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {salon?.pricePerHour.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 })}/h × {hours}h
              </p>
            </div>

            <div className="flex justify-between">
              <Button type="button" variant="outline" onClick={() => setStep(1)} className="gap-2">
                <ChevronLeft className="h-4 w-4" strokeWidth={1.5} />
                Atrás
              </Button>
              <Button
                onClick={confirmBooking}
                disabled={createBooking.isPending || hours <= 0}
                className="gap-2"
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
