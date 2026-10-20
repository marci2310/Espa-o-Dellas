/*
 * ESPAÇO DELLAS — CONFIGURAÇÃO PRINCIPAL
 * Edite os dados desta seção para adaptar o site ao salão.
 */
const CONFIG = {
  business: {
    name: "Espaço dellas",
    whatsapp: "5581973475644", // somente números, com 55 + DDD + número.
    whatsappDisplay: "(81) 97347-5644",
    instagram: "", // ex.: "@espacodellas" — deixe vazio para esconder o link
    instagramUrl: "", // ex.: "https://instagram.com/espacodellas"
    googleUrl: "https://www.google.com/search?q=Espa%C3%A7o+dellas+Camaragibe", // link das avaliações no Google
    addressLines: ["Galeria Oca dos Camarás — Aldeia dos Camarás", "Camaragibe — PE · CEP 54783-010"],
    mapsQuery: "Galeria Oca dos Camarás, Aldeia dos Camarás, Camaragibe, PE"
  },
  opening: {
    // Date.getDay(): 0 domingo, 1 segunda, 2 terça, 3 quarta, 4 quinta, 5 sexta, 6 sábado.
    openDays: [2, 3, 4, 5, 6],
    openAt: "09:00",
    closeAt: "18:00",
    label: "Terça a sábado, das 9h às 18h"
  },
  // Para mostrar preço no site, acrescente price: 50 (em reais) em qualquer serviço.
  services: [
    { id: "depilacao", name: "Depilação com cera", icon: "✦", description: "Pele macia e um cuidado feito com delicadeza." },
    { id: "sobrancelha", name: "Design de sobrancelha", icon: "⌁", description: "Um desenho que valoriza o seu olhar." },
    { id: "escova", name: "Escova", icon: "⌇", description: "Fios leves, movimento e aquele acabamento lindo." },
    { id: "manicure", name: "Manicure", icon: "♡", description: "Unhas cuidadas para você se sentir ainda mais bonita." },
    { id: "pedicure", name: "Pedicure", icon: "◌", description: "Um momento de pausa e cuidado para os pés." },
    { id: "acrilicas", name: "Unhas acrílicas", icon: "✧", description: "Estrutura, beleza e acabamento personalizado." },
    { id: "maquiagem", name: "Maquiagem", icon: "◒", description: "Para realçar a sua beleza em dias especiais." },
    { id: "penteados", name: "Penteados", icon: "♧", description: "Um toque especial para celebrar cada ocasião." },
    { id: "shampoo", name: "Shampoo e condicionador", icon: "❋", description: "Um ritual gostoso para começar o cuidado." }
  ],
  // Avaliações reais do Google (a nota 5,0 e o total de 41 ficam no index.html).
  reviews: [
    { author: "ATALA rebeca", stars: 5, text: "Espaço muito confortável, aconchegante e feminino. Gostei muito dos serviços que realizei. Recomendo." },
    { author: "Patricia Terencio Marcon", stars: 5, text: "Amei o atendimento, o cuidado e a perfeição dos serviços. Super indico e virei cliente 😍🥰😘" },
    { author: "thereza pessoa", stars: 5, text: "Ótimo atendimento, ambiente aconchegante, bons profissionais, super recomendo" }
  ]
};

const PLACEHOLDER_WHATSAPP = "5581999999999";

const state = {
  step: 1,
  selectedServices: [],
  name: "",
  note: "",
  lastWhatsappLink: ""
};

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[character]));
}

function normalizeDigits(value) {
  return String(value || "").replace(/\D/g, "");
}

function formatCurrency(value) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function getSelectedServiceObjects() {
  return CONFIG.services.filter((service) => state.selectedServices.includes(service.id));
}

// "manicure", "manicure e pedicure", "manicure, pedicure e maquiagem"
function joinList(items) {
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")} e ${items[items.length - 1]}`;
}

// "anna  silva" → "Anna Silva" (só mexe quando a pessoa digitou tudo em minúsculas ou MAIÚSCULAS)
function formatName(raw) {
  const clean = String(raw || "").trim().replace(/\s+/g, " ");
  if (clean !== clean.toLowerCase() && clean !== clean.toUpperCase()) return clean;
  const small = new Set(["da", "de", "do", "das", "dos", "e"]);
  return clean.split(" ").map((word, index) => {
    const lower = word.toLowerCase();
    return index > 0 && small.has(lower) ? lower : lower.charAt(0).toUpperCase() + lower.slice(1);
  }).join(" ");
}

function buildWhatsappMessage() {
  const name = formatName(state.name) || "[seu nome]";
  const services = joinList(getSelectedServiceObjects().map((service) => service.name.toLowerCase()));
  const lines = [
    `Olá, ${CONFIG.business.name}! 😊`,
    `Me chamo ${name} e gostaria de saber mais sobre ${services || "os serviços"}.`,
    "Poderiam me passar os valores e os horários disponíveis?"
  ];
  if (state.note.trim()) lines.push("", `Observação: ${state.note.trim()}`);
  lines.push("", "Desde já, agradeço!");
  return lines.join("\n");
}

function renderBusinessDetails() {
  const business = CONFIG.business;
  const whatsappLink = `https://wa.me/${normalizeDigits(business.whatsapp)}`;
  const directionsLink = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(business.mapsQuery)}`;
  $("#business-address").innerHTML = business.addressLines.map((line) => escapeHTML(line)).join("<br />");
  $("#business-hours").textContent = CONFIG.opening.label;
  $("#business-whatsapp").textContent = business.whatsappDisplay;
  $("#business-whatsapp").href = whatsappLink;
  const hasInstagram = Boolean(business.instagram && business.instagramUrl);
  ["#business-instagram", "#footer-instagram"].forEach((selector) => {
    const link = $(selector);
    if (!hasInstagram) { link.hidden = true; return; }
    link.textContent = business.instagram;
    link.href = business.instagramUrl;
  });
  $("#footer-whatsapp").textContent = business.whatsappDisplay;
  $("#footer-whatsapp").href = whatsappLink;
  $("#floating-whatsapp").href = `${whatsappLink}?text=${encodeURIComponent("Olá! Gostaria de conhecer os serviços do Espaço dellas.")}`;
  $("#directions-link").href = directionsLink;
  $("#google-link").href = business.googleUrl;
  $("#current-year").textContent = new Date().getFullYear();
  renderBusinessSchema();
}

function renderBusinessSchema() {
  const schemaNode = $("#local-business-schema");
  if (!schemaNode) return;
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const schema = JSON.parse(schemaNode.textContent);
  if (normalizeDigits(CONFIG.business.whatsapp) !== PLACEHOLDER_WHATSAPP) schema.telephone = `+${normalizeDigits(CONFIG.business.whatsapp)}`;
  schema.openingHoursSpecification = [{
    "@type": "OpeningHoursSpecification",
    dayOfWeek: CONFIG.opening.openDays.map((day) => dayNames[day]),
    opens: CONFIG.opening.openAt,
    closes: CONFIG.opening.closeAt
  }];
  schemaNode.textContent = JSON.stringify(schema);
}

function renderServices() {
  $("#service-options").innerHTML = CONFIG.services.map((service) => `
    <article class="service-card ${state.selectedServices.includes(service.id) ? "selected" : ""}" data-service-card="${service.id}">
      <div class="service-card-top"><span class="service-icon" aria-hidden="true">${service.icon}</span><span class="service-check" aria-hidden="true">✓</span></div>
      <h3>${escapeHTML(service.name)}</h3>
      <p>${escapeHTML(service.description)}</p>
      ${service.price != null ? `<div class="service-meta"><span>${formatCurrency(service.price)}</span></div>` : ""}
      <button class="service-quick" type="button" data-quick-service="${service.id}">Agendar este serviço <span aria-hidden="true">↗</span></button>
    </article>`).join("");
  $("#wizard-services").innerHTML = CONFIG.services.map((service) => `
    <button class="wizard-service ${state.selectedServices.includes(service.id) ? "selected" : ""}" type="button" data-wizard-service="${service.id}" aria-pressed="${state.selectedServices.includes(service.id)}">
      <span class="wizard-service-main"><span class="service-icon" aria-hidden="true">${service.icon}</span><span><strong>${escapeHTML(service.name)}</strong></span></span>
      <span class="wizard-service-price">${service.price != null ? `${formatCurrency(service.price)} ` : ""}<span class="wizard-service-check" aria-hidden="true">✓</span></span>
    </button>`).join("");
}

function toggleService(serviceId) {
  if (state.selectedServices.includes(serviceId)) {
    state.selectedServices = state.selectedServices.filter((id) => id !== serviceId);
  } else {
    state.selectedServices.push(serviceId);
  }
  renderServices();
  clearError("step-1-error");
}

function selectQuickService(serviceId) {
  state.selectedServices = [serviceId];
  renderServices();
  goToStep(2);
  $("#agendamento").scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderReviews() {
  const grid = $("#reviews-grid");
  grid.innerHTML = CONFIG.reviews.map((review) => `
    <figure class="g-review reveal">
      <span class="review-stars" role="img" aria-label="${review.stars} de 5 estrelas">${"★".repeat(review.stars)}</span>
      <blockquote><p>${escapeHTML(review.text)}</p></blockquote>
      <figcaption><cite>${escapeHTML(review.author)}</cite></figcaption>
    </figure>`).join("");
}

function goToStep(nextStep) {
  state.step = nextStep;
  $$(".wizard-step").forEach((panel) => {
    const active = Number(panel.dataset.step) === nextStep;
    panel.hidden = !active;
    panel.classList.toggle("active", active);
  });
  $$(".step-indicators li").forEach((indicator) => {
    const number = Number(indicator.dataset.indicator);
    indicator.classList.toggle("active", number === nextStep);
    indicator.classList.toggle("done", number < nextStep);
  });
  $("#progress-line-fill").style.width = `${(nextStep - 1) * 100}%`;
}

function clearError(id) {
  const node = $(`#${id}`);
  if (node) node.textContent = "";
}

function showError(id, message) {
  const node = $(`#${id}`);
  if (node) node.textContent = message;
}

function validateStep(step) {
  if (step === 1 && !state.selectedServices.length) {
    showError("step-1-error", "Escolha pelo menos um serviço para continuar.");
    return false;
  }
  if (step === 2) {
    state.name = $("#customer-name").value;
    state.note = $("#customer-note").value;
    clearError("name-error");
    if (formatName(state.name).length < 2) {
      showError("name-error", "Digite seu nome para continuar.");
      return false;
    }
  }
  return true;
}

function confirmBooking() {
  if (!validateStep(1) || !validateStep(2)) return;
  if (normalizeDigits(CONFIG.business.whatsapp) === PLACEHOLDER_WHATSAPP) {
    console.error("Configure o WhatsApp real em CONFIG.business.whatsapp (script.js) antes de publicar.");
    showError("step-2-error", "Estamos finalizando a configuração do agendamento. Tente novamente em breve.");
    return;
  }
  clearError("step-2-error");
  state.lastWhatsappLink = `https://wa.me/${normalizeDigits(CONFIG.business.whatsapp)}?text=${encodeURIComponent(buildWhatsappMessage())}`;
  $("#success-whatsapp-link").href = state.lastWhatsappLink;
  $("#success-message").textContent = `Pronto, ${formatName(state.name).split(" ")[0]}! Abrimos o WhatsApp com sua mensagem pronta. É só enviar, e a gente combina o melhor dia e horário.`;
  $("#booking-wizard").hidden = true;
  $("#booking-success").hidden = false;
  window.open(state.lastWhatsappLink, "_blank", "noopener");
}

function resetBooking() {
  state.selectedServices = [];
  state.name = "";
  state.note = "";
  $("#booking-form").reset();
  $("#booking-success").hidden = true;
  $("#booking-wizard").hidden = false;
  renderServices();
  goToStep(1);
}

function setupEvents() {
  const toggle = $(".menu-toggle");
  const closeMenu = () => { toggle.setAttribute("aria-expanded", "false"); $("#main-nav").classList.remove("open"); };
  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!open));
    $("#main-nav").classList.toggle("open", !open);
  });
  $$("#main-nav a").forEach((link) => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") { closeMenu(); toggle.focus(); }
  });
  $("#service-options").addEventListener("click", (event) => {
    const quick = event.target.closest("[data-quick-service]");
    if (quick) { selectQuickService(quick.dataset.quickService); return; }
    const card = event.target.closest("[data-service-card]");
    if (card) toggleService(card.dataset.serviceCard);
  });
  $("#wizard-services").addEventListener("click", (event) => {
    const button = event.target.closest("[data-wizard-service]");
    if (button) toggleService(button.dataset.wizardService);
  });
  $$("[data-next]").forEach((button) => button.addEventListener("click", () => {
    const currentStep = Number(button.closest(".wizard-step").dataset.step);
    if (validateStep(currentStep)) goToStep(Number(button.dataset.next));
  }));
  $$("[data-back]").forEach((button) => button.addEventListener("click", () => goToStep(Number(button.dataset.back))));
  $("#customer-name").addEventListener("input", (event) => { state.name = event.target.value; clearError("name-error"); });
  $("#customer-note").addEventListener("input", (event) => { state.note = event.target.value; });
  $("#booking-form").addEventListener("submit", (event) => { event.preventDefault(); confirmBooking(); });
  $("#confirm-booking").addEventListener("click", confirmBooking);
  $("#new-booking").addEventListener("click", resetBooking);
}

function setupReveal() {
  const elements = $$(".reveal");
  if (!("IntersectionObserver" in window)) { elements.forEach((element) => element.classList.add("is-visible")); return; }
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add("is-visible"); currentObserver.unobserve(entry.target); } });
  }, { threshold: .12 });
  elements.forEach((element) => observer.observe(element));
}

function init() {
  renderBusinessDetails();
  renderServices();
  renderReviews();
  setupEvents();
  setupReveal();
}

document.addEventListener("DOMContentLoaded", init);
