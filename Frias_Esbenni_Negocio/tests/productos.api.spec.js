const { test, expect } = require('@playwright/test');

test.describe('API - /api/productos', () => {
  test('API-01: GET /api/productos devuelve 200 y una lista JSON válida', async ({ request }) => {
    const res = await request.get('/api/productos');
    expect(res.status()).toBe(200);
    expect(res.headers()['content-type']).toContain('application/json');

    const productos = await res.json();
    expect(Array.isArray(productos)).toBe(true);
    expect(productos).toHaveLength(6);
    for (const p of productos) {
      expect(p).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          nombre: expect.any(String),
          categoria: expect.any(String),
          descripcion: expect.any(String),
        })
      );
    }
  });

  test('API-02: GET /api/productos?categoria=servicios filtra correctamente', async ({ request }) => {
    const res = await request.get('/api/productos', { params: { categoria: 'servicios' } });
    expect(res.status()).toBe(200);
    const productos = await res.json();
    expect(productos.map((p) => p.nombre)).toEqual(['Copias e impresión', 'Plastificación']);
    expect(productos.every((p) => p.categoria === 'servicios')).toBe(true);
  });

  test('API-03: GET /api/productos/3 devuelve 200 con el producto "Costura"', async ({ request }) => {
    const res = await request.get('/api/productos/3');
    expect(res.status()).toBe(200);
    const p = await res.json();
    expect(p.id).toBe(3);
    expect(p.nombre).toBe('Costura');
  });

  test('API-04: GET /api/productos/999 devuelve 404 con mensaje de error JSON', async ({ request }) => {
    const res = await request.get('/api/productos/999');
    expect(res.status()).toBe(404);
    expect(await res.json()).toEqual({ error: 'Producto no encontrado' });
  });

  test('API-05: GET /api/productos/abc devuelve 400 (id inválido)', async ({ request }) => {
    const res = await request.get('/api/productos/abc');
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body).toHaveProperty('error');
  });
});
