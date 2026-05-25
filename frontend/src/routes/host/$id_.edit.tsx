import { createFileRoute } from '@tanstack/react-router'
import { EditSalonPage } from '@/features/host/components/EditSalonPage'
import { requireAuth } from '@/features/auth/lib/auth'

export const Route = createFileRoute('/host/$id_/edit')({
  beforeLoad: ({ location }) => requireAuth(location),
  component: function EditSalonRoute() {
    const { id } = Route.useParams()
    return <EditSalonPage salonId={id} />
  },
})
