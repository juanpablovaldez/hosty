import { effectivePrice, formatBookingPrice } from '@/features/host/lib/booking-status'

describe('TC-U02 | effectivePrice y formatBookingPrice', () => {
  it('effectivePrice: prioriza quotedPrice sobre totalPrice cuando ambos tienen valor', () => {
    const result = effectivePrice({ totalPrice: 5000, quotedPrice: 7500 })

    expect(result).toBe(7500)
  })

  it('formatBookingPrice: devuelve "A consultar" cuando totalPrice y quotedPrice son null', () => {
    const result = formatBookingPrice({ totalPrice: null, quotedPrice: null })

    expect(result).toBe('A consultar')
  })
})
