import type { PriceType, SalonService } from './lib/pricing'

export interface Salon {
  id: string
  name: string
  description: string | null
  images: string[]
  priceType: PriceType
  pricePerHour: number | null
  priceMin: number | null
  priceMax: number | null
  services: SalonService[]
  rating: { value: number; count: number } | null
  capacity: number
  location: string
  address: string
  latitude: number | null
  longitude: number | null
  isVerified: boolean
  isFeatured: boolean
  rentTimeHours: number
  isFavorite: boolean
  amenities: string[]
  availabilityStatus: 'disponible' | 'reservado' | 'no disponible'
  eventTypes: string[]
}

export interface SalonSearchParams {
  location?: string
  date?: string
  capacity?: number
  minPrice?: number
  maxPrice?: number
  eventTypes?: string[]
  amenities?: string[]
  availability?: 'disponible' | 'reservado' | 'no disponible'
  // Paginación server-side
  page?: number
  pageSize?: number
  // Filtros adicionales (server-side)
  name?: string
  locations?: string[]
  sortBy?: 'rating' | 'price_asc' | 'price_desc' | 'capacity'
}

export interface PaginatedSalones {
  salones: Salon[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}
