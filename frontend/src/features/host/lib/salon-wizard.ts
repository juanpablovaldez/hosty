import { z } from 'zod'

export const EVENT_TYPES = ['Cumpleaños', 'Casamientos', 'Corporativo', 'Egresos', 'Infantiles', 'Baby Shower', 'Quince años']
export const AMENITIES = ['Catering', 'Estacionamiento', 'Climatización', 'Sonido', 'Wi-Fi', 'Iluminación']
export const ZONAS = ['Centro', 'Yerba Buena', 'Tafí Viejo', 'Banda del Río Salí']

export const step1Schema = z.object({
  name: z.string().min(3, 'Mínimo 3 caracteres'),
  description: z.string().min(20, 'Contá un poco más sobre el salón (mínimo 20 caracteres)'),
  location: z.string().min(1, 'Seleccioná una zona'),
  address: z.string().min(5, 'Ingresá la dirección completa'),
})

export const step2Schema = z.object({
  capacity: z.number().min(1, 'Capacidad mínima 1 persona'),
  pricePerHour: z.number().min(1, 'Ingresá un precio'),
  rentTimeHours: z.number().min(1, 'Mínimo 1 hora'),
  eventTypes: z.array(z.string()).min(1, 'Seleccioná al menos un tipo de evento'),
  amenities: z.array(z.string()),
})

export type Step1 = z.infer<typeof step1Schema>
export type Step2 = z.infer<typeof step2Schema>

export interface FormState {
  step1: Step1
  step2: Step2
  images: File[]
  imageUrls: string[]
  existingUrls: string[]
}

export const EMPTY_FORM: FormState = {
  step1: { name: '', description: '', location: '', address: '' },
  step2: { capacity: 50, pricePerHour: 0, rentTimeHours: 2, eventTypes: [], amenities: [] },
  images: [],
  imageUrls: [],
  existingUrls: [],
}
