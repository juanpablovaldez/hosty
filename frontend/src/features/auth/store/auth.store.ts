import { create } from 'zustand'
import type { User, Session } from '@supabase/supabase-js'

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated'

interface AuthStore {
  user: User | null
  session: Session | null
  status: AuthStatus
  setSession: (session: Session | null) => void
  clear: () => void
}

export const useAuthStore = create<AuthStore>()((set) => ({
  user: null,
  session: null,
  status: 'loading',
  setSession: (session) =>
    set({
      session,
      user: session?.user ?? null,
      status: session ? 'authenticated' : 'unauthenticated',
    }),
  clear: () => set({ user: null, session: null, status: 'unauthenticated' }),
}))
