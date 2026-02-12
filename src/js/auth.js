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

function getFormErrorEl(formEl) {
  let el = formEl.querySelector(".form-error");
  if (!el) {
    el = document.createElement("p");
    el.className = "form-error";
    el.setAttribute("role", "alert");
    formEl.appendChild(el);
  }
  return el;
}

function showFormError(formEl, msg) {
  const el = getFormErrorEl(formEl);
  el.textContent = msg;
  el.style.display = "block";
}

function clearFormError(formEl) {
  const el = formEl.querySelector(".form-error");
  if (!el) return;
  el.textContent = "";
  el.style.display = "none";
}

// function mapAuthError(err) {
//   const code = err?.code || "";
//   if (code === "auth/email-already-in-use")
//     return "This email is already in use.";
//   if (code === "auth/invalid-email") return "Invalid email address.";
//   if (code === "auth/weak-password")
//     return "Password should be at least 6 characters.";
//   if (code === "auth/user-not-found") return "No user found with this email.";
//   if (code === "auth/wrong-password") return "Incorrect password.";
//   if (code === "auth/invalid-credential") return "Invalid email or password.";
//   if (code === "auth/too-many-requests")
//     return "Too many attempts. Try again later.";
//   return "Something went wrong. Please try again.";
// }

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
    }

    regForm.reset();
    closeCurrentModalByForm(regForm);
  } catch (err) {
    console.error(err);
  }
});

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
    console.error(err);
  }
});
