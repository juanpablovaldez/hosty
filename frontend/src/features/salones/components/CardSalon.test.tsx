import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactNode } from 'react'
import type { User } from '@supabase/supabase-js'
import type { Salon } from '../types'

const navigateMock = vi.fn()
const mutateMock = vi.fn()

vi.mock('@tanstack/react-router', () => ({
  Link: ({ children }: { children: ReactNode }) => <>{children}</>,
  useNavigate: () => navigateMock,
}))

vi.mock('@/features/favorites/api/favorites.mutations', () => ({
  useToggleFavorite: vi.fn(() => ({ mutate: mutateMock, isPending: false })),
}))

import { CardSalon } from './CardSalon'
import { useAuthStore } from '@/features/auth/store/auth.store'

function makeSalon(overrides: Partial<Salon> = {}): Salon {
  return {
    id: 'salon-1',
    name: 'Salón Los Aromos',
    description: 'Hermoso salón',
    images: [],
    priceType: 'on_request',
    pricePerHour: null,
    priceMin: null,
    priceMax: null,
    services: [],
    rating: null,
    capacity: 150,
    location: 'Centro, Tucumán',
    address: 'Av. Roca 123',
    latitude: null,
    longitude: null,
    isVerified: false,
    isFeatured: false,
    rentTimeHours: 4,
    isFavorite: false,
    amenities: [],
    availabilityStatus: 'disponible',
    eventTypes: ['Casamientos', 'Cumpleaños'],
    ...overrides,
  }
}

describe('CardSalon', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useAuthStore.setState({ user: null, session: null, status: 'unauthenticated' })
  })

  it('muestra nombre, ubicación y capacidad del salón', () => {
    render(<CardSalon salon={makeSalon()} />)
    expect(screen.getByText('Salón Los Aromos')).toBeInTheDocument()
    expect(screen.getByText('Centro, Tucumán')).toBeInTheDocument()
    expect(screen.getByText(/hasta 150 personas/i)).toBeInTheDocument()
  })

  it('precio on_request → muestra "A consultar"', () => {
    render(<CardSalon salon={makeSalon({ priceType: 'on_request' })} />)
    expect(screen.getByText('A consultar')).toBeInTheDocument()
  })

  it('precio fixed con pricePerHour → muestra monto y "/hora"', () => {
    render(
      <CardSalon
        salon={makeSalon({ priceType: 'fixed', pricePerHour: 50000 })}
      />,
    )
    expect(screen.getByText(/\$\s*50\.000|\$ 50\.000/)).toBeInTheDocument()
    expect(screen.getByText(/hora/i)).toBeInTheDocument()
  })

  it('badge "Destacado" visible cuando isFeatured=true', () => {
    render(<CardSalon salon={makeSalon({ isFeatured: true })} />)
    expect(screen.getByText('Destacado')).toBeInTheDocument()
  })

  it('badge "Destacado" NO visible cuando isFeatured=false', () => {
    render(<CardSalon salon={makeSalon({ isFeatured: false })} />)
    expect(screen.queryByText('Destacado')).not.toBeInTheDocument()
  })

  it('muestra badges de tipos de evento (máx 3 visibles)', () => {
    const salon = makeSalon({ eventTypes: ['Casamientos', 'Cumpleaños', 'Empresariales', 'Quinceañeras'] })
    render(<CardSalon salon={salon} />)
    expect(screen.getByText('Casamientos')).toBeInTheDocument()
    expect(screen.getByText('Cumpleaños')).toBeInTheDocument()
    expect(screen.getByText('Empresariales')).toBeInTheDocument()
    expect(screen.getByText('+1')).toBeInTheDocument()
  })

  describe('botón favorito', () => {
    it('sin usuario → click redirige a /login', async () => {
      const user = userEvent.setup()
      render(<CardSalon salon={makeSalon()} />)

      await user.click(screen.getByRole('button', { name: /guardar en favoritos/i }))

      expect(navigateMock).toHaveBeenCalledWith({ to: '/login' })
      expect(mutateMock).not.toHaveBeenCalled()
    })

    it('con usuario → click llama toggleFavorite.mutate con salonId e isFavorite', async () => {
      useAuthStore.setState({
        user: { id: 'u1', email: 'host@hosty.ar' } as User,
        session: null,
        status: 'authenticated',
      })
      const salon = makeSalon({ id: 'salon-1', isFavorite: false })
      const user = userEvent.setup()
      render(<CardSalon salon={salon} />)

      await user.click(screen.getByRole('button', { name: /guardar en favoritos/i }))

      expect(mutateMock).toHaveBeenCalledWith({ salonId: 'salon-1', isFavorite: false })
      expect(navigateMock).not.toHaveBeenCalled()
    })

    it('con usuario y isFavorite=true → aria-label indica "Quitar de favoritos"', () => {
      useAuthStore.setState({
        user: { id: 'u1', email: 'host@hosty.ar' } as User,
        session: null,
        status: 'authenticated',
      })
      render(<CardSalon salon={makeSalon({ isFavorite: true })} />)
      expect(screen.getByRole('button', { name: /quitar de favoritos/i })).toBeInTheDocument()
    })
  })
})
