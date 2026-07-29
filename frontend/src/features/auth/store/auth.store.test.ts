import { describe, it, expect, beforeEach } from 'vitest'
import type { Session, User } from '@supabase/supabase-js'
import { useAuthStore } from './auth.store'

const fakeUser = { id: 'u1', email: 'test@hosty.ar' } as User
const fakeSession = { user: fakeUser } as unknown as Session

describe('useAuthStore', () => {
  beforeEach(() => {
    useAuthStore.setState({ user: null, session: null, status: 'loading' })
  })

  it('estado inicial: sin usuario, status loading', () => {
    const { user, session, status } = useAuthStore.getState()
    expect(user).toBeNull()
    expect(session).toBeNull()
    expect(status).toBe('loading')
  })

  it('setSession con sesión válida → status authenticated + user derivado', () => {
    useAuthStore.getState().setSession(fakeSession)
    const { user, session, status } = useAuthStore.getState()
    expect(status).toBe('authenticated')
    expect(user).toBe(fakeUser)
    expect(session).toBe(fakeSession)
  })

  it('setSession(null) → status unauthenticated, user y session nulos', () => {
    useAuthStore.getState().setSession(fakeSession)
    useAuthStore.getState().setSession(null)
    const { user, session, status } = useAuthStore.getState()
    expect(status).toBe('unauthenticated')
    expect(user).toBeNull()
    expect(session).toBeNull()
  })

  it('clear() → status unauthenticated, limpia user y session', () => {
    useAuthStore.getState().setSession(fakeSession)
    useAuthStore.getState().clear()
    const { user, session, status } = useAuthStore.getState()
    expect(status).toBe('unauthenticated')
    expect(user).toBeNull()
    expect(session).toBeNull()
  })
})
