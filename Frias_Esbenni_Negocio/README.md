# Papelería y Mercería La Profe – Pruebas automatizadas con Playwright

## Estructura
```
public/            Sitio web (index.html, productos.html, pedido.html, CSS, JS, imágenes)
server.js          Servidor Node (sin dependencias): sitio + API JSON
tests/             Pruebas Playwright (*.ui.spec.js y *.api.spec.js)
playwright.config.js
```

## API
| Método | Ruta | Respuestas |
|---|---|---|
| GET  | /api/productos[?categoria=servicios] | 200 |
| GET  | /api/productos/:id | 200, 400 (id inválido), 404 |
| POST | /api/pedidos | 201, 400 (datos incompletos / teléfono inválido) |
| GET  | /api/pedidos/:id | 200, 404 |

## Cómo ejecutar
```bash
npm install
npx playwright install chromium
npm test              # todas las pruebas (levanta el servidor solo)
npm run test:ui       # solo interfaz
npm run test:api      # solo API
npm run test:report   # abrir reporte HTML
npm start             # ver el sitio en http://localhost:3000
```

## Casos de prueba
**UI (7):** UI-01 menú navega entre páginas · UI-02 botones de portada · UI-03 productos cargados desde la API ·
UI-04 botones de filtro · UI-05 formulario vacío muestra error · UI-06 formulario válido confirma pedido (201) ·
UI-07 enlace de WhatsApp.

**API (10):** API-01 GET lista 200 + JSON · API-02 filtro por categoría · API-03 GET por id 200 · API-04 404 ·
API-05 400 id inválido · API-06 POST 201 · API-07 GET pedido creado · API-08 POST 400 campos faltantes ·
API-09 POST 400 teléfono inválido · API-10 404 pedido/ruta inexistente.
