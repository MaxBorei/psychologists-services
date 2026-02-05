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

document.addEventListener("click", (e) => {
  const openBtn = e.target.closest("[data-modal-open]");
  if (openBtn) {
    const name = openBtn.dataset.modalOpen;
    const modal = document.querySelector(`[data-modal="${name}"]`);
    if (!modal) return;

    const modalName = modal.querySelector("[data-modal-name]");
    const modalAvatar = modal.querySelector("[data-modal-avatar]");

    if (modalName) modalName.textContent = openBtn.dataset.name || "—";
    if (modalAvatar) {
      modalAvatar.src = openBtn.dataset.avatar;
    }

    openModal(modal);
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

const form = document.getElementById("appointment-form");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  showSuccessMessage("Your appointment request has been sent!");
  form.reset();
});

function showSuccessMessage(text) {
  const message = document.createElement("div");
  message.className = "form-success";
  message.textContent = text;

  document.body.appendChild(message);

  setTimeout(() => {
    message.classList.add("show");
  }, 10);

  setTimeout(() => {
    message.classList.remove("show");
    setTimeout(() => message.remove(), 300);
  }, 3000);

  const modal = form.closest("[data-modal]");
  if (modal) closeModal(modal);
}
