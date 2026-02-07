import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { auth } from "./firebase.js";
import { renderFavoritesList } from "./favorites.js";

function openRegisterModal() {
  document.querySelector('[data-modal-open="register"]')?.click();
}

document.addEventListener("DOMContentLoaded", () => {
  const favoritesList = document.querySelector(".favorites-list");
  if (!favoritesList) return;

  onAuthStateChanged(auth, (user) => {
    if (!user) {
      openRegisterModal();
      return;
    }

    renderFavoritesList();
  });
});
