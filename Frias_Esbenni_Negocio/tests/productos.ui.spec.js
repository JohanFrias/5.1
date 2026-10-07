const { test, expect } = require('@playwright/test');

test.describe('UI - Página de productos', () => {
  test('UI-03: muestra los 6 productos cargados desde la API', async ({ page }) => {
    await page.goto('/productos.html');
    const tarjetas = page.locator('#lista-productos .producto');
    await expect(tarjetas).toHaveCount(6);
    await expect(tarjetas.first().locator('h3')).toHaveText('Papelería');
    await expect(page.locator('#estado-productos')).toHaveText('6 resultado(s)');
  });

  test('UI-04: el botón de filtro "Servicios" muestra solo los servicios', async ({ page }) => {
    await page.goto('/productos.html');
    await expect(page.locator('#lista-productos .producto')).toHaveCount(6);

    await page.getByRole('button', { name: 'Servicios' }).click();

    const tarjetas = page.locator('#lista-productos .producto');
    await expect(tarjetas).toHaveCount(2);
    await expect(tarjetas.locator('h3')).toHaveText(['Copias e impresión', 'Plastificación']);
    await expect(page.getByRole('button', { name: 'Servicios' })).toHaveClass(/activo/);

    await page.getByRole('button', { name: 'Todos' }).click();
    await expect(page.locator('#lista-productos .producto')).toHaveCount(6);
  });
});
