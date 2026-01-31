import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { auth } from "./firebase.js";


const regForm = document.querySelector('.modal__register__form');

regForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = regForm.elements.email.value.trim();
  const password = regForm.elements.password.value.trim();

  try {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    console.log('Registered:', user.uid);
  } catch (err) {
    console.error(err.code, err.message);
  }
});



const loginForm = document.querySelector('.modal__login__form');

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = loginForm.elements.email.value.trim();
  const password = loginForm.elements.password.value.trim();

  try {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    console.log('Logged in:', user.uid);
  } catch (err) {
    console.error(err.code, err.message);
  }
});