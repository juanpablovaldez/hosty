import { createFileRoute } from '@tanstack/react-router'
import { HostDashboardPage } from '@/features/host/components/HostDashboardPage'
import { requireAuth } from '@/features/auth/lib/auth'

export const Route = createFileRoute('/host/dashboard')({
  beforeLoad: ({ location }) => requireAuth(location),
  component: HostDashboardPage,
})
