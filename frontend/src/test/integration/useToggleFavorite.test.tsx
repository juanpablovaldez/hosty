import { renderHook, act, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { useToggleFavorite } from '@/features/favorites/api/favorites.mutations'

const mockInsert = vi.fn()
const mockDeleteEq = vi.fn()

vi.mock('@/shared/lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      insert: mockInsert,
      delete: vi.fn(() => ({
        eq: vi.fn(() => ({
          eq: mockDeleteEq,
        })),
      })),
    })),
  },
}))

const USER_ID = 'usuario-test-123'
const SALON_ID = 'salon-test-abc'

function makeWrapper(client: QueryClient) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>
  }
}

describe('TC-I01 | useToggleFavorite', () => {
  let queryClient: QueryClient

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    })
    mockInsert.mockResolvedValue({ error: null })
    mockDeleteEq.mockResolvedValue({ error: null })
  })

  it('agrega el salón al caché de favoritos cuando Supabase responde sin error', async () => {
    queryClient.setQueryData<Set<string>>(['favorites', 'ids', USER_ID], new Set())

    const { result } = renderHook(() => useToggleFavorite(USER_ID), {
      wrapper: makeWrapper(queryClient),
    })

    await act(async () => {
      result.current.mutate({ salonId: SALON_ID, isFavorite: false })
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    const cache = queryClient.getQueryData<Set<string>>(['favorites', 'ids', USER_ID])
    expect(cache?.has(SALON_ID)).toBe(true)
    expect(mockInsert).toHaveBeenCalledWith({ user_id: USER_ID, salon_id: SALON_ID })
  })

  it('revierte el caché al estado previo cuando Supabase devuelve un error', async () => {
    queryClient.setQueryData<Set<string>>(['favorites', 'ids', USER_ID], new Set([SALON_ID]))

    mockInsert.mockResolvedValueOnce({ error: new Error('Error de base de datos') })

    const { result } = renderHook(() => useToggleFavorite(USER_ID), {
      wrapper: makeWrapper(queryClient),
    })

    await act(async () => {
      result.current.mutate({ salonId: 'salon-nuevo', isFavorite: false })
    })

    await waitFor(() => expect(result.current.isError).toBe(true))

    const cache = queryClient.getQueryData<Set<string>>(['favorites', 'ids', USER_ID])
    expect(cache?.has(SALON_ID)).toBe(true)
    expect(cache?.has('salon-nuevo')).toBe(false)
  })
})
