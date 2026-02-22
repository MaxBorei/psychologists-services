import axios from "axios";
import {
  getFavorites,
  toggleFavorite,
  syncFavoriteButtons,
  renderFavoritesList,
  syncAppointmentButtons,
} from "./favorites";

axios.defaults.baseURL =
  "https://psychologists-services-b403d-default-rtdb.firebaseio.com";

const list = document.querySelector(".list-psychologists");
const loadMoreBtn = document.querySelector(".btn-load-more");

let page = 1;
const perPage = 3;
let allPsychologists = [];
let currentSort = "az";

function makeIdFromName(name) {
  return (name ?? "").toLowerCase().trim().replaceAll(" ", "-");
}

async function getPsychologists() {
  const { data } = await axios.get("/.json");
  const arr = Object.values(data || []);
  return arr.map((p) => ({
    ...p,
    id: makeIdFromName(p.name),
    reviews: Array.isArray(p.reviews) ? p.reviews : [],
  }));
}

function renderPsychologists(items, replace = false) {
  if (!list) return;

  const markup = items.map(psychologistCardMarkup).join("");
  if (replace) list.innerHTML = markup;
  else list.insertAdjacentHTML("beforeend", markup);

  syncFavoriteButtons(list);
  syncAppointmentButtons(list);
}

function psychologistCardMarkup(p) {
  const {
    id,
    avatar_url,
    name,
    about,
    initial_consultation,
    experience,
    rating,
    price_per_hour,
    license,
    specialization,
    reviews = [],
  } = p;

  return `
    <li class="psychologists__card__item">
      <div class="psychologists__card__box" data-id="${id}">
        <div class="psychologists__img__box">
          <span class="onlineDot" aria-hidden="true"></span>
          <img loading="lazy" src="${avatar_url ?? "—"}" alt="avatar" class="psychologists__img">
        </div>

        <div class="psychologists__content__cta">
          <div class="psychologists__card_content">
            <div class="psychologists__card__cta__box">
              <div class="psychlogistics__title__box">
                <p class="psychologists__text__label">Psychologist</p>
                <h2 class="post-title">${name ?? "—"}</h2>
              </div>

              <div class="psychologists__card__metaItem__box">
                <div class="psychologists__metaItem__box">
                  <div class="metaItem">
                    <span class="rating-icon" aria-hidden="true">
                      <svg class="ctaIcon_star">
                        <use href="/sprite.svg#icon-Star"></use>
                      </svg>
                    </span>
                    <p class="psychologists__text__metaItem">Rating: ${rating ?? "—"}</p>
                  </div>

                  <div class="metaItem">
                    <p class="psychologists__text__metaItem">
                      Price / 1 hour: <span class="price_span">${price_per_hour ?? "—"}$</span>
                    </p>
                  </div>
                </div>

                <button class="heart-icon is-active" data-action="add-to-favorites" aria-label="Add to favorites">
                  <svg class="ctaIcon_heart">
                    <use href="/sprite.svg#icon-heart"></use>
                  </svg>
                </button>
              </div>
            </div>

            <div class="psychlodgists__pills_box">
              <div class="psychlogists__card_pills">
                <p class="psychlogists__card_pills_text">Experience: <span class="pills_text">${experience ?? "—"}</span></p>
              </div>
              <div class="psychlogists__card_pills">
                <p class="psychlogists__card_pills_text">License: <span class="pills_text">${license ?? "—"}</span></p>
              </div>
              <div class="psychlogists__card_pills">
                <p class="psychlogists__card_pills_text">Specialization: <span class="pills_text">${specialization ?? "—"}</span></p>
              </div>
              <div class="psychlogists__card_pills">
                <p class="psychlogists__card_pills_text">Initial consultation: <span class="pills_text">${initial_consultation ?? "—"}</span></p>
              </div>
            </div>

            <p class="psychlogists__card_text">${about ?? "—"}</p>

            <ul class="reviews-list">
              ${reviews
                .map(
                  ({ reviewer, rating: r, comment }) => `
                    <li class="review-item">
                      <div class="review-head">
                        <div class="review-avatar">${(reviewer ?? "?")[0]}</div>
                        <div class="review-meta">
                          <p class="reviewer-name">${reviewer ?? "—"}</p>
                          <p class="reviewer-rating">
                            <svg class="ctaIcon_star">
                              <use href="/sprite.svg#icon-Star"></use>
                            </svg>
                            ${r ?? "—"}
                          </p>
                        </div>
                      </div>
                      <p class="review-text">${comment ?? ""}</p>
                    </li>
                  `,
                )
                .join("")}

              <li class="reviews-actions">
                <div class="btn_card_reviews_box">
                  <button
                    class="btn_card_rewies is-disabled"
                    disabled
                    data-action="add-appointment"
                    data-modal-open="appointment"
                    data-name="${name ?? ""}"
                    data-avatar="${avatar_url ?? ""}"
                  >
                    Make an appointment
                  </button>
                </div>
              </li>
            </ul>
          </div>

          <button class="psychlogists__card__btn" data-action="toggle">Read more</button>
        </div>
      </div>
    </li>
  `;
}

function applySort(data, sortType) {
  const arr = [...data];

  switch (sortType) {
    case "az":
      return arr.sort((a, b) => (a.name ?? "").localeCompare(b.name ?? ""));
    case "za":
      return arr.sort((a, b) => (b.name ?? "").localeCompare(a.name ?? ""));
    case "priceLow":
      return arr.sort(
        (a, b) => (a.price_per_hour ?? 0) - (b.price_per_hour ?? 0),
      );
    case "priceHigh":
      return arr.sort(
        (a, b) => (b.price_per_hour ?? 0) - (a.price_per_hour ?? 0),
      );
    case "popular":
      return arr.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    case "unpopular":
      return arr.sort((a, b) => (a.rating ?? 0) - (b.rating ?? 0));
    default:
      return arr;
  }
}

function getPageSlice() {
  const sorted = applySort(allPsychologists, currentSort);
  const start = (page - 1) * perPage;
  const end = start + perPage;
  return sorted.slice(start, end);
}

function updateButton() {
  if (!loadMoreBtn) return;

  const shown = page * perPage;
  if (shown >= allPsychologists.length) {
    loadMoreBtn.style.display = "none";
  } else {
    loadMoreBtn.style.display = "inline-block";
    loadMoreBtn.textContent = "Load more";
  }
}

async function loadInitial() {
  try {
    if (!list) return;

    list.innerHTML = "";
    page = 1;

    allPsychologists = await getPsychologists();

    renderPsychologists(getPageSlice(), true);
    updateButton();
  } catch (error) {
    console.error("Ошибка запроса:", error?.response?.data || error);
  }
}

function onLoadMore() {
  page += 1;
  renderPsychologists(getPageSlice());
  updateButton();
}

document.addEventListener("DOMContentLoaded", () => {
  if (list) loadInitial();
  renderFavoritesList();
});

loadMoreBtn?.addEventListener("click", onLoadMore);

document.addEventListener("click", (e) => {
  const favBtn = e.target.closest('[data-action="add-to-favorites"]');
  if (favBtn) {
    const card = favBtn.closest(".psychologists__card__box");
    if (!card) return;

    const id = card.dataset.id;

    const favorites = getFavorites();
    const fromFavorites = favorites.find((p) => p.id === id);
    const fromAll = allPsychologists.find((p) => p.id === id);

    const data = fromFavorites || fromAll;
    if (!data) return;

    const isAdded = toggleFavorite(data);

    const isFavoritesCard = !!card.closest(".favorites-list");
    if (!isFavoritesCard) {
      favBtn.classList.toggle("is-active", isAdded);
    }

    renderFavoritesList();
    syncFavoriteButtons(document.querySelector(".list-psychologists"));
    syncAppointmentButtons(document.querySelector(".list-psychologists"));
    return;
  }

  const btn = e.target.closest("[data-action='toggle']");
  if (!btn) return;

  const card = btn.closest(".psychologists__card__box");
  if (!card) return;

  const reviewsList = card.querySelector(".reviews-list");
  if (!reviewsList) return;

  reviewsList.classList.toggle("is-open");

  btn.innerHTML = reviewsList.classList.contains("is-open")
    ? `
      <svg class="icon-chevron">
        <use href="/sprite.svg#icon-chevron-up"></use>
      </svg>
    `
    : "Read more";
});

const filtersBox = document.querySelector(".psychologists_filter_box_all");
const btn = filtersBox?.querySelector("[data-action='toggleFilters']");
const dropdown = btn?.nextElementSibling;
const menu = dropdown?.querySelector(".dropdown-menu");

const isOpen = () => menu && !menu.classList.contains("is-hidden");
const chevronUse = btn?.querySelector("use");

function openMenu() {
  if (!menu || !btn || !chevronUse) return;
  menu.classList.remove("is-hidden");
  btn.setAttribute("aria-expanded", "true");
  chevronUse.setAttribute("href", "/sprite.svg#icon-chevron-up");
}

function closeMenu() {
  if (!menu || !btn || !chevronUse) return;
  menu.classList.add("is-hidden");
  btn.setAttribute("aria-expanded", "false");
  chevronUse.setAttribute("href", "/sprite.svg#icon-chevron-down");
}

btn?.addEventListener("click", (e) => {
  e.stopPropagation();
  isOpen() ? closeMenu() : openMenu();
});

document.addEventListener("click", () => {
  if (isOpen()) closeMenu();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && isOpen()) closeMenu();
});

menu?.addEventListener("click", (e) => {
  e.stopPropagation();

  const clickedItem = e.target.closest(".item");
  if (!clickedItem) return;

  const sortType = clickedItem.dataset.sort;
  if (!sortType) return;

  const items = menu.querySelectorAll(".item");
  items.forEach((item) => {
    if (item === clickedItem) item.classList.remove("disabled");
    else item.classList.add("disabled");
  });

  if (sortType === "showAll") {
    currentSort = "az";
    btn.querySelector(".filter__value").textContent = "A to Z";
  } else {
    currentSort = sortType;
    btn.querySelector(".filter__value").textContent = clickedItem.textContent;
  }

  page = 1;
  renderPsychologists(getPageSlice(), true);
  updateButton();
  closeMenu();
});
