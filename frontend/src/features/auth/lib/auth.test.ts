import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/shared/lib/supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
    },
  },
}))

import { signIn, signUp } from './auth'
import { supabase } from '@/shared/lib/supabase'

describe('auth lib (unit)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('signIn envía las credenciales a Supabase y propaga el error', async () => {
    const fakeError = { message: 'Invalid login credentials' }
    vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
      data: { user: null, session: null },
      error: fakeError,
    } as unknown as Awaited<ReturnType<typeof supabase.auth.signInWithPassword>>)

    const result = await signIn('vos@ejemplo.com', 'secreta123')

    expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email: 'vos@ejemplo.com',
      password: 'secreta123',
    })
    expect(result.error).toBe(fakeError)
  })

  it('signUp registra al usuario y devuelve data + error', async () => {
    const payload = {
      data: { user: { id: 'u1' }, session: null },
      error: null,
    }
    vi.mocked(supabase.auth.signUp).mockResolvedValue(
      payload as unknown as Awaited<ReturnType<typeof supabase.auth.signUp>>,
    )

    const result = await signUp('nuevo@ejemplo.com', 'secreta123')

    expect(supabase.auth.signUp).toHaveBeenCalledWith({
      email: 'nuevo@ejemplo.com',
      password: 'secreta123',
    })
    expect(result.data).toBe(payload.data)
    expect(result.error).toBeNull()
  })
})
