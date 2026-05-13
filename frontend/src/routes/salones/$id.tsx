import { createFileRoute } from '@tanstack/react-router'
import { SalonDetailPage } from '@/features/salones/components/SalonDetailPage'

export const Route = createFileRoute('/salones/$id')({
  component: SalonDetailPage,
})
