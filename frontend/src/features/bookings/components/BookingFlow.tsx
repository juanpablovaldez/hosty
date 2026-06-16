import { useState, Fragment } from 'react'
import { useParams, Link } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import { toast } from 'sonner'
import { useSalon, useSalonBlockedDates } from '@/features/salones/api/salones.queries'
import { useCreateBooking } from '../api/bookings.mutations'
import { useAuthStore } from '@/features/auth/store/auth.store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { ChevronLeft, ChevronRight, Check, Calendar, Users, FileText, CheckCircle2, ClipboardList, Home } from 'lucide-react'
import { cn, formError } from '@/shared/lib/utils'
import { formatARS } from '@/features/salones/lib/pricing'

const EVENT_TYPES = ['Cumpleaños', 'Casamiento', 'Corporativo', 'Baby shower', 'Quince años', 'Graduación']

const isQuarterHour = (v: string) => /^\d{2}:(00|15|30|45)$/.test(v)

const TIME_SLOTS = Array.from({ length: 24 * 4 }, (_, i) => {
  const h = String(Math.floor(i / 4)).padStart(2, '0')
  const m = String((i % 4) * 15).padStart(2, '0')
  return `${h}:${m}`
})

const TIME_SELECT_CLASS =
  'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm'

const step1Schema = z.object({
  eventDate: z.string().min(1, 'Seleccioná una fecha'),
  startTime: z
    .string()
    .min(1, 'Seleccioná hora de inicio')
    .refine(isQuarterHour, 'Elegí un horario en intervalos de 15 minutos'),
  endTime: z
    .string()
    .min(1, 'Seleccioná hora de fin')
    .refine(isQuarterHour, 'Elegí un horario en intervalos de 15 minutos'),
})

const step2Schema = z.object({
  eventType: z.string().min(1, 'Seleccioná el tipo de evento'),
  attendees: z.coerce.number().min(1, 'Al menos 1 asistente'),
  contactName: z.string().min(2, 'Ingresá tu nombre'),
  contactPhone: z.string().min(6, 'Ingresá un teléfono de contacto'),
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
  const { data: blockedList = [] } = useSalonBlockedDates(id)
  const createBooking = useCreateBooking()
  const user = useAuthStore((s) => s.user)

  const blockedDates = new Set(blockedList)

  const [step, setStep] = useState(0)
  const [step1Error, setStep1Error] = useState<string | null>(null)
  const [bookingConfirmed, setBookingConfirmed] = useState(false)

  const [step1Snapshot, setStep1Snapshot] = useState({ eventDate: '', startTime: '', endTime: '' })
  const [step2Snapshot, setStep2Snapshot] = useState({ eventType: '', attendees: 1, contactName: '', contactPhone: '', notes: '' })
  const [selectedServiceNames, setSelectedServiceNames] = useState<string[]>([])

  const hours = calcHours(step1Snapshot.startTime, step1Snapshot.endTime)
  const chosenServices = salon ? salon.services.filter((s) => selectedServiceNames.includes(s.name)) : []
  const base = salon && salon.priceType === 'fixed' && salon.pricePerHour != null ? salon.pricePerHour * hours : null
  const extrasPriced = chosenServices.every((s) => s.price != null)
  const extrasSum = chosenServices.reduce((acc, s) => acc + (s.price ?? 0), 0)
  const totalPrice: number | null = base != null && extrasPriced ? base + extrasSum : null

  const form1 = useForm({
    defaultValues: step1Snapshot,
    validators: { onSubmit: step1Schema },
    onSubmit: ({ value }) => {
      const h = calcHours(value.startTime, value.endTime)
      if (h <= 0) {
        setStep1Error('La hora de fin debe ser posterior a la de inicio.')
        return
      }
      if (salon && h < salon.rentTimeHours) {
        setStep1Error(`Este salón se alquila por un mínimo de ${salon.rentTimeHours} h. Ajustá el horario.`)
        return
      }
      if (blockedDates.has(value.eventDate)) {
        setStep1Error('El salón no está disponible en la fecha elegida. Probá con otra fecha.')
        return
      }
      setStep1Error(null)
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
    if (!user || !salon) return
    try {
      await createBooking.mutateAsync({
        salonId: salon.id,
        userId: user.id,
        eventDate: step1Snapshot.eventDate,
        startTime: step1Snapshot.startTime,
        endTime: step1Snapshot.endTime,
        attendees: step2Snapshot.attendees,
        eventType: step2Snapshot.eventType,
        contactName: step2Snapshot.contactName,
        contactPhone: step2Snapshot.contactPhone,
        notes: step2Snapshot.notes,
        selectedServices: chosenServices.map((s) => ({ name: s.name, price: s.price })),
        totalPrice,
      })
      setBookingConfirmed(true)
      setStep(3)
    } catch {
      toast.error('No pudimos procesar tu reserva. Intentá de nuevo.')
    }
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-12">
        <Skeleton className="mb-6 h-8 w-48" />
        <Skeleton className="h-64 w-full rounded-2xl" />
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
                <span>{totalPrice != null ? formatARS(totalPrice) : 'A consultar'}</span>
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
                  {formError(field.state.meta.errors[0]) && (
                    <p className="text-xs text-destructive">{formError(field.state.meta.errors[0])}</p>
                  )}
                </div>
              )}
            </form1.Field>

            <div className="grid grid-cols-2 gap-4">
              <form1.Field name="startTime">
                {(field) => (
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="startTime">Hora de inicio</Label>
                    <select
                      id="startTime"
                      className={TIME_SELECT_CLASS}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                    >
                      <option value="" disabled>
                        Elegí un horario
                      </option>
                      {TIME_SLOTS.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                    {formError(field.state.meta.errors[0]) && (
                      <p className="text-xs text-destructive">{formError(field.state.meta.errors[0])}</p>
                    )}
                  </div>
                )}
              </form1.Field>

              <form1.Field name="endTime">
                {(field) => (
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="endTime">Hora de fin</Label>
                    <select
                      id="endTime"
                      className={TIME_SELECT_CLASS}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                    >
                      <option value="" disabled>
                        Elegí un horario
                      </option>
                      {TIME_SLOTS.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                    {formError(field.state.meta.errors[0]) && (
                      <p className="text-xs text-destructive">{formError(field.state.meta.errors[0])}</p>
                    )}
                  </div>
                )}
              </form1.Field>
            </div>

            {step1Error && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2.5 text-sm text-destructive">
                {step1Error}
              </div>
            )}

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
                  {formError(field.state.meta.errors[0]) && (
                    <p className="text-xs text-destructive">{formError(field.state.meta.errors[0])}</p>
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
                  {formError(field.state.meta.errors[0]) && (
                    <p className="text-xs text-destructive">{formError(field.state.meta.errors[0])}</p>
                  )}
                </div>
              )}
            </form2.Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <form2.Field name="contactName">
                {(field) => (
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="contactName">Tu nombre</Label>
                    <Input
                      id="contactName"
                      placeholder="Nombre y apellido"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                    />
                    {formError(field.state.meta.errors[0]) && (
                      <p className="text-xs text-destructive">{formError(field.state.meta.errors[0])}</p>
                    )}
                  </div>
                )}
              </form2.Field>

              <form2.Field name="contactPhone">
                {(field) => (
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="contactPhone">Teléfono de contacto</Label>
                    <Input
                      id="contactPhone"
                      placeholder="381 555-0000"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                    />
                    {formError(field.state.meta.errors[0]) && (
                      <p className="text-xs text-destructive">{formError(field.state.meta.errors[0])}</p>
                    )}
                  </div>
                )}
              </form2.Field>
            </div>

            {salon && salon.services.length > 0 && (
              <div className="flex flex-col gap-2">
                <Label>Servicios extra (opcional)</Label>
                <div className="flex flex-col gap-2">
                  {salon.services.map((s) => {
                    const checked = selectedServiceNames.includes(s.name)
                    return (
                      <label
                        key={s.id ?? s.name}
                        className="flex items-center gap-3 rounded-lg border border-border px-3 py-2.5 cursor-pointer hover:border-primary transition"
                      >
                        <Checkbox
                          checked={checked}
                          onCheckedChange={(v) =>
                            setSelectedServiceNames((prev) =>
                              v === true ? [...prev, s.name] : prev.filter((n) => n !== s.name),
                            )
                          }
                        />
                        <span className="flex-1 text-sm text-foreground">{s.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {s.price != null ? formatARS(s.price) : 'A consultar'}
                        </span>
                      </label>
                    )
                  })}
                </div>
              </div>
            )}

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
                  ['Contacto', `${step2Snapshot.contactName} · ${step2Snapshot.contactPhone}`],
                  ...(step2Snapshot.notes ? [['Notas', step2Snapshot.notes]] : []),
                ] as [string, string][]).map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-3">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="max-w-xs text-right font-medium">{value}</span>
                  </div>
                ))}
              </div>

              {chosenServices.length > 0 && (
                <>
                  <Separator className="my-4" />
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Servicios extra</p>
                  <div className="flex flex-col gap-2 text-sm">
                    {chosenServices.map((s) => (
                      <div key={s.id ?? s.name} className="flex justify-between">
                        <span className="text-muted-foreground">{s.name}</span>
                        <span className="font-medium">{s.price != null ? formatARS(s.price) : 'A consultar'}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}

              <Separator className="my-4" />

              <div className="flex justify-between text-base font-semibold text-foreground">
                <span>{totalPrice != null ? 'Total estimado' : 'Total'}</span>
                <span>{totalPrice != null ? formatARS(totalPrice) : 'A consultar'}</span>
              </div>
              {totalPrice != null && base != null ? (
                <p className="mt-1 text-xs text-muted-foreground">
                  {salon && salon.pricePerHour != null && `${formatARS(salon.pricePerHour)}/h × ${hours}h`}
                  {chosenServices.length > 0 && ` + ${chosenServices.length} servicio${chosenServices.length > 1 ? 's' : ''}`}
                </p>
              ) : (
                <p className="mt-1 text-xs text-muted-foreground">
                  El salón revisará tu solicitud y te enviará una cotización.
                </p>
              )}
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
