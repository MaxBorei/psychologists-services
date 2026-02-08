import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { auth } from "./firebase.js";


function openRegisterModal() {
  document.querySelector('[data-modal-open="register"]')?.click();
}

let isAuthed = false;

onAuthStateChanged(auth, (user) => {
  isAuthed = !!user;
});

document.addEventListener(
  "click",
  (e) => {
    const favLink = e.target.closest('a[data-link="favorites"]');
    if (!favLink) return;

    if (!isAuthed) {
      e.preventDefault();
      e.stopImmediatePropagation();
      openRegisterModal();
    }
  },
  true,
);

document.addEventListener("registerModal:closed", () => {
  
  if (!auth.currentUser) {
    window.location.assign("/psychologists");
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const burgerBtn = document.querySelector(".burger-menu");
  const closeBtn = document.querySelector(".mobile-close");
  const mobileMenu = document.querySelector(".mobile-drawer");

  if (!burgerBtn || !closeBtn || !mobileMenu) return;

  const openMenu = () => {
    mobileMenu.style.transform = "translateX(0)";
    mobileMenu.style.visibility = "visible";
    mobileMenu.setAttribute("aria-hidden", "false");

    burgerBtn.setAttribute("aria-expanded", "true");
    burgerBtn.style.display = "none";
    closeBtn.style.display = "flex";

    document.body.style.overflow = "hidden";
  };

  const closeMenu = () => {
    mobileMenu.style.transform = "translateX(100%)";
    mobileMenu.style.visibility = "hidden";
    mobileMenu.setAttribute("aria-hidden", "true");

    burgerBtn.setAttribute("aria-expanded", "false");
    burgerBtn.style.display = "flex";
    closeBtn.style.display = "none";

    document.body.style.overflow = "";
  };

  burgerBtn.setAttribute("aria-expanded", "false");
  closeBtn.style.display = "none";

  burgerBtn.addEventListener("click", openMenu);
  closeBtn.addEventListener("click", closeMenu);

  mobileMenu.addEventListener("click", (e) => {
    const link = e.target.closest("a");
    if (link) closeMenu();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });
});
