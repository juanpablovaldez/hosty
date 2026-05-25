import { createFileRoute } from '@tanstack/react-router'
import { MyBookingsPage } from '@/features/bookings/components/MyBookingsPage'

export const Route = createFileRoute('/mis-reservas')({
  component: MyBookingsPage,
})
