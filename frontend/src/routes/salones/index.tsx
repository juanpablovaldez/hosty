import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { SalonesPage } from '@/features/salones/components/SalonesPage'

const searchSchema = z.object({
  location: z.string().optional(),
  date: z.string().optional(),
  capacity: z.coerce.number().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  eventTypes: z.array(z.string()).optional(),
  amenities: z.array(z.string()).optional(),
  availability: z.enum(['disponible', 'reservado', 'no disponible']).optional(),
})

export const Route = createFileRoute('/salones/')({
  validateSearch: searchSchema,
  component: SalonesPage,
})
