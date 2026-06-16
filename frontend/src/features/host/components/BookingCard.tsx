import { Calendar, Clock, Users, CheckCircle, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/shared/lib/utils'
import { toast } from 'sonner'
import type { Booking } from '../types'
import { useUpdateBookingStatus } from '../api/host.mutations'
import { STATUS_STYLES, STATUS_LABELS, formatBookingPrice } from '../lib/booking-status'

export function BookingCard({
  booking,
  salonName,
  onOpen,
}: {
  booking: Booking
  salonName: string
  onOpen?: (booking: Booking) => void
}) {
  const update = useUpdateBookingStatus()

  async function handleStatus(status: Booking['status']) {
    try {
      await update.mutateAsync({ id: booking.id, status })
      toast.success(status === 'confirmed' ? 'Reserva confirmada' : 'Reserva rechazada')
    } catch {
      toast.error('No se pudo actualizar la reserva')
    }
  }

  return (
    <div
      onClick={onOpen ? () => onOpen(booking) : undefined}
      className={cn(
        'rounded-2xl border border-border bg-card p-5 shadow-[0_1px_3px_rgba(28,43,58,0.06)]',
        onOpen && 'cursor-pointer transition-shadow hover:shadow-[0_2px_4px_rgba(28,43,58,0.04),0_10px_30px_rgba(28,43,58,0.09)]',
      )}
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <p className="font-semibold text-[15px] text-foreground">{salonName}</p>
          <p className="text-[13px] text-muted-foreground mt-0.5">{booking.eventType}</p>
        </div>
        <span className={cn('rounded-full px-2.5 py-1 text-[11px] font-semibold', STATUS_STYLES[booking.status])}>
          {STATUS_LABELS[booking.status]}
        </span>
      </div>

      <div className="flex flex-wrap gap-4 text-[13px] text-muted-foreground mb-4">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-4 h-4 shrink-0" strokeWidth={1.5} />
          {new Date(booking.eventDate).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })}
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="w-4 h-4 shrink-0" strokeWidth={1.5} />
          {booking.startTime} – {booking.endTime}
        </div>
        <div className="flex items-center gap-1.5">
          <Users className="w-4 h-4 shrink-0" strokeWidth={1.5} />
          {booking.attendees} personas
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="font-bold text-[17px] text-foreground">{formatBookingPrice(booking)}</p>
        {booking.status === 'pending' && (
          <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
              disabled={update.isPending}
              onClick={() => handleStatus('declined')}
            >
              <XCircle className="w-4 h-4" strokeWidth={1.5} />
              Rechazar
            </Button>
            <Button
              size="sm"
              className="gap-1.5"
              disabled={update.isPending}
              onClick={() => handleStatus('confirmed')}
            >
              <CheckCircle className="w-4 h-4" strokeWidth={1.5} />
              Confirmar
            </Button>
          </div>
        )}
      </div>

      {booking.notes && (
        <p className="mt-3 text-[13px] text-muted-foreground border-t border-border pt-3">{booking.notes}</p>
      )}
    </div>
  )
}
