import { describe, it, expect } from 'vitest'
import { calcHours, calcBookingTotal } from './booking-pricing'

describe('calcHours', () => {
  it('calcula la diferencia en horas dentro del mismo día', () => {
    expect(calcHours('14:00', '18:00')).toBe(4)
  })

  it('calcula fracciones de hora', () => {
    expect(calcHours('14:00', '15:30')).toBe(1.5)
  })

  it('cruza la medianoche sumando 24h', () => {
    expect(calcHours('22:00', '03:00')).toBe(5)
  })

  it('devuelve 0 si falta la hora de inicio o de fin', () => {
    expect(calcHours('', '18:00')).toBe(0)
    expect(calcHours('14:00', '')).toBe(0)
    expect(calcHours('', '')).toBe(0)
  })

  it('devuelve 0 cuando inicio y fin son iguales', () => {
    expect(calcHours('14:00', '14:00')).toBe(0)
  })
})

describe('calcBookingTotal', () => {
  const fixedSalon = { priceType: 'fixed' as const, pricePerHour: 20000 }

  it('calcula el total para un salón de precio fijo sin extras', () => {
    const result = calcBookingTotal(fixedSalon, 6, [])
    expect(result.base).toBe(120000)
    expect(result.extrasSum).toBe(0)
    expect(result.extrasPriced).toBe(true)
    expect(result.totalPrice).toBe(120000)
  })

  it('suma los extras con precio al total', () => {
    const services = [
      { name: 'DJ', price: 15000 },
      { name: 'Catering', price: 25000 },
    ]
    const result = calcBookingTotal(fixedSalon, 6, services)
    expect(result.extrasSum).toBe(40000)
    expect(result.totalPrice).toBe(160000)
  })

  it('totalPrice es null si algún extra elegido no tiene precio', () => {
    const services = [
      { name: 'DJ', price: 15000 },
      { name: 'Decoración a medida', price: null },
    ]
    const result = calcBookingTotal(fixedSalon, 6, services)
    expect(result.extrasPriced).toBe(false)
    expect(result.totalPrice).toBeNull()
  })

  it('base es null para salones "estimated" u "on_request"', () => {
    expect(calcBookingTotal({ priceType: 'estimated', pricePerHour: null }, 4, []).base).toBeNull()
    expect(calcBookingTotal({ priceType: 'on_request', pricePerHour: null }, 4, []).base).toBeNull()
  })

  it('totalPrice es null cuando no hay salón', () => {
    const result = calcBookingTotal(null, 4, [])
    expect(result.base).toBeNull()
    expect(result.totalPrice).toBeNull()
  })

  it('sin servicios elegidos, extrasPriced es true por vacuidad y no afecta el total', () => {
    const result = calcBookingTotal(fixedSalon, 3, [])
    expect(result.extrasPriced).toBe(true)
    expect(result.totalPrice).toBe(60000)
  })
})
