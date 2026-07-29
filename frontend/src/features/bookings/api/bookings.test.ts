import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { createElement } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

vi.mock('@/shared/lib/supabase', () => ({
  supabase: {
    from: vi.fn(),
  },
}))

import { useCreateBooking, useCancelBooking } from './bookings.mutations'
import { useMyBookings } from './bookings.queries'
import { supabase } from '@/shared/lib/supabase'
import type { BookingPayload } from '../types'

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
  })
  return ({ children }: { children: React.ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children)
}

const fakeBookingRow = {
  id: 'booking-1',
  salon_id: 'salon-1',
  user_id: 'user-1',
  event_date: '2025-08-15',
  start_time: '18:00',
  end_time: '23:00',
  attendees: 80,
  event_type: 'Casamiento',
  notes: null,
  total_price: 125000,
  status: 'pending',
  created_at: '2025-07-01T10:00:00Z',
  salones: { name: 'Salón Test', images: ['https://example.com/img.jpg'] },
}

const fakePayload: BookingPayload = {
  salonId: 'salon-1',
  userId: 'user-1',
  eventDate: '2025-08-15',
  startTime: '18:00',
  endTime: '23:00',
  attendees: 80,
  eventType: 'Casamiento',
  notes: '',
  contactName: 'Juan',
  contactPhone: '381-555-0001',
  selectedServices: [],
  totalPrice: 125000,
}

describe('useCreateBooking', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('inserta la reserva en Supabase y devuelve los datos', async () => {
    const fakeQuery = {
      insert: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: fakeBookingRow, error: null }),
    }
    vi.mocked(supabase.from).mockReturnValue(fakeQuery as unknown as ReturnType<typeof supabase.from>)

    const { result } = renderHook(() => useCreateBooking(), { wrapper: createWrapper() })

    act(() => result.current.mutate(fakePayload))

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(supabase.from).toHaveBeenCalledWith('bookings')
    expect(fakeQuery.insert).toHaveBeenCalledWith(
      expect.objectContaining({
        salon_id: 'salon-1',
        user_id: 'user-1',
        status: 'pending',
        event_type: 'Casamiento',
      }),
    )
  })

  it('falla cuando Supabase devuelve un error', async () => {
    const fakeQuery = {
      insert: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: { message: 'constraint violation' } }),
    }
    vi.mocked(supabase.from).mockReturnValue(fakeQuery as unknown as ReturnType<typeof supabase.from>)

    const { result } = renderHook(() => useCreateBooking(), { wrapper: createWrapper() })

    act(() => result.current.mutate(fakePayload))

    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})

describe('useCancelBooking', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('actualiza status a "cancelled" y devuelve la reserva actualizada', async () => {
    const fakeQuery = {
      update: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({
        data: { ...fakeBookingRow, status: 'cancelled' },
        error: null,
      }),
    }
    vi.mocked(supabase.from).mockReturnValue(fakeQuery as unknown as ReturnType<typeof supabase.from>)

    const { result } = renderHook(() => useCancelBooking(), { wrapper: createWrapper() })

    act(() => result.current.mutate('booking-1'))

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(fakeQuery.update).toHaveBeenCalledWith({ status: 'cancelled' })
    expect(fakeQuery.eq).toHaveBeenCalledWith('id', 'booking-1')
  })

  it('falla si Supabase retorna error', async () => {
    const fakeQuery = {
      update: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: { message: 'not found' } }),
    }
    vi.mocked(supabase.from).mockReturnValue(fakeQuery as unknown as ReturnType<typeof supabase.from>)

    const { result } = renderHook(() => useCancelBooking(), { wrapper: createWrapper() })

    act(() => result.current.mutate('booking-1'))

    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})

describe('useMyBookings', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('devuelve las reservas del usuario mapeadas a camelCase', async () => {
    const fakeQuery = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({ data: [fakeBookingRow], error: null }),
    }
    vi.mocked(supabase.from).mockReturnValue(fakeQuery as unknown as ReturnType<typeof supabase.from>)

    const { result } = renderHook(() => useMyBookings('user-1'), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    const booking = result.current.data?.[0]
    expect(booking?.id).toBe('booking-1')
    expect(booking?.salonName).toBe('Salón Test')
    expect(booking?.status).toBe('pending')
  })

  it('no ejecuta la query cuando userId es null', () => {
    vi.mocked(supabase.from).mockReturnValue({
      select: vi.fn(),
    } as unknown as ReturnType<typeof supabase.from>)

    const { result } = renderHook(() => useMyBookings(null), { wrapper: createWrapper() })

    expect(result.current.fetchStatus).toBe('idle')
    expect(supabase.from).not.toHaveBeenCalled()
  })
})
