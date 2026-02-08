import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { auth } from "./firebase.js";
import { renderFavoritesList } from "./favorites.js";

function openRegisterModal() {
  document.querySelector('[data-modal-open="register"]')?.click();
}

function isFavoritesRoute() {
  return window.location.pathname === "/favorites";
}

document.addEventListener("DOMContentLoaded", () => {
  if (!document.querySelector(".favorites-list")) return;

  onAuthStateChanged(auth, (user) => {
    if (!isFavoritesRoute()) return;

    if (!user) {
      openRegisterModal();
      return;
    }

    renderFavoritesList();
  });
});
