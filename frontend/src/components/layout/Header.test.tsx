import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactNode } from 'react'
import type { User } from '@supabase/supabase-js'

const { navigateMock, signOutMock } = vi.hoisted(() => ({
  navigateMock: vi.fn(),
  signOutMock: vi.fn(),
}))

vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, to }: { children: ReactNode; to: string }) => <a href={to}>{children}</a>,
  useNavigate: () => navigateMock,
  useRouterState: ({ select }: { select: (s: { location: { pathname: string } }) => string }) =>
    select({ location: { pathname: '/' } }),
}))

vi.mock('@/features/auth/lib/auth', () => ({
  signOut: signOutMock,
}))

vi.mock('@/shared/store/theme.store', () => ({
  useThemeStore: () => ({ theme: 'light', toggleTheme: vi.fn() }),
}))

import { Header } from './Header'
import { useAuthStore } from '@/features/auth/store/auth.store'

const fakeUser = { id: 'u1', email: 'pepe@hosty.ar' } as User

describe('Header', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useAuthStore.setState({ user: null, session: null, status: 'unauthenticated' })
  })

  describe('sin usuario autenticado', () => {
    it('muestra el link "Iniciar sesión"', () => {
      render(<Header />)
      const links = screen.getAllByRole('link', { name: /iniciar sesión/i })
      expect(links.length).toBeGreaterThan(0)
    })

    it('NO muestra el email del usuario', () => {
      render(<Header />)
      expect(screen.queryByText(fakeUser.email)).not.toBeInTheDocument()
    })
  })

  describe('con usuario autenticado', () => {
    beforeEach(() => {
      useAuthStore.setState({ user: fakeUser, session: null, status: 'authenticated' })
    })

    it('muestra el email del usuario en el trigger del dropdown', () => {
      render(<Header />)
      expect(screen.getByText(fakeUser.email)).toBeInTheDocument()
    })

    it('NO muestra el link "Iniciar sesión" en desktop', () => {
      render(<Header />)
      expect(screen.queryByRole('link', { name: /iniciar sesión/i })).not.toBeInTheDocument()
    })

    it('Cerrar sesión llama a signOut y navega a /', async () => {
      signOutMock.mockResolvedValue(undefined)
      const user = userEvent.setup()
      render(<Header />)

      await user.click(screen.getByText(fakeUser.email))
      const logoutItem = await screen.findByText('Cerrar sesión')
      await user.click(logoutItem)

      expect(signOutMock).toHaveBeenCalledOnce()
      await vi.waitFor(() => {
        expect(navigateMock).toHaveBeenCalledWith({ to: '/' })
      })
    })
  })
})
