export interface Salon {
    name: string
    image: string
    price: number
    rating?: number;
    capacity: number
    location: string
    isVerified: boolean
    rentTime: number
    isFavorite: boolean
    amenities: string[]
    availabilityStatus: 'disponible' | 'reservado' | 'no disponible'
    eventType: string[]
}