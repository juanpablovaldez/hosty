import { test, expect } from '@playwright/test';

test.describe('Flujo de reserva de salones', () => {

  test('la home carga correctamente', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/hosty/i);
    await expect(page.getByText('Celebrá cerca')).toBeVisible();
  });

  test('se pueden ver los salones sin estar logueado', async ({ page }) => {
    await page.goto('/salones');
    await expect(page.getByText('Salones cerca tuyo')).toBeVisible();
  });

  test('se puede ver el detalle de un salón', async ({ page }) => {
    await page.goto('/salones');
    const primerSalon = page.locator('a[href*="/salones/"]').first();
    await primerSalon.click();
    await expect(page.getByText('Reservar ahora')).toBeVisible();
    await expect(page.getByText('Verificado')).toBeVisible();
  });

  test('intentar reservar sin login redirige al login', async ({ page }) => {
    await page.goto('/salones');
    const primerSalon = page.locator('a[href*="/salones/"]').first();
    await primerSalon.click();
    await page.getByText('Reservar ahora').click();
    await expect(page).toHaveURL(/login|iniciar-sesion|auth/i);
  });

  test('la página de login se muestra correctamente', async ({ page }) => {
    await page.goto('/salones');
    const primerSalon = page.locator('a[href*="/salones/"]').first();
    await primerSalon.click();
    await page.getByText('Reservar ahora').click();
    await expect(page.getByText('Iniciá sesión').first()).toBeVisible();
  });

});