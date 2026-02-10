import {
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { auth } from "./firebase.js";
import { syncAppointmentButtons, syncFavoriteButtons } from "./favorites.js";

export function initHeaderAuth() {
  const header = document.querySelector(".header");
  const nameEl = document.querySelector("[data-user-name]");
  if (!header) return;

  onAuthStateChanged(auth, (user) => {
    console.log("AUTH STATE:", user ? "LOGGED IN" : "LOGGED OUT", user?.uid);
    header.classList.toggle("is-auth", !!user);

    if (nameEl) {
      nameEl.textContent = user ? user.displayName || user.email : "";
    }

    const list = document.querySelector(".list-psychologists");
    const favList = document.querySelector(".favorites-list");

    syncAppointmentButtons(list);
    syncAppointmentButtons(favList);

    syncFavoriteButtons(list);
    syncFavoriteButtons(favList);
  });
}

document.addEventListener("click", async (e) => {
  const logoutBtn = e.target.closest('[data-modal-open="logout"]');
  if (!logoutBtn) return;

  try {
    await signOut(auth);
  } catch (err) {
    console.error(err);
  }
});
