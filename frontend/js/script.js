// script.js
import { createGameCard } from './cards.js';

const gameList = document.querySelector(".gameList");
const loadMoreBtn = document.querySelector(".main-button");

let currentPage = 1;
const pageSize = 20;

async function fetchGames(page = 1) {
  try {
    const response = await fetch(`https://api.rawg.io/api/games?key=${window.RAWG_API_KEY}&page=${page}`);
    const data = await response.json();

    if (data.results && data.results.length > 0) {
      data.results.forEach((game) => {
        const card = createGameCard(game);
        gameList.appendChild(card);
      });
    } else {
      loadMoreBtn.disabled = true;
      loadMoreBtn.textContent = "No more games to load.";
    }

  } catch (error) {
    console.error("Failed to load games:", error);
    loadMoreBtn.disabled = true;
    loadMoreBtn.textContent = "Error loading games.";
  }
}

// Load first page on initial load
fetchGames(currentPage);

// Handle Load More button
loadMoreBtn.addEventListener("click", () => {
  currentPage++;
  fetchGames(currentPage);
});
