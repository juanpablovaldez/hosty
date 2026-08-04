import type { PriceType, SalonService } from '@/features/salones/lib/pricing'

export function calcHours(start: string, end: string): number {
  if (!start || !end) return 0
  const [sh, sm] = start.split(':').map(Number)
  const [eh, em] = end.split(':').map(Number)
  let diff = eh * 60 + em - (sh * 60 + sm)
  if (diff < 0) diff += 24 * 60 // la reserva cruza la medianoche (ej. 22:00 → 03:00)
  return diff / 60
}

interface BookingPricingFields {
  priceType: PriceType
  pricePerHour: number | null
}

export interface BookingTotal {
  base: number | null
  extrasSum: number
  extrasPriced: boolean
  totalPrice: number | null
}

export function calcBookingTotal(
  salon: BookingPricingFields | null | undefined,
  hours: number,
  chosenServices: SalonService[],
): BookingTotal {
  const base = salon && salon.priceType === 'fixed' && salon.pricePerHour != null
    ? salon.pricePerHour * hours
    : null
  const extrasPriced = chosenServices.every((s) => s.price != null)
  const extrasSum = chosenServices.reduce((acc, s) => acc + (s.price ?? 0), 0)
  const totalPrice = base != null && extrasPriced ? base + extrasSum : null

  return { base, extrasSum, extrasPriced, totalPrice }
}
