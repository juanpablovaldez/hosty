import { createFileRoute } from '@tanstack/react-router'
import { MyBookingsPage } from '@/features/bookings/components/MyBookingsPage'
import { requireAuth } from '@/features/auth/lib/auth'

export const Route = createFileRoute('/mis-reservas')({
  beforeLoad: ({ location }) => requireAuth(location),
  component: MyBookingsPage,
})
