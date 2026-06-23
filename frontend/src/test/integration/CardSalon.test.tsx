import { render, screen, fireEvent } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { CardSalon } from '@/features/salones/components/CardSalon'
import type { Salon } from '@/features/salones/types'
import { useAuthStore } from '@/features/auth/store/auth.store'

const mockNavigate = vi.fn()

vi.mock('@tanstack/react-router', () => ({
  Link: ({ children }: { children: ReactNode }) => <a>{children}</a>,
  useNavigate: () => mockNavigate,
}))

vi.mock('@/shared/lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      insert: vi.fn().mockResolvedValue({ error: null }),
      delete: vi.fn(() => ({
        eq: vi.fn(() => ({
          eq: vi.fn().mockResolvedValue({ error: null }),
        })),
      })),
    })),
  },
}))

const salonBase: Salon = {
  id: 'salon-123',
  name: 'Salón La Quinta',
  description: null,
  images: ['/foto.jpg'],
  priceType: 'fixed',
  pricePerHour: 10000,
  priceMin: null,
  priceMax: null,
  services: [],
  rating: null,
  capacity: 100,
  location: 'Yerba Buena',
  address: 'Av. Siempre Viva 742',
  latitude: null,
  longitude: null,
  isVerified: false,
  rentTimeHours: 3,
  isFavorite: false,
  amenities: [],
  availabilityStatus: 'disponible',
  eventTypes: ['Cumpleaños'],
}

function Wrapper({ children }: { children: ReactNode }) {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  return <QueryClientProvider client={qc}>{children}</QueryClientProvider>
}

describe('TC-I02 | CardSalon', () => {
  afterEach(() => {
    useAuthStore.setState({ user: null, session: null, status: 'unauthenticated' })
    mockNavigate.mockClear()
  })

  it('muestra aria-label "Quitar de favoritos" cuando isFavorite es true', () => {
    render(<CardSalon salon={{ ...salonBase, isFavorite: true }} />, { wrapper: Wrapper })

    const boton = screen.getByRole('button', { name: 'Quitar de favoritos' })
    expect(boton).toBeInTheDocument()
  })

  it('redirige a /login al hacer click en favorito sin usuario autenticado', () => {
    useAuthStore.setState({ user: null, session: null, status: 'unauthenticated' })

    render(<CardSalon salon={salonBase} />, { wrapper: Wrapper })

    const boton = screen.getByRole('button', { name: 'Guardar en favoritos' })
    fireEvent.click(boton)

    expect(mockNavigate).toHaveBeenCalledWith({ to: '/login' })
  })
})
