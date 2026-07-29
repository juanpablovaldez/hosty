import { test, expect } from '@playwright/test'

test.describe('Detalle de salón', () => {
  test('click en card navega al detalle del salón', async ({ page }) => {
    await page.goto('/salones')

    const firstCard = page.locator('article').first()
    await expect(firstCard).toBeVisible({ timeout: 10_000 })

    const salonLink = firstCard.locator('a[href*="/salones/"]').first()
    const href = await salonLink.getAttribute('href')
    await salonLink.click()

    await expect(page).toHaveURL(new RegExp(href ?? '/salones/'))
  })

  test('página de detalle muestra h1 con el nombre del salón', async ({ page }) => {
    await page.goto('/salones')

    const firstCard = page.locator('article').first()
    await expect(firstCard).toBeVisible({ timeout: 10_000 })

    await firstCard.locator('a[href*="/salones/"]').first().click()

    await expect(page.getByRole('heading', { level: 1 })).toBeVisible({ timeout: 10_000 })
  })

  test('botón "Reservar ahora" o "Reservar" visible en salón disponible', async ({ page }) => {
    await page.goto('/salones')

    const firstCard = page.locator('article').first()
    await expect(firstCard).toBeVisible({ timeout: 10_000 })

    await firstCard.locator('a[href*="/salones/"]').first().click()

    await expect(page.getByRole('button', { name: /reservar/i }).first()).toBeVisible({
      timeout: 10_000,
    })
  })

  test('click en "Reservar" sin sesión redirige a /login', async ({ page }) => {
    await page.goto('/salones')

    const firstCard = page.locator('article').first()
    await expect(firstCard).toBeVisible({ timeout: 10_000 })

    await firstCard.locator('a[href*="/salones/"]').first().click()

    const reservarBtn = page.getByRole('button', { name: /reservar ahora/i }).first()
    await expect(reservarBtn).toBeVisible({ timeout: 10_000 })
    await reservarBtn.click()

    await expect(page).toHaveURL(/login|reservar/, { timeout: 8_000 })
  })

  test('breadcrumb o link de vuelta a salones visible', async ({ page }) => {
    await page.goto('/salones')

    const firstCard = page.locator('article').first()
    await expect(firstCard).toBeVisible({ timeout: 10_000 })

    await firstCard.locator('a[href*="/salones/"]').first().click()

    await expect(page.getByRole('heading', { level: 1 })).toBeVisible({ timeout: 10_000 })

    const backLink = page.getByRole('link', { name: /salones/i }).first()
    await expect(backLink).toBeVisible()
  })
})
