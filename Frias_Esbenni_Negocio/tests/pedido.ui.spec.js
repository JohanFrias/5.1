const { test, expect } = require('@playwright/test');

test.describe('UI - Formulario de pedido', () => {
  test('UI-05: enviar el formulario vacío muestra un error y no crea pedido', async ({ page }) => {
    await page.goto('/pedido.html');
    await page.getByRole('button', { name: 'Enviar pedido' }).click();
    const msg = page.locator('#mensaje-pedido');
    await expect(msg).toBeVisible();
    await expect(msg).toHaveClass(/error/);
    await expect(msg).toContainText('completa todos los campos');
  });

  test('UI-06: llenar y enviar el formulario confirma el pedido y limpia los campos', async ({ page }) => {
    await page.goto('/pedido.html');
    await page.getByLabel('Nombre:').fill('Esbenni Frias');
    await page.getByLabel('Dirección:').fill('Calle Duarte #12, Santo Domingo');
    await page.getByLabel('Teléfono:').fill('809-508-1967');
    await page.getByLabel('Detalles del pedido:').fill('2 cuadernos y 1 plastificación');

    // Esperamos la respuesta real de la API al enviar
    const [respuesta] = await Promise.all([
      page.waitForResponse((r) => r.url().includes('/api/pedidos') && r.request().method() === 'POST'),
      page.getByRole('button', { name: 'Enviar pedido' }).click(),
    ]);
    expect(respuesta.status()).toBe(201);

    const msg = page.locator('#mensaje-pedido');
    await expect(msg).toHaveClass(/ok/);
    await expect(msg).toContainText('Pedido #');
    await expect(msg).toContainText('Esbenni Frias');
    await expect(page.getByLabel('Nombre:')).toHaveValue('');
  });

  test('UI-07: el enlace de WhatsApp apunta al número del negocio', async ({ page }) => {
    await page.goto('/pedido.html');
    const enlace = page.locator('#enlace-whatsapp');
    await expect(enlace).toHaveAttribute('href', 'https://wa.me/8095081967');
    await expect(enlace).toHaveAttribute('target', '_blank');
  });
});
