import { auth } from "./firebase.js";

const BASE_KEY = "favorites";

function getUid() {
  return auth?.currentUser?.uid || null;
}

function getStorageKey() {
  const uid = getUid();
  return uid ? `${BASE_KEY}:${uid}` : null;
}

export function getFavorites() {
  const key = getStorageKey();
  if (!key) return [];
  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch {
    return [];
  }
}

export function setFavorites(items) {
  const key = getStorageKey();
  if (!key) return;
  localStorage.setItem(key, JSON.stringify(items));
}

export function toggleFavorite(item) {
  const key = getStorageKey();
  if (!key) return false;

  const favorites = getFavorites();
  const index = favorites.findIndex((f) => f.id === item.id);

  if (index === -1) {
    favorites.push(item);
    setFavorites(favorites);
    return true;
  }

  favorites.splice(index, 1);
  setFavorites(favorites);
  return false;
}

export function syncFavoriteButtons(container) {
  if (!container) return;

  const favorites = getFavorites();
  const favSet = new Set(favorites.map((f) => f.id));

  container
    .querySelectorAll(".psychologists__card__box[data-id]")
    .forEach((card) => {
      const id = card.dataset.id;
      const btn = card.querySelector('[data-action="add-to-favorites"]');
      if (!btn) return;

      const active = favSet.has(id);
      btn.classList.toggle("is-active", active);
      btn.setAttribute(
        "aria-label",
        active ? "Remove from favorites" : "Add to favorites",
      );
    });
}

export function syncAppointmentButtons(container) {
  if (!container) return;

  const isAuthed = !!auth.currentUser;

  container
    .querySelectorAll(".psychologists__card__box[data-id]")
    .forEach((card) => {
      const btn = card.querySelector('[data-action="add-appointment"]');
      if (!btn) return;

      btn.disabled = !isAuthed;
      btn.classList.toggle("is-disabled", !isAuthed);
      btn.setAttribute(
        "aria-label",
        isAuthed ? "Make an appointment" : "Log in to make an appointment",
      );
    });
}

export function renderFavoritesList() {
  const list = document.querySelector(".favorites-list");
  if (!list) return;

  const favorites = getFavorites();

  if (favorites.length === 0) {
    list.innerHTML = `<div class="favorites__empty"><p class="favorites__empty__text">Save psychologists you like to see them here</p><a class="favorites-empty" data-link href="/psychologists">Browse psychologists</a></div>`;
    return;
  }

  list.innerHTML = favorites.map(favoriteCardMarkup).join("");
}

function favoriteCardMarkup(p) {
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
          <img src="${avatar_url ?? "—"}" alt="avatar" class="psychologists__img">
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

                <button class="heart-icon is-active" data-action="add-to-favorites" aria-label="Remove from favorites">
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
                <button
                  class="btn_card_rewies"
                  data-modal-open="appointment"
                  data-name="${name ?? ""}"
                  data-avatar="${avatar_url ?? ""}"
                >
                  Make an appointment
                </button>
              </li>
            </ul>
          </div>

          <button class="psychlogists__card__btn" data-action="toggle">Read more</button>
        </div>
      </div>
    </li>
  `;
}
