import { useState, useEffect, useMemo } from 'react'
import { Link } from '@tanstack/react-router'
import { toast } from 'sonner'
import { supabase } from '@/shared/lib/supabase'
import { useMyBookings } from '../api/bookings.queries'
import { useCancelBooking } from '../api/bookings.mutations'
import type { Booking, BookingStatus } from '../types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Calendar,
  Clock,
  Users,
  MapPin,
  LogIn,
  CalendarX2,
  PartyPopper,
  XCircle,
  ClipboardList,
  AlertTriangle,
} from 'lucide-react'
import { cn } from '@/shared/lib/utils'

const IS_DEV = import.meta.env.DEV

const DEV_MOCK_BOOKINGS: Booking[] = [
  {
    id: 'mock-1',
    salonId: 'mock-salon-1',
    salonName: 'Salón Aurora — Yerba Buena',
    salonImage: '',
    userId: 'dev-user',
    eventDate: '2026-06-15',
    startTime: '18:00',
    endTime: '23:00',
    attendees: 80,
    eventType: 'Casamiento',
    notes: 'Decoración con flores blancas. Necesitamos proyector.',
    totalPrice: 250000,
    status: 'pending',
    createdAt: '2026-05-17T10:00:00Z',
  },
  {
    id: 'mock-2',
    salonId: 'mock-salon-2',
    salonName: 'Espacio Jardín del Norte',
    salonImage: '',
    userId: 'dev-user',
    eventDate: '2026-07-20',
    startTime: '20:00',
    endTime: '02:00',
    attendees: 120,
    eventType: 'Cumpleaños',
    notes: null,
    totalPrice: 180000,
    status: 'confirmed',
    createdAt: '2026-05-10T14:30:00Z',
  },
  {
    id: 'mock-3',
    salonId: 'mock-salon-3',
    salonName: 'Terraza Mirador',
    salonImage: '',
    userId: 'dev-user',
    eventDate: '2026-05-10',
    startTime: '15:00',
    endTime: '19:00',
    attendees: 30,
    eventType: 'Corporativo',
    notes: 'Evento cancelado por cambio de fecha.',
    totalPrice: 95000,
    status: 'cancelled',
    createdAt: '2026-04-28T09:00:00Z',
  },
  {
    id: 'mock-4',
    salonId: 'mock-salon-1',
    salonName: 'Salón Aurora — Yerba Buena',
    salonImage: '',
    userId: 'dev-user',
    eventDate: '2026-08-05',
    startTime: '16:00',
    endTime: '21:00',
    attendees: 50,
    eventType: 'Baby shower',
    notes: null,
    totalPrice: 150000,
    status: 'pending',
    createdAt: '2026-05-16T18:00:00Z',
  },
]

type FilterTab = 'all' | BookingStatus

const TABS: { value: FilterTab; label: string }[] = [
  { value: 'all', label: 'Todas' },
  { value: 'pending', label: 'Pendientes' },
  { value: 'confirmed', label: 'Confirmadas' },
  { value: 'cancelled', label: 'Canceladas' },
]

const STATUS_CONFIG: Record<BookingStatus, { label: string; className: string; icon: typeof Calendar }> = {
  pending: {
    label: 'Pendiente',
    className: 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-400',
    icon: Clock,
  },
  confirmed: {
    label: 'Confirmada',
    className: 'border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-400',
    icon: PartyPopper,
  },
  cancelled: {
    label: 'Cancelada',
    className: 'border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400',
    icon: XCircle,
  },
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr + 'T12:00:00')
  return date.toLocaleDateString('es-AR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function BookingCard({ booking, onCancel }: { booking: Booking; onCancel: (b: Booking) => void }) {
  const config = STATUS_CONFIG[booking.status]
  const StatusIcon = config.icon
  const canCancel = booking.status === 'pending' || booking.status === 'confirmed'

  const isPast = new Date(booking.eventDate + 'T23:59:59') < new Date()

  return (
    <div className="group relative overflow-hidden rounded-2xl border bg-card shadow-sm transition-all hover:shadow-md">
      <div className="absolute right-0 top-0 h-32 w-32 -translate-y-8 translate-x-8 rounded-full bg-primary/5 transition-transform group-hover:scale-150" />

      <div className="relative flex flex-col gap-4 p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 flex-col gap-1">
            <Link
              to="/salones/$id"
              params={{ id: booking.salonId }}
              className="truncate text-lg font-semibold text-foreground transition-colors hover:text-primary"
            >
              {booking.salonName}
            </Link>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 flex-shrink-0" strokeWidth={1.5} />
              <span className="truncate">{booking.eventType}</span>
            </div>
          </div>
          <Badge className={cn('flex-shrink-0 gap-1', config.className)}>
            <StatusIcon className="h-3 w-3" strokeWidth={2} />
            {config.label}
          </Badge>
        </div>

        <Separator />

        <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm sm:grid-cols-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
            <div>
              <p className="text-xs text-muted-foreground">Fecha</p>
              <p className="font-medium">{formatDate(booking.eventDate)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
            <div>
              <p className="text-xs text-muted-foreground">Horario</p>
              <p className="font-medium">{booking.startTime} – {booking.endTime}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
            <div>
              <p className="text-xs text-muted-foreground">Asistentes</p>
              <p className="font-medium">{booking.attendees}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex h-4 w-4 items-center justify-center text-sm font-bold text-muted-foreground">$</span>
            <div>
              <p className="text-xs text-muted-foreground">Total</p>
              <p className="font-medium">
                {booking.totalPrice.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 })}
              </p>
            </div>
          </div>
        </div>

        {booking.notes && (
          <p className="rounded-lg bg-muted/50 px-3 py-2 text-sm text-muted-foreground">
            {booking.notes}
          </p>
        )}

        {canCancel && !isPast && (
          <div className="flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onCancel(booking)}
              className="gap-1.5 text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              <XCircle className="h-4 w-4" strokeWidth={1.5} />
              Cancelar reserva
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

function EmptyState({ tab }: { tab: FilterTab }) {
  const messages: Record<FilterTab, { icon: typeof Calendar; title: string; description: string }> = {
    all: {
      icon: ClipboardList,
      title: 'No tenés reservas aún',
      description: 'Explorá nuestros salones y hacé tu primera reserva.',
    },
    pending: {
      icon: Clock,
      title: 'Sin reservas pendientes',
      description: 'Tus reservas pendientes de confirmación aparecerán acá.',
    },
    confirmed: {
      icon: PartyPopper,
      title: 'Sin reservas confirmadas',
      description: 'Cuando un salón confirme tu solicitud, la verás acá.',
    },
    cancelled: {
      icon: CalendarX2,
      title: 'Sin reservas canceladas',
      description: 'Las reservas que canceles aparecerán en esta sección.',
    },
  }

  const { icon: Icon, title, description } = messages[tab]

  return (
    <div className="flex flex-col items-center gap-4 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
        <Icon className="h-8 w-8 text-muted-foreground" strokeWidth={1.5} />
      </div>
      <div>
        <p className="font-semibold text-foreground">{title}</p>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      {tab === 'all' && (
        <Button asChild className="mt-2">
          <Link to="/salones">Explorar salones</Link>
        </Button>
      )}
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="rounded-2xl border bg-card p-6">
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>
          <Skeleton className="mt-4 h-px w-full" />
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[1, 2, 3, 4].map((j) => (
              <Skeleton key={j} className="h-12 w-full" />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export function MyBookingsPage() {
  const [userId, setUserId] = useState<string | null>(null)
  const [authChecked, setAuthChecked] = useState(false)
  const [activeTab, setActiveTab] = useState<FilterTab>('all')
  const [cancelTarget, setCancelTarget] = useState<Booking | null>(null)

  const cancelBooking = useCancelBooking()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null)
      setAuthChecked(true)
    })
  }, [])

  const isDevNoAuth = IS_DEV && authChecked && !userId
  const { data: realBookings, isLoading } = useMyBookings(userId)
  const bookings = isDevNoAuth ? DEV_MOCK_BOOKINGS : realBookings

  const filteredBookings = useMemo(() => {
    if (!bookings) return []
    if (activeTab === 'all') return bookings
    return bookings.filter((b) => b.status === activeTab)
  }, [bookings, activeTab])

  const counts = useMemo(() => {
    if (!bookings) return { all: 0, pending: 0, confirmed: 0, cancelled: 0 }
    return {
      all: bookings.length,
      pending: bookings.filter((b) => b.status === 'pending').length,
      confirmed: bookings.filter((b) => b.status === 'confirmed').length,
      cancelled: bookings.filter((b) => b.status === 'cancelled').length,
    }
  }, [bookings])

  async function handleCancel() {
    if (!cancelTarget) return
    try {
      await cancelBooking.mutateAsync(cancelTarget.id)
      toast.success('Reserva cancelada correctamente.')
      setCancelTarget(null)
    } catch {
      toast.error('No pudimos cancelar la reserva. Intentá de nuevo.')
    }
  }

  if (!authChecked) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-12">
        <Skeleton className="mb-2 h-8 w-48" />
        <Skeleton className="mb-8 h-5 w-72" />
        <LoadingSkeleton />
      </div>
    )
  }

  if (!userId && !isDevNoAuth) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-6 px-6 py-20 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <LogIn className="h-8 w-8 text-primary" strokeWidth={1.5} />
        </div>
        <h2 className="text-xl font-bold text-foreground">Iniciá sesión para ver tus reservas</h2>
        <p className="text-muted-foreground">
          Necesitás una cuenta para acceder a tu panel de reservas.
        </p>
        <Button asChild size="lg" className="w-full gap-2">
          <Link to="/">
            <LogIn className="h-4 w-4" strokeWidth={1.5} />
            Iniciar sesión
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Mis Reservas</h1>
        <p className="mt-1 text-muted-foreground">
          Gestioná y seguí el estado de tus reservas de salones.
        </p>
      </div>

      <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
        {TABS.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            onClick={() => setActiveTab(value)}
            className={cn(
              'flex flex-shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all',
              activeTab === value
                ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                : 'border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground',
            )}
          >
            {label}
            {counts[value] > 0 && (
              <span
                className={cn(
                  'flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-xs font-semibold',
                  activeTab === value
                    ? 'bg-primary-foreground/20 text-primary-foreground'
                    : 'bg-muted text-muted-foreground',
                )}
              >
                {counts[value]}
              </span>
            )}
          </button>
        ))}
      </div>

      {isLoading ? (
        <LoadingSkeleton />
      ) : filteredBookings.length === 0 ? (
        <EmptyState tab={activeTab} />
      ) : (
        <div className="flex flex-col gap-4">
          {filteredBookings.map((booking) => (
            <BookingCard key={booking.id} booking={booking} onCancel={setCancelTarget} />
          ))}
        </div>
      )}

      <Dialog open={cancelTarget !== null} onOpenChange={(open) => !open && setCancelTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" strokeWidth={1.5} />
              Cancelar reserva
            </DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que querés cancelar tu reserva en{' '}
              <span className="font-medium text-foreground">{cancelTarget?.salonName}</span> para el{' '}
              <span className="font-medium text-foreground">{cancelTarget ? formatDate(cancelTarget.eventDate) : ''}</span>?
              Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setCancelTarget(null)}>
              Volver
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancel}
              disabled={cancelBooking.isPending}
            >
              {cancelBooking.isPending ? 'Cancelando...' : 'Sí, cancelar reserva'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
