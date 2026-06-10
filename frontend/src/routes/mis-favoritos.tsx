import { createFileRoute } from '@tanstack/react-router'
import { MisFavoritosPage } from '@/features/favorites/components/MisFavoritosPage'
import { requireAuth } from '@/features/auth/lib/auth'

export const Route = createFileRoute('/mis-favoritos')({
  beforeLoad: ({ location }) => requireAuth(location),
  component: MisFavoritosPage,
})
