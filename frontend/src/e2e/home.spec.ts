import { test, expect } from '@playwright/test'

test.describe('Home page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('muestra el hero con el h1 principal', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1 })).toContainText('El salón perfecto')
  })

  test('muestra la sección "Salones destacados"', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /salones destacados/i })).toBeVisible({
      timeout: 10_000,
    })
  })

  test('muestra la sección "Cómo funciona"', async ({ page }) => {
    await expect(page.locator('#como-funciona')).toBeVisible()
    await expect(page.locator('#como-funciona').getByText(/cómo funciona/i).first()).toBeVisible()
  })

  test('chips de tipo de evento visibles en el hero', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Casamientos' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Cumpleaños' })).toBeVisible()
  })

  test('click en chip navega a /salones con filtro de tipo de evento', async ({ page }) => {
    await page.getByRole('button', { name: 'Casamientos' }).click()
    await expect(page).toHaveURL(/salones/)
    await expect(page).toHaveURL(/Casamientos/)
  })

  test('trust indicators con "+120 salones verificados" visibles', async ({ page }) => {
    await expect(page.getByText(/\+120/)).toBeVisible()
    await expect(page.getByText(/salones verificados/)).toBeVisible()
  })

  test('el link "Publicar tu salón" del host CTA navega a /login o /host/create', async ({ page }) => {
    const hostCtaLink = page.getByRole('link', { name: /publicar (tu )?salón/i }).last()
    await expect(hostCtaLink).toBeVisible()
  })
})
