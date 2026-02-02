document.addEventListener('DOMContentLoaded', () => {
  const burger = document.querySelector('.burger-menu');
  const drawer = document.querySelector('#mobileDrawer');
  const closeBtn = drawer?.querySelector('.mobile-close');

  if (!burger || !drawer || !closeBtn) return;

  const isOpen = () => drawer.classList.contains('active');

  const openDrawer = () => {
    drawer.classList.add('active');
    drawer.setAttribute('aria-hidden', 'false');
    burger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    drawer.classList.remove('active');
    drawer.setAttribute('aria-hidden', 'true');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  burger.addEventListener('click', (e) => {
    e.stopPropagation();
    isOpen() ? closeDrawer() : openDrawer();
  });

  closeBtn.addEventListener('click', closeDrawer);

  
  drawer.addEventListener('click', (e) => {
    if (e.target.closest('a')) closeDrawer();
  });

  
  document.addEventListener('click', (e) => {
    if (!drawer.contains(e.target) && !burger.contains(e.target)) {
      closeDrawer();
    }
  });

  
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDrawer();
  });

  
  drawer.querySelectorAll('[data-modal-open]').forEach(btn => {
    btn.addEventListener('click', () => {
      closeDrawer();
    });
  });
});
