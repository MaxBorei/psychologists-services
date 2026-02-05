const routes = {
  "/": "hero",
  "/psychologists": "psychologists",
};

function setActiveNav() {
  const path = location.pathname;

  document.querySelectorAll(".header-nav__link").forEach((link) => {
    const href = link.getAttribute("href");
    link.classList.toggle("is-active", href === path);
  });
}

function setSurfaceHeader() {
  const path = location.pathname;
  const header = document.querySelector(".header");
  if (!header) return;

  header.classList.toggle("is-surface", path !== "/");
}

function renderRoute() {
  const path = location.pathname;
  const pageId = routes[path] || "hero";

  document.querySelectorAll("main > section").forEach((section) => {
    section.hidden = section.id !== pageId;
  });

  setSurfaceHeader();

  if (path === "/") {
    document
      .querySelectorAll(".header-nav__link")
      .forEach((link) => link.classList.remove("is-active"));
  } else {
    setActiveNav();
  }
}

document.addEventListener("click", (e) => {
  const link = e.target.closest("a[data-link]");
  if (!link) return;

  e.preventDefault();
  history.pushState(null, "", link.getAttribute("href"));
  renderRoute();
});

window.addEventListener("popstate", renderRoute);
renderRoute();
