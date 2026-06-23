import { salonPriceDisplay } from '@/features/salones/lib/pricing'

describe('TC-U01 | salonPriceDisplay', () => {
  it('devuelve "A consultar" cuando el tipo de precio es on_request', () => {
    const result = salonPriceDisplay({
      priceType: 'on_request',
      pricePerHour: null,
      priceMin: null,
      priceMax: null,
    })

    expect(result.main).toBe('A consultar')
    expect(result.label).toBeNull()
    expect(result.suffix).toBeNull()
  })

  it('devuelve precio por hora formateado con label "desde" cuando el tipo es fixed', () => {
    const result = salonPriceDisplay({
      priceType: 'fixed',
      pricePerHour: 15000,
      priceMin: null,
      priceMax: null,
    })

    expect(result.label).toBe('desde')
    expect(result.main).toContain('15.000')
    expect(result.suffix).toBe('/ hora')
  })
})
