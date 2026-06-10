import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { useAuthStore } from '@/features/auth/store/auth.store'
import { useHostSalones, useHostBookings, useSalonBlocks } from '../api/host.queries'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Building2, Plus } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import type { Booking } from '../types'
import { ResumenView } from './ResumenView'
import { ReservasView } from './ReservasView'
import { SalonRow } from './SalonRow'
import { CalendarioView } from './CalendarioView'
import { BookingDrawer } from './BookingDrawer'

type Tab = 'resumen' | 'reservas' | 'salones' | 'calendario'

function hostNameFromEmail(email: string | undefined): string {
  if (!email) return 'host'
  const local = email.split('@')[0]
  return local.charAt(0).toUpperCase() + local.slice(1)
}

export function HostDashboardPage() {
  const user = useAuthStore((s) => s.user)
  const [tab, setTab] = useState<Tab>('resumen')
  const [selected, setSelected] = useState<Booking | null>(null)

  const { data: salones = [], isLoading: loadingSalones } = useHostSalones(user?.id ?? null)
  const salonIds = salones.map((s) => s.id)
  const { data: bookings = [], isLoading: loadingBookings } = useHostBookings(salonIds)
  const { data: blocks = [] } = useSalonBlocks(salonIds)

  const isLoading = loadingSalones || (salonIds.length > 0 && loadingBookings)
  const pendingCount = bookings.filter((b) => b.status === 'pending').length
  const salonNameById = new Map(salones.map((s) => [s.id, s.name]))

  const selectedLive = selected ? (bookings.find((b) => b.id === selected.id) ?? selected) : null

  const tabs: { id: Tab; label: string; count?: number }[] = [
    { id: 'resumen', label: 'Resumen' },
    { id: 'reservas', label: 'Reservas', count: pendingCount },
    { id: 'salones', label: 'Mis salones' },
    { id: 'calendario', label: 'Calendario' },
  ]

  return (
    <div className="max-w-5xl mx-auto px-5 lg:px-8 py-10">
      <div className="flex items-end justify-between gap-4 flex-wrap mb-8">
        <div>
          <h1 className="text-[28px] lg:text-[34px] font-extrabold text-foreground tracking-tight">
            Hola, {hostNameFromEmail(user?.email)}<span className="text-primary">.</span>
          </h1>
          <p className="text-muted-foreground mt-1">Gestioná tus espacios y las reservas recibidas.</p>
        </div>
        <Button asChild className="gap-2">
          <Link to="/host/create">
            <Plus className="w-4 h-4" strokeWidth={1.5} />
            Nuevo salón
          </Link>
        </Button>
      </div>

      <nav className="flex gap-1.5 mb-9 border-b border-border overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              'relative whitespace-nowrap px-4 pb-3 pt-2.5 text-[14.5px] font-semibold transition-colors',
              tab === t.id ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {t.label}
            {t.count ? (
              <span className="ml-1.5 rounded-full bg-primary text-primary-foreground text-[11px] font-bold px-1.5 py-0.5 align-middle">
                {t.count}
              </span>
            ) : null}
            {tab === t.id && (
              <span className="absolute bottom-[-1px] left-3.5 right-3.5 h-[2.5px] rounded-sm bg-primary" />
            )}
          </button>
        ))}
      </nav>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-[20px]" />
          ))}
        </div>
      ) : salones.length === 0 ? (
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
      ) : (
        <>
          {tab === 'resumen' && (
            <ResumenView
              salones={salones}
              bookings={bookings}
              onGoToReservas={() => setTab('reservas')}
              onGoToSalones={() => setTab('salones')}
              onOpen={setSelected}
            />
          )}

          {tab === 'reservas' && (
            <ReservasView salones={salones} bookings={bookings} onOpen={setSelected} />
          )}

          {tab === 'salones' && (
            <div className="space-y-4">
              {salones.map((salon) => (
                <SalonRow
                  key={salon.id}
                  salon={salon}
                  bookings={bookings.filter((b) => b.salonId === salon.id)}
                  onOpen={setSelected}
                />
              ))}
            </div>
          )}

          {tab === 'calendario' && (
            <CalendarioView salones={salones} bookings={bookings} onOpen={setSelected} />
          )}
        </>
      )}

      <BookingDrawer
        booking={selectedLive}
        salonName={selectedLive ? (salonNameById.get(selectedLive.salonId) ?? '') : ''}
        allBookings={bookings}
        blocks={blocks}
        onClose={() => setSelected(null)}
      />
    </div>
  )
}
