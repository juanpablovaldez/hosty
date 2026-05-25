import { useEffect } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { useAuthStore } from '@/features/auth/store/auth.store'
import { useHostBooking } from '../api/host.queries'
import { useUpdateBookingStatus } from '../api/host.mutations'
import type { Booking } from '../types'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import {
  ChevronLeft, Calendar, Clock, Users, CheckCircle, XCircle, Building2,
} from 'lucide-react'
import { cn } from '@/shared/lib/utils'

const STATUS_STYLES: Record<Booking['status'], string> = {
  pending: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
  confirmed: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
  declined: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
  cancelled: 'bg-muted text-muted-foreground',
}

const STATUS_LABELS: Record<Booking['status'], string> = {
  pending: 'Pendiente',
  confirmed: 'Confirmada',
  declined: 'Rechazada',
  cancelled: 'Cancelada',
}

interface BookingDetailPageProps {
  bookingId: string
}

export function BookingDetailPage({ bookingId }: BookingDetailPageProps) {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const { data: booking, isLoading, error } = useHostBooking(bookingId)
  const update = useUpdateBookingStatus()

  useEffect(() => {
    if (booking && user && booking.salonHostId !== user.id) {
      navigate({ to: '/host/dashboard' })
    }
  }, [booking, user, navigate])

  async function handleStatus(status: Booking['status']) {
    try {
      await update.mutateAsync({ id: bookingId, status })
      toast.success(status === 'confirmed' ? 'Reserva confirmada' : 'Reserva rechazada')
    } catch {
      toast.error('No se pudo actualizar la reserva')
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto px-5 lg:px-8 py-10 space-y-4">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-48 w-full rounded-2xl" />
      </div>
    )
  }

  if (error || !booking) {
    return (
      <div className="max-w-2xl mx-auto px-5 lg:px-8 py-10 text-center">
        <p className="text-muted-foreground mb-4">Reserva no encontrada.</p>
        <Link to="/host/dashboard" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
          <ChevronLeft className="w-4 h-4" strokeWidth={1.5} />
          Volver al dashboard
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-5 lg:px-8 py-10">
      <Link
        to="/host/dashboard"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition mb-8"
      >
        <ChevronLeft className="w-4 h-4" strokeWidth={1.5} />
        Volver al dashboard
      </Link>

      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-[28px] font-extrabold text-foreground tracking-tight">
            Detalle de reserva<span className="text-primary">.</span>
          </h1>
          <p className="text-muted-foreground mt-1">
            Solicitada el {new Date(booking.createdAt).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <span className={cn('rounded-full px-3 py-1.5 text-xs font-semibold shrink-0', STATUS_STYLES[booking.status])}>
          {STATUS_LABELS[booking.status]}
        </span>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-6">
        <div className="flex items-center gap-3">
          <Building2 className="w-5 h-5 text-muted-foreground shrink-0" strokeWidth={1.5} />
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Salón</p>
            <p className="font-semibold text-foreground">{booking.salonName}</p>
          </div>
        </div>

        <Separator />

        <div className="grid sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-muted-foreground shrink-0" strokeWidth={1.5} />
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Fecha</p>
              <p className="font-semibold text-foreground">
                {new Date(booking.eventDate).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-muted-foreground shrink-0" strokeWidth={1.5} />
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Horario</p>
              <p className="font-semibold text-foreground">{booking.startTime} – {booking.endTime}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-muted-foreground shrink-0" strokeWidth={1.5} />
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Invitados</p>
              <p className="font-semibold text-foreground">{booking.attendees} personas</p>
            </div>
          </div>
        </div>

        <Separator />

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Tipo de evento</p>
            <p className="font-semibold text-foreground">{booking.eventType}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Total</p>
            <p className="text-[22px] font-extrabold text-foreground">
              {booking.totalPrice.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 })}
            </p>
          </div>
        </div>

        {booking.notes && (
          <>
            <Separator />
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Notas del solicitante</p>
              <p className="text-[15px] text-foreground leading-relaxed">{booking.notes}</p>
            </div>
          </>
        )}

        {booking.status === 'pending' && (
          <>
            <Separator />
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                className="gap-1.5 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                disabled={update.isPending}
                onClick={() => handleStatus('declined')}
              >
                <XCircle className="w-4 h-4" strokeWidth={1.5} />
                Rechazar
              </Button>
              <Button
                className="gap-1.5"
                disabled={update.isPending}
                onClick={() => handleStatus('confirmed')}
              >
                <CheckCircle className="w-4 h-4" strokeWidth={1.5} />
                Confirmar
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
