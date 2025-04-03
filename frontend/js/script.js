// script.js

const gameContainer = document.getElementById("gameContainer");
const loadMoreBtn = document.getElementById("loadMoreBtn");
const searchInput = document.getElementById("searchInput");

let currentPage = 1;
let currentSearch = "";
let userApiKey = localStorage.getItem("rawgApiKey") || null;

if (!userApiKey) {
  userApiKey = prompt("Please enter your RAWG API Key:");
  if (userApiKey) {
    localStorage.setItem("rawgApiKey", userApiKey);
  } else {
    alert("API key is required to use this app.");
  }
}

async function fetchGames(search = "", page = 1) {
  try {
    const url = `https://api.rawg.io/api/games?key=${userApiKey}&search=${encodeURIComponent(
      search
    )}&page=${page}&page_size=8`;
    const res = await fetch(url);
    const data = await res.json();

    if (Array.isArray(data.results)) {
      const seenTitles = new Set();

      for (const game of data.results) {
        const normalizedTitle = game.name.trim().toLowerCase();
        if (seenTitles.has(normalizedTitle)) continue;

        seenTitles.add(normalizedTitle);
        const deal = await fetchDeal(game.name);
        const card = await createGameCard(game);
        if (card) gameContainer.appendChild(card);
      }
      
    } else {
      console.error("Invalid API response:", data);
      alert("Something went wrong fetching game data.");
    }
  } catch (error) {
    console.error("RAWG API fetch error:", error);
    alert("Failed to fetch data from RAWG API.");
  }
}

async function fetchDeal(title) {
  try {
    const response = await fetch(
      `https://video-game-library-tracker.onrender.com/api/deals?title=${encodeURIComponent(
        title
      )}`
    );
    const data = await response.json();
    return data && data.length > 0 ? data[0] : null;
  } catch (error) {
    console.warn("Deal fetch failed for:", title);
    return null;
  }
}

function renderGameCard(game, deal) {
  const card = document.createElement("div");
  card.className = "game-card";

  const dealHTML = deal
    ? `<div class="deal">
        💲 <strong>$${parseFloat(deal.salePrice).toFixed(2)}</strong> @ ${
        deal.storeName
      }
      </div>`
    : `<div class="deal">No deals found</div>`;

  card.innerHTML = `
    <img src="${game.background_image}" alt="${game.name}" />
    <div class="info">
      <h3>${game.name}</h3>
      <div class="platforms">
        ${game.parent_platforms
          .map((p) => `<i class="icon-${p.platform.slug}"></i>`) // Font Awesome assumed
          .join(" ")}
      </div>
      <div class="meta">
        <span>${game.rating.toFixed(2)}</span>
        <span>${game.released}</span>
      </div>
      ${dealHTML}
    </div>
  `;

  gameContainer.appendChild(card);
}

function handleSearchInput(e) {
  const value = e.target.value.trim();
  gameContainer.innerHTML = "";
  currentPage = 1;
  currentSearch = value;
  fetchGames(currentSearch, currentPage);
}

function handleLoadMore() {
  currentPage++;
  fetchGames(currentSearch, currentPage);
}

searchInput.addEventListener("input", handleSearchInput);
loadMoreBtn.addEventListener("click", handleLoadMore);

document.addEventListener("DOMContentLoaded", () => {
  fetchGames();
});
