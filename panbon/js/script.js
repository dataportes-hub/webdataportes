// ============================================
// Pan Bon — script.js
//
// TODO para activar una venta real:
// 1. Cambia "activa" a true.
// 2. Pon la fecha real de la venta en "fecha" (formato "AAAA-MM-DDTHH:mm:00").
// 3. Ajusta "diasCierrePedidoAntes" si el cierre no es 3 días antes.
// 4. Pon tu número de WhatsApp en "whatsapp" (código de país + número, sin espacios).
// Cuando termine la venta, vuelve a poner "activa" en false hasta la próxima.
// ============================================

const VENTA = {
  activa: true,
  fecha: "2026-09-15T12:00:00",   // fecha y hora de la entrega / proyección de la venta
  diasCierrePedidoAntes: 3,        // cuántos días antes de "fecha" se cierran los pedidos
  whatsapp: "50767112592",
};

document.addEventListener("DOMContentLoaded", () => {
  if (VENTA.activa) {
    iniciarVentaActiva();
  } else {
    mostrarSinFecha();
  }
  setupOrderForm();
});

function mostrarSinFecha() {
  const fechaBlock = document.getElementById("estado-fecha");
  const countdown = document.getElementById("countdown");
  const cta = document.getElementById("cta-reservar");
  const pedidoInfo = document.getElementById("pedido-info");
  const submitBtn = document.getElementById("submit-pedido");

  fechaBlock.innerHTML = `
    Fecha por anunciar
    <span class="fecha-nota">Síguenos en Instagram — ahí avisamos apenas se abra la próxima venta.</span>
  `;
  countdown.innerHTML = "";
  cta.textContent = "Seguir en Instagram";
  cta.href = "https://instagram.com/TU_INSTAGRAM_PANBON";
  cta.target = "_blank";
  cta.rel = "noopener";

  pedidoInfo.textContent = "Todavía no hay una fecha de venta activa. Vuelve pronto o síguenos en Instagram para el aviso.";
  submitBtn.disabled = true;
  submitBtn.textContent = "Pedidos aún no disponibles";
}

function iniciarVentaActiva() {
  const fechaVenta = new Date(VENTA.fecha);
  const fechaCierre = new Date(fechaVenta);
  fechaCierre.setDate(fechaCierre.getDate() - VENTA.diasCierrePedidoAntes);

  const fechaBlock = document.getElementById("estado-fecha");
  const countdownEl = document.getElementById("countdown");
  const pedidoInfo = document.getElementById("pedido-info");
  const submitBtn = document.getElementById("submit-pedido");

  const fechaLarga = fechaVenta.toLocaleDateString("es-PA", {
    weekday: "long", day: "numeric", month: "long"
  });
  const cierreLargo = fechaCierre.toLocaleDateString("es-PA", {
    weekday: "long", day: "numeric", month: "long"
  });

  fechaBlock.innerHTML = `
    Venta: ${fechaLarga}
    <span class="fecha-nota">Cierre de pedidos: ${cierreLargo}</span>
  `;

  function actualizar() {
    const ahora = new Date();
    const diffVenta = fechaVenta - ahora;

    if (diffVenta <= 0) {
      countdownEl.innerHTML = `<p class="countdown-message">¡Hoy es el gran día! 🎉</p>`;
    } else {
      countdownEl.innerHTML = renderCountdown(diffVenta);
    }

    if (ahora > fechaCierre) {
      pedidoInfo.textContent = `Los pedidos para esta venta ya cerraron (${cierreLargo}). Síguenos en Instagram para la próxima tanda.`;
      submitBtn.disabled = true;
      submitBtn.textContent = "Pedidos cerrados";
    } else {
      pedidoInfo.textContent = `Pedidos abiertos hasta el ${cierreLargo}. Después de esa fecha no podremos tomar más pedidos para esta tanda.`;
      submitBtn.disabled = false;
      submitBtn.textContent = "Enviar pedido por WhatsApp";
    }
  }

  actualizar();
  setInterval(actualizar, 1000);
}

function renderCountdown(diffMs) {
  const segTotal = Math.floor(diffMs / 1000);
  const dias = Math.floor(segTotal / 86400);
  const horas = Math.floor((segTotal % 86400) / 3600);
  const min = Math.floor((segTotal % 3600) / 60);
  const seg = segTotal % 60;

  const unidad = (num, label) => `
    <div class="count-unit">
      <span class="count-num">${String(num).padStart(2, "0")}</span>
      <span class="count-label">${label}</span>
    </div>
  `;

  return unidad(dias, "días") + unidad(horas, "horas") + unidad(min, "min") + unidad(seg, "seg");
}

function setupOrderForm() {
  const form = document.getElementById("order-form");
  const note = document.getElementById("order-note");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const submitBtn = document.getElementById("submit-pedido");
    if (submitBtn.disabled) return;

    const cantidad = form.cantidad.value;
    const nombre = form.nombre.value.trim();
    const nota = form.nota.value.trim();

    const fechaLarga = new Date(VENTA.fecha).toLocaleDateString("es-PA", {
      day: "numeric", month: "long"
    });

    const partes = [
      `Hola, soy ${nombre || "un cliente"}.`,
      `Quiero reservar ${cantidad} pan(es) bon para la venta del ${fechaLarga}.`,
    ];
    if (nota) {
      partes.push(`Nota: ${nota}`);
    }

    const mensaje = encodeURIComponent(partes.join(" "));
    const url = `https://wa.me/${VENTA.whatsapp}?text=${mensaje}`;

    note.textContent = "Abriendo WhatsApp con tu pedido listo para enviar…";
    window.open(url, "_blank", "noopener");
  });
}
