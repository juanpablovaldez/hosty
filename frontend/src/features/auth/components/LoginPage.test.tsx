import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactNode } from 'react'

vi.mock('@tanstack/react-router', () => ({
  Link: ({ children }: { children: ReactNode }) => children,
  useNavigate: () => vi.fn(),
  useSearch: () => ({}),
}))

vi.mock('../lib/auth', () => ({ signIn: vi.fn() }))
vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }))

import { LoginPage } from './LoginPage'
import { signIn } from '../lib/auth'

describe('LoginPage (integración)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('muestra el error del servidor cuando las credenciales son incorrectas', async () => {
    vi.mocked(signIn).mockResolvedValue({
      error: { message: 'Invalid login credentials' },
    } as unknown as Awaited<ReturnType<typeof signIn>>)

    const user = userEvent.setup()
    render(<LoginPage />)

    await user.type(screen.getByLabelText('Email'), 'vos@ejemplo.com')
    await user.type(screen.getByLabelText('Contraseña'), 'incorrecta')
    await user.click(screen.getByRole('button', { name: /iniciar sesión/i }))

    expect(await screen.findByText('Email o contraseña incorrectos.')).toBeInTheDocument()
    expect(signIn).toHaveBeenCalledWith('vos@ejemplo.com', 'incorrecta')
  })
})
