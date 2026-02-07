import {
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { auth } from "./firebase.js";

export function initHeaderAuth() {
  const header = document.querySelector(".header");
  const nameEl = document.querySelector("[data-user-name]");
  if (!header) return;

  onAuthStateChanged(auth, (user) => {
    if (user) {
      header.classList.add("is-auth");
      if (nameEl) {
        nameEl.textContent = user.displayName || user.email || "Пользователь";
      }
    } else {
      header.classList.remove("is-auth");
      if (nameEl) nameEl.textContent = "";
    }
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
