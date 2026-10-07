// Valida el formulario y envia el pedido a la API (POST /api/pedidos).
const form = document.getElementById('form-pedido');
const mensaje = document.getElementById('mensaje-pedido');

function mostrar(texto, tipo) {
  mensaje.textContent = texto;
  mensaje.className = `mensaje ${tipo}`;
  mensaje.hidden = false;
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const datos = Object.fromEntries(new FormData(form).entries());

  if (Object.values(datos).some((v) => !String(v).trim())) {
    mostrar('Por favor completa todos los campos.', 'error');
    return;
  }

  try {
    const res = await fetch('/api/pedidos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos),
    });
    const json = await res.json();
    if (res.status === 201) {
      mostrar(`¡Pedido #${json.id} recibido! Te contactaremos pronto, ${json.nombre}.`, 'ok');
      form.reset();
    } else {
      mostrar(json.error || 'No se pudo enviar el pedido.', 'error');
    }
  } catch (err) {
    mostrar('Error de conexión. Intenta de nuevo.', 'error');
  }
});
