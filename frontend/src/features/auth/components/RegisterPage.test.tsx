import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactNode } from 'react'

vi.mock('@tanstack/react-router', () => ({
  Link: ({ children }: { children: ReactNode }) => children,
  useNavigate: () => vi.fn(),
  useSearch: () => ({}),
}))

vi.mock('../lib/auth', () => ({ signUp: vi.fn() }))
vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }))

import { RegisterPage } from './RegisterPage'
import { signUp } from '../lib/auth'

describe('RegisterPage (integración)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('valida que las contraseñas coincidan y no llama a signUp si difieren', async () => {
    const user = userEvent.setup()
    render(<RegisterPage />)

    await user.type(screen.getByLabelText('Email'), 'nuevo@ejemplo.com')
    await user.type(screen.getByLabelText('Contraseña'), 'secreta123')
    await user.type(screen.getByLabelText('Confirmá la contraseña'), 'otracosa123')
    await user.click(screen.getByRole('button', { name: /crear cuenta/i }))

    expect(await screen.findByText('Las contraseñas no coinciden')).toBeInTheDocument()
    expect(signUp).not.toHaveBeenCalled()
  })

  it('muestra la pantalla de confirmación de email cuando session es null tras el registro', async () => {
    vi.mocked(signUp).mockResolvedValue({
      data: { user: { id: 'u1' }, session: null },
      error: null,
    } as unknown as Awaited<ReturnType<typeof signUp>>)

    const user = userEvent.setup()
    render(<RegisterPage />)

    await user.type(screen.getByLabelText('Email'), 'nuevo@ejemplo.com')
    await user.type(screen.getByLabelText('Contraseña'), 'secreta123')
    await user.type(screen.getByLabelText('Confirmá la contraseña'), 'secreta123')
    await user.click(screen.getByRole('button', { name: /crear cuenta/i }))

    expect(await screen.findByText('Revisá tu email')).toBeInTheDocument()
    expect(
      screen.getByText(/te enviamos un link de confirmación/i),
    ).toBeInTheDocument()
  })
})
