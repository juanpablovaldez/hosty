import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { createElement } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

vi.mock('@/shared/lib/supabase', () => ({
  supabase: {
    from: vi.fn(),
  },
}))

import { useUpdateBookingStatus, useUpdateBookingQuote } from './host.mutations'
import { supabase } from '@/shared/lib/supabase'

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

function mockUpdateChain() {
  const fakeQuery = {
    update: vi.fn().mockReturnThis(),
    eq: vi.fn().mockResolvedValue({ error: null }),
  }
  vi.mocked(supabase.from).mockReturnValue(fakeQuery as unknown as ReturnType<typeof supabase.from>)
  return fakeQuery
}

describe('useUpdateBookingStatus', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('al confirmar, anula rejection_reason aunque se haya pasado un mensaje', async () => {
    const fakeQuery = mockUpdateChain()

    const { result } = renderHook(() => useUpdateBookingStatus(), { wrapper: createWrapper() })

    act(() =>
      result.current.mutate({ id: 'booking-1', status: 'confirmed', rejectionReason: 'no debería usarse' }),
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(supabase.from).toHaveBeenCalledWith('bookings')
    expect(fakeQuery.update).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'confirmed', rejection_reason: null }),
    )
    expect(fakeQuery.eq).toHaveBeenCalledWith('id', 'booking-1')
  })

  it('al rechazar, guarda el motivo de rechazo', async () => {
    const fakeQuery = mockUpdateChain()

    const { result } = renderHook(() => useUpdateBookingStatus(), { wrapper: createWrapper() })

    act(() =>
      result.current.mutate({ id: 'booking-1', status: 'declined', rejectionReason: 'fecha ya comprometida' }),
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(fakeQuery.update).toHaveBeenCalledWith({
      status: 'declined',
      rejection_reason: 'fecha ya comprometida',
    })
  })

  it('al rechazar sin motivo, guarda null en vez de undefined', async () => {
    const fakeQuery = mockUpdateChain()

    const { result } = renderHook(() => useUpdateBookingStatus(), { wrapper: createWrapper() })

    act(() => result.current.mutate({ id: 'booking-1', status: 'declined' }))

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(fakeQuery.update).toHaveBeenCalledWith({ status: 'declined', rejection_reason: null })
  })

  it('incluye quoted_price en el patch sólo cuando se pasa un valor', async () => {
    const fakeQuery = mockUpdateChain()

    const { result } = renderHook(() => useUpdateBookingStatus(), { wrapper: createWrapper() })

    act(() => result.current.mutate({ id: 'booking-1', status: 'confirmed', quotedPrice: 150000 }))

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(fakeQuery.update).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'confirmed', quoted_price: 150000 }),
    )
  })

  it('no incluye quoted_price en el patch cuando no se pasa', async () => {
    const fakeQuery = mockUpdateChain()

    const { result } = renderHook(() => useUpdateBookingStatus(), { wrapper: createWrapper() })

    act(() => result.current.mutate({ id: 'booking-1', status: 'confirmed' }))

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    const patch = fakeQuery.update.mock.calls[0][0]
    expect(patch).not.toHaveProperty('quoted_price')
  })

  it('falla cuando Supabase devuelve un error', async () => {
    const fakeQuery = {
      update: vi.fn().mockReturnThis(),
      eq: vi.fn().mockResolvedValue({ error: { message: 'constraint violation' } }),
    }
    vi.mocked(supabase.from).mockReturnValue(fakeQuery as unknown as ReturnType<typeof supabase.from>)

    const { result } = renderHook(() => useUpdateBookingStatus(), { wrapper: createWrapper() })

    act(() => result.current.mutate({ id: 'booking-1', status: 'confirmed' }))

    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})

describe('useUpdateBookingQuote', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('actualiza quoted_price para la reserva indicada', async () => {
    const fakeQuery = mockUpdateChain()

    const { result } = renderHook(() => useUpdateBookingQuote(), { wrapper: createWrapper() })

    act(() => result.current.mutate({ id: 'booking-1', quotedPrice: 200000 }))

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(fakeQuery.update).toHaveBeenCalledWith({ quoted_price: 200000 })
    expect(fakeQuery.eq).toHaveBeenCalledWith('id', 'booking-1')
  })

  it('falla cuando Supabase devuelve un error', async () => {
    const fakeQuery = {
      update: vi.fn().mockReturnThis(),
      eq: vi.fn().mockResolvedValue({ error: { message: 'not found' } }),
    }
    vi.mocked(supabase.from).mockReturnValue(fakeQuery as unknown as ReturnType<typeof supabase.from>)

    const { result } = renderHook(() => useUpdateBookingQuote(), { wrapper: createWrapper() })

    act(() => result.current.mutate({ id: 'booking-1', quotedPrice: 200000 }))

    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})
