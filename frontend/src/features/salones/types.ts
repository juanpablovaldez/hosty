export interface Salon {
  id: string
  name: string
  description: string | null
  images: string[]
  pricePerHour: number
  rating: { value: number; count: number } | null
  capacity: number
  location: string
  address: string
  isVerified: boolean
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
}
