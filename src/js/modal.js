document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('.password-toggle').forEach(btn => {
    const field = btn.closest('.password-field');
    const input = field.querySelector('input');
    const icon = btn.querySelector('use');

    btn.addEventListener('click', () => {
      const isPassword = input.type === 'password';
      input.type = isPassword ? 'text' : 'password';

      const href = isPassword ? '/sprite.svg#icon-eye' : '/sprite.svg#icon-eye-off';
      icon.setAttribute('href', href);
      icon.setAttribute('xlink:href', href);
    });
  });
});


const openBtns = document.querySelectorAll('[data-modal-open]');
const modals = document.querySelectorAll('[data-modal]');

openBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const modalName = btn.dataset.modalOpen;
    const modal = document.querySelector(`[data-modal="${modalName}"]`);
    openModal(modal);
  });
});

modals.forEach(modal => {
  modal.addEventListener('click', e => {
    if (e.target === modal || e.target.closest('[data-modal-close]')) {
      closeModal(modal);
    }
  });
});

window.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    modals.forEach(closeModal);
  }
});

function openModal(modal) {
  modal.classList.remove('visually-hidden');
  document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
  modal.classList.add('visually-hidden');
  document.body.style.overflow = '';
}


