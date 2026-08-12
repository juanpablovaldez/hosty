import { describe, it, expect } from 'vitest'
import {
  timesOverlap,
  busySlotsForDate,
  findBookingConflict,
  formatSlotRange,
  type BusySlot,
} from './booking-availability'

const slot = (eventDate: string, startTime: string, endTime: string): BusySlot => ({
  eventDate,
  startTime,
  endTime,
})

describe('timesOverlap', () => {
  it('detecta un solapamiento parcial por delante', () => {
    expect(timesOverlap('09:00', '11:00', '10:00', '12:00')).toBe(true)
  })

  it('detecta un solapamiento parcial por detrás', () => {
    expect(timesOverlap('11:00', '13:00', '10:00', '12:00')).toBe(true)
  })

  it('detecta un rango contenido dentro de otro', () => {
    expect(timesOverlap('10:30', '11:00', '10:00', '12:00')).toBe(true)
  })

  it('detecta un rango que contiene a otro', () => {
    expect(timesOverlap('09:00', '13:00', '10:00', '12:00')).toBe(true)
  })

  it('no considera solapamiento cuando una reserva termina justo donde arranca la otra', () => {
    expect(timesOverlap('08:00', '10:00', '10:00', '12:00')).toBe(false)
    expect(timesOverlap('12:00', '14:00', '10:00', '12:00')).toBe(false)
  })

  it('no considera solapamiento entre rangos separados', () => {
    expect(timesOverlap('08:00', '09:00', '10:00', '12:00')).toBe(false)
  })

  it('compara por minutos, no por texto', () => {
    expect(timesOverlap('09:30', '10:30', '10:00', '12:00')).toBe(true)
    expect(timesOverlap('09:00', '09:30', '09:30', '12:00')).toBe(false)
  })
})

describe('busySlotsForDate', () => {
  const busy = [
    slot('2026-12-05', '18:00', '23:00'),
    slot('2026-12-04', '10:00', '12:00'),
    slot('2026-12-05', '09:00', '11:00'),
  ]

  it('filtra por fecha y ordena por hora de inicio', () => {
    expect(busySlotsForDate(busy, '2026-12-05')).toEqual([
      slot('2026-12-05', '09:00', '11:00'),
      slot('2026-12-05', '18:00', '23:00'),
    ])
  })

  it('devuelve una lista vacía para una fecha sin reservas', () => {
    expect(busySlotsForDate(busy, '2026-12-31')).toEqual([])
  })
})

describe('findBookingConflict', () => {
  const busy = [slot('2026-12-05', '10:00', '14:00')]

  it('devuelve la reserva que se superpone', () => {
    expect(findBookingConflict(slot('2026-12-05', '12:00', '16:00'), busy)).toEqual(busy[0])
  })

  it('devuelve null cuando el horario está libre ese día', () => {
    expect(findBookingConflict(slot('2026-12-05', '15:00', '18:00'), busy)).toBeNull()
  })

  it('ignora las reservas de otras fechas', () => {
    expect(findBookingConflict(slot('2026-12-06', '10:00', '14:00'), busy)).toBeNull()
  })

  it('devuelve null si el formulario todavía está incompleto', () => {
    expect(findBookingConflict(slot('', '10:00', '14:00'), busy)).toBeNull()
    expect(findBookingConflict(slot('2026-12-05', '', ''), busy)).toBeNull()
  })

  it('devuelve null cuando el salón no tiene reservas confirmadas', () => {
    expect(findBookingConflict(slot('2026-12-05', '10:00', '14:00'), [])).toBeNull()
  })
})

describe('formatSlotRange', () => {
  it('muestra el rango sin los segundos que devuelve Postgres', () => {
    expect(formatSlotRange(slot('2026-12-05', '10:00:00', '14:30:00'))).toBe('10:00 a 14:30')
  })
})
