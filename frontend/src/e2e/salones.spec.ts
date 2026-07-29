import { test, expect } from '@playwright/test'

test.describe('Página de salones', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/salones')
    await expect(page.locator('article').first()).toBeVisible({ timeout: 12_000 })
  })

  test('carga la página con heading y al menos un card', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /salones cerca tuyo/i })).toBeVisible()
  })

  test('los cards tienen links hacia el detalle del salón', async ({ page }) => {
    const salonLinks = page.locator('article a[href*="/salones/"]')
    await expect(salonLinks.first()).toBeVisible()
  })

  test('filtrar por chip "Casamientos" actualiza la URL y mantiene resultados', async ({ page }) => {
    await page.getByRole('button', { name: 'Casamientos' }).click()

    await expect(page).toHaveURL(/Casamientos/)
    await expect(page.locator('article').first()).toBeVisible({ timeout: 10_000 })
  })

  test('cambiar chip activo actualiza el filtro en la URL', async ({ page }) => {
    await page.getByRole('button', { name: 'Casamientos' }).click()
    await expect(page).toHaveURL(/Casamientos/)

    await page.getByRole('button', { name: 'Cumpleaños' }).click()
    await expect(page).toHaveURL(/Cumplea/)
  })

  test('buscar por nombre actualiza la URL con el parámetro "busqueda"', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/buscar por nombre/i)
    await expect(searchInput).toBeVisible()

    await searchInput.fill('Los Aromos')
    await searchInput.press('Enter')

    await expect(page).toHaveURL(/busqueda=Los\+Aromos|busqueda=Los%20Aromos/)
  })

  test('selector de orden actualiza la URL con sortBy', async ({ page }) => {
    const sortSelect = page.locator('select').first()
    if (await sortSelect.isVisible()) {
      await sortSelect.selectOption('price_asc')
      await expect(page).toHaveURL(/price_asc/)
    } else {
      const sortBtn = page.getByRole('combobox').first()
      await sortBtn.selectOption('price_asc')
      await expect(page).toHaveURL(/price_asc/)
    }
  })

  test('pill "Guardar en favoritos" redirige a /login si no hay sesión', async ({ page }) => {
    const favBtn = page.getByRole('button', { name: /guardar en favoritos/i }).first()
    await expect(favBtn).toBeVisible()
    await favBtn.click()

    await expect(page).toHaveURL(/login/)
  })

  test('vista mapa toggle muestra el mapa', async ({ page }) => {
    const mapToggle = page.getByRole('button', { name: /mapa/i }).first()
    if (await mapToggle.isVisible()) {
      await mapToggle.click()
      await expect(page.locator('.leaflet-container, [class*="map"]').first()).toBeVisible({
        timeout: 8_000,
      })
    }
  })
})
