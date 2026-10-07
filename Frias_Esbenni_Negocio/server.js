
const http = require('http');
const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = path.join(__dirname, 'public');
const TIPOS = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
};

const productos = [
  { id: 1, nombre: 'Papelería', categoria: 'papeleria', descripcion: 'Lápices, papeles y materiales escolares.' },
  { id: 2, nombre: 'Mercería', categoria: 'merceria', descripcion: 'Materiales para costura y manualidades.' },
  { id: 3, nombre: 'Costura', categoria: 'merceria', descripcion: 'Artículos y materiales para tus proyectos de costura.' },
  { id: 4, nombre: 'Bisutería', categoria: 'manualidades', descripcion: 'Mostacillas y materiales para crear accesorios.' },
  { id: 5, nombre: 'Copias e impresión', categoria: 'servicios', descripcion: 'Servicio de copias e impresión de documentos.' },
  { id: 6, nombre: 'Plastificación', categoria: 'servicios', descripcion: 'Protección y plastificación de documentos.' },
];
const pedidos = [];

function enviarJSON(res, status, cuerpo) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(cuerpo));
}

function leerJSON(req) {
  return new Promise((resolve) => {
    let datos = '';
    req.on('data', (c) => { datos += c; if (datos.length > 1e6) req.destroy(); });
    req.on('end', () => {
      try { resolve(JSON.parse(datos || '{}')); } catch { resolve(null); }
    });
  });
}

async function manejarAPI(req, res, url) {
  const ruta = url.pathname.replace(/\/+$/, '');
  const partes = ruta.split('/').filter(Boolean); // ['api', 'productos', '3']
  const recurso = partes[1];
  const idTexto = partes[2];

  // GET /api/productos 
  if (req.method === 'GET' && recurso === 'productos' && idTexto === undefined) {
    const categoria = url.searchParams.get('categoria');
    return enviarJSON(res, 200, categoria ? productos.filter((p) => p.categoria === categoria) : productos);
  }

  // GET /api/productos/:id 200, 400 id invalido o 404
  if (req.method === 'GET' && recurso === 'productos' && partes.length === 3) {
    const id = Number(idTexto);
    if (!Number.isInteger(id) || id <= 0) {
      return enviarJSON(res, 400, { error: 'El id debe ser un número entero positivo' });
    }
    const producto = productos.find((p) => p.id === id);
    return producto
      ? enviarJSON(res, 200, producto)
      : enviarJSON(res, 404, { error: 'Producto no encontrado' });
  }

  // POST /api/pedidos 201 si es valido, 400 si faltan datos
  if (req.method === 'POST' && recurso === 'pedidos' && partes.length === 2) {
    const body = await leerJSON(req);
    if (body === null) return enviarJSON(res, 400, { error: 'JSON inválido' });
    const campos = ['nombre', 'direccion', 'telefono', 'detalles'];
    const faltantes = campos.filter((k) => typeof body[k] !== 'string' || body[k].trim() === '');
    if (faltantes.length) return enviarJSON(res, 400, { error: 'Datos incompletos', faltantes });
    if (!/^[0-9+\-\s()]{7,20}$/.test(body.telefono.trim())) {
      return enviarJSON(res, 400, { error: 'Teléfono inválido', faltantes: ['telefono'] });
    }
    const pedido = {
      id: pedidos.length + 1,
      nombre: body.nombre.trim(),
      direccion: body.direccion.trim(),
      telefono: body.telefono.trim(),
      detalles: body.detalles.trim(),
      estado: 'recibido',
      fecha: new Date().toISOString(),
    };
    pedidos.push(pedido);
    return enviarJSON(res, 201, pedido);
  }

  // GET /api/pedidos/ 200 o 404
  if (req.method === 'GET' && recurso === 'pedidos' && partes.length === 3) {
    const pedido = pedidos.find((p) => p.id === Number(idTexto));
    return pedido
      ? enviarJSON(res, 200, pedido)
      : enviarJSON(res, 404, { error: 'Pedido no encontrado' });
  }

  enviarJSON(res, 404, { error: 'Ruta de API no encontrada' });
}

function servirEstatico(req, res, url) {
  let pathname = decodeURIComponent(url.pathname);
  if (pathname === '/') pathname = '/index.html';
  const archivo = path.normalize(path.join(PUBLIC_DIR, pathname));
  if (!archivo.startsWith(PUBLIC_DIR)) { res.writeHead(403); return res.end('Prohibido'); }
  fs.readFile(archivo, (err, contenido) => {
    if (err) { res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }); return res.end('No encontrado'); }
    res.writeHead(200, { 'Content-Type': TIPOS[path.extname(archivo)] || 'application/octet-stream' });
    res.end(contenido);
  });
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  if (url.pathname.startsWith('/api/')) return manejarAPI(req, res, url);
  servirEstatico(req, res, url);
});

const PORT = process.env.PORT || 3000;
if (require.main === module) {
  server.listen(PORT, () => console.log(`La Profe corriendo en http://localhost:${PORT}`));
}
module.exports = server;
