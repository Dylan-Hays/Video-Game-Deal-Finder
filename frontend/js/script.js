// script.js
import { createGameCard } from "./cards.js";

const gameList = document.querySelector(".gameList");
const loadMoreBtn = document.querySelector(".main-button");

let currentPage = 1;
const pageSize = 20;
const renderedGameIds = new Set();

async function fetchGames(page = 1) {
  if (!window.RAWG_API_KEY) {
    console.error("RAWG API key is missing!");
    return;
  }

  try {
    const response = await fetch(
      `https://api.rawg.io/api/games?key=${window.RAWG_API_KEY}&page=${page}`
    );
    const data = await response.json();

    if (data.results && data.results.length > 0) {
      for (const game of data.results) {
        if (renderedGameIds.has(game.id)) continue;
        renderedGameIds.add(game.id);

        const card = await createGameCard(game);
        gameList.appendChild(card);
      }
    } else {
      disableLoadMore("No more games to load.");
    }
  } catch (error) {
    console.error("Failed to load games:", error);
    disableLoadMore("Error loading games.");
  }
}

function disableLoadMore(message) {
  loadMoreBtn.disabled = true;
  loadMoreBtn.textContent = message;
}

// Initial fetch
fetchGames(currentPage);
document.getElementById("js-preloader")?.remove();

// Handle Load More button
loadMoreBtn.addEventListener("click", () => {
  currentPage++;
  fetchGames(currentPage);
});
