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
  totalPrice: number
  status: 'pending' | 'confirmed' | 'declined' | 'cancelled'
  createdAt: string
}
