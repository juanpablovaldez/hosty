import { useState, type ReactNode } from 'react'
import { toast } from 'sonner'
import {
  Calendar, Clock, Users, MessageSquare, MapPin,
  Phone, User, CheckCircle, XCircle, MessageCircle, AlertTriangle, Pencil,
} from 'lucide-react'
import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
} from '@/components/ui/sheet'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/shared/lib/utils'
import type { Booking } from '../types'
import { useUpdateBookingStatus, useUpdateBookingQuote } from '../api/host.mutations'
import { STATUS_STYLES, STATUS_LABELS, formatARS, formatBookingPrice, effectivePrice } from '../lib/booking-status'

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })
}

function timesOverlap(a: Booking, b: Booking): boolean {
  return a.startTime < b.endTime && b.startTime < a.endTime
}

function waLink(phone: string): string {
  let digits = phone.replace(/\D/g, '')
  if (digits.startsWith('0')) digits = digits.slice(1)
  if (!digits.startsWith('54')) digits = `549${digits}`
  return `https://wa.me/${digits}`
}

function telLink(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, '')}`
}

function Pill({ status }: { status: Booking['status'] }) {
  return (
    <span className={cn('rounded-full px-2.5 py-1 text-[11px] font-semibold', STATUS_STYLES[status])}>
      {STATUS_LABELS[status]}
    </span>
  )
}

type ActionMode = 'confirm' | 'reject'

function ActionDialog({
  booking,
  mode,
  warning,
  onClose,
  onResolved,
}: {
  booking: Booking
  mode: ActionMode
  warning?: string | null
  onClose: () => void
  onResolved: () => void
}) {
  const [message, setMessage] = useState('')
  const [quote, setQuote] = useState<number | null>(null)
  const update = useUpdateBookingStatus()
  const isConfirm = mode === 'confirm'
  const needsQuote = isConfirm && effectivePrice(booking) == null

  async function handleSubmit() {
    try {
      await update.mutateAsync({
        id: booking.id,
        status: isConfirm ? 'confirmed' : 'declined',
        rejectionReason: isConfirm ? undefined : message.trim() || undefined,
        quotedPrice: needsQuote && quote != null ? quote : undefined,
      })
      toast.success(isConfirm ? 'Reserva confirmada' : 'Reserva rechazada')
      onResolved()
    } catch {
      toast.error('No se pudo actualizar la reserva')
    }
  }

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isConfirm ? 'Confirmar reserva' : 'Rechazar reserva'}</DialogTitle>
          <DialogDescription>
            {isConfirm
              ? 'El cliente va a recibir la confirmación de su solicitud.'
              : 'Contanos el motivo (opcional). El cliente va a recibir la notificación.'}
          </DialogDescription>
        </DialogHeader>

        {isConfirm && warning && (
          <div className="flex items-start gap-2 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2.5 text-[13px] text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.5} />
            <span>{warning} Podés confirmar igualmente si estás seguro.</span>
          </div>
        )}

        {needsQuote && (
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium text-foreground">Monto a cobrar (cotización)</label>
            <Input
              type="number"
              min={0}
              placeholder="Ej: 150000"
              value={quote ?? ''}
              onChange={(e) => setQuote(e.target.value === '' ? null : Number(e.target.value))}
            />
            <p className="text-xs text-muted-foreground">Esta reserva es “a consultar”. Ingresá el total que le vas a cobrar al cliente.</p>
          </div>
        )}

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={isConfirm ? 'Mensaje opcional para el cliente…' : 'Motivo del rechazo (opcional)…'}
          className="min-h-[84px] w-full resize-y rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
        />

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={update.isPending}>
            Volver
          </Button>
          <Button onClick={handleSubmit} disabled={update.isPending} className="gap-1.5">
            {isConfirm
              ? <CheckCircle className="w-4 h-4" strokeWidth={1.5} />
              : <XCircle className="w-4 h-4" strokeWidth={1.5} />}
            {isConfirm ? 'Confirmar reserva' : 'Rechazar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function QuoteDialog({
  booking,
  onClose,
}: {
  booking: Booking
  onClose: () => void
}) {
  const [quote, setQuote] = useState<number | null>(effectivePrice(booking))
  const updateQuote = useUpdateBookingQuote()

  async function handleSave() {
    if (quote == null) return
    try {
      await updateQuote.mutateAsync({ id: booking.id, quotedPrice: quote })
      toast.success('Cotización actualizada')
      onClose()
    } catch {
      toast.error('No se pudo actualizar la cotización')
    }
  }

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar cotización</DialogTitle>
          <DialogDescription>Actualizá el monto total acordado con el cliente.</DialogDescription>
        </DialogHeader>
        <Input
          type="number"
          min={0}
          placeholder="Ej: 150000"
          value={quote ?? ''}
          onChange={(e) => setQuote(e.target.value === '' ? null : Number(e.target.value))}
        />
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={updateQuote.isPending}>Volver</Button>
          <Button onClick={handleSave} disabled={updateQuote.isPending || quote == null}>Guardar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function BookingDrawer({
  booking,
  salonName,
  allBookings,
  blocks,
  onClose,
}: {
  booking: Booking | null
  salonName: string
  allBookings: Booking[]
  blocks: { salonId: string; date: string }[]
  onClose: () => void
}) {
  const [action, setAction] = useState<ActionMode | null>(null)
  const [editingQuote, setEditingQuote] = useState(false)

  const conflicts = booking
    ? allBookings.filter(
        (b) =>
          b.id !== booking.id &&
          b.salonId === booking.salonId &&
          b.eventDate === booking.eventDate &&
          b.status === 'confirmed' &&
          timesOverlap(b, booking),
      )
    : []
  const isBlocked = booking
    ? blocks.some((bl) => bl.salonId === booking.salonId && bl.date === booking.eventDate)
    : false
  const confirmWarning =
    conflicts.length > 0
      ? 'Ya tenés una reserva confirmada que se superpone con esta fecha y horario.'
      : isBlocked
        ? 'Marcaste esta fecha como no disponible para este salón.'
        : null

  return (
    <Sheet open={booking !== null} onOpenChange={(o) => { if (!o) { setEditingQuote(false); setAction(null); onClose() } }}>
      <SheetContent side="right" aria-describedby={undefined} className="w-full sm:max-w-md flex flex-col p-0">
        {booking && (
          <>
            <SheetHeader className="px-6 pt-6 pb-0">
              <div className="flex items-center justify-between">
                <Pill status={booking.status} />
              </div>
              <SheetTitle className="sr-only">Detalle de la reserva</SheetTitle>
            </SheetHeader>

            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
              <div>
                <div className="text-lg font-extrabold tracking-tight text-foreground">{salonName}</div>
                <div className="text-[13px] text-muted-foreground flex items-center gap-1.5 mt-1">
                  <MessageSquare className="w-3.5 h-3.5" strokeWidth={1.5} />
                  {booking.eventType}
                </div>
              </div>

              {(booking.contactName || booking.contactPhone) && (
                <section>
                  <p className="text-[11.5px] font-bold uppercase tracking-wide text-muted-foreground mb-2.5">Cliente</p>
                  <div className="rounded-xl border border-border p-3.5 space-y-1.5">
                    {booking.contactName && (
                      <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                        <User className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
                        {booking.contactName}
                      </div>
                    )}
                    {booking.contactPhone && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-[13px] text-muted-foreground">
                          <Phone className="w-3.5 h-3.5" strokeWidth={1.5} />
                          {booking.contactPhone}
                        </div>
                        <div className="flex gap-2">
                          <a
                            href={waLink(booking.contactPhone)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-md bg-green-100 px-2.5 py-1 text-[12px] font-semibold text-green-800 transition hover:bg-green-200 dark:bg-green-900/40 dark:text-green-300"
                          >
                            <MessageCircle className="h-3.5 w-3.5" strokeWidth={1.5} /> WhatsApp
                          </a>
                          <a
                            href={telLink(booking.contactPhone)}
                            className="inline-flex items-center gap-1.5 rounded-md bg-muted px-2.5 py-1 text-[12px] font-semibold text-foreground transition hover:bg-muted/70"
                          >
                            <Phone className="h-3.5 w-3.5" strokeWidth={1.5} /> Llamar
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </section>
              )}

              <section>
                <p className="text-[11.5px] font-bold uppercase tracking-wide text-muted-foreground mb-2.5">El evento</p>
                <div className="rounded-xl bg-muted/60 p-4 grid grid-cols-2 gap-4">
                  <Ficha icon={<Calendar className="w-3 h-3" strokeWidth={1.5} />} k="Fecha" v={fmtDate(booking.eventDate)} />
                  <Ficha icon={<Clock className="w-3 h-3" strokeWidth={1.5} />} k="Horario" v={`${booking.startTime} – ${booking.endTime} hs`} />
                  <Ficha icon={<Users className="w-3 h-3" strokeWidth={1.5} />} k="Invitados" v={`${booking.attendees} personas`} />
                  <Ficha icon={<MapPin className="w-3 h-3" strokeWidth={1.5} />} k="Tipo" v={booking.eventType} />
                </div>
              </section>

              <section>
                <p className="text-[11.5px] font-bold uppercase tracking-wide text-muted-foreground mb-2.5">Precio</p>
                {booking.selectedServices.length > 0 && (
                  <div className="space-y-1.5 text-[13.5px] text-muted-foreground mb-2.5">
                    {booking.selectedServices.map((s, i) => (
                      <div key={i} className="flex justify-between">
                        <span>{s.name}</span>
                        <span>{s.price != null ? formatARS(s.price) : 'A consultar'}</span>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex items-center justify-between border-t border-border pt-2.5 text-[16px] font-extrabold text-foreground">
                  <span>Total</span>
                  <span>{formatBookingPrice(booking)}</span>
                </div>
                {booking.status === 'confirmed' && (
                  <button
                    type="button"
                    onClick={() => setEditingQuote(true)}
                    className="mt-2.5 inline-flex items-center gap-1.5 text-[13px] font-semibold text-primary transition hover:text-primary/80"
                  >
                    <Pencil className="h-3.5 w-3.5" strokeWidth={1.5} /> Editar cotización
                  </button>
                )}
              </section>

              {booking.notes && (
                <section>
                  <p className="text-[11.5px] font-bold uppercase tracking-wide text-muted-foreground mb-2.5">Mensaje del cliente</p>
                  <div className="rounded-xl bg-muted px-4 py-3.5 text-[13.5px] leading-relaxed text-foreground">
                    {booking.notes}
                  </div>
                </section>
              )}

              {booking.status === 'declined' && booking.rejectionReason && (
                <section>
                  <p className="text-[11.5px] font-bold uppercase tracking-wide text-muted-foreground mb-2.5">Motivo del rechazo</p>
                  <div className="rounded-xl bg-red-50 dark:bg-red-900/20 px-4 py-3.5 text-[13.5px] leading-relaxed text-red-700 dark:text-red-300">
                    {booking.rejectionReason}
                  </div>
                </section>
              )}
            </div>

            {booking.status === 'pending' && (
              <div className="border-t border-border p-4 flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 gap-1.5 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                  onClick={() => setAction('reject')}
                >
                  <XCircle className="w-4 h-4" strokeWidth={1.5} />
                  Rechazar
                </Button>
                <Button className="flex-1 gap-1.5" onClick={() => setAction('confirm')}>
                  <CheckCircle className="w-4 h-4" strokeWidth={1.5} />
                  Confirmar
                </Button>
              </div>
            )}

            {action && (
              <ActionDialog
                booking={booking}
                mode={action}
                warning={action === 'confirm' ? confirmWarning : null}
                onClose={() => setAction(null)}
                onResolved={() => {
                  setAction(null)
                  onClose()
                }}
              />
            )}

            {editingQuote && (
              <QuoteDialog booking={booking} onClose={() => setEditingQuote(false)} />
            )}
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}

function Ficha({ icon, k, v }: { icon: ReactNode; k: string; v: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[11.5px] font-semibold text-muted-foreground flex items-center gap-1.5">
        {icon}
        {k}
      </span>
      <span className="text-sm font-bold text-foreground">{v}</span>
    </div>
  )
}
