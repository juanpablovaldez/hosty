import { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { supabase } from '@/shared/lib/supabase'
import { useHostSalones, useHostBookings } from '../api/host.queries'
import { useUpdateBookingStatus } from '../api/host.mutations'
import type { Salon } from '@/features/salones/types'
import type { Booking } from '../types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Building2, Calendar, Users, ChevronRight,
  CheckCircle, XCircle, Clock, Plus,
} from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { toast } from 'sonner'

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

function BookingCard({ booking, salonName }: { booking: Booking; salonName: string }) {
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
    <div className="rounded-2xl border border-border bg-card p-5 shadow-[0_1px_3px_rgba(28,43,58,0.06)]">
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
        <p className="font-bold text-[17px] text-foreground">
          {booking.totalPrice.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 })}
        </p>
        {booking.status === 'pending' && (
          <div className="flex gap-2">
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
        <p className="mt-3 text-[13px] text-muted-foreground border-t border-border pt-3">
          {booking.notes}
        </p>
      )}
    </div>
  )
}

function SalonRow({ salon, bookings }: { salon: Salon; bookings: Booking[] }) {
  const pending = bookings.filter((b) => b.status === 'pending').length
  const cover = salon.images[0] ?? null

  return (
    <div className="rounded-[20px] border border-border bg-card overflow-hidden shadow-[0_1px_3px_rgba(28,43,58,0.06)]">
      <div className="flex items-center gap-4 p-5">
        {cover
          ? <img src={cover} alt={salon.name} className="w-16 h-16 rounded-xl object-cover shrink-0" />
          : <div className="w-16 h-16 rounded-xl bg-muted shrink-0 flex items-center justify-center">
              <Building2 className="w-7 h-7 text-muted-foreground" strokeWidth={1.5} />
            </div>
        }
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-bold text-[17px] text-foreground truncate">{salon.name}</h3>
            {salon.isVerified && (
              <Badge variant="secondary" className="text-xs shrink-0">Verificado</Badge>
            )}
          </div>
          <p className="text-[13px] text-muted-foreground">{salon.location}</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {pending > 0 && (
            <span className="bg-primary text-primary-foreground text-[11px] font-bold rounded-full px-2.5 py-1">
              {pending} pendiente{pending > 1 ? 's' : ''}
            </span>
          )}
          <Link
            to="/salones/$id"
            params={{ id: salon.id }}
            className="text-muted-foreground hover:text-foreground transition"
          >
            <ChevronRight className="w-5 h-5" strokeWidth={1.5} />
          </Link>
        </div>
      </div>

      {bookings.length > 0 && (
        <div className="border-t border-border px-5 pb-5 pt-4 grid sm:grid-cols-2 gap-3">
          {bookings.map((b) => (
            <BookingCard key={b.id} booking={b} salonName={salon.name} />
          ))}
        </div>
      )}

      {bookings.length === 0 && (
        <div className="border-t border-border px-5 py-4 text-[13px] text-muted-foreground">
          Sin reservas todavía
        </div>
      )}
    </div>
  )
}

export function HostDashboardPage() {
  const [userId, setUserId] = useState<string | null>(null)
  const [authChecked, setAuthChecked] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null)
      setAuthChecked(true)
    })
  }, [])

  const { data: salones = [], isLoading: loadingSalones } = useHostSalones(userId)
  const salonIds = salones.map((s) => s.id)
  const { data: bookings = [], isLoading: loadingBookings } = useHostBookings(salonIds)

  const isLoading = !authChecked || loadingSalones || (salonIds.length > 0 && loadingBookings)

  function bookingsForSalon(salonId: string): Booking[] {
    return bookings.filter((b) => b.salonId === salonId)
  }

  if (!authChecked) return null

  if (!userId) {
    return (
      <div className="flex flex-col items-center gap-4 py-24 text-center px-6">
        <Building2 className="w-12 h-12 text-muted-foreground" strokeWidth={1.5} />
        <h2 className="text-xl font-bold text-foreground">Iniciá sesión para ver tu dashboard</h2>
        <Button asChild>
          <Link to="/">Ir al inicio</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-5 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[28px] lg:text-[34px] font-extrabold text-foreground tracking-tight">
            Mis salones<span className="text-primary">.</span>
          </h1>
          <p className="text-muted-foreground mt-1">
            Gestioná tus espacios y las reservas recibidas
          </p>
        </div>
        <Button asChild className="gap-2 hidden sm:flex">
          <Link to="/host/create">
            <Plus className="w-4 h-4" strokeWidth={1.5} />
            Nuevo salón
          </Link>
        </Button>
      </div>

      {isLoading && (
        <div className="space-y-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-[20px]" />
          ))}
        </div>
      )}

      {!isLoading && salones.length === 0 && (
        <div className="flex flex-col items-center gap-4 py-20 text-center">
          <Building2 className="w-12 h-12 text-muted-foreground" strokeWidth={1.5} />
          <p className="text-[17px] font-semibold text-foreground">Todavía no tenés salones publicados</p>
          <p className="text-muted-foreground text-sm">Publicá tu primer salón y empezá a recibir reservas</p>
          <Button asChild className="gap-2 mt-2">
            <Link to="/host/create">
              <Plus className="w-4 h-4" strokeWidth={1.5} />
              Publicar mi salón
            </Link>
          </Button>
        </div>
      )}

      {!isLoading && salones.length > 0 && (
        <div className="space-y-6">
          {salones.map((salon) => (
            <SalonRow
              key={salon.id}
              salon={salon}
              bookings={bookingsForSalon(salon.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
