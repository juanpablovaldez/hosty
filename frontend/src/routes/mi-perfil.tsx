import { createFileRoute } from '@tanstack/react-router'
import { MiPerfilPage } from '@/features/profile/components/MiPerfilPage'
import { requireAuth } from '@/features/auth/lib/auth'

export const Route = createFileRoute('/mi-perfil')({
  beforeLoad: ({ location }) => requireAuth(location),
  component: MiPerfilPage,
})
