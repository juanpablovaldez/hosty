import type { SalonService } from '@/features/salones/lib/pricing'

export type BookingStatus = 'pending' | 'confirmed' | 'declined' | 'cancelled'

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
  contactName: string
  contactPhone: string
  selectedServices: SalonService[]
  totalPrice: number | null
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
  totalPrice: number | null
  status: BookingStatus
  createdAt: string
}
