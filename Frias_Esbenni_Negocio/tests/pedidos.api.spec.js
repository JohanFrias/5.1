const { test, expect } = require('@playwright/test');

const pedidoValido = {
  nombre: 'María Pérez',
  direccion: 'Av. Independencia #45',
  telefono: '809-555-1234',
  detalles: '10 hojas de colores y 1 impresión',
};

test.describe('API - /api/pedidos', () => {
  test('API-06: POST /api/pedidos con datos válidos devuelve 201 y el pedido creado', async ({ request }) => {
    const res = await request.post('/api/pedidos', { data: pedidoValido });
    expect(res.status()).toBe(201);
    const pedido = await res.json();
    expect(pedido).toMatchObject({ ...pedidoValido, estado: 'recibido' });
    expect(pedido.id).toEqual(expect.any(Number));
    expect(new Date(pedido.fecha).toString()).not.toBe('Invalid Date');
  });

  test('API-07: el pedido creado se puede consultar con GET /api/pedidos/:id', async ({ request }) => {
    const creado = await (await request.post('/api/pedidos', { data: pedidoValido })).json();
    const res = await request.get(`/api/pedidos/${creado.id}`);
    expect(res.status()).toBe(200);
    expect((await res.json()).nombre).toBe(pedidoValido.nombre);
  });

  test('API-08: POST /api/pedidos sin campos obligatorios devuelve 400 y lista los faltantes', async ({ request }) => {
    const res = await request.post('/api/pedidos', { data: { nombre: 'Solo nombre' } });
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.error).toBe('Datos incompletos');
    expect(body.faltantes).toEqual(['direccion', 'telefono', 'detalles']);
  });

  test('API-09: POST /api/pedidos con teléfono inválido devuelve 400', async ({ request }) => {
    const res = await request.post('/api/pedidos', { data: { ...pedidoValido, telefono: 'abc' } });
    expect(res.status()).toBe(400);
    expect((await res.json()).faltantes).toEqual(['telefono']);
  });

  test('API-10: GET /api/pedidos/99999 y una ruta inexistente devuelven 404', async ({ request }) => {
    expect((await request.get('/api/pedidos/99999')).status()).toBe(404);
    const res = await request.get('/api/no-existe');
    expect(res.status()).toBe(404);
    expect(await res.json()).toHaveProperty('error');
  });
});
