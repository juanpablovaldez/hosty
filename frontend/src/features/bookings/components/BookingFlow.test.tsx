import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'

vi.mock('@tanstack/react-router', () => ({
  useParams: () => ({ id: 'salon-1' }),
  Link: ({ children }: { children: ReactNode }) => children,
}))

const { BLOCKED_DATE, BUSY_DATE } = vi.hoisted(() => {
  const futureDate = (days: number) => {
    const d = new Date()
    d.setDate(d.getDate() + days)
    return d.toISOString().split('T')[0]
  }
  return { BLOCKED_DATE: futureDate(7), BUSY_DATE: futureDate(14) }
})

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
  useSalonBlockedDates: () => ({ data: [BLOCKED_DATE] }),
}))

vi.mock('../api/bookings.mutations', () => ({
  useCreateBooking: () => ({ mutateAsync: vi.fn(), isPending: false }),
}))

vi.mock('../api/bookings.queries', () => ({
  useSalonBusySlots: () => ({
    data: [{ eventDate: BUSY_DATE, startTime: '10:00:00', endTime: '14:00:00' }],
  }),
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

    await user.type(screen.getByLabelText('Fecha del evento'), BLOCKED_DATE)

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

  it('CP-02: bloquea el avance cuando el horario se superpone con una reserva ya confirmada', async () => {
    const user = userEvent.setup()
    renderWithClient()

    await user.type(screen.getByLabelText('Fecha del evento'), BUSY_DATE)

    expect(
      await screen.findByText(/Horarios ya reservados ese día: 10:00 a 14:00/),
    ).toBeInTheDocument()

    await user.click(screen.getByLabelText('Hora de inicio'))
    await user.click(await screen.findByRole('option', { name: '12:00' }))

    await user.click(screen.getByLabelText('Hora de fin'))
    await user.click(await screen.findByRole('option', { name: '16:00' }))

    await user.click(screen.getByRole('button', { name: /siguiente/i }))

    expect(
      await screen.findByText(
        'Ese horario ya está reservado (de 10:00 a 14:00). Elegí otro horario u otra fecha.',
      ),
    ).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Fecha y hora' })).toBeInTheDocument()
  })

  it('CP-03: deja avanzar cuando el horario elegido arranca justo cuando termina la reserva confirmada', async () => {
    const user = userEvent.setup()
    renderWithClient()

    await user.type(screen.getByLabelText('Fecha del evento'), BUSY_DATE)

    await user.click(screen.getByLabelText('Hora de inicio'))
    await user.click(await screen.findByRole('option', { name: '14:00' }))

    await user.click(screen.getByLabelText('Hora de fin'))
    await user.click(await screen.findByRole('option', { name: '18:00' }))

    await user.click(screen.getByRole('button', { name: /siguiente/i }))

    expect(await screen.findByRole('heading', { name: 'Datos del evento' })).toBeInTheDocument()
  })
})
