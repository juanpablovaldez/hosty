import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'

vi.mock('@tanstack/react-router', () => ({
  useParams: () => ({ id: 'salon-1' }),
  Link: ({ children }: { children: ReactNode }) => children,
}))

vi.mock('@/features/salones/api/salones.queries', () => ({
  useSalon: () => ({
    data: {
      id: 'salon-1',
      name: 'Salón de prueba',
      capacity: 100,
      rentTimeHours: 1,
      priceType: 'fixed',
      pricePerHour: 1000,
      services: [],
    },
    isLoading: false,
  }),
  useSalonBlockedDates: () => ({ data: ['2026-08-10'] }),
}))

vi.mock('../api/bookings.mutations', () => ({
  useCreateBooking: () => ({ mutateAsync: vi.fn(), isPending: false }),
}))

vi.mock('@/features/auth/store/auth.store', () => ({
  useAuthStore: () => ({ id: 'user-1' }),
}))

import { BookingFlow } from './BookingFlow'

function renderWithClient() {
  const queryClient = new QueryClient()
  return render(
    <QueryClientProvider client={queryClient}>
      <BookingFlow />
    </QueryClientProvider>,
  )
}

describe('BookingFlow — paso 1 (fecha y hora)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('CP-01: bloquea el avance y muestra un mensaje cuando la fecha elegida tiene un bloqueo de disponibilidad', async () => {
    const user = userEvent.setup()
    renderWithClient()

    await user.type(screen.getByLabelText('Fecha del evento'), '2026-08-10')

    await user.click(screen.getByLabelText('Hora de inicio'))
    await user.click(await screen.findByRole('option', { name: '10:00' }))

    await user.click(screen.getByLabelText('Hora de fin'))
    await user.click(await screen.findByRole('option', { name: '12:00' }))

    await user.click(screen.getByRole('button', { name: /siguiente/i }))

    expect(
      await screen.findByText('El salón no está disponible en la fecha elegida. Probá con otra fecha.'),
    ).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Fecha y hora' })).toBeInTheDocument()
  })
})
