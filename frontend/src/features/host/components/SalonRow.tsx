import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { toast } from 'sonner'
import { Building2, MapPin, ChevronRight, Pencil, Pause, Play, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog'
import { cn } from '@/shared/lib/utils'
import type { Salon } from '@/features/salones/types'
import type { Booking } from '../types'
import { useAuthStore } from '@/features/auth/store/auth.store'
import { useUpdateSalonAvailability, useDeleteSalon } from '../api/host.mutations'
import { BookingCard } from './BookingCard'

export function SalonRow({
  salon,
  bookings,
  onOpen,
}: {
  salon: Salon
  bookings: Booking[]
  onOpen?: (booking: Booking) => void
}) {
  const [open, setOpen] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const user = useAuthStore((s) => s.user)
  const updateAvailability = useUpdateSalonAvailability()
  const deleteSalon = useDeleteSalon()
  const pending = bookings.filter((b) => b.status === 'pending').length
  const cover = salon.images[0] ?? null
  const isPaused = salon.availabilityStatus !== 'disponible'

  function toggleAvailability() {
    if (!user) return
    updateAvailability.mutate(
      { id: salon.id, userId: user.id, availabilityStatus: isPaused ? 'disponible' : 'no disponible' },
      {
        onSuccess: () => toast.success(isPaused ? 'Salón activado' : 'Salón pausado'),
        onError: () => toast.error('No se pudo actualizar el salón'),
      },
    )
  }

  function handleDelete() {
    if (!user) return
    deleteSalon.mutate(
      { id: salon.id, userId: user.id },
      {
        onSuccess: () => { toast.success('Salón eliminado'); setConfirmDelete(false) },
        onError: () => toast.error('No se pudo eliminar el salón'),
      },
    )
  }

  return (
    <div className="rounded-[20px] border border-border bg-card overflow-hidden shadow-[0_1px_3px_rgba(28,43,58,0.06)]">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-4 p-5 text-left transition hover:bg-muted/40"
      >
        {cover ? (
          <img src={cover} alt={salon.name} className="w-16 h-16 rounded-xl object-cover shrink-0" />
        ) : (
          <div className="w-16 h-16 rounded-xl bg-muted shrink-0 flex items-center justify-center">
            <Building2 className="w-7 h-7 text-muted-foreground" strokeWidth={1.5} />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-bold text-[17px] text-foreground truncate">{salon.name}</h3>
            {salon.isVerified && <Badge variant="secondary" className="text-xs shrink-0">Verificado</Badge>}
            {isPaused && <Badge variant="outline" className="text-xs shrink-0 text-muted-foreground">Pausado</Badge>}
          </div>
          <p className="text-[13px] text-muted-foreground flex items-center gap-1.5 mt-1">
            <MapPin className="w-3.5 h-3.5" strokeWidth={1.5} />
            {salon.location} · hasta {salon.capacity} personas
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {pending > 0 && (
            <span className="bg-primary text-primary-foreground text-[11px] font-bold rounded-full px-2.5 py-1">
              {pending} pendiente{pending > 1 ? 's' : ''}
            </span>
          )}
          <ChevronRight
            className={cn('w-5 h-5 text-muted-foreground transition-transform duration-200', open && 'rotate-90')}
            strokeWidth={1.5}
          />
        </div>
      </button>

      {open && (
        <div className="border-t border-border px-5 pb-5 pt-4">
          <div className="flex flex-wrap items-center justify-end gap-x-4 gap-y-2 mb-4">
            <button
              type="button"
              onClick={toggleAvailability}
              disabled={updateAvailability.isPending}
              className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-muted-foreground hover:text-foreground transition"
            >
              {isPaused
                ? <><Play className="w-3.5 h-3.5" strokeWidth={1.5} /> Activar</>
                : <><Pause className="w-3.5 h-3.5" strokeWidth={1.5} /> Pausar</>}
            </button>
            <Link
              to="/host/$id/edit"
              params={{ id: salon.id }}
              className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-muted-foreground hover:text-foreground transition"
            >
              <Pencil className="w-3.5 h-3.5" strokeWidth={1.5} />
              Editar
            </Link>
            <Link
              to="/salones/$id"
              params={{ id: salon.id }}
              className="inline-flex items-center gap-1 text-[13px] font-semibold text-primary hover:text-primary/80 transition"
            >
              Ver publicación
              <ChevronRight className="w-3.5 h-3.5" strokeWidth={1.5} />
            </Link>
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-destructive hover:text-destructive/80 transition"
            >
              <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
              Eliminar
            </button>
          </div>

          {bookings.length > 0 ? (
            <div className="grid sm:grid-cols-2 gap-3">
              {bookings.map((b) => (
                <BookingCard key={b.id} booking={b} salonName={salon.name} onOpen={onOpen} />
              ))}
            </div>
          ) : (
            <p className="text-[13px] text-muted-foreground">Sin reservas todavía.</p>
          )}
        </div>
      )}

      <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar salón</DialogTitle>
            <DialogDescription>
              ¿Seguro que querés eliminar “{salon.name}”? Esta acción no se puede deshacer y se borrarán también sus reservas.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDelete(false)} disabled={deleteSalon.isPending}>
              Cancelar
            </Button>
            <Button
              onClick={handleDelete}
              disabled={deleteSalon.isPending}
              className="gap-1.5 bg-destructive text-white hover:bg-destructive/90"
            >
              <Trash2 className="w-4 h-4" strokeWidth={1.5} />
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
