import { createFileRoute } from '@tanstack/react-router'
import { CreateSalonPage } from '@/features/host/components/CreateSalonPage'
import { requireAuth } from '@/features/auth/lib/auth'

export const Route = createFileRoute('/host/create')({
  beforeLoad: ({ location }) => requireAuth(location),
  component: CreateSalonPage,
})
