import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest'
import type { Session, User } from '@supabase/supabase-js'

vi.mock('@/shared/lib/supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(),
    },
  },
}))

vi.mock('@tanstack/react-router', () => ({
  redirect: vi.fn((args: unknown) => args),
}))

import { signIn, signUp, signOut, initAuth, requireAuth } from './auth'
import { supabase } from '@/shared/lib/supabase'
import { useAuthStore } from '../store/auth.store'

const fakeUser = { id: 'u1', email: 'test@hosty.ar' } as User
const fakeSession = { user: fakeUser } as unknown as Session

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

  describe('signOut, initAuth y requireAuth', () => {
    beforeAll(async () => {
      vi.mocked(supabase.auth.getSession).mockResolvedValue({
        data: { session: fakeSession },
        error: null,
      } as unknown as Awaited<ReturnType<typeof supabase.auth.getSession>>)

      vi.mocked(supabase.auth.onAuthStateChange).mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } },
      } as unknown as ReturnType<typeof supabase.auth.onAuthStateChange>)

      await initAuth()
    })

    it('initAuth popula el store con el usuario de la sesión', () => {
      expect(useAuthStore.getState().status).toBe('authenticated')
      expect(useAuthStore.getState().user?.id).toBe('u1')
    })

    it('signOut llama a supabase.auth.signOut', async () => {
      await signOut()
      expect(supabase.auth.signOut).toHaveBeenCalledOnce()
    })

    it('requireAuth resuelve sin lanzar cuando el usuario está autenticado', async () => {
      useAuthStore.setState({ status: 'authenticated', user: fakeUser, session: fakeSession })
      await expect(requireAuth({ href: '/mi-perfil' })).resolves.toBeUndefined()
    })

    it('requireAuth lanza redirect a /login cuando el usuario no está autenticado', async () => {
      useAuthStore.setState({ status: 'unauthenticated', user: null, session: null })
      await expect(requireAuth({ href: '/mis-reservas' })).rejects.toMatchObject({
        to: '/login',
        search: { redirect: '/mis-reservas' },
      })
    })
  })
})
