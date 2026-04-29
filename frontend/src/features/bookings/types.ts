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
