// search.js

const searchInputField = document.getElementById("searchInput");
const gameList = document.querySelector(".gameList");
const loadMoreButton = document.querySelector(".main-button");

const renderedGameSlugs = new Set();// Capitalizes the first character of a string

// Core function to fetch & render search results
async function handleSearch(query) {

  const apiKey = window.RAWG_API_KEY || localStorage.getItem("rawgApiKey");
  if (!apiKey || query.length < 3) return; // Avoid weak/incomplete queries

  gameList.innerHTML = ""; // Clear old results
  renderedGameSlugs.clear(); // Reset deduplication
  loadMoreButton.style.display = "none"; // Hide pagination during search

  try {
    const res = await fetch(
      `https://api.rawg.io/api/games?key=${
        apiKey
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
      const key = `${title}|${date}`; // Uniqueness per title+release
      if (renderedGameSlugs.has(key)) continue;
      renderedGameSlugs.add(key);      

      const card = await createGameCard(game);
      if (card) gameList.appendChild(card);      
    }

  } catch (err) {
    console.error("Search failed:", err);
  }
}

// Run search on Enter key
searchInputField.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    handleSearch(searchInputField.value.trim());
  }
});

// Run search on search button click
const searchBtn = document.getElementById("searchBtn");
if (searchBtn) {
  searchBtn.addEventListener("click", () => {
    handleSearch(searchInputField.value.trim());
  });
}

// Remove stray reference if previously attached incorrectly
searchInputField.removeEventListener("input", handleSearch);
