// search.js
import { createGameCard } from "./cards.js";

const searchInput = document.getElementById("searchInput");
const gameList = document.querySelector(".gameList");
const loadMoreBtn = document.querySelector(".main-button");

const renderedGameIds = new Set();

async function handleSearch(query) {
  if (!window.RAWG_API_KEY || query.length < 3) return;

  gameList.innerHTML = "";
  renderedGameIds.clear();
  loadMoreBtn.style.display = "none";

  try {
    const res = await fetch(
      `https://api.rawg.io/api/games?key=${
        window.RAWG_API_KEY
      }&search=${encodeURIComponent(query)}`
    );
    const data = await res.json();

    if (!data.results || data.results.length === 0) {
      const msg = document.createElement("p");
      msg.textContent = "No results found.";
      gameList.appendChild(msg);
      return;
    }

    for (const game of data.results) {
      if (renderedGameIds.has(game.id)) continue;
      renderedGameIds.add(game.id);

      const card = await createGameCard(game);
      gameList.appendChild(card);
    }
  } catch (err) {
    console.error("Search failed:", err);
  }
}

let debounceTimeout;
searchInput.addEventListener("input", (e) => {
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(() => handleSearch(e.target.value.trim()), 300);
});
