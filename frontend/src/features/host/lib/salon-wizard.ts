import { z } from 'zod'
import type { SalonService } from '@/features/salones/lib/pricing'

export const EVENT_TYPES = ['Cumpleaños', 'Casamientos', 'Corporativo', 'Egresos', 'Infantiles', 'Baby Shower', 'Quince años']
export const AMENITIES = ['Catering', 'Estacionamiento', 'Climatización', 'Sonido', 'Wi-Fi', 'Iluminación']
export const ZONAS = ['Centro', 'Yerba Buena', 'Tafí Viejo', 'Banda del Río Salí']

export const step1Schema = z.object({
  name: z.string().min(3, 'Mínimo 3 caracteres'),
  description: z.string().min(20, 'Contá un poco más sobre el salón (mínimo 20 caracteres)'),
  location: z.string().min(1, 'Seleccioná una zona'),
  address: z.string().min(5, 'Ingresá la dirección completa'),
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
})

export const step2Schema = z
  .object({
    capacity: z.number().min(1, 'Capacidad mínima 1 persona'),
    priceType: z.enum(['fixed', 'estimated', 'on_request']),
    pricePerHour: z.number().nullable(),
    priceMin: z.number().nullable(),
    priceMax: z.number().nullable(),
    rentTimeHours: z.number().min(1, 'Mínimo 1 hora'),
    eventTypes: z.array(z.string()).min(1, 'Seleccioná al menos un tipo de evento'),
    amenities: z.array(z.string()),
  })
  .superRefine((v, ctx) => {
    if (v.priceType === 'fixed' && (!v.pricePerHour || v.pricePerHour <= 0)) {
      ctx.addIssue({ path: ['pricePerHour'], code: 'custom', message: 'Ingresá un precio por hora' })
    }
    if (v.priceType === 'estimated') {
      if (!v.priceMin || v.priceMin <= 0) {
        ctx.addIssue({ path: ['priceMin'], code: 'custom', message: 'Ingresá un mínimo' })
      }
      if (!v.priceMax || v.priceMax <= 0) {
        ctx.addIssue({ path: ['priceMax'], code: 'custom', message: 'Ingresá un máximo' })
      }
      if (v.priceMin && v.priceMax && v.priceMax < v.priceMin) {
        ctx.addIssue({ path: ['priceMax'], code: 'custom', message: 'El máximo debe ser mayor al mínimo' })
      }
    }
  })

export type Step1 = z.infer<typeof step1Schema>
export type Step2 = z.infer<typeof step2Schema>

export interface FormState {
  step1: Step1
  step2: Step2
  services: SalonService[]
  images: File[]
  imageUrls: string[]
  existingUrls: string[]
}

export const EMPTY_FORM: FormState = {
  step1: { name: '', description: '', location: '', address: '', latitude: null, longitude: null },
  step2: {
    capacity: 50,
    priceType: 'fixed',
    pricePerHour: null,
    priceMin: null,
    priceMax: null,
    rentTimeHours: 2,
    eventTypes: [],
    amenities: [],
  },
  services: [],
  images: [],
  imageUrls: [],
  existingUrls: [],
}
