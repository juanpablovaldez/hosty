import { test, expect } from '@playwright/test'

test.describe('Navegación global', () => {
  test('logo del header navega a /', async ({ page }) => {
    await page.goto('/salones')
    await page.locator('header a').first().click()
    await expect(page).toHaveURL('/')
  })

  test('link "Salones" del header navega a /salones', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('navigation').getByRole('link', { name: 'Salones' }).click()
    await expect(page).toHaveURL(/\/salones/)
  })

  test('link "Iniciar sesión" del header navega a /login cuando no hay sesión', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: /iniciar sesión/i }).first().click()
    await expect(page).toHaveURL(/login/)
  })

  test('ruta protegida /mis-reservas redirige a /login sin sesión', async ({ page }) => {
    await page.goto('/mis-reservas')
    await expect(page).toHaveURL(/login/)
  })

  test('ruta protegida /mi-perfil redirige a /login sin sesión', async ({ page }) => {
    await page.goto('/mi-perfil')
    await expect(page).toHaveURL(/login/)
  })

  test('ruta protegida /mis-favoritos redirige a /login sin sesión', async ({ page }) => {
    await page.goto('/mis-favoritos')
    await expect(page).toHaveURL(/login/)
  })

  test('ruta protegida /host/dashboard redirige a /login sin sesión', async ({ page }) => {
    await page.goto('/host/dashboard')
    await expect(page).toHaveURL(/login/)
  })

  test('/login guarda el redirect param en la URL', async ({ page }) => {
    await page.goto('/mis-reservas')
    await expect(page).toHaveURL(/login/)
    await expect(page).toHaveURL(/redirect/)
  })
})
