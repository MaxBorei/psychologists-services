import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { auth } from "./firebase.js";
import {
  renderFavoritesList,
  syncAppointmentButtons,
  syncFavoriteButtons,
} from "./favorites.js";

function openRegisterModal() {
  document.querySelector('[data-modal-open="register"]')?.click();
}

function isFavoritesRoute() {
  const p = window.location.pathname.replace(/\/+$/, "");
  return p.endsWith("/favorites") || p.endsWith("/favorites.html");
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
    syncFavoriteButtons(document.querySelector(".favorites-list"));
    syncAppointmentButtons(document.querySelector(".favorites-list"));
  });
});
