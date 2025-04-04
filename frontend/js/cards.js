// cards.js

const API_BASE = "https://video-game-library-tracker.onrender.com";

// Prompt for RAWG API key if not found in localStorage
let RAWG_API_KEY = localStorage.getItem("rawg_key");
if (!RAWG_API_KEY) {
  RAWG_API_KEY = prompt("Enter your RAWG API Key:");
  localStorage.setItem("rawg_key", RAWG_API_KEY);
}

let storeMap = {};

// Preload store IDs → names from CheapShark
async function loadStores() {
  try {
    const res = await fetch("https://www.cheapshark.com/api/1.0/stores");
    const data = await res.json();
    data.forEach((store) => {
      storeMap[store.storeID] = store.storeName;
    });
  } catch (err) {
    console.error("Failed to load store names:", err);
  }
}
loadStores();

// Periodically remove expired deal cache entries (older than 1 hour)
function cleanupOldDeals(maxAgeMs = 3600000) {
  for (const key in sessionStorage) {
    if (key.startsWith("deal-")) {
      try {
        const { ts } = JSON.parse(sessionStorage.getItem(key));
        if (Date.now() - ts > maxAgeMs) {
          sessionStorage.removeItem(key);
        }
      } catch (e) {
        sessionStorage.removeItem(key);// Fallback if corrupted
      }
    }
  }
}

// Retrieve deal from sessionStorage cache (if fresh)
function getCachedDeal(title, maxAgeMs = 3600000) {
  const cached = sessionStorage.getItem(`deal-${title}`);
  if (cached) {
    try {
      const { deal, ts } = JSON.parse(cached);
      if (Date.now() - ts < maxAgeMs) return deal;
      else sessionStorage.removeItem(`deal-${title}`);
    } catch (e) {
      sessionStorage.removeItem(`deal-${title}`);
    }
  }
  return null;
}

// Save deal to sessionStorage cache with timestamp
function setCachedDeal(title, deal) {
  sessionStorage.setItem(`deal-${title}`, JSON.stringify({ deal, ts: Date.now() }));
}

// Clean expired deals on load
cleanupOldDeals();

// Clear cache completely on tab/window close
window.addEventListener("beforeunload", () => {
  Object.keys(sessionStorage)
    .filter(key => key.startsWith("deal-"))
    .forEach(key => sessionStorage.removeItem(key));
});

// Fetch deal data (use cache if available)
async function fetchGameDeal(title) {
  const cached = getCachedDeal(title);
  if (cached) return cached;

  try {
    const res = await fetch(`${API_BASE}/api/deals?title=${encodeURIComponent(title)}`);
    const data = await res.json();
    setCachedDeal(title, data);// Store fresh result
    return data;
  } catch (err) {
    console.error("Error fetching deal:", err);
    return null;
  }
}

// Create a game card DOM element
window.createGameCard = function(game) {
  const card = document.createElement("div");
  card.classList.add("game-card");

  const thumbnail = document.createElement("div");
  thumbnail.className = "thumbnail";
  thumbnail.innerHTML = `<img src="${game.background_image}" alt="${game.name} Cover">`;

  const info = document.createElement("div");
  info.className = "info";

  const cardDetails = document.createElement("div");
  cardDetails.className = "card-details";

  const title = document.createElement("h4");
  title.textContent = game.name;

  const platforms = document.createElement("div");
  platforms.className = "platforms";
  platforms.innerHTML = renderPlatforms(game.platforms || []);

  const meta = document.createElement("ul");
  const rating = document.createElement("li");
  rating.innerHTML = `<i class="fa-solid fa-star"></i> ${game.rating ?? "?"}`;

  const release = document.createElement("li");
  release.innerHTML = `<i class="fa-solid fa-calendar-days"></i> ${
    game.released ?? "?"
  }`;

  meta.appendChild(rating);
  meta.appendChild(release);

  const deal = document.createElement("div");
  deal.className = "deal-info";

    // Assemble card structure
  cardDetails.appendChild(title);
  cardDetails.appendChild(platforms);
  cardDetails.appendChild(meta);
  cardDetails.appendChild(deal);

  info.appendChild(cardDetails);
  card.appendChild(thumbnail);
  card.appendChild(info);

  renderGameDeal(game.name, deal);// Populate deal section asynchronously

  return card;
}

// Render deal info into a card's deal element
const renderGameDeal = async (gameTitle, priceElement) => {
  const encodedTitle = encodeURIComponent(gameTitle);
  const url = `https://video-game-library-tracker.onrender.com/api/deals?title=${encodedTitle}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Network response was not ok");

    const data = await response.json();
    const deal = data[0];

    if (deal && deal.salePrice && deal.normalPrice) {
      const discount = Math.round(
        100 - (deal.salePrice / deal.normalPrice) * 100
      );

      if (discount === 0) {
        priceElement.innerHTML = "";// No discount, show nothing
        return null;
      }

      // Display discount badge and pricing
      priceElement.innerHTML = `
        <div class="deal-badge">
          <span class="deal-percent">-${discount}%</span>
          <span class="old-price">$${parseFloat(deal.normalPrice).toFixed(
            2
          )}</span>
          <span class="new-price">$${parseFloat(deal.salePrice).toFixed(
            2
          )}</span>
        </div>
        <div class="deal-store">
         <a href="https://www.cheapshark.com/redirect?dealID=${
          deal.dealID
          }" target="_blank">
          @ ${storeMap[deal.storeID] ?? "Unknown Store"}
         </a>
       </div>
      `;
    } else {
      priceElement.textContent = "";// No deal found
    }
  } catch (error) {
    priceElement.textContent = "";// API error fallback
  }
};

window.createGameCard = createGameCard;// Expose globally for script.js

//Platform Icon Map Logic
const PLATFORM_ICON_MAP = {
  pc: "fa-solid fa-desktop",
  playstation: "fa-brands fa-playstation",
  xbox: "fa-brands fa-xbox",
  nintendo: "fa-solid fa-gamepad",
  ios: "fa-brands fa-apple",
  mac: "fa-brands fa-apple",
  android: "fa-brands fa-android",
  linux: "fa-brands fa-linux",
  web: "fa-solid fa-globe",
};

const DEFAULT_PLATFORM_ICON = "fa-solid fa-gamepad";

// Normalize platform names to known keys
function normalizePlatform(name) {
  const lower = name.toLowerCase();
  if (lower.includes("playstation")) return "playstation";
  if (lower.includes("xbox")) return "xbox";
  if (lower.includes("nintendo")) return "nintendo";
  if (lower.includes("pc")) return "pc";
  if (lower.includes("mac")) return "mac";
  if (lower.includes("ios")) return "ios";
  if (lower.includes("android")) return "android";
  if (lower.includes("linux")) return "linux";
  if (lower.includes("web")) return "web";
  return name.toLowerCase();// fallback
}

// Build a single platform icon with tooltip showing all platform name variants
function renderPlatformIcon(normalized, nameList) {
  const iconClass = PLATFORM_ICON_MAP[normalized] || DEFAULT_PLATFORM_ICON;
  const title = nameList.join(", ");
  return `<i class="${iconClass} platform-icon" title="${title}"></i>`;
}

// Render all platforms into icons, grouped by normalized type
function renderPlatforms(platformArray) {
  const grouped = {};
  platformArray.forEach((p) => {
    const norm = normalizePlatform(p.platform.name);
    if (!grouped[norm]) grouped[norm] = [];
    grouped[norm].push(p.platform.name);
  });
  return Object.entries(grouped)
    .map(([norm, names]) => renderPlatformIcon(norm, names))
    .join(""); // Return HTML string of icons
}

// Capitalizes the first character of a string
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
