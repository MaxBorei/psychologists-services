import axios from "axios";

axios.defaults.baseURL =
  "https://psychologists-services-b403d-default-rtdb.firebaseio.com";

const list = document.querySelector(".list-psychologists");
const loadMoreBtn = document.querySelector(".btn-load-more");

let page = 1;
const perPage = 3;
let allPsychologists = [];

async function getPsychologists() {
  const { data } = await axios.get("/.json");
  const obj = Object.values(data);
  return obj;
}

function renderPsychologists(items) {
  const markup = items
    .map(
      ({
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
      }) => `
      <li class="psychologists__card__item">
        <div class="psychologists__card__box">
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
                          <svg class="ctaIcon_star" >
                            <use  href="/sprite.svg#icon-Star"></use>
                          </svg>
                        </span>
                        <p class="psychologists__text__metaItem">Rating: ${rating ?? "—"}</p>
                      </div>
                      <div class="metaItem">
                        <p class="psychologists__text__metaItem">Price / 1 hour: <span class="price_span">${price_per_hour ?? "—"}$</span></p>
                      </div>
                    </div>
                    <button class="heart-icon" aria-hidden="true">
                        <svg class="ctaIcon_heart" >
                          <use  href="/sprite.svg#icon-heart"></use>
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

                <ul class="reviews-list">${reviews
                  .map(
                    ({ reviewer, rating, comment }) => `
                  <li class="review-item">
                    <div class="review-head">
                        <div class="review-avatar">${(reviewer ?? "?")[0]}</div>
                      <div class="review-meta">
                    <p class="reviewer-name">${reviewer ?? "—"}</p>
                    <p class="reviewer-rating">
                          <svg class="ctaIcon_star" >
                            <use  href="/sprite.svg#icon-Star"></use>
                          </svg>
                        </span> ${rating ?? "—"}</p>
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
            <button class="psychlogists__card__btn" data-action='toggle'>Read more</button>
          </div>
        </div>
      </li>
    `,
    )
    .join("");

  list.insertAdjacentHTML("beforeend", markup);
}

function getPageSlice() {
  const start = (page - 1) * perPage;
  const end = start + perPage;
  return allPsychologists.slice(start, end);
}

function updateButton() {
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
    list.innerHTML = "";
    page = 1;

    allPsychologists = await getPsychologists();

    renderPsychologists(getPageSlice());
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

document.addEventListener("DOMContentLoaded", loadInitial);
loadMoreBtn?.addEventListener("click", onLoadMore);

list.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-action='toggle']");
  if (!btn) return;

  const card = btn.closest(".psychologists__card__box");
  if (!card) return;

  const reviewsList = card.querySelector(".reviews-list");
  if (!reviewsList) return;

  reviewsList.classList.toggle("is-open");

  btn.textContent = reviewsList.classList.contains("is-open")
    ? ""
    : "Read more";
});
