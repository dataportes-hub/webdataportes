// ============================================
// DataPorte — script.js
// ============================================

// Número de WhatsApp que recibe los pedidos.
// Formato: código de país + número, sin espacios ni símbolos.
// Ejemplo Panamá: "507" + "60001234" -> "50760001234"
const WHATSAPP_NUMBER = "50700000000";

document.addEventListener("DOMContentLoaded", () => {
  setFooterYear();
  setupNavToggle();
  setupOrderForm();
});

function setFooterYear() {
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

function setupNavToggle() {
  const toggle = document.getElementById("nav-toggle");
  const nav = document.getElementById("main-nav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  // Cierra el menú al elegir una sección (útil en móvil)
  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

function setupOrderForm() {
  const form = document.getElementById("order-form");
  const note = document.getElementById("order-note");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const producto = form.producto.value;
    const detalle = form.detalle.value.trim();
    const nombre = form.nombre.value.trim();

    const partes = [
      `Hola, soy ${nombre || "un cliente"}.`,
      `Quiero hacer un pedido de: ${producto}.`,
    ];
    if (detalle) {
      partes.push(`Detalle: ${detalle}`);
    }

    const mensaje = encodeURIComponent(partes.join(" "));
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${mensaje}`;

    if (note) {
      note.textContent = "Abriendo WhatsApp con tu pedido listo para enviar…";
    }

    window.open(url, "_blank", "noopener");
  });
}
