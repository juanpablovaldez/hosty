import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { useAuthStore } from '@/features/auth/store/auth.store'
import { useCreateSalon } from '../api/host.mutations'
import { SalonWizard } from './SalonWizard'
import { EMPTY_FORM } from '../lib/salon-wizard'
import type { FormState } from '../lib/salon-wizard'

export function CreateSalonPage() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const createSalon = useCreateSalon()

  async function handleSubmit(form: FormState) {
    if (!user) { toast.error('Necesitás estar logueado'); return }
    try {
      await createSalon.mutateAsync({
        userId: user.id,
        step1: form.step1,
        step2: form.step2,
        services: form.services,
        images: form.images,
      })
      toast.success('¡Salón publicado exitosamente!')
      navigate({ to: '/host/dashboard' })
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : (err as { message?: string })?.message ?? JSON.stringify(err)
      toast.error(`Error: ${msg}`)
    }
  }

  return (
    <SalonWizard
      mode="create"
      title="Publicar mi salón"
      initialState={EMPTY_FORM}
      submitting={createSalon.isPending}
      onSubmit={handleSubmit}
    />
  )
}
