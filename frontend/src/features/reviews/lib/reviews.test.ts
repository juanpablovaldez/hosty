import { describe, it, expect } from 'vitest'
import {
  localToday,
  isBookingReviewable,
  averageRating,
  ratingDistribution,
} from './reviews'

describe('localToday', () => {
  it('usa la fecha local y no la de UTC', () => {
    // 23:30 del 5 de diciembre en Argentina (UTC-3) ya es 6 de diciembre en UTC.
    const nocheDelCinco = new Date(2026, 11, 5, 23, 30)
    expect(localToday(nocheDelCinco)).toBe('2026-12-05')
  })

  it('completa mes y día con cero a la izquierda', () => {
    expect(localToday(new Date(2026, 0, 9))).toBe('2026-01-09')
  })
})

describe('isBookingReviewable', () => {
  it('habilita la reseña de una reserva confirmada cuya fecha ya pasó', () => {
    expect(isBookingReviewable({ status: 'confirmed', eventDate: '2026-12-04' }, '2026-12-05')).toBe(true)
  })

  it('no habilita la reseña el mismo día del evento', () => {
    expect(isBookingReviewable({ status: 'confirmed', eventDate: '2026-12-05' }, '2026-12-05')).toBe(false)
  })

  it('no habilita la reseña de un evento futuro', () => {
    expect(isBookingReviewable({ status: 'confirmed', eventDate: '2026-12-20' }, '2026-12-05')).toBe(false)
  })

  it.each(['pending', 'declined', 'cancelled'])(
    'no habilita la reseña de una reserva en estado %s aunque la fecha haya pasado',
    (status) => {
      expect(isBookingReviewable({ status, eventDate: '2026-12-04' }, '2026-12-05')).toBe(false)
    },
  )
})

describe('averageRating', () => {
  it('devuelve null cuando no hay reseñas', () => {
    expect(averageRating([])).toBeNull()
  })

  it('promedia y redondea a dos decimales', () => {
    expect(averageRating([{ rating: 5 }, { rating: 4 }, { rating: 4 }])).toBe(4.33)
  })

  it('devuelve el mismo puntaje cuando hay una sola reseña', () => {
    expect(averageRating([{ rating: 3 }])).toBe(3)
  })
})

describe('ratingDistribution', () => {
  it('cuenta cuántas reseñas hay por cada puntaje', () => {
    const reviews = [{ rating: 5 }, { rating: 5 }, { rating: 3 }, { rating: 1 }]
    expect(ratingDistribution(reviews)).toEqual({ 1: 1, 2: 0, 3: 1, 4: 0, 5: 2 })
  })

  it('devuelve todos los puntajes en cero cuando no hay reseñas', () => {
    expect(ratingDistribution([])).toEqual({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 })
  })
})
