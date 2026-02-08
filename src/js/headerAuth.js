import {
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { auth } from "./firebase.js";
import { syncAppointmentButtons } from "./favorites.js";

export function initHeaderAuth() {
  const header = document.querySelector(".header");
  const nameEl = document.querySelector("[data-user-name]");
  if (!header) return;

  onAuthStateChanged(auth, (user) => {
    header.classList.toggle("is-auth", !!user);

    if (nameEl) {
      nameEl.textContent = user ? user.displayName || user.email : "";
    }

    syncAppointmentButtons(document.querySelector(".list-psychologists"));
    syncAppointmentButtons(document.querySelector(".favorites-list"));
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
