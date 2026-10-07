const { test, expect } = require('@playwright/test');

test.describe('UI - Navegación entre páginas', () => {
  test('UI-01: el menú navega entre Inicio, Productos y Contacto/Pedido', async ({ page }) => {
    const menu = page.getByRole('navigation', { name: 'Menú principal' });
    await page.goto('/index.html');
    await expect(page).toHaveTitle(/Inicio/);
    await expect(page.locator('#titulo')).toHaveText('Papeleria Y Merceria La Profe');

    await menu.getByRole('link', { name: 'Productos' }).click();
    await expect(page).toHaveURL(/productos\.html$/);
    await expect(page.getByRole('heading', { name: 'Productos y Servicios' })).toBeVisible();

    await menu.getByRole('link', { name: 'Contacto y Pedido' }).click();
    await expect(page).toHaveURL(/pedido\.html$/);
    await expect(page.getByRole('heading', { name: 'Realizar Pedido' })).toBeVisible();

    await menu.getByRole('link', { name: 'Inicio' }).click();
    await expect(page).toHaveURL(/index\.html$/);
    // el enlace de la página actual queda marcado en el menú
    await expect(page.locator('nav a[data-nav="inicio"]')).toHaveAttribute('aria-current', 'page');
  });

  test('UI-02: los botones de la portada llevan a Productos y a Pedido', async ({ page }) => {
    await page.goto('/index.html');
    await page.locator('#btn-ver-productos').click();
    await expect(page).toHaveURL(/productos\.html$/);

    await page.goto('/index.html');
    await page.locator('#btn-hacer-pedido').click();
    await expect(page).toHaveURL(/pedido\.html$/);
  });
});
