import { redirect } from '@tanstack/react-router'
import { supabase } from '@/shared/lib/supabase'
import { useAuthStore } from '../store/auth.store'

let resolveReady: () => void
export const authReady: Promise<void> = new Promise((res) => { resolveReady = res })

export async function initAuth() {
  const { data: { session } } = await supabase.auth.getSession()
  useAuthStore.getState().setSession(session)
  resolveReady()

  supabase.auth.onAuthStateChange((_event, session) => {
    useAuthStore.getState().setSession(session)
  })
}

export async function requireAuth(location: { href: string }) {
  await authReady
  const { status } = useAuthStore.getState()
  if (status !== 'authenticated') {
    throw redirect({ to: '/login', search: { redirect: location.href } })
  }
}

export async function signIn(email: string, password: string) {
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  return { error }
}

export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({ email, password })
  return { data, error }
}

export async function signOut() {
  await supabase.auth.signOut()
}
