import axios from "axios";

axios.defaults.baseURL =
  "https://psychologists-services-b403d-default-rtdb.firebaseio.com";

const fetchBtn = document.querySelector(".btn-psychologists");
const list = document.querySelector(".posts-psychologists");

fetchBtn.addEventListener("click", async () => {
  try {
    const psychologists = await getPsychologists();
    renderPsychologists(psychologists);
  } catch (error) {
    console.error("Ошибка запроса:", error);
  }
});

async function getPsychologists() {
  const { data } = await axios.get("/.json"); 
  return Array.isArray(data) ? data : Object.values(data || {});
}

function renderPsychologists(items) {
  const markup = items
    .map(({ name, about, initial_consultation, experience }) => `
      <li>
        <h2 class="post-title">${name ?? "—"}</h2>
        <p><b>Experience</b>: ${experience ?? "—"}</p>
        <p><b>About</b>: ${(about ?? "").slice(0, 120)}...</p>
        <p><b>Consultation</b>: ${initial_consultation ?? "—"}</p>
      </li>
    `)
    .join("");

  list.innerHTML = markup || "<li>Пусто</li>";
}
