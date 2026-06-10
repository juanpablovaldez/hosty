import type { SalonService } from '@/features/salones/lib/pricing'

export interface Booking {
  id: string
  salonId: string
  userId: string
  eventDate: string
  startTime: string
  endTime: string
  attendees: number
  eventType: string
  notes: string | null
  totalPrice: number | null
  quotedPrice: number | null
  selectedServices: SalonService[]
  status: 'pending' | 'confirmed' | 'declined' | 'cancelled'
  rejectionReason: string | null
  contactName: string | null
  contactPhone: string | null
  createdAt: string
}
