import { createFileRoute } from '@tanstack/react-router'
import { BookingDetailPage } from '@/features/host/components/BookingDetailPage'
import { requireAuth } from '@/features/auth/lib/auth'

export const Route = createFileRoute('/host/$bookingId')({
  beforeLoad: ({ location }) => requireAuth(location),
  component: function BookingRoute() {
    const { bookingId } = Route.useParams()
    return <BookingDetailPage bookingId={bookingId} />
  },
})
