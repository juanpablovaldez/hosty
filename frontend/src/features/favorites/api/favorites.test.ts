import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { createElement } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

vi.mock('@/shared/lib/supabase', () => ({
  supabase: {
    from: vi.fn(),
  },
}))

import { useToggleFavorite } from './favorites.mutations'
import { useUserFavoriteIds, useUserFavorites } from './favorites.queries'
import { supabase } from '@/shared/lib/supabase'

const fakeSalonRow = {
  id: 'salon-1',
  name: 'Salón Test',
  description: null,
  images: ['https://example.com/img.jpg'],
  price_type: 'on_request',
  price_per_hour: null,
  price_min: null,
  price_max: null,
  salon_services: [],
  rating_value: null,
  rating_count: null,
  capacity: 100,
  location: 'Centro',
  address: 'Av. Roca 123',
  latitude: null,
  longitude: null,
  is_verified: false,
  is_featured: false,
  rent_time_hours: 4,
  amenities: [],
  availability_status: 'disponible',
  event_types: [],
}

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

describe('useUserFavoriteIds', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('devuelve un Set con los IDs de salones favoritos del usuario', async () => {
    const fakeQuery = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockResolvedValue({
        data: [{ salon_id: 'salon-1' }, { salon_id: 'salon-2' }],
        error: null,
      }),
    }
    vi.mocked(supabase.from).mockReturnValue(fakeQuery as unknown as ReturnType<typeof supabase.from>)

    const { result } = renderHook(() => useUserFavoriteIds('user-1'), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toBeInstanceOf(Set)
    expect(result.current.data?.has('salon-1')).toBe(true)
    expect(result.current.data?.has('salon-2')).toBe(true)
    expect(result.current.data?.size).toBe(2)
  })

  it('no ejecuta la query cuando userId es null', () => {
    vi.mocked(supabase.from).mockReturnValue({ select: vi.fn() } as unknown as ReturnType<typeof supabase.from>)

    const { result } = renderHook(() => useUserFavoriteIds(null), { wrapper: createWrapper() })

    expect(result.current.fetchStatus).toBe('idle')
    expect(supabase.from).not.toHaveBeenCalled()
  })
})

describe('useUserFavorites', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('devuelve los salones favoritos con isFavorite=true', async () => {
    const fakeQuery = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({
        data: [{ salon_id: 'salon-1', salones: fakeSalonRow }],
        error: null,
      }),
    }
    vi.mocked(supabase.from).mockReturnValue(fakeQuery as unknown as ReturnType<typeof supabase.from>)

    const { result } = renderHook(() => useUserFavorites('user-1'), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toHaveLength(1)
    expect(result.current.data?.[0].isFavorite).toBe(true)
    expect(result.current.data?.[0].id).toBe('salon-1')
  })
})

describe('useToggleFavorite', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('llama a DELETE cuando isFavorite es true (quitar favorito)', async () => {
    const fakeDeleteQuery = {
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
    }
    const secondEq = vi.fn().mockResolvedValue({ error: null })
    fakeDeleteQuery.eq.mockReturnValueOnce(fakeDeleteQuery).mockReturnValueOnce({ eq: secondEq })
    vi.mocked(supabase.from).mockReturnValue(fakeDeleteQuery as unknown as ReturnType<typeof supabase.from>)

    const { result } = renderHook(() => useToggleFavorite('user-1'), { wrapper: createWrapper() })

    act(() => result.current.mutate({ salonId: 'salon-1', isFavorite: true }))

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(fakeDeleteQuery.delete).toHaveBeenCalled()
  })

  it('llama a INSERT cuando isFavorite es false (agregar favorito)', async () => {
    const fakeInsertQuery = {
      insert: vi.fn().mockResolvedValue({ error: null }),
    }
    vi.mocked(supabase.from).mockReturnValue(fakeInsertQuery as unknown as ReturnType<typeof supabase.from>)

    const { result } = renderHook(() => useToggleFavorite('user-1'), { wrapper: createWrapper() })

    act(() => result.current.mutate({ salonId: 'salon-2', isFavorite: false }))

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(fakeInsertQuery.insert).toHaveBeenCalledWith({
      user_id: 'user-1',
      salon_id: 'salon-2',
    })
  })

  it('falla si userId es null', async () => {
    const { result } = renderHook(() => useToggleFavorite(null), { wrapper: createWrapper() })

    act(() => result.current.mutate({ salonId: 'salon-1', isFavorite: false }))

    await waitFor(() => expect(result.current.isError).toBe(true))
    expect((result.current.error as Error).message).toBe('Not authenticated')
  })
})
