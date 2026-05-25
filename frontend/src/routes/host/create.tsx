import { createFileRoute } from '@tanstack/react-router'
import { CreateSalonPage } from '@/features/host/components/CreateSalonPage'

export const Route = createFileRoute('/host/create')({
  component: CreateSalonPage,
})
