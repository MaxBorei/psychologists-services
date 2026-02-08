document.addEventListener("click", (e) => {
  const btn = e.target.closest(".password-toggle");
  if (!btn) return;

  const field = btn.closest(".password-field");
  const input = field?.querySelector("input");
  const icon = btn.querySelector("use");
  if (!input || !icon) return;

  const isPassword = input.type === "password";
  input.type = isPassword ? "text" : "password";

  const href = isPassword ? "/sprite.svg#icon-eye" : "/sprite.svg#icon-eye-off";
  icon.setAttribute("href", href);
  icon.setAttribute("xlink:href", href);
});

function initTimeField(scope = document) {
  const input = scope.querySelector(".js-time");
  if (!input) return;

  if (input._flatpickr) return;

  flatpickr(input, {
    enableTime: true,
    noCalendar: true,
    dateFormat: "H:i",
    time_24hr: true,
    minTime: "09:00",
    maxTime: "18:00",
    minuteIncrement: 30,
    allowInput: false,
    defaultHour: 9,
    defaultMinute: 0,
    defaultDate: "00:00",
  });
}

function openModal(modal) {
  modal.classList.remove("visually-hidden");
  document.body.style.overflow = "hidden";

  if (modal.dataset.modal === "appointment") {
    initTimeField(modal);
  }
  document.body.classList.add("no-scroll");
}

function closeModal(modal) {
  modal.classList.add("visually-hidden");
  document.body.style.overflow = "";
  document.body.classList.remove("no-scroll");

  if (modal?.dataset?.modal === "register") {
    document.dispatchEvent(new CustomEvent("registerModal:closed"));
  }
}

function showSuccessMessage(text) {
  const message = document.createElement("div");
  message.className = "form-success";
  message.textContent = text;

  document.body.appendChild(message);

  requestAnimationFrame(() => {
    message.classList.add("show");
  });

  setTimeout(() => {
    message.classList.remove("show");
    setTimeout(() => message.remove(), 300);
  }, 3000);
}

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
      modalAvatar.src =
        openBtn.dataset.avatar || "/images/avatar-placeholder.jpg";
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
  if (e.key !== "Escape") return;
  document.querySelectorAll("[data-modal]").forEach(closeModal);
});

document.addEventListener("submit", (e) => {
  const form = e.target.closest("#appointment-form");
  if (!form) return;

  e.preventDefault();

  showSuccessMessage("Your appointment request has been sent!");
  form.reset();

  const modal = form.closest("[data-modal]");
  if (modal) closeModal(modal);
});
