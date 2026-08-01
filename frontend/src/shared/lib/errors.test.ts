import { describe, it, expect } from 'vitest'
import { mensajeDeError } from './errors'

describe('mensajeDeError', () => {
  it('traduce el error de email ya registrado de Supabase Auth', () => {
    expect(mensajeDeError({ message: 'User already registered' })).toBe(
      'Ya existe una cuenta con ese email. Iniciá sesión o usá otro email.',
    )
  })

  it('traduce credenciales inválidas', () => {
    expect(mensajeDeError(new Error('Invalid login credentials'))).toBe('Email o contraseña incorrectos.')
  })

  it('conserva el número de caracteres exigido por el servidor', () => {
    expect(mensajeDeError({ message: 'Password should be at least 6 characters.' })).toBe(
      'La contraseña debe tener al menos 6 caracteres.',
    )
  })

  it('conserva los segundos de espera del límite de intentos', () => {
    expect(
      mensajeDeError({ message: 'For security purposes, you can only request this after 42 seconds.' }),
    ).toBe('Por seguridad, esperá 42 segundos antes de volver a intentarlo.')
  })

  it('traduce una violación de política RLS a un mensaje de permisos', () => {
    expect(
      mensajeDeError({ message: 'new row violates row-level security policy for table "salones"' }),
    ).toBe('No tenés permiso para realizar esta acción.')
  })

  it('nunca devuelve el texto crudo en inglés cuando no hay traducción', () => {
    const resultado = mensajeDeError({ message: 'Some untranslated backend failure' })
    expect(resultado).not.toContain('untranslated')
    expect(resultado).toBe('Ocurrió un error inesperado. Intentá de nuevo en unos minutos.')
  })

  it('usa el respaldo indicado cuando el error viene vacío', () => {
    expect(mensajeDeError(null, 'No pudimos crear tu cuenta.')).toBe('No pudimos crear tu cuenta.')
    expect(mensajeDeError({ message: '   ' }, 'No pudimos crear tu cuenta.')).toBe('No pudimos crear tu cuenta.')
  })
})
