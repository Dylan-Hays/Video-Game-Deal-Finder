// search.js
import { createGameCard } from './cards.js';

const searchInput = document.getElementById("searchInput");
const gameList = document.querySelector(".gameList");

searchInput.addEventListener("input", async function () {
  const query = this.value.trim();

  if (query.length === 0) {
    gameList.innerHTML = "";
    return;
  }

  try {
    const response = await fetch(`https://api.rawg.io/api/games?key=${window.RAWG_API_KEY}&search=${query}`);
    const data = await response.json();

    gameList.innerHTML = "";

    if (data.results && data.results.length > 0) {
      data.results.forEach((game) => {
        const card = createGameCard(game);
        gameList.appendChild(card);
      });
    } else {
      gameList.innerHTML = "<p>No games found.</p>";
    }

  } catch (error) {
    console.error("Search failed:", error);
    gameList.innerHTML = "<p>Error loading results. Please try again.</p>";
  }
});