import { formatARS } from '@/features/salones/lib/pricing'
import type { Booking } from '../types'

export const STATUS_STYLES: Record<Booking['status'], string> = {
  pending: 'bg-amber-light text-amber-dark dark:bg-amber/15 dark:text-amber',
  confirmed: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
  declined: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
  cancelled: 'bg-muted text-muted-foreground',
}

export const STATUS_LABELS: Record<Booking['status'], string> = {
  pending: 'Pendiente',
  confirmed: 'Confirmada',
  declined: 'Rechazada',
  cancelled: 'Cancelada',
}

export function effectivePrice(booking: Pick<Booking, 'totalPrice' | 'quotedPrice'>): number | null {
  return booking.quotedPrice ?? booking.totalPrice
}

export function formatBookingPrice(booking: Pick<Booking, 'totalPrice' | 'quotedPrice'>): string {
  const price = effectivePrice(booking)
  return price != null ? formatARS(price) : 'A consultar'
}
