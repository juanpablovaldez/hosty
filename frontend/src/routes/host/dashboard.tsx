import { createFileRoute } from '@tanstack/react-router'
import { HostDashboardPage } from '@/features/host/components/HostDashboardPage'

export const Route = createFileRoute('/host/dashboard')({
  component: HostDashboardPage,
})
