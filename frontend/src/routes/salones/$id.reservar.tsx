import { createFileRoute } from '@tanstack/react-router'
import { BookingFlow } from '@/features/bookings/components/BookingFlow'

export const Route = createFileRoute('/salones/$id/reservar')({
  component: BookingFlow,
})
