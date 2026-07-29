import { describe, it, expect } from 'vitest'
import { formatARS, salonPriceDisplay } from './pricing'

describe('formatARS', () => {
  it('formatea número como moneda ARS sin decimales', () => {
    const result = formatARS(50000)
    expect(result).toMatch(/50\.000/)
    expect(result).toMatch(/\$/)
  })

  it('formatea cero', () => {
    expect(formatARS(0)).toMatch(/0/)
  })

  it('formatea números grandes con separador de miles', () => {
    expect(formatARS(1500000)).toMatch(/1\.500\.000/)
  })
})

describe('salonPriceDisplay', () => {
  const base = { priceType: 'on_request' as const, pricePerHour: null, priceMin: null, priceMax: null }

  describe('on_request', () => {
    it('devuelve "A consultar" sin label ni suffix', () => {
      const result = salonPriceDisplay({ ...base, priceType: 'on_request' })
      expect(result.main).toBe('A consultar')
      expect(result.label).toBeNull()
      expect(result.suffix).toBeNull()
    })
  })

  describe('fixed', () => {
    it('con pricePerHour → label "desde", main con monto, suffix "/ hora"', () => {
      const result = salonPriceDisplay({ ...base, priceType: 'fixed', pricePerHour: 30000 })
      expect(result.label).toBe('desde')
      expect(result.main).toMatch(/30\.000/)
      expect(result.suffix).toBe('/ hora')
    })

    it('sin pricePerHour → "A consultar"', () => {
      const result = salonPriceDisplay({ ...base, priceType: 'fixed', pricePerHour: null })
      expect(result.main).toBe('A consultar')
      expect(result.label).toBeNull()
    })
  })

  describe('estimated', () => {
    it('con priceMin y priceMax → rango con label "estimado"', () => {
      const result = salonPriceDisplay({ ...base, priceType: 'estimated', priceMin: 10000, priceMax: 20000 })
      expect(result.label).toBe('estimado')
      expect(result.main).toMatch(/10\.000/)
      expect(result.main).toMatch(/20\.000/)
      expect(result.suffix).toBeNull()
    })

    it('solo priceMin → label "estimado · desde"', () => {
      const result = salonPriceDisplay({ ...base, priceType: 'estimated', priceMin: 15000, priceMax: null })
      expect(result.label).toBe('estimado · desde')
      expect(result.main).toMatch(/15\.000/)
    })

    it('sin priceMin ni priceMax → "A consultar"', () => {
      const result = salonPriceDisplay({ ...base, priceType: 'estimated', priceMin: null, priceMax: null })
      expect(result.main).toBe('A consultar')
    })
  })
})
