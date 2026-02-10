// ===== helpers =====
const EMAIL_RE = /^\S+@\S+\.\S+$/;

function getField(form, name) {
  return form.querySelector(`[name="${name}"]`);
}

function clearError(input) {
  if (!input) return;
  input.classList.remove("is-invalid");
  const err =
    input
      .closest("label, .field, .form-field, div")
      ?.querySelector(".form-error") ||
    input.parentElement?.querySelector(".form-error");
  if (err) err.remove();
}

function setError(input, message) {
  if (!input) return;
  clearError(input);

  input.classList.add("is-invalid");

  const err = document.createElement("p");
  err.className = "form-error";
  err.textContent = message;

  // Ставимо помилку одразу після input/textarea/select
  input.insertAdjacentElement("afterend", err);
}

function readFormValues(form) {
  return Object.fromEntries(new FormData(form));
}

function validateRequired(form, fieldName, label = "Поле") {
  const input = getField(form, fieldName);
  if (!input) return true; // якщо поля нема — не валимо форму
  const value = (input.value ?? "").trim();
  if (!value) {
    setError(input, `${label} обовʼязкове`);
    return false;
  }
  return true;
}

function validateEmail(form, fieldName = "email") {
  const input = getField(form, fieldName);
  if (!input) return true;
  const value = (input.value ?? "").trim();

  // якщо поле required — воно вже перевірене validateRequired
  if (value && !EMAIL_RE.test(value)) {
    setError(input, "Некоректний email");
    return false;
  }
  return true;
}

function validatePasswordMin(form, fieldName = "password", min = 6) {
  const input = getField(form, fieldName);
  if (!input) return true;
  const value = (input.value ?? "").trim();
  if (value && value.length < min) {
    setError(input, `Пароль має бути мінімум ${min} символів`);
    return false;
  }
  return true;
}

function validatePhoneUA(form, fieldName = "phone") {
  const input = getField(form, fieldName);
  if (!input) return true;

  const raw = (input.value ?? "").trim();
  const value = raw.replace(/[^\d+]/g, ""); // лишаємо тільки + та цифри

  // строго: +380(код 2 цифри)(номер 7 цифр)
  const m = value.match(/^\+380(\d{2})(\d{7})$/);
  if (!m) {
    setError(input, "Телефон має бути у форматі +380XXXXXXXXX");
    return false;
  }

  const code = m[1]; // наприклад "67", "97"
  const number = m[2]; // 7 цифр після коду

  // мобільні коди України (найпоширеніші)
  const mobileCodes = new Set([
    "39",
    "50",
    "66",
    "95",
    "99",
    "63",
    "67",
    "68",
    "96",
    "97",
    "98",
    "73",
    "93",
    "91",
    "92",
    "94",
  ]);

  if (!mobileCodes.has(code)) {
    setError(
      input,
      "Після +380 має бути коректний код оператора (67, 97, 98...)",
    );
    return false;
  }

  // додатково: щоб не було +380670000000
  if (/^0{7}$/.test(number)) {
    setError(input, "Некоректний номер телефону");
    return false;
  }

  // нормалізуємо введення
  input.value = value;
  return true;
}

// ===== attach validation to any form =====
function attachValidation(form, rules) {
  if (!form) return;

  // чистимо помилку при введенні
  form.addEventListener("input", (e) => {
    const el = e.target;
    if (
      el &&
      (el.matches("input") || el.matches("textarea") || el.matches("select"))
    ) {
      clearError(el);
    }
  });

  form.addEventListener("submit", (e) => {
    // спочатку прибираємо старі помилки
    form.querySelectorAll("input, textarea, select").forEach(clearError);

    let ok = true;

    // required поля
    for (const r of rules.required ?? []) {
      ok = validateRequired(form, r.name, r.label) && ok;
    }

    // email
    if (rules.email) ok = validateEmail(form, rules.email) && ok;

    // password
    if (rules.passwordMin) {
      ok =
        validatePasswordMin(
          form,
          rules.passwordMin.name,
          rules.passwordMin.min,
        ) && ok;
    }

    // phone
    if (rules.phone) ok = validatePhoneUA(form, rules.phone) && ok;

    if (!ok) {
      e.preventDefault();
      // фокус на перше невалідне поле
      const firstInvalid = form.querySelector(".is-invalid");
      firstInvalid?.focus();
      return;
    }

    // якщо все ок — тут ти можеш робити свій submit/логіку
    // (якщо форма має відправлятись звичайно — просто не preventDefault)
    // e.preventDefault();
    // const data = readFormValues(form);
    // console.log("submit", data);
  });
}

// ===== connect your forms =====
document.addEventListener("DOMContentLoaded", () => {
  // LOGIN: email + password required
  attachValidation(document.querySelector(".modal__login__form"), {
    required: [
      { name: "email", label: "Email" },
      { name: "password", label: "Пароль" },
    ],
    email: "email",
    passwordMin: { name: "password", min: 6 },
  });

  // REGISTER: name + email + password required
  attachValidation(document.querySelector(".modal__register__form"), {
    required: [
      { name: "name", label: "Імʼя" },
      { name: "email", label: "Email" },
      { name: "password", label: "Пароль" },
    ],
    email: "email",
    passwordMin: { name: "password", min: 6 },
  });

  // APPOINTMENT: name, phone, time, email required; message optional
  attachValidation(document.querySelector(".modal__appointment__form"), {
    required: [
      { name: "name", label: "Імʼя" },
      { name: "phone", label: "Телефон" },
      { name: "time", label: "Час" },
      { name: "email", label: "Email" },
    ],
    email: "email",
    phone: "phone",
    // message не вказуємо — він не required
  });
});
