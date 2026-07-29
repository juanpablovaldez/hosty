import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { createElement } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

vi.mock('@/shared/lib/supabase', () => ({
  supabase: {
    from: vi.fn(),
  },
}))

import { rowToSalon, useSearchSalones, useSalon, useFeaturedSalones } from './salones.queries'
import { supabase } from '@/shared/lib/supabase'

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
    },
  })
  return ({ children }: { children: React.ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children)
}

const fakeRow = {
  id: 'salon-1',
  name: 'Salón Test',
  description: 'Descripción test',
  images: ['https://example.com/img.jpg'],
  price_type: 'fixed',
  price_per_hour: 25000,
  price_min: null,
  price_max: null,
  salon_services: [{ id: 'svc-1', name: 'DJ', price: 5000 }],
  rating_value: 4.5,
  rating_count: 12,
  capacity: 100,
  location: 'Centro',
  address: 'Av. Roca 123',
  latitude: -26.8,
  longitude: -65.2,
  is_verified: true,
  is_featured: false,
  rent_time_hours: 4,
  amenities: ['estacionamiento', 'wifi'],
  availability_status: 'disponible',
  event_types: ['Casamientos', 'Cumpleaños'],
}

describe('rowToSalon', () => {
  it('mapea snake_case de DB a camelCase del dominio', () => {
    const salon = rowToSalon(fakeRow as Parameters<typeof rowToSalon>[0])

    expect(salon.id).toBe('salon-1')
    expect(salon.priceType).toBe('fixed')
    expect(salon.pricePerHour).toBe(25000)
    expect(salon.isVerified).toBe(true)
    expect(salon.isFeatured).toBe(false)
    expect(salon.rentTimeHours).toBe(4)
    expect(salon.availabilityStatus).toBe('disponible')
    expect(salon.rating).toEqual({ value: 4.5, count: 12 })
    expect(salon.services).toEqual([{ id: 'svc-1', name: 'DJ', price: 5000 }])
    expect(salon.isFavorite).toBe(false)
  })

  it('rating null cuando rating_value o rating_count son null', () => {
    const salon = rowToSalon({ ...fakeRow, rating_value: null, rating_count: null } as Parameters<typeof rowToSalon>[0])
    expect(salon.rating).toBeNull()
  })

  it('salon_services vacío cuando no hay servicios', () => {
    const salon = rowToSalon({ ...fakeRow, salon_services: null } as Parameters<typeof rowToSalon>[0])
    expect(salon.services).toEqual([])
  })
})

describe('useSearchSalones', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('llama a supabase y devuelve los salones paginados', async () => {
    const fakeQuery = {
      ilike: vi.fn().mockReturnThis(),
      gte: vi.fn().mockReturnThis(),
      lte: vi.fn().mockReturnThis(),
      neq: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      or: vi.fn().mockReturnThis(),
      overlaps: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      range: vi.fn().mockResolvedValue({
        data: [fakeRow],
        error: null,
        count: 1,
      }),
    }
    vi.mocked(supabase.from).mockReturnValue({
      select: vi.fn().mockReturnValue(fakeQuery),
    } as unknown as ReturnType<typeof supabase.from>)

    const { result } = renderHook(() => useSearchSalones({ page: 1, pageSize: 20 }), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data?.total).toBe(1)
    expect(result.current.data?.salones).toHaveLength(1)
    expect(result.current.data?.salones[0].id).toBe('salon-1')
  })

  it('devuelve error cuando Supabase falla', async () => {
    const fakeQuery = {
      neq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      range: vi.fn().mockResolvedValue({
        data: null,
        error: { message: 'DB error' },
        count: null,
      }),
    }
    vi.mocked(supabase.from).mockReturnValue({
      select: vi.fn().mockReturnValue(fakeQuery),
    } as unknown as ReturnType<typeof supabase.from>)

    const { result } = renderHook(() => useSearchSalones({}), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})

describe('useFeaturedSalones', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('devuelve salones verificados y disponibles', async () => {
    const fakeQuery = {
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockResolvedValue({ data: [fakeRow], error: null }),
    }
    vi.mocked(supabase.from).mockReturnValue({
      select: vi.fn().mockReturnValue(fakeQuery),
    } as unknown as ReturnType<typeof supabase.from>)

    const { result } = renderHook(() => useFeaturedSalones(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toHaveLength(1)
    expect(result.current.data?.[0].isVerified).toBe(true)
  })
})

describe('useSalon', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('devuelve el salón por id', async () => {
    const fakeQuery = {
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: fakeRow, error: null }),
    }
    vi.mocked(supabase.from).mockReturnValue({
      select: vi.fn().mockReturnValue(fakeQuery),
    } as unknown as ReturnType<typeof supabase.from>)

    const { result } = renderHook(() => useSalon('salon-1'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.id).toBe('salon-1')
  })

  it('no ejecuta la query cuando id está vacío', () => {
    vi.mocked(supabase.from).mockReturnValue({
      select: vi.fn(),
    } as unknown as ReturnType<typeof supabase.from>)

    const { result } = renderHook(() => useSalon(''), {
      wrapper: createWrapper(),
    })

    expect(result.current.fetchStatus).toBe('idle')
    expect(supabase.from).not.toHaveBeenCalled()
  })
})
