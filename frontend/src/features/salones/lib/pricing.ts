export type PriceType = 'fixed' | 'estimated' | 'on_request'

export interface SalonService {
  id?: string
  name: string
  price: number | null // null = a consultar
}

export function formatARS(value: number): string {
  return value.toLocaleString('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  })
}

export interface PriceDisplay {
  label: string | null
  main: string
  suffix: string | null
}

interface PricingFields {
  priceType: PriceType
  pricePerHour: number | null
  priceMin: number | null
  priceMax: number | null
}

export function salonPriceDisplay(salon: PricingFields): PriceDisplay {
  if (salon.priceType === 'on_request') {
    return { label: null, main: 'A consultar', suffix: null }
  }
  if (salon.priceType === 'estimated') {
    if (salon.priceMin != null && salon.priceMax != null) {
      return { label: 'estimado', main: `${formatARS(salon.priceMin)} – ${formatARS(salon.priceMax)}`, suffix: null }
    }
    if (salon.priceMin != null) {
      return { label: 'estimado · desde', main: formatARS(salon.priceMin), suffix: null }
    }
    return { label: null, main: 'A consultar', suffix: null }
  }
  return salon.pricePerHour != null
    ? { label: 'desde', main: formatARS(salon.pricePerHour), suffix: '/ hora' }
    : { label: null, main: 'A consultar', suffix: null }
}
