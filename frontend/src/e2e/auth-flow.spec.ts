import { test, expect } from '@playwright/test'

test.describe('Login', () => {
  test('renderiza y muestra error con credenciales inválidas', async ({ page }) => {
    await page.goto('/login')

    await expect(page.getByText('Iniciá sesión')).toBeVisible()

    await page.getByLabel('Email').fill('noexiste@ejemplo.com')
    await page.getByLabel('Contraseña', { exact: true }).fill('credencial-incorrecta')
    await page.getByRole('button', { name: /iniciar sesión/i }).click()

    await expect(page.getByText('Email o contraseña incorrectos.')).toBeVisible()
  })

  test('email inválido muestra error de validación antes de submit', async ({ page }) => {
    await page.goto('/login')

    await page.getByLabel('Email').fill('esto-no-es-un-email')
    await page.getByLabel('Contraseña', { exact: true }).fill('unapassword')
    await page.getByRole('button', { name: /iniciar sesión/i }).click()

    await expect(page.getByText(/email inválido/i)).toBeVisible()
  })

  test('contraseña vacía muestra error de validación', async ({ page }) => {
    await page.goto('/login')

    await page.getByLabel('Email').fill('test@hosty.ar')
    await page.getByRole('button', { name: /iniciar sesión/i }).click()

    await expect(page.getByText(/ingresá tu contraseña/i)).toBeVisible()
  })

  test('toggle de visibilidad de contraseña funciona', async ({ page }) => {
    await page.goto('/login')

    const passwordInput = page.getByLabel('Contraseña', { exact: true })
    await expect(passwordInput).toHaveAttribute('type', 'password')

    await page.getByRole('button', { name: /ver contraseña/i }).click()
    await expect(passwordInput).toHaveAttribute('type', 'text')

    await page.getByRole('button', { name: /ocultar contraseña/i }).click()
    await expect(passwordInput).toHaveAttribute('type', 'password')
  })
})

test.describe('Registro', () => {
  test('renderiza con el título "Creá tu cuenta"', async ({ page }) => {
    await page.goto('/register')
    await expect(page.getByText('Creá tu cuenta')).toBeVisible()
    await expect(page.getByRole('button', { name: /crear cuenta/i })).toBeVisible()
  })

  test('contraseñas que no coinciden muestran error de validación', async ({ page }) => {
    await page.goto('/register')

    await page.getByLabel('Email').fill('nuevo@hosty.ar')
    await page.getByLabel('Contraseña', { exact: true }).fill('secreta123')
    await page.getByLabel('Confirmá la contraseña').fill('diferente456')
    await page.getByRole('button', { name: /crear cuenta/i }).click()

    await expect(page.getByText(/las contraseñas no coinciden/i)).toBeVisible()
  })

  test('contraseña menor a 6 caracteres muestra error de validación', async ({ page }) => {
    await page.goto('/register')

    await page.getByLabel('Email').fill('nuevo@hosty.ar')
    await page.getByLabel('Contraseña', { exact: true }).fill('abc')
    await page.getByLabel('Confirmá la contraseña').fill('abc')
    await page.getByRole('button', { name: /crear cuenta/i }).click()

    await expect(page.getByText(/mínimo 6 caracteres/i)).toBeVisible()
  })

  test('email inválido en registro muestra error', async ({ page }) => {
    await page.goto('/register')

    await page.getByLabel('Email').fill('no-es-email')
    await page.getByLabel('Contraseña', { exact: true }).fill('secreta123')
    await page.getByLabel('Confirmá la contraseña').fill('secreta123')
    await page.getByRole('button', { name: /crear cuenta/i }).click()

    await expect(page.getByText(/email inválido/i)).toBeVisible()
  })
})

test.describe('Navegación entre login y registro', () => {
  test('se puede navegar entre login y registro', async ({ page }) => {
    await page.goto('/login')

    await page.getByRole('link', { name: /registrate/i }).click()
    await expect(page).toHaveURL(/register/)
    await expect(page.getByText('Creá tu cuenta')).toBeVisible()

    await page.getByRole('link', { name: /iniciá sesión/i }).click()
    await expect(page).toHaveURL(/login/)
    await expect(page.getByText('Iniciá sesión')).toBeVisible()
  })
})
