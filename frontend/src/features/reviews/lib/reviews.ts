import type { Review } from '../types'

export const RATING_LABELS: Record<number, string> = {
  1: 'Muy malo',
  2: 'Malo',
  3: 'Regular',
  4: 'Bueno',
  5: 'Excelente',
}

// `toISOString()` devuelve la fecha en UTC: en Argentina (UTC-3) a partir de las
// 21:00 ya informa el día siguiente, y una reserva de hoy pasaría por vencida.
export function localToday(date: Date = new Date()): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

interface ReviewableBooking {
  status: string
  eventDate: string
}

// Réplica exacta de la regla que aplica RLS en `can_review_booking`: acá sólo
// decide si se muestra el botón, la base es la que valida de verdad.
export function isBookingReviewable(
  booking: ReviewableBooking,
  today: string = localToday(),
): boolean {
  return booking.status === 'confirmed' && booking.eventDate < today
}

export function averageRating(reviews: Pick<Review, 'rating'>[]): number | null {
  if (reviews.length === 0) return null
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0)
  return Math.round((sum / reviews.length) * 100) / 100
}

export function ratingDistribution(
  reviews: Pick<Review, 'rating'>[],
): Record<number, number> {
  const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  for (const review of reviews) {
    if (review.rating >= 1 && review.rating <= 5) {
      distribution[review.rating] += 1
    }
  }
  return distribution
}

export function formatReviewDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-AR', { month: 'long', year: 'numeric' })
}
