/**
 * APP.JS — Plantão de Farmácias de Piranga, MG
 * Lógica principal da SPA
 */

// ─── UTILITÁRIOS ───────────────────────────────────────────────────────────────

/**
 * Retorna a data atual no fuso de Brasília (YYYY-MM-DD)
 */
function getTodayLocal() {
  const now = new Date();
  // Ajusta para o fuso de Brasília (UTC-3)
  const brt = new Date(now.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }));
  const y = brt.getFullYear();
  const m = String(brt.getMonth() + 1).padStart(2, '0');
  const d = String(brt.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Formata uma data YYYY-MM-DD para exibição amigável em PT-BR
 */
function formatDateDisplay(dateStr) {
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
}

/**
 * Formata data resumida para os cards de próximos plantões
 */
function formatDateShort(dateStr) {
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('pt-BR', {
    weekday: 'short',
    day: '2-digit',
    month: 'short'
  });
}

/**
 * Busca farmácia pelo nome exato
 */
function getPharmacyByName(name) {
  return PHARMACY_DATA.pharmacies.find(p => p.name === name) || null;
}

/**
 * Busca o plantão para uma data específica
 */
function getShiftForDate(dateStr) {
  return PHARMACY_DATA.shift_schedule[dateStr] || null;
}

/**
 * Retorna os próximos N plantões a partir de uma data (exclusive)
 */
function getUpcomingShifts(fromDate, count = 5) {
  const entries = Object.entries(PHARMACY_DATA.shift_schedule)
    .filter(([date]) => date > fromDate)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(0, count);
  return entries;
}

// ─── ÍCONES POR FARMÁCIA ───────────────────────────────────────────────────────

const PHARMACY_ICONS = {
  "Guarapiranga": "fa-shield-heart",
  "UAI Farma":    "fa-kit-medical",
  "Dora":         "fa-heart-pulse",
  "São Pedro":    "fa-star-of-life",
  "Multifarma":   "fa-capsules",
  "Drogary":      "fa-pills"
};

const PHARMACY_COLORS = {
  "Guarapiranga": { bg: "linear-gradient(135deg, #1a6fb5 0%, #0d4a8a 100%)", accent: "#1a6fb5" },
  "UAI Farma":    { bg: "linear-gradient(135deg, #0a8f6a 0%, #066b4f 100%)", accent: "#0a8f6a" },
  "Dora":         { bg: "linear-gradient(135deg, #8b2fc9 0%, #6a1fa0 100%)", accent: "#8b2fc9" },
  "São Pedro":    { bg: "linear-gradient(135deg, #c75a0d 0%, #a04208 100%)", accent: "#c75a0d" },
  "Multifarma":   { bg: "linear-gradient(135deg, #0a7a9f 0%, #075c78 100%)", accent: "#0a7a9f" },
  "Drogary":      { bg: "linear-gradient(135deg, #1e8c4a 0%, #145e32 100%)", accent: "#1e8c4a" }
};

// ─── RENDERIZADORES ────────────────────────────────────────────────────────────

/**
 * Renderiza o card principal de plantão
 */
function renderShiftCard(dateStr, isToday = false) {
  const wrapper = document.getElementById('shift-card-wrapper');
  const shiftName = getShiftForDate(dateStr);

  // Fade-out
  wrapper.classList.add('card-exit');

  setTimeout(() => {
    wrapper.innerHTML = '';

    if (!shiftName) {
      wrapper.innerHTML = renderNoShiftCard(dateStr);
    } else {
      const pharmacy = getPharmacyByName(shiftName);
      if (!pharmacy) {
        wrapper.innerHTML = renderNoShiftCard(dateStr);
      } else {
        wrapper.innerHTML = renderPharmacyCard(pharmacy, dateStr, isToday);
      }
    }

    // Fade-in
    wrapper.classList.remove('card-exit');
    wrapper.classList.add('card-enter');
    setTimeout(() => wrapper.classList.remove('card-enter'), 400);
  }, 220);
}

/**
 * Gera HTML do card de "sem plantão"
 */
function renderNoShiftCard(dateStr) {
  const phonesHTML = PHARMACY_DATA.pharmacies.map(p => `
    <a href="tel:${p.phone.replace(/\D/g,'')}" class="no-shift-phone">
      <i class="fa-solid fa-phone"></i>
      <span class="no-shift-phone-name">${p.name}</span>
      <span class="no-shift-phone-num">${p.phone}</span>
    </a>
  `).join('');

  return `
    <div class="no-shift-card">
      <div class="no-shift-icon">
        <i class="fa-regular fa-calendar-xmark"></i>
      </div>
      <h2 class="no-shift-title">Sem plantão nesta data</h2>
      <p class="no-shift-desc">
        Não há um plantão específico agendado para esta data.<br>
        Recomendamos entrar em contato com as farmácias:
      </p>
      <div class="no-shift-phones">
        ${phonesHTML}
      </div>
    </div>
  `;
}

/**
 * Gera HTML do card completo de farmácia
 */
function renderPharmacyCard(pharmacy, dateStr, isToday) {
  const icon = PHARMACY_ICONS[pharmacy.name] || 'fa-store';
  const colors = PHARMACY_COLORS[pharmacy.name] || { bg: "linear-gradient(135deg, #1a6fb5 0%, #0d4a8a 100%)", accent: "#1a6fb5" };
  const dateLabel = isToday ? 'Plantão de Hoje' : 'Plantão do Dia';
  const waNumber = pharmacy.whatsapp.replace(/\D/g, '');
  const phoneClean = pharmacy.phone.replace(/\D/g, '');

  // Links opcionais
  const siteLink = pharmacy.site
    ? `<a href="${pharmacy.site}" target="_blank" rel="noopener" class="contact-link contact-link--site">
        <i class="fa-solid fa-globe"></i><span>Acessar Site</span>
       </a>` : '';

  const igLink = pharmacy.instagram
    ? `<a href="${pharmacy.instagram}" target="_blank" rel="noopener" class="contact-link contact-link--ig">
        <i class="fa-brands fa-instagram"></i><span>Instagram</span>
       </a>` : '';

  const emailLink = pharmacy.email
    ? `<a href="mailto:${pharmacy.email}" class="contact-link contact-link--email">
        <i class="fa-solid fa-envelope"></i><span>${pharmacy.email}</span>
       </a>` : '';

  const extraLinks = (siteLink || igLink || emailLink)
    ? `<div class="contact-extras">${siteLink}${igLink}${emailLink}</div>`
    : '';

  return `
    <article class="pharmacy-shift-card" style="--card-bg: ${colors.bg}; --card-accent: ${colors.accent};" aria-label="Farmácia de plantão: ${pharmacy.name}">
      <div class="psc-header">
        <div class="psc-badge">
          <i class="fa-solid fa-circle-check"></i>
          <span>${dateLabel}</span>
        </div>
        <div class="psc-icon-wrap">
          <i class="fa-solid ${icon}"></i>
        </div>
      </div>

      <div class="psc-name-block">
        <h2 class="psc-name">${pharmacy.name}</h2>
        <p class="psc-subtitle">Farmácia · Piranga, MG</p>
      </div>

      <div class="psc-contacts">

        <!-- TELEFONE -->
        <a href="tel:${phoneClean}" class="contact-btn contact-btn--phone" aria-label="Ligar para ${pharmacy.name}">
          <div class="contact-btn-icon">
            <i class="fa-solid fa-phone"></i>
          </div>
          <div class="contact-btn-info">
            <span class="contact-btn-label">Ligar agora</span>
            <span class="contact-btn-value">${pharmacy.phone}</span>
          </div>
          <i class="fa-solid fa-chevron-right contact-btn-arrow"></i>
        </a>

        <!-- WHATSAPP -->
        <a href="https://wa.me/${waNumber}" target="_blank" rel="noopener" class="contact-btn contact-btn--whatsapp" aria-label="WhatsApp de ${pharmacy.name}">
          <div class="contact-btn-icon">
            <i class="fa-brands fa-whatsapp"></i>
          </div>
          <div class="contact-btn-info">
            <span class="contact-btn-label">Enviar mensagem</span>
            <span class="contact-btn-value">WhatsApp</span>
          </div>
          <i class="fa-solid fa-chevron-right contact-btn-arrow"></i>
        </a>

        <!-- MAPS -->
        <a href="${pharmacy.addressLink}" target="_blank" rel="noopener" class="contact-btn contact-btn--maps" aria-label="Ver no Google Maps: ${pharmacy.address}">
          <div class="contact-btn-icon">
            <i class="fa-solid fa-location-dot"></i>
          </div>
          <div class="contact-btn-info">
            <span class="contact-btn-label">Como chegar</span>
            <span class="contact-btn-value">${pharmacy.address}</span>
          </div>
          <i class="fa-solid fa-chevron-right contact-btn-arrow"></i>
        </a>

      </div>

      ${extraLinks}
    </article>
  `;
}

/**
 * Renderiza a lista de próximos plantões
 */
function renderUpcomingShifts(fromDate) {
  const list = document.getElementById('upcoming-list');
  const shifts = getUpcomingShifts(fromDate, 6);

  if (shifts.length === 0) {
    list.innerHTML = '<p class="upcoming-empty">Nenhum plantão agendado nos próximos dias.</p>';
    return;
  }

  list.innerHTML = shifts.map(([date, name]) => {
    const pharmacy = getPharmacyByName(name);
    const icon = PHARMACY_ICONS[name] || 'fa-store';
    const colors = PHARMACY_COLORS[name] || { accent: '#1a6fb5' };
    return `
      <button class="upcoming-item" data-date="${date}" aria-label="Ver plantão de ${formatDateDisplay(date)}: ${name}" style="--item-accent: ${colors.accent}">
        <div class="upcoming-item-icon" style="background: ${colors.accent}">
          <i class="fa-solid ${icon}"></i>
        </div>
        <div class="upcoming-item-info">
          <span class="upcoming-item-date">${formatDateShort(date)}</span>
          <span class="upcoming-item-name">${name}</span>
        </div>
        <i class="fa-solid fa-arrow-right upcoming-item-arrow"></i>
      </button>
    `;
  }).join('');

  // Clique nos próximos plantões
  list.querySelectorAll('.upcoming-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const date = btn.dataset.date;
      document.getElementById('date-picker').value = date;
      updateView(date);
      document.getElementById('shift-card-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

/**
 * Renderiza a grade de farmácias no rodapé
 */
function renderPharmaciesGrid() {
  const grid = document.getElementById('pharmacies-grid');
  grid.innerHTML = PHARMACY_DATA.pharmacies.map(p => {
    const icon = PHARMACY_ICONS[p.name] || 'fa-store';
    const colors = PHARMACY_COLORS[p.name] || { accent: '#1a6fb5' };
    const phoneClean = p.phone.replace(/\D/g, '');
    const waNumber = p.whatsapp.replace(/\D/g, '');
    return `
      <article class="pharmacy-mini-card" aria-label="Farmácia ${p.name}">
        <div class="pmc-header" style="--pmc-color: ${colors.accent}">
          <div class="pmc-icon">
            <i class="fa-solid ${icon}"></i>
          </div>
          <h3 class="pmc-name">${p.name}</h3>
        </div>
        <div class="pmc-body">
          <a href="tel:${phoneClean}" class="pmc-link pmc-link--phone">
            <i class="fa-solid fa-phone"></i> ${p.phone}
          </a>
          <a href="https://wa.me/${waNumber}" target="_blank" rel="noopener" class="pmc-link pmc-link--wa">
            <i class="fa-brands fa-whatsapp"></i> WhatsApp
          </a>
          <a href="${p.addressLink}" target="_blank" rel="noopener" class="pmc-link pmc-link--maps">
            <i class="fa-solid fa-location-dot"></i> Ver no mapa
          </a>
          ${p.instagram ? `<a href="${p.instagram}" target="_blank" rel="noopener" class="pmc-link pmc-link--ig"><i class="fa-brands fa-instagram"></i> Instagram</a>` : ''}
        </div>
      </article>
    `;
  }).join('');
}

// ─── CONTROLE DE ESTADO ────────────────────────────────────────────────────────

let currentDate = getTodayLocal();

/**
 * Atualiza toda a view para uma data específica
 */
function updateView(dateStr) {
  const isToday = dateStr === getTodayLocal();
  currentDate = dateStr;

  // Hero label
  const labelEl = document.getElementById('hero-label-text');
  const dateDisplayEl = document.getElementById('hero-date-display');

  if (isToday) {
    labelEl.textContent = 'Plantão de hoje';
    document.getElementById('btn-today').style.display = 'none';
  } else {
    labelEl.textContent = 'Consultando data específica';
    document.getElementById('btn-today').style.display = 'flex';
  }

  dateDisplayEl.textContent = formatDateDisplay(dateStr)
    .replace(/^\w/, c => c.toUpperCase());

  // Card principal
  renderShiftCard(dateStr, isToday);

  // Próximos plantões (a partir da data selecionada)
  renderUpcomingShifts(dateStr);
}

// ─── INICIALIZAÇÃO ─────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  const today = getTodayLocal();
  const datePicker = document.getElementById('date-picker');
  const btnToday = document.getElementById('btn-today');

  // Configura o date picker
  datePicker.value = today;
  datePicker.addEventListener('change', (e) => {
    if (e.target.value) updateView(e.target.value);
  });

  // Botão "Hoje"
  btnToday.addEventListener('click', () => {
    const t = getTodayLocal();
    datePicker.value = t;
    updateView(t);
  });
  btnToday.style.display = 'none'; // começa oculto (já está em "hoje")

  // Renderiza grade de farmácias (estática)
  renderPharmaciesGrid();

  // Inicializa com a data de hoje
  updateView(today);
});
