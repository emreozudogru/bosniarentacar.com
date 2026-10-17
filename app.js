'use strict';

const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#site-navigation');
const form = document.querySelector('#quote-form');
const pickup = document.querySelector('#pickup');
const returnDate = document.querySelector('#return');
const carSelect = document.querySelector('#car');
const formStatus = document.querySelector('#form-status');
const floatingContact = document.querySelector('.floating-whatsapp');

// Keep the fixed contact shortcut clear of the form and its native date picker.
if ('IntersectionObserver' in window) {
  const formVisibility = new IntersectionObserver(([entry]) => {
    floatingContact.hidden = entry.isIntersecting;
  }, { rootMargin: '80px 0px 80px 0px' });
  formVisibility.observe(form);
} else {
  floatingContact.hidden = true;
}

function closeMenu() {
  navigation.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Menüyü aç');
}

menuToggle.addEventListener('click', () => {
  const isOpen = menuToggle.getAttribute('aria-expanded') !== 'true';
  navigation.classList.toggle('open', isOpen);
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Menüyü kapat' : 'Menüyü aç');
});
navigation.addEventListener('click', event => {
  if (event.target.closest('a')) closeMenu();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && navigation.classList.contains('open')) {
    closeMenu();
    menuToggle.focus();
  }
});
window.addEventListener('resize', () => {
  if (window.innerWidth > 780) closeMenu();
});

function formatLocalInputDate(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function updateDateLimits() {
  const today = formatLocalInputDate(new Date());
  pickup.min = today;
  const pickupIsValid = pickup.value && pickup.value >= today;
  const earliest = new Date(`${pickupIsValid ? pickup.value : today}T12:00:00`);
  earliest.setDate(earliest.getDate() + 1);
  returnDate.min = formatLocalInputDate(earliest);
  returnDate.setCustomValidity(returnDate.value && returnDate.value < returnDate.min ? 'İade tarihi alış tarihinden sonra olmalıdır.' : '');
}

updateDateLimits();
pickup.addEventListener('input', () => { updateDateLimits(); });
returnDate.addEventListener('input', () => { updateDateLimits(); });

document.querySelectorAll('[data-car]').forEach(link => {
  link.addEventListener('click', () => {
    carSelect.value = link.dataset.car;
    formStatus.textContent = `${carSelect.value} seçildi. Şimdi alış ve iade tarihlerini belirtin.`;
    window.setTimeout(() => { pickup.focus({ preventScroll: true }); }, 250);
  });
});

function readableDate(value) {
  return new Date(`${value}T12:00:00`).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
}

form.addEventListener('submit', event => {
  event.preventDefault();
  updateDateLimits();
  if (!form.reportValidity()) return;
  const message = [
    'Merhaba, araç kiralama için fiyat ve müsaitlik bilgisi almak istiyorum.',
    '',
    `Araç: ${carSelect.value || 'Henüz karar vermedim'}`,
    `Alış tarihi: ${readableDate(pickup.value)}`,
    `İade tarihi: ${readableDate(returnDate.value)}`,
    '',
    'Teslim yeri, sigorta ve kiralama koşulları hakkında bilgi verebilir misiniz?'
  ].join('\n');
  const email = event.submitter?.value === 'email';
  if (email) {
    const url = `mailto:info@bosniarentacar.com?subject=${encodeURIComponent('Araç kiralama fiyat talebi')}&body=${encodeURIComponent(message)}`;
    window.location.href = url;
    formStatus.textContent = 'E-posta uygulamanızda hazırlanan mesajı göndermeniz gerekir.';
  } else {
    const url = `https://wa.me/908508400387?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    formStatus.textContent = 'WhatsApp üzerinden hazırlanan mesajı göndermeniz gerekir.';
  }
});

document.querySelector('#year').textContent = String(new Date().getFullYear());
