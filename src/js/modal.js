document.addEventListener("DOMContentLoaded", () => { 
const toggleBtn = document.querySelector('.password-toggle');
const input = document.querySelector('.password-field input');
const icon = toggleBtn.querySelector('use');

toggleBtn.addEventListener('click', () => {
  const isPassword = input.type === 'password';

  input.type = isPassword ? 'text' : 'password';
  icon.setAttribute(
    'href',
    isPassword
      ? '/sprite.svg#icon-eye'
      : '/sprite.svg#icon-eye-off'
  );
});
})

const openBtn = document.querySelector('[data-modal-open]');
const backdrop = document.querySelector('[data-modal]');
const closeBtn = document.querySelector('[data-modal-close]');

openBtn.addEventListener('click', openModal);
closeBtn.addEventListener('click', closeModal);

backdrop.addEventListener('click', e => {
  if (e.target === backdrop) closeModal();
});

window.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

function openModal() {
  backdrop.classList.remove('visually-hidden');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  backdrop.classList.add('visually-hidden');
  document.body.style.overflow = '';
}