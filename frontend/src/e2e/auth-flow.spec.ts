import { test, expect } from '@playwright/test'

test.describe('Flujo de autenticación (register / login)', () => {
  test('la página de login renderiza y muestra error con credenciales inválidas', async ({ page }) => {
    await page.goto('/login')

    await expect(page.getByText('Iniciá sesión')).toBeVisible()

    await page.getByLabel('Email').fill('noexiste@ejemplo.com')
    await page.getByLabel('Contraseña', { exact: true }).fill('credencial-incorrecta')
    await page.getByRole('button', { name: /iniciar sesión/i }).click()

    await expect(page.getByText('Email o contraseña incorrectos.')).toBeVisible()
  })

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
