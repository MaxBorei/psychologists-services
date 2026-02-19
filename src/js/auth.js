import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  reload,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { auth } from "./firebase.js";

function closeCurrentModalByForm(formEl) {
  const modal = formEl.closest("[data-modal]");
  if (!modal) return;

  const closeBtn = modal.querySelector("[data-modal-close]");
  if (closeBtn) closeBtn.click();
  else modal.classList.add("visually-hidden");

  document.body.style.overflow = "";
  document.body.classList.remove("no-scroll");
}

const regForm = document.querySelector(".modal__register__form");

regForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  clearFormError(regForm);

  const email = regForm.elements.email.value.trim();
  const password = regForm.elements.password.value.trim();
  const name = regForm.elements.name.value.trim();

  try {
    const { user } = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );

    if (name) {
      await updateProfile(user, { displayName: name });
      await reload(user);
      renderHeaderUser(auth.currentUser);
    }

    regForm.reset();
    closeCurrentModalByForm(regForm);
  } catch (err) {
    console.error("AUTH ERROR:", err.code, err.message, err);
    showFormError(regForm, mapAuthError(err));
  }
});

function renderHeaderUser(user) {
  document.querySelectorAll("[data-user-name]").forEach((el) => {
    el.textContent = user ? user.displayName || user.email || "User" : "";
  });
}

const loginForm = document.querySelector(".modal__login__form");

loginForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  clearFormError(loginForm);

  const email = loginForm.elements.email.value.trim();
  const password = loginForm.elements.password.value.trim();

  try {
    await signInWithEmailAndPassword(auth, email, password);
    loginForm.reset();
    closeCurrentModalByForm(loginForm);
  } catch (err) {
    console.error("AUTH ERROR:", err.code, err.message, err);
    showFormError(loginForm, mapAuthError(err));
  }
});

function getFormErrorEl(formEl) {
  let el = formEl.querySelector(".form-error");
  if (!el) {
    el = document.createElement("p");
    el.className = "form-error";
    el.setAttribute("role", "alert");
    formEl.append(el);
  }
  return el;
}

function clearFormError(formEl) {
  formEl.querySelector(".form-error")?.remove();
}

function showFormError(formEl, message) {
  const el = getFormErrorEl(formEl);
  el.textContent = message;
}

function mapAuthError(err) {
  console.log(err);

  switch (err.code) {
    case "auth/email-already-in-use":
      return "This email is already in use. Please use a different email.";
    case "auth/invalid-email":
      return "The email address is not valid. Please enter a valid email.";
    case "auth/operation-not-allowed":
      return "Email/password accounts are not enabled. Please contact support.";
    case "auth/weak-password":
      return "The password is too weak. Please use a stronger password.";
    case "auth/user-disabled":
      return "This user account has been disabled. Please contact support.";
    case "auth/user-not-found":
      return "No user found with this email. Please check your email or register for a new account.";
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "The email or password is incorrect.";
    case "auth/network-request-failed":
      return "Network error. Please check your internet connection.";
    default:
      return "An unknown authentication error occurred.";
  }
}
