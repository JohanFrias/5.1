// Carga los productos desde la API y permite filtrarlos por categoria.
const lista = document.getElementById('lista-productos');
const estado = document.getElementById('estado-productos');
const botones = document.querySelectorAll('.filtro');

async function cargar(categoria = '') {
  estado.textContent = 'Cargando productos...';
  try {
    const url = categoria ? `/api/productos?categoria=${encodeURIComponent(categoria)}` : '/api/productos';
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const datos = await res.json();
    lista.innerHTML = '';
    datos.forEach((p) => {
      const div = document.createElement('div');
      div.className = 'producto';
      div.dataset.id = p.id;
      const h3 = document.createElement('h3');
      h3.textContent = p.nombre;
      const desc = document.createElement('p');
      desc.textContent = p.descripcion;
      div.append(h3, desc);
      lista.appendChild(div);
    });
    estado.textContent = `${datos.length} resultado(s)`;
  } catch (e) {
    estado.textContent = 'No se pudieron cargar los productos. Intenta de nuevo.';
  }
}

botones.forEach((b) =>
  b.addEventListener('click', () => {
    botones.forEach((x) => x.classList.remove('activo'));
    b.classList.add('activo');
    cargar(b.dataset.categoria);
  })
);

cargar();
