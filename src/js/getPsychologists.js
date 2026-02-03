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
      }) => `
      <li class="psychologists__card__box">
        <div class="psychologists__img__box">
        <span class="onlineDot" aria-hidden="true"></span>
        <img src="${avatar_url ?? "—"}" alt="avatar" class="psychologists__img">
        </div>
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
                <span class="heart-icon" aria-hidden="true">
                    <svg class="ctaIcon_heart" >
                      <use  href="/sprite.svg#icon-heart"></use>
                    </svg>
                  </span>
              </div>
            </div>
            <p><b>Experience</b>: ${experience ?? "—"}</p>
            <p><b>About</b>: ${(about ?? "").slice(0, 120)}...</p>
            <p><b>Consultation</b>: ${initial_consultation ?? "—"}</p>
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
