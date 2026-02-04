document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".password-toggle").forEach((btn) => {
    const field = btn.closest(".password-field");
    const input = field.querySelector("input");
    const icon = btn.querySelector("use");

    btn.addEventListener("click", () => {
      const isPassword = input.type === "password";
      input.type = isPassword ? "text" : "password";

      const href = isPassword
        ? "/sprite.svg#icon-eye"
        : "/sprite.svg#icon-eye-off";
      icon.setAttribute("href", href);
      icon.setAttribute("xlink:href", href);
    });
  });
});

const openBtns = document.querySelectorAll("[data-modal-open]");
const modals = document.querySelectorAll("[data-modal]");

document.addEventListener("click", (e) => {
  const openBtn = e.target.closest("[data-modal-open]");
  if (openBtn) {
    const name = openBtn.dataset.modalOpen;
    const modal = document.querySelector(`[data-modal="${name}"]`);
    if (modal) openModal(modal);
    return;
  }

  const closeBtn = e.target.closest("[data-modal-close]");
  if (closeBtn) {
    const modal = closeBtn.closest("[data-modal]");
    if (modal) closeModal(modal);
    return;
  }

  const backdrop = e.target.closest(".modal-backdrop[data-modal]");
  if (backdrop && e.target === backdrop) {
    closeModal(backdrop);
  }
});

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    document.querySelectorAll("[data-modal]").forEach(closeModal);
  }
});

function openModal(modal) {
  modal.classList.remove("visually-hidden");
  document.body.style.overflow = "hidden";
}

function closeModal(modal) {
  modal.classList.add("visually-hidden");
  document.body.style.overflow = "";
}

document.addEventListener("click", (e) => {
  const openBtn = e.target.closest("[data-modal-open]");
  if (!openBtn) return;

  const name = openBtn.dataset.modalOpen;
  const modal = document.querySelector(`[data-modal="${name}"]`);
  if (!modal) return;

  const modalName = modal.querySelector("[data-modal-name]");
  const modalAvatar = modal.querySelector("[data-modal-avatar]");

  if (modalName) modalName.textContent = openBtn.dataset.name || "—";
  if (modalAvatar)
    modalAvatar.src =
      openBtn.dataset.avatar || "/images/avatar-placeholder.jpg";

  openModal(modal);
});
