// search.js

const searchInputField = document.getElementById("searchInput");
const gameList = document.querySelector(".gameList");
const loadMoreButton = document.querySelector(".main-button");

const renderedGameSlugs = new Set();

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
      const title = game.name.trim().toLowerCase();
      const date = game.released || "";
      const key = `${title}|${date}`;
      if (renderedGameSlugs.has(key)) continue;
      renderedGameSlugs.add(key);      
    
      const card = await createGameCard(game);
      if (card) gameList.appendChild(card);      
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
