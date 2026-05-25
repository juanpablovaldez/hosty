import { createFileRoute } from '@tanstack/react-router'
import { BookingFlow } from '@/features/bookings/components/BookingFlow'
import { requireAuth } from '@/features/auth/lib/auth'

export const Route = createFileRoute('/salones/$id_/reservar')({
  beforeLoad: ({ location }) => requireAuth(location),
  component: BookingFlow,
})
