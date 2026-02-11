(function initThemeSwitcher() {
  const root = document.documentElement;
  const floating = document.querySelector(".floating");
  if (!floating) return;

  const buttons = Array.from(floating.querySelectorAll("button.item"));

  const getThemeFromButton = (btn) => {
    const dot = btn.querySelector(".iconDot");
    if (!dot) return null;

    if (dot.classList.contains("orange")) return "orange";
    if (dot.classList.contains("blue")) return "blue";
    if (dot.classList.contains("green")) return "green";
    return null;
  };

  const setActive = (theme) => {
    buttons.forEach((btn) => {
      const btnTheme = getThemeFromButton(btn);
      const isActive = btnTheme === theme;

      if (isActive) btn.setAttribute("data-active", "true");
      else btn.removeAttribute("data-active");
    });
  };

  const applyTheme = (theme) => {
    if (!theme) return;
    root.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    setActive(theme);
  };

  const saved = localStorage.getItem("theme");
  const initial = saved || root.getAttribute("data-theme") || "green";
  applyTheme(initial);

  floating.addEventListener("click", (e) => {
    const btn = e.target.closest("button.item");
    if (!btn) return;

    const theme = getThemeFromButton(btn);
    applyTheme(theme);
  });

  floating.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    const btn = e.target.closest("button.item");
    if (!btn) return;

    e.preventDefault();
    const theme = getThemeFromButton(btn);
    applyTheme(theme);
  });
})();
