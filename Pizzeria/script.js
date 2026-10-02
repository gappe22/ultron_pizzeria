/* ═══════════════════════════════════════════════════════════════
   FORNO DEL VICOLO — Script
   ═══════════════════════════════════════════════════════════════ */

'use strict';

// ─── Year ────────────────────────────────────────────────────────
document.querySelector('#year').textContent = new Date().getFullYear();

// ─── Set min date for booking form ───────────────────────────────
const dateInput = document.querySelector('#f-date');
if (dateInput) {
  const today = new Date().toISOString().split('T')[0];
  dateInput.min = today;
}

// ═══════════════════════════════════════════════════════════════
// MOBILE MENU
// ═══════════════════════════════════════════════════════════════
function initMobileMenu() {
  const toggle = document.querySelector('.menu-toggle');
  const nav    = document.querySelector('.site-nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    toggle.setAttribute('aria-label', expanded ? 'Apri il menu' : 'Chiudi il menu');
    nav.classList.toggle('is-open', !expanded);
  });

  nav.addEventListener('click', (e) => {
    if (e.target.closest('a')) {
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Apri il menu');
      nav.classList.remove('is-open');
    }
  });
}

// ═══════════════════════════════════════════════════════════════
// STICKY HEADER
// ═══════════════════════════════════════════════════════════════
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const update = () => header.classList.toggle('scrolled', window.scrollY > 80);
  window.addEventListener('scroll', update, { passive: true });
  update();
}

// ═══════════════════════════════════════════════════════════════
// SCROLL REVEAL
// ═══════════════════════════════════════════════════════════════
function initScrollReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Stagger siblings slightly
          const siblings = entry.target.parentElement.querySelectorAll('.reveal');
          let delay = 0;
          siblings.forEach((el, i) => {
            if (el === entry.target) delay = i * 80;
          });
          setTimeout(() => entry.target.classList.add('is-visible'), delay);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  items.forEach((el) => observer.observe(el));
}

// ═══════════════════════════════════════════════════════════════
// MENU TABS
// ═══════════════════════════════════════════════════════════════
function initMenuTabs() {
  const tabs   = document.querySelectorAll('.menu-tab');
  const panels = document.querySelectorAll('.menu-panel');
  if (!tabs.length) return;

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const category = tab.dataset.category;

      // Update tab states
      tabs.forEach((t) => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      // Show matching panel
      panels.forEach((panel) => {
        const match = panel.id === `panel-${category}`;
        panel.classList.toggle('active', match);
        panel.hidden = !match;
      });
    });
  });
}

// ═══════════════════════════════════════════════════════════════
// CART
// ═══════════════════════════════════════════════════════════════
const cart = {
  items: {},   // { id: { name, price, qty } }

  add(id, name, price) {
    price = parseFloat(price);
    if (this.items[id]) {
      this.items[id].qty += 1;
    } else {
      this.items[id] = { id, name, price, qty: 1 };
    }
    this.render();
    showToast(`${name} aggiunto! 🍕`);
  },

  remove(id) {
    if (!this.items[id]) return;
    this.items[id].qty -= 1;
    if (this.items[id].qty <= 0) delete this.items[id];
    this.render();
  },

  total() {
    return Object.values(this.items).reduce((sum, item) => sum + item.price * item.qty, 0);
  },

  count() {
    return Object.values(this.items).reduce((sum, item) => sum + item.qty, 0);
  },

  clear() {
    this.items = {};
    this.render();
  },

  render() {
    const list       = document.querySelector('#cart-list');
    const countEl    = document.querySelector('#cart-count');
    const totalEl    = document.querySelector('#cart-total');
    const footer     = document.querySelector('#cart-footer');
    const emptyEl    = document.querySelector('#cart-empty');
    if (!list) return;

    const keys = Object.keys(this.items);

    // Update count label
    const n = this.count();
    if (countEl) countEl.textContent = n === 0 ? '0 elementi' : `${n} element${n === 1 ? 'o' : 'i'}`;

    // Empty state
    if (emptyEl) emptyEl.style.display = keys.length ? 'none' : 'block';
    if (footer)  footer.hidden = keys.length === 0;

    // Remove existing rows
    list.querySelectorAll('.cart-row').forEach((r) => r.remove());

    // Add rows
    keys.forEach((id) => {
      const { name, price, qty } = this.items[id];
      const li = document.createElement('li');
      li.className = 'cart-row';
      li.innerHTML = `
        <span class="cart-row-name">${name}</span>
        <div class="cart-row-qty">
          <button aria-label="Rimuovi uno" data-remove="${id}">−</button>
          <span>${qty}</span>
          <button aria-label="Aggiungi uno" data-add="${id}" data-price="${price}" data-name="${name}">+</button>
        </div>
        <span class="cart-row-price">€ ${(price * qty).toFixed(0)}</span>
      `;
      list.appendChild(li);
    });

    // Update total
    if (totalEl) totalEl.textContent = `€ ${this.total().toFixed(0)}`;
  }
};

function initCart() {
  // Delegate clicks on all + buttons (menu items + quick add)
  document.addEventListener('click', (e) => {
    // Add to cart (menu)
    const addBtn = e.target.closest('.add-to-cart, .quick-add');
    if (addBtn) {
      const { id, price, name } = addBtn.dataset;
      cart.add(id, name, price);
      return;
    }

    // Cart row: add/remove
    const removeBtn = e.target.closest('[data-remove]');
    if (removeBtn) {
      cart.remove(removeBtn.dataset.remove);
      return;
    }
    const addRowBtn = e.target.closest('[data-add]');
    if (addRowBtn) {
      const { add: id, price, name } = addRowBtn.dataset;
      cart.add(id, name, price);
      return;
    }

    // Confirm order
    if (e.target.closest('#cart-submit')) {
      submitOrder();
      return;
    }

    // Close modal
    if (e.target.closest('#modal-close') || e.target.id === 'order-modal') {
      closeModal();
      return;
    }
  });

  cart.render();
}

async function submitOrder() {
  if (cart.count() === 0) return;
  const submitBtn = document.querySelector('#cart-submit');
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Elaborazione...';
  }

  try {
    const payload = {
      items: Object.values(cart.items).map(i => ({ id: i.id, qty: i.qty, name: i.name }))
    };

    const res  = await fetch('ordine.php', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload),
    });
    const json = await res.json();

    if (json.ok) {
      const modal  = document.querySelector('#order-modal');
      const body   = document.querySelector('#modal-body');
      if (modal && body) {
        body.textContent = json.message;
        modal.hidden = false;
        document.body.style.overflow = 'hidden';
      }
      cart.clear();
    } else {
      alert(json.error || 'Si è verificato un errore.');
    }
  } catch (err) {
    alert('Errore di rete. Controlla la connessione e riprova.');
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Conferma ordine ↗';
    }
  }
}

function closeModal() {
  const modal = document.querySelector('#order-modal');
  if (modal) modal.hidden = true;
  document.body.style.overflow = '';
}

// Close modal on Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

// ═══════════════════════════════════════════════════════════════
// TOAST
// ═══════════════════════════════════════════════════════════════
let toastTimer = null;
function showToast(msg) {
  const toast = document.querySelector('#cart-toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.hidden = false;
  toast.style.opacity = '1';
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => { toast.hidden = true; }, 320);
  }, 2000);
}

// ═══════════════════════════════════════════════════════════════
// BOOKING FORM
// ═══════════════════════════════════════════════════════════════
function initBookingForm() {
  const form    = document.querySelector('#booking-form');
  const success = document.querySelector('#booking-success');
  const reset   = document.querySelector('#booking-reset');
  const nameOut = document.querySelector('#success-name');
  if (!form) return;

  const rules = {
    'f-name':   { required: true, label: 'Nome e cognome' },
    'f-email':  { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, label: 'Email valida' },
    'f-phone':  { required: true, label: 'Telefono' },
    'f-date':   { required: true, label: 'Data' },
    'f-time':   { required: true, label: 'Orario' },
    'f-guests': { required: true, label: 'Numero di persone' },
  };

  function validateField(id) {
    const el    = document.querySelector(`#${id}`);
    const rule  = rules[id];
    const errEl = el?.nextElementSibling;
    if (!el || !rule) return true;

    let msg = '';
    if (rule.required && !el.value.trim()) {
      msg = `${rule.label} è obbligatorio.`;
    } else if (rule.pattern && el.value && !rule.pattern.test(el.value)) {
      msg = `Inserisci un'${rule.label.toLowerCase()}.`;
    }

    el.classList.toggle('invalid', !!msg);
    if (errEl) errEl.textContent = msg;
    return !msg;
  }

  // Live validation on blur
  Object.keys(rules).forEach((id) => {
    const el = document.querySelector(`#${id}`);
    if (el) el.addEventListener('blur', () => validateField(id));
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const valid = Object.keys(rules).map(validateField).every(Boolean);
    if (!valid) {
      form.querySelector('.invalid')?.focus();
      return;
    }

    const submitBtn = form.querySelector('[type="submit"]');
    const origText  = submitBtn.textContent;
    submitBtn.disabled    = true;
    submitBtn.textContent = 'Invio in corso…';

    const payload = {
      name:     document.querySelector('#f-name')?.value.trim(),
      email:    document.querySelector('#f-email')?.value.trim(),
      phone:    document.querySelector('#f-phone')?.value.trim(),
      date:     document.querySelector('#f-date')?.value,
      time:     document.querySelector('#f-time')?.value,
      guests:   document.querySelector('#f-guests')?.value,
      occasion: document.querySelector('#f-occasion')?.value,
      notes:    document.querySelector('#f-notes')?.value.trim(),
    };

    try {
      const res  = await fetch('prenota.php', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
      });
      const json = await res.json();

      if (json.ok) {
        form.hidden = true;
        if (success) {
          success.hidden = false;
          if (nameOut) nameOut.textContent = payload.name.split(' ')[0];
        }
      } else {
        // Mostra errori server sui campi
        const serverErrors = json.errors || {};
        Object.entries(serverErrors).forEach(([field, msg]) => {
          const el    = document.querySelector(`#f-${field}`);
          const errEl = el?.nextElementSibling;
          if (el)    el.classList.add('invalid');
          if (errEl) errEl.textContent = msg;
        });
        submitBtn.disabled    = false;
        submitBtn.textContent = origText;
      }
    } catch {
      alert('Errore di rete. Controlla la connessione e riprova.');
      submitBtn.disabled    = false;
      submitBtn.textContent = origText;
    }
  });

  if (reset) {
    reset.addEventListener('click', () => {
      form.reset();
      form.querySelectorAll('.invalid').forEach((el) => el.classList.remove('invalid'));
      form.querySelectorAll('.field-error').forEach((el) => (el.textContent = ''));
      form.hidden     = false;
      if (success) success.hidden = true;
    });
  }
}

// ═══════════════════════════════════════════════════════════════
// LIGHTBOX
// ═══════════════════════════════════════════════════════════════
function initLightbox() {
  const overlay  = document.querySelector('#lightbox');
  const img      = document.querySelector('#lightbox-img');
  const caption  = document.querySelector('#lightbox-caption');
  const closeBtn = document.querySelector('#lightbox-close');
  const prevBtn  = document.querySelector('#lightbox-prev');
  const nextBtn  = document.querySelector('#lightbox-next');
  if (!overlay) return;

  // Collect all lightbox-enabled figures
  const figures = Array.from(document.querySelectorAll('.gallery-image[data-lightbox]'));
  let current = 0;

  function open(index) {
    current = (index + figures.length) % figures.length;
    const fig = figures[current];
    img.src = fig.dataset.src || fig.querySelector('img').src;
    img.alt = fig.querySelector('img').alt;
    caption.textContent = fig.dataset.caption || '';
    overlay.hidden = false;
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
    // Show/hide nav arrows
    prevBtn.style.display = figures.length > 1 ? '' : 'none';
    nextBtn.style.display = figures.length > 1 ? '' : 'none';
  }

  function close() {
    overlay.hidden = true;
    document.body.style.overflow = '';
    // Return focus to the trigger
    figures[current]?.focus();
  }

  // Click on gallery images
  figures.forEach((fig, i) => {
    fig.style.cursor = 'zoom-in';
    fig.setAttribute('tabindex', '0');
    fig.setAttribute('role', 'button');
    fig.setAttribute('aria-label', `Apri foto: ${fig.dataset.caption || ''}`);
    fig.addEventListener('click', () => open(i));
    fig.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(i); }
    });
  });

  closeBtn.addEventListener('click', close);
  prevBtn.addEventListener('click', () => open(current - 1));
  nextBtn.addEventListener('click', () => open(current + 1));

  // Click outside image closes
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (overlay.hidden) return;
    if (e.key === 'Escape')     close();
    if (e.key === 'ArrowLeft')  open(current - 1);
    if (e.key === 'ArrowRight') open(current + 1);
  });
}

// ═══════════════════════════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initStickyHeader();
  initScrollReveal();
  initMenuTabs();
  initCart();
  initBookingForm();
  initLightbox();
});
