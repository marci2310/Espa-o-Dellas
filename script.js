/*
 * ESPAÇO DELLAS — CONFIGURAÇÃO PRINCIPAL
 * Edite os dados desta seção para adaptar o site ao salão.
 */
const CONFIG = {
  business: {
    name: "Espaço dellas",
    whatsapp: "5581999999999", // somente números, com código do Brasil. Troque antes de publicar.
    whatsappDisplay: "(81) 99999-9999",
    instagram: "", // ex.: "@espacodellas" — deixe vazio para esconder o link
    instagramUrl: "", // ex.: "https://instagram.com/espacodellas"
    rating: "5,0",
    reviewCount: 41,
    addressLines: ["Galeria Oca dos Camarás — Aldeia dos Camarás", "Camaragibe — PE · CEP 54783-010"],
    mapsQuery: "Galeria Oca dos Camarás, Aldeia dos Camarás, Camaragibe, PE"
  },
  opening: {
    // Date.getDay(): 0 domingo, 1 segunda, 2 terça, 3 quarta, 4 quinta, 5 sexta, 6 sábado.
    openDays: [2, 3, 4, 5, 6],
    openAt: "09:00",
    closeAt: "18:00",
    intervalMinutes: 30,
    minLeadMinutes: 60, // antecedência mínima para agendar no mesmo dia
    maxMonthsAhead: 3, // até quantos meses à frente o calendário permite
    label: "Terça a sábado, das 9h às 18h"
  },
  services: [
    { id: "depilacao", name: "Depilação com cera", icon: "✦", description: "Pele macia e um cuidado feito com delicadeza.", duration: 45, price: 55 },
    { id: "sobrancelha", name: "Design de sobrancelha", icon: "⌁", description: "Um desenho que valoriza o seu olhar.", duration: 30, price: 30 },
    { id: "escova", name: "Escova", icon: "⌇", description: "Fios leves, movimento e aquele acabamento lindo.", duration: 45, price: 55 },
    { id: "manicure", name: "Manicure", icon: "♡", description: "Unhas cuidadas para você se sentir ainda mais bonita.", duration: 45, price: 35 },
    { id: "pedicure", name: "Pedicure", icon: "◌", description: "Um momento de pausa e cuidado para os pés.", duration: 50, price: 40 },
    { id: "acrilicas", name: "Unhas acrílicas", icon: "✧", description: "Estrutura, beleza e acabamento personalizado.", duration: 120, price: 150 },
    { id: "maquiagem", name: "Maquiagem", icon: "◒", description: "Para realçar a sua beleza em dias especiais.", duration: 60, price: 120 },
    { id: "penteados", name: "Penteados", icon: "♧", description: "Um toque especial para celebrar cada ocasião.", duration: 75, price: 100 },
    { id: "shampoo", name: "Shampoo e condicionador", icon: "❋", description: "Um ritual gostoso para começar o cuidado.", duration: 20, price: 25 }
  ],
  gallery: [
    { title: "Unhas com personalidade", category: "unhas", image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=1000&q=82", alt: "Unhas decoradas em tons suaves" },
    { title: "Detalhes delicados", category: "sobrancelhas", image: "https://images.unsplash.com/photo-1583001931096-959e9a1a6223?auto=format&fit=crop&w=800&q=82", alt: "Olho com sobrancelha bem desenhada" },
    { title: "Brilho na medida", category: "unhas", image: "https://images.unsplash.com/photo-1610992015732-2449b76344bc?auto=format&fit=crop&w=800&q=82", alt: "Mãos com esmaltação delicada" },
    { title: "Cuidado que aparece", category: "beleza", image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=82", alt: "Produtos e acessórios de maquiagem" },
    { title: "Seu momento", category: "beleza", image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=82", alt: "Mulher se arrumando diante do espelho" }
  ],
  // Só coloque depoimentos REAIS e autorizados (ex.: copiados das avaliações do Google).
  // Enquanto estiver vazio, a seção mostra apenas o link para as avaliações.
  // Formato: { quote: "texto", author: "Nome S.", context: "cliente do Espaço dellas" }
  testimonials: [],
  storage: {
    key: "espacodellas_bookings_v1",
    // O painel só enxerga agendamentos feitos NO PRÓPRIO aparelho e a senha fica visível no código.
    // Por isso vem desligado. Só ligue para demonstração.
    ownerPanelEnabled: false,
    ownerPassword: "troque-esta-senha"
  }
};

const PLACEHOLDER_WHATSAPP = "5581999999999";

const state = {
  step: 1,
  selectedServices: [],
  selectedDate: "",
  selectedTime: "",
  customer: { name: "", whatsapp: "", note: "" },
  calendarCursor: startOfMonth(new Date()),
  lastWhatsappLink: ""
};

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function todayStart() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function dateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function dateFromKey(key) {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function formatCurrency(value) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatMinutes(total) {
  if (!total) return "0 min";
  const hours = Math.floor(total / 60);
  const minutes = total % 60;
  if (!hours) return `${minutes} min`;
  if (!minutes) return `${hours}h`;
  return `${hours}h ${minutes}min`;
}

function minutesFromTime(time) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function timeFromMinutes(total) {
  const hours = Math.floor(total / 60);
  const minutes = total % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

function formatDate(key, options = { weekday: "long", day: "numeric", month: "long" }) {
  if (!key) return "";
  return dateFromKey(key).toLocaleDateString("pt-BR", options);
}

function normalizeDigits(value) {
  return String(value || "").replace(/\D/g, "");
}

function formatBrazilPhone(value) {
  const digits = normalizeDigits(value).slice(0, 11);
  if (digits.length <= 2) return digits ? `(${digits}` : "";
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function getSelectedServiceObjects() {
  return CONFIG.services.filter((service) => state.selectedServices.includes(service.id));
}

function getTotalDuration() {
  return getSelectedServiceObjects().reduce((sum, service) => sum + service.duration, 0);
}

function getTotalPrice() {
  return getSelectedServiceObjects().reduce((sum, service) => sum + service.price, 0);
}

function getBookings() {
  try {
    const stored = localStorage.getItem(CONFIG.storage.key);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.warn("Não foi possível ler os agendamentos locais.", error);
    return [];
  }
}

function saveBooking(booking) {
  try {
    const bookings = getBookings();
    bookings.push(booking);
    localStorage.setItem(CONFIG.storage.key, JSON.stringify(bookings));
    return true;
  } catch (error) {
    console.warn("Não foi possível salvar o agendamento local.", error);
    return false;
  }
}

function isOpenDay(date) {
  return CONFIG.opening.openDays.includes(date.getDay());
}

function hasTimeConflict(date, startMinutes, endMinutes) {
  return getBookings().some((booking) => {
    if (booking.date !== date) return false;
    return Number(booking.startMinutes) < endMinutes && Number(booking.endMinutes) > startMinutes;
  });
}

function getAvailableSlots(date) {
  const duration = getTotalDuration();
  if (!duration) return [];
  const open = minutesFromTime(CONFIG.opening.openAt);
  const close = minutesFromTime(CONFIG.opening.closeAt);
  const slots = [];
  const now = new Date();
  const isToday = date === dateKey(now);
  const earliest = isToday ? now.getHours() * 60 + now.getMinutes() + (CONFIG.opening.minLeadMinutes || 0) : 0;
  for (let start = open; start + duration <= close; start += CONFIG.opening.intervalMinutes) {
    if (start < earliest) continue;
    const end = start + duration;
    slots.push({ time: timeFromMinutes(start), end: timeFromMinutes(end), available: !hasTimeConflict(date, start, end) });
  }
  return slots;
}

function renderBusinessDetails() {
  const business = CONFIG.business;
  const whatsappLink = `https://wa.me/${normalizeDigits(business.whatsapp)}`;
  const directionsLink = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(business.mapsQuery)}`;
  const address = $("#business-address");
  if (address) address.innerHTML = business.addressLines.map((line) => escapeHTML(line)).join("<br />");
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
  const serviceCards = CONFIG.services.map((service) => `
    <article class="service-card ${state.selectedServices.includes(service.id) ? "selected" : ""}" data-service-card="${service.id}">
      <div class="service-card-top"><span class="service-icon" aria-hidden="true">${service.icon}</span><span class="service-check" aria-hidden="true">✓</span></div>
      <h3>${escapeHTML(service.name)}</h3>
      <p>${escapeHTML(service.description)}</p>
      <div class="service-meta"><span>${formatMinutes(service.duration)}</span><span>${formatCurrency(service.price)}</span></div>
      <button class="service-quick" type="button" data-quick-service="${service.id}">Agendar este serviço <span aria-hidden="true">↗</span></button>
    </article>`).join("");
  $("#service-options").innerHTML = serviceCards;
  $("#wizard-services").innerHTML = CONFIG.services.map((service) => `
    <button class="wizard-service ${state.selectedServices.includes(service.id) ? "selected" : ""}" type="button" data-wizard-service="${service.id}" aria-pressed="${state.selectedServices.includes(service.id)}">
      <span class="wizard-service-main"><span class="service-icon" aria-hidden="true">${service.icon}</span><span><strong>${escapeHTML(service.name)}</strong><small>${formatMinutes(service.duration)}</small></span></span>
      <span class="wizard-service-price">${formatCurrency(service.price)} <span class="wizard-service-check" aria-hidden="true">✓</span></span>
    </button>`).join("");
  updateTotals();
}

function updateTotals() {
  $("#total-duration").textContent = formatMinutes(getTotalDuration());
  $("#total-price").textContent = formatCurrency(getTotalPrice());
}

function toggleService(serviceId) {
  if (state.selectedServices.includes(serviceId)) {
    state.selectedServices = state.selectedServices.filter((id) => id !== serviceId);
  } else {
    state.selectedServices.push(serviceId);
  }
  state.selectedTime = ""; // a duração mudou, então o horário escolhido pode não caber mais
  renderServices();
  clearError("step-1-error");
}

function selectQuickService(serviceId) {
  state.selectedServices = [serviceId];
  state.selectedTime = "";
  renderServices();
  goToStep(1);
  document.querySelector("#agendamento").scrollIntoView({ behavior: "smooth", block: "start" });
}

// Para imagens do Unsplash gera versões menores (srcset) em WebP/AVIF. Arquivos locais passam direto.
function imageAttrs(url, widths, sizes) {
  try {
    const base = new URL(url, location.href);
    if (base.hostname !== "images.unsplash.com") return `src="${escapeHTML(url)}"`;
    const make = (width) => {
      const next = new URL(base);
      next.searchParams.set("w", width);
      next.searchParams.set("q", "72");
      next.searchParams.set("fit", "crop");
      next.searchParams.set("auto", "format");
      return escapeHTML(next.toString());
    };
    const srcset = widths.map((width) => `${make(width)} ${width}w`).join(", ");
    return `src="${make(widths[Math.floor(widths.length / 2)])}" srcset="${srcset}" sizes="${sizes}"`;
  } catch (error) {
    return `src="${escapeHTML(url)}"`;
  }
}

function renderGallery() {
  $("#gallery-grid").innerHTML = CONFIG.gallery.map((item, index) => `
    <figure class="gallery-item"><img ${imageAttrs(item.image, [400, 640, 900], index === 0 ? "(min-width: 600px) 42vw, 100vw" : "(min-width: 600px) 28vw, 50vw")} alt="${escapeHTML(item.alt)}" loading="lazy" decoding="async" width="900" height="700" /><figcaption class="gallery-label"><strong>${escapeHTML(item.title)}</strong><small>${escapeHTML(item.category)}</small></figcaption></figure>`).join("");
}

function renderTestimonials() {
  const empty = !CONFIG.testimonials.length;
  $("#testimonials")?.classList.toggle("is-empty", empty);
  if (empty) return;
  $("#testimonials-grid").innerHTML = CONFIG.testimonials.map((item) => `
    <blockquote class="testimonial"><p>${escapeHTML(item.quote)}</p><cite>${escapeHTML(item.author)} · ${escapeHTML(item.context)}</cite></blockquote>`).join("");
}

function renderCalendar() {
  const cursor = state.calendarCursor;
  $("#calendar-month").textContent = cursor.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
  const grid = $("#calendar-grid");
  const firstDay = cursor.getDay();
  const daysInMonth = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();
  const today = todayStart();
  let html = "";
  for (let i = 0; i < firstDay; i += 1) html += '<span class="calendar-empty" aria-hidden="true"></span>';
  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = new Date(cursor.getFullYear(), cursor.getMonth(), day);
    const key = dateKey(date);
    const disabled = date < today || !isOpenDay(date);
    const selected = state.selectedDate === key;
    const label = `${day} de ${date.toLocaleDateString("pt-BR", { month: "long" })}`;
    html += `<button type="button" class="${selected ? "selected" : ""}" data-calendar-date="${key}" aria-label="${label}" aria-pressed="${selected}" ${disabled ? "disabled" : ""}>${day}</button>`;
  }
  grid.innerHTML = html;
  $("#calendar-prev").disabled = cursor <= startOfMonth(today);
  $("#calendar-next").disabled = cursor >= new Date(today.getFullYear(), today.getMonth() + (CONFIG.opening.maxMonthsAhead || 3) - 1, 1);
  $("#selected-date-note").textContent = state.selectedDate ? `Você escolheu ${formatDate(state.selectedDate)}.` : "Nenhum dia selecionado ainda.";
}

function selectDate(key) {
  state.selectedDate = key;
  state.selectedTime = "";
  renderCalendar();
  clearError("step-2-error");
}

function renderTimeSlots() {
  const context = $("#time-context");
  if (!state.selectedDate) {
    context.textContent = "Escolha uma data para ver os horários.";
    $("#time-slots").innerHTML = "";
    return;
  }
  context.textContent = `${formatDate(state.selectedDate)} · ${formatMinutes(getTotalDuration())} de atendimento`;
  const slots = getAvailableSlots(state.selectedDate);
  $("#time-slots").innerHTML = slots.length ? slots.map((slot) => `
    <button type="button" class="time-slot ${state.selectedTime === slot.time ? "selected" : ""}" data-time-slot="${slot.time}" aria-pressed="${state.selectedTime === slot.time}" ${slot.available ? "" : "disabled"}>
      ${slot.time}<small>${slot.available ? "disponível" : "indisponível"}</small>
    </button>`).join("") : '<p class="owner-empty">Não há horários que comportem os serviços selecionados neste dia.</p>';
}

function selectTime(time) {
  state.selectedTime = time;
  renderTimeSlots();
  clearError("step-3-error");
}

function renderReview() {
  const services = getSelectedServiceObjects().map((service) => service.name).join(", ");
  const end = state.selectedTime ? timeFromMinutes(minutesFromTime(state.selectedTime) + getTotalDuration()) : "";
  $("#review-card").innerHTML = `
    <dl class="review-row"><dt>Serviços</dt><dd>${escapeHTML(services)}<span>${formatMinutes(getTotalDuration())} de cuidado</span></dd></dl>
    <dl class="review-row"><dt>Data</dt><dd>${escapeHTML(formatDate(state.selectedDate))}</dd></dl>
    <dl class="review-row"><dt>Horário</dt><dd>${escapeHTML(state.selectedTime)} às ${escapeHTML(end)}</dd></dl>
    <dl class="review-row"><dt>Cliente</dt><dd>${escapeHTML(state.customer.name)}<span>${escapeHTML(state.customer.whatsapp)}</span></dd></dl>
    <dl class="review-row"><dt>Valor estimado</dt><dd>${formatCurrency(getTotalPrice())}</dd></dl>
    ${state.customer.note ? `<dl class="review-row"><dt>Observação</dt><dd>${escapeHTML(state.customer.note)}</dd></dl>` : ""}`;
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
  $("#progress-line-fill").style.width = `${((nextStep - 1) / 4) * 100}%`;
  if (nextStep === 2) renderCalendar();
  if (nextStep === 3) renderTimeSlots();
  if (nextStep === 5) renderReview();
  const current = $(`.wizard-step[data-step="${nextStep}"]`);
  current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
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
  if (step === 1) {
    if (!state.selectedServices.length) {
      showError("step-1-error", "Escolha pelo menos um serviço para continuar.");
      return false;
    }
  }
  if (step === 2) {
    if (!state.selectedDate || !isOpenDay(dateFromKey(state.selectedDate)) || dateFromKey(state.selectedDate) < todayStart()) {
      showError("step-2-error", "Escolha um dia disponível no calendário.");
      return false;
    }
  }
  if (step === 3) {
    if (!state.selectedTime) {
      showError("step-3-error", "Escolha um dos horários disponíveis.");
      return false;
    }
    const start = minutesFromTime(state.selectedTime);
    if (hasTimeConflict(state.selectedDate, start, start + getTotalDuration())) {
      showError("step-3-error", "Esse horário acabou de ser reservado. Escolha outro, por favor.");
      renderTimeSlots();
      return false;
    }
  }
  if (step === 4) return validateCustomerForm();
  return true;
}

function validateCustomerForm() {
  const name = $("#customer-name").value.trim();
  const whatsapp = $("#customer-whatsapp").value.trim();
  let valid = true;
  clearError("name-error");
  clearError("whatsapp-error");
  if (name.length < 2) { showError("name-error", "Digite seu nome para continuar."); valid = false; }
  if (normalizeDigits(whatsapp).length < 10) { showError("whatsapp-error", "Informe um WhatsApp válido com DDD."); valid = false; }
  if (!valid) return false;
  state.customer = { name, whatsapp, note: $("#customer-note").value.trim() };
  return true;
}

function buildWhatsappMessage() {
  const services = getSelectedServiceObjects().map((service) => service.name).join(", ");
  const end = timeFromMinutes(minutesFromTime(state.selectedTime) + getTotalDuration());
  return `Olá, Espaço dellas! Gostaria de confirmar meu agendamento.\n\n*Nome:* ${state.customer.name}\n*Serviços:* ${services}\n*Data:* ${formatDate(state.selectedDate)}\n*Horário:* ${state.selectedTime} às ${end}\n*Valor estimado:* ${formatCurrency(getTotalPrice())}${state.customer.note ? `\n*Observação:* ${state.customer.note}` : ""}`;
}

function confirmBooking() {
  if (normalizeDigits(CONFIG.business.whatsapp) === PLACEHOLDER_WHATSAPP) {
    console.error("Configure o WhatsApp real em CONFIG.business.whatsapp (script.js) antes de publicar.");
    showError("step-5-error", "Estamos finalizando a configuração do agendamento. Tente novamente em breve.");
    return;
  }
  if (!validateStep(1) || !validateStep(2) || !validateStep(3) || !validateStep(4)) return;
  const startMinutes = minutesFromTime(state.selectedTime);
  const endMinutes = startMinutes + getTotalDuration();
  const booking = {
    id: `booking-${Date.now()}`,
    createdAt: new Date().toISOString(),
    date: state.selectedDate,
    time: state.selectedTime,
    endTime: timeFromMinutes(endMinutes),
    startMinutes,
    endMinutes,
    services: getSelectedServiceObjects().map((service) => ({ id: service.id, name: service.name, duration: service.duration, price: service.price })),
    totalDuration: getTotalDuration(),
    totalPrice: getTotalPrice(),
    customer: { ...state.customer }
  };
  if (hasTimeConflict(booking.date, booking.startMinutes, booking.endMinutes)) {
    showError("step-5-error", "Esse horário não está mais disponível. Volte e escolha outro.");
    return;
  }
  const stored = saveBooking(booking);
  if (!stored) {
    showError("step-5-error", "Não conseguimos salvar localmente. Tente novamente neste navegador.");
    return;
  }
  const whatsappNumber = normalizeDigits(CONFIG.business.whatsapp);
  state.lastWhatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(buildWhatsappMessage())}`;
  $("#success-whatsapp-link").href = state.lastWhatsappLink;
  $("#success-message").textContent = `Falta só um passo, ${state.customer.name.split(" ")[0]}! Envie a mensagem no WhatsApp. O horário fica confirmado quando o Espaço dellas responder.`;
  $("#booking-wizard").hidden = true;
  $("#booking-success").hidden = false;
  window.open(state.lastWhatsappLink, "_blank", "noopener");
}

function resetBooking() {
  state.step = 1;
  state.selectedServices = [];
  state.selectedDate = "";
  state.selectedTime = "";
  state.customer = { name: "", whatsapp: "", note: "" };
  $("#booking-form").reset();
  $("#booking-success").hidden = true;
  $("#booking-wizard").hidden = false;
  renderServices();
  renderCalendar();
  goToStep(1);
}

function renderOwnerBookings() {
  const bookings = getBookings().sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`));
  const today = todayStart();
  const weekEnd = new Date(today);
  weekEnd.setDate(weekEnd.getDate() + 7);
  const weekBookings = bookings.filter((booking) => {
    const date = dateFromKey(booking.date);
    return date >= today && date <= weekEnd;
  });
  $("#owner-summary").innerHTML = `<span>${weekBookings.length} agendamento${weekBookings.length === 1 ? "" : "s"}</span><span>próximos 7 dias</span>`;
  if (!weekBookings.length) {
    $("#owner-bookings").innerHTML = '<p class="owner-empty">Nenhum agendamento salvo para os próximos 7 dias neste dispositivo.</p>';
    return;
  }
  const groups = weekBookings.reduce((acc, booking) => {
    (acc[booking.date] ||= []).push(booking);
    return acc;
  }, {});
  $("#owner-bookings").innerHTML = Object.entries(groups).map(([date, dayBookings]) => `
    <div class="owner-day"><strong>${formatDate(date, { weekday: "long", day: "numeric", month: "long" })}</strong>${dayBookings.map((booking) => `<div class="owner-booking"><b>${escapeHTML(booking.time)} · ${escapeHTML(booking.customer.name)}</b><span>${escapeHTML(booking.services.map((service) => service.name).join(", "))} · ${formatCurrency(booking.totalPrice)}</span><span>${escapeHTML(booking.customer.whatsapp)}${booking.customer.note ? ` · ${escapeHTML(booking.customer.note)}` : ""}</span></div>`).join("")}</div>`).join("");
}

function openOwnerPanel() {
  if (!CONFIG.storage.ownerPanelEnabled) return;
  state.lastFocusedElement = document.activeElement;
  $("#owner-panel").hidden = false;
  $("#owner-password").focus();
}

function closeOwnerPanel() {
  $("#owner-panel").hidden = true;
  $("#owner-content").hidden = true;
  $("#owner-login").hidden = false;
  $("#owner-password").value = "";
  clearError("owner-error");
  state.lastFocusedElement?.focus?.();
  state.lastFocusedElement = null;
}

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[character]));
}

function setupEvents() {
  $(".menu-toggle").addEventListener("click", () => {
    const toggle = $(".menu-toggle");
    const open = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!open));
    $("#main-nav").classList.toggle("open", !open);
  });
  $$("#main-nav a").forEach((link) => link.addEventListener("click", () => {
    $(".menu-toggle").setAttribute("aria-expanded", "false");
    $("#main-nav").classList.remove("open");
  }));
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
  $("#calendar-grid").addEventListener("click", (event) => {
    const button = event.target.closest("[data-calendar-date]");
    if (button && !button.disabled) selectDate(button.dataset.calendarDate);
  });
  $("#calendar-prev").addEventListener("click", () => { state.calendarCursor = new Date(state.calendarCursor.getFullYear(), state.calendarCursor.getMonth() - 1, 1); renderCalendar(); });
  $("#calendar-next").addEventListener("click", () => { state.calendarCursor = new Date(state.calendarCursor.getFullYear(), state.calendarCursor.getMonth() + 1, 1); renderCalendar(); });
  $("#time-slots").addEventListener("click", (event) => {
    const button = event.target.closest("[data-time-slot]");
    if (button && !button.disabled) selectTime(button.dataset.timeSlot);
  });
  $$("[data-next]").forEach((button) => button.addEventListener("click", () => {
    const currentStep = Number(button.closest(".wizard-step").dataset.step);
    if (validateStep(currentStep)) goToStep(Number(button.dataset.next));
  }));
  $$("[data-back]").forEach((button) => button.addEventListener("click", () => goToStep(Number(button.dataset.back))));
  $("#customer-whatsapp").addEventListener("input", (event) => { event.target.value = formatBrazilPhone(event.target.value); clearError("whatsapp-error"); });
  $("#customer-name").addEventListener("input", () => clearError("name-error"));
  $("#confirm-booking").addEventListener("click", confirmBooking);
  $("#new-booking").addEventListener("click", resetBooking);
  if (CONFIG.storage.ownerPanelEnabled) {
    $("#owner-access").addEventListener("click", openOwnerPanel);
    $$('[data-close-owner]').forEach((element) => element.addEventListener("click", closeOwnerPanel));
    $("#owner-login").addEventListener("submit", (event) => {
      event.preventDefault();
      if ($("#owner-password").value !== CONFIG.storage.ownerPassword) { showError("owner-error", "Senha incorreta. Confira a configuração do painel."); return; }
      $("#owner-login").hidden = true;
      $("#owner-content").hidden = false;
      renderOwnerBookings();
    });
    $("#owner-logout").addEventListener("click", closeOwnerPanel);
    document.addEventListener("keydown", (event) => {
      if ($("#owner-panel").hidden) return;
      if (event.key === "Escape") { closeOwnerPanel(); return; }
      if (event.key !== "Tab") return;
      const focusable = $$('button, input, [href], textarea', $("#owner-panel-card"));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    });
  }
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    const toggle = $(".menu-toggle");
    if (toggle.getAttribute("aria-expanded") !== "true") return;
    toggle.setAttribute("aria-expanded", "false");
    $("#main-nav").classList.remove("open");
    toggle.focus();
  });
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
  if (!CONFIG.storage.ownerPanelEnabled) {
    $("#owner-access")?.remove();
    $("#owner-panel")?.remove();
  }
  renderBusinessDetails();
  renderServices();
  renderGallery();
  renderTestimonials();
  renderCalendar();
  setupEvents();
  setupReveal();
}

document.addEventListener("DOMContentLoaded", init);
