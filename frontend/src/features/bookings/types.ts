export type BookingStatus = 'pending' | 'confirmed' | 'cancelled'

export interface BookingFormData {
  eventDate: string
  startTime: string
  endTime: string
  attendees: number
  eventType: string
  notes: string
}

export interface BookingPayload extends BookingFormData {
  salonId: string
  userId: string
  totalPrice: number
}

export interface Booking {
  id: string
  salonId: string
  salonName: string
  salonImage: string
  userId: string
  eventDate: string
  startTime: string
  endTime: string
  attendees: number
  eventType: string
  notes: string | null
  totalPrice: number
  status: BookingStatus
  createdAt: string
}
