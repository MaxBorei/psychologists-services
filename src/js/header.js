document.addEventListener("DOMContentLoaded", () => {
  const burgerBtn = document.querySelector(".burger-menu");
  const closeBtn = document.querySelector(".mobile-close");
  const mobileMenu = document.querySelector(".mobile-menu");

  if (!burgerBtn || !closeBtn || !mobileMenu) return;

  const openMenu = () => {
    mobileMenu.style.transform = "translateX(0)";
    mobileMenu.style.visibility = "visible";

    burgerBtn.classList.add("is-open");
    burgerBtn.setAttribute("aria-expanded", "true");

    burgerBtn.style.display = "none";
    closeBtn.style.display = "flex";

    document.body.style.overflow = "hidden";
  };

  const closeMenu = () => {
    mobileMenu.style.transform = "translateX(100%)";
    mobileMenu.style.visibility = "hidden";

    burgerBtn.classList.remove("is-open");
    burgerBtn.setAttribute("aria-expanded", "false");

    burgerBtn.style.display = "flex";
    closeBtn.style.display = "none";

    document.body.style.overflow = "";
  };

  // Початкові стани
  burgerBtn.setAttribute("aria-expanded", "false");
  closeBtn.style.display = "none";

  burgerBtn.addEventListener("click", openMenu);
  closeBtn.addEventListener("click", closeMenu);

  // Закривати по кліку на пункт меню
  mobileMenu.addEventListener("click", (e) => {
    const link = e.target.closest("a");
    if (link) closeMenu();
  });

  // Закривати по ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });
});