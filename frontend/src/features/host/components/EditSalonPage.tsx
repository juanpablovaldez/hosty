import { useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { useAuthStore } from '@/features/auth/store/auth.store'
import { useHostSalon } from '../api/host.queries'
import { useUpdateSalon } from '../api/host.mutations'
import { SalonWizard } from './SalonWizard'
import type { FormState } from '../lib/salon-wizard'
import { Skeleton } from '@/components/ui/skeleton'
import { ChevronLeft } from 'lucide-react'
import { Link } from '@tanstack/react-router'

interface EditSalonPageProps {
  salonId: string
}

export function EditSalonPage({ salonId }: EditSalonPageProps) {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const { data: salon, isLoading, error } = useHostSalon(salonId)
  const updateSalon = useUpdateSalon()

  useEffect(() => {
    if (salon && user && salon.hostId !== user.id) {
      navigate({ to: '/host/dashboard' })
    }
  }, [salon, user, navigate])

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto px-5 lg:px-8 py-10 space-y-4">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    )
  }

  if (error || !salon) {
    return (
      <div className="max-w-2xl mx-auto px-5 lg:px-8 py-10 text-center">
        <p className="text-muted-foreground mb-4">Salón no encontrado.</p>
        <Link to="/host/dashboard" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
          <ChevronLeft className="w-4 h-4" strokeWidth={1.5} />
          Volver al dashboard
        </Link>
      </div>
    )
  }

  const initialState: FormState = {
    step1: {
      name: salon.name,
      description: salon.description ?? '',
      location: salon.location,
      address: salon.address,
    },
    step2: {
      capacity: salon.capacity,
      pricePerHour: salon.pricePerHour,
      rentTimeHours: salon.rentTimeHours,
      eventTypes: salon.eventTypes,
      amenities: salon.amenities,
    },
    images: [],
    imageUrls: [],
    existingUrls: salon.images,
  }

  async function handleSubmit(form: FormState) {
    if (!user) { toast.error('Necesitás estar logueado'); return }
    try {
      await updateSalon.mutateAsync({
        id: salonId,
        userId: user.id,
        step1: form.step1,
        step2: form.step2,
        newFiles: form.images,
        keptUrls: form.existingUrls,
      })
      toast.success('Cambios guardados exitosamente')
      navigate({ to: '/host/dashboard' })
    } catch {
      toast.error('Ocurrió un error al guardar. Intentá de nuevo.')
    }
  }

  return (
    <SalonWizard
      mode="edit"
      title="Editar salón"
      initialState={initialState}
      submitting={updateSalon.isPending}
      onSubmit={handleSubmit}
    />
  )
}
