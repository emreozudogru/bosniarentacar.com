'use strict';
const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
function closeMenu() {
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Menüyü aç');
  navigation.classList.remove('open');
}
menuToggle.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') !== 'true';
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Menüyü kapat' : 'Menüyü aç');
  navigation.classList.toggle('open', open);
});
navigation.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape' && navigation.classList.contains('open')) { closeMenu(); menuToggle.focus(); } });
const form = document.querySelector('#quote-form');
const pickup = document.querySelector('#pickup');
const returnDate = document.querySelector('#return');
const car = document.querySelector('#car');
const status = document.querySelector('#form-status');
function localDate(date) {
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
}
function syncDates() {
  pickup.min = localDate(new Date());
  const earliest = new Date(`${pickup.value || pickup.min}T12:00:00`);
  earliest.setDate(earliest.getDate()+1);
  returnDate.min = localDate(earliest);
  returnDate.setCustomValidity(returnDate.value && returnDate.value < returnDate.min ? 'İade tarihi alış tarihinden sonra olmalıdır.' : '');
}
syncDates();
pickup.addEventListener('input', syncDates);
returnDate.addEventListener('input', syncDates);
document.querySelectorAll('[data-car]').forEach(link => link.addEventListener('click', () => {
  car.value = link.dataset.car;
  status.textContent = `${car.value} seçildi. Fiyat almak için tarihlerinizi girin.`;
  pickup.focus({ preventScroll: true });
}));
function displayDate(value) { return new Date(`${value}T12:00:00`).toLocaleDateString('tr-TR', {day:'numeric',month:'long',year:'numeric'}); }
form.addEventListener('submit', event => {
  event.preventDefault();
  syncDates();
  if (!form.reportValidity()) return;
  const message = `Merhaba, araç kiralama için fiyat ve müsaitlik bilgisi almak istiyorum.\n\nAraç: ${car.value || 'Birlikte karar verelim'}\nAlış tarihi: ${displayDate(pickup.value)}\nİade tarihi: ${displayDate(returnDate.value)}\n\nTeslim alma ve kiralama koşulları hakkında bilgi verebilir misiniz?`;
  const email = event.submitter?.value === 'email';
  const url = email ? `mailto:info@bosniarentacar.com?subject=${encodeURIComponent('Araç kiralama fiyat talebi')}&body=${encodeURIComponent(message)}` : `https://wa.me/908508400387?text=${encodeURIComponent(message)}`;
  if (email) window.location.href = url;
  else window.open(url, '_blank', 'noopener,noreferrer');
  status.textContent = email ? 'E-posta uygulamanızda hazırlanan mesajı göndererek talebinizi iletebilirsiniz.' : 'WhatsApp’ta hazırlanan mesajı göndererek talebinizi iletebilirsiniz.';
});
document.querySelector('#year').textContent = new Date().getFullYear();
