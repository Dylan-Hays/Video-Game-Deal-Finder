// cards.js

const API_BASE = "https://video-game-library-tracker.onrender.com";

let RAWG_API_KEY = localStorage.getItem("rawg_key");
if (!RAWG_API_KEY) {
  RAWG_API_KEY = prompt("Enter your RAWG API Key:");
  localStorage.setItem("rawg_key", RAWG_API_KEY);
}

let storeMap = {};

async function loadStores() {
  try {
    const res = await fetch("https://www.cheapshark.com/api/1.0/stores");
    const data = await res.json();
    data.forEach(store => {
      storeMap[store.storeID] = store.storeName;
    });
  } catch (err) {
    console.error("Failed to load store names:", err);
  }
}

loadStores();

function createGameCard(game) {
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
  release.innerHTML = `<i class="fa-solid fa-calendar-days"></i> ${game.released ?? "?"}`;

  meta.appendChild(rating);
  meta.appendChild(release);

  const deal = document.createElement("div");
  deal.className = "deal-info";

  cardDetails.appendChild(title);
  cardDetails.appendChild(platforms);
  cardDetails.appendChild(meta);
  cardDetails.appendChild(deal);

  info.appendChild(cardDetails);
  card.appendChild(thumbnail);
  card.appendChild(info);

  fetchGameDeal(game.name, deal);

  if (!deal.innerHTML.trim()) return null;
  return card;
}

const fetchGameDeal = async (gameTitle, priceElement) => {
  const encodedTitle = encodeURIComponent(gameTitle);
  const url = `https://video-game-library-tracker.onrender.com/api/deals?title=${encodedTitle}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Network response was not ok");

    const data = await response.json();
    const deal = data[0];

    if (deal && deal.salePrice && deal.normalPrice) {
      const discount = Math.round(100 - (deal.salePrice / deal.normalPrice) * 100);

      if (discount === 0) {
        priceElement.innerHTML = "";
        return null;
      }

      priceElement.innerHTML = `
        <div class="deal-badge">
          <span class="deal-percent">-${discount}%</span>
          <span class="old-price">$${parseFloat(deal.normalPrice).toFixed(2)}</span>
          <span class="new-price">$${parseFloat(deal.salePrice).toFixed(2)}</span>
        </div>
        <div class="deal-store">@ ${storeMap[deal.storeID] ?? "Unknown Store"}</div>
      `;
    } else {
      priceElement.textContent = "";
    }
  } catch (error) {
    priceElement.textContent = "Deal info unavailable";
  }
};

window.createGameCard = createGameCard;

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
  return name.toLowerCase();
}

function renderPlatformIcon(normalized, nameList) {
  const iconClass = PLATFORM_ICON_MAP[normalized] || DEFAULT_PLATFORM_ICON;
  const title = nameList.join(", ");
  return `<i class="${iconClass} platform-icon" title="${title}"></i>`;
}

function renderPlatforms(platformArray) {
  const grouped = {};
  platformArray.forEach((p) => {
    const norm = normalizePlatform(p.platform.name);
    if (!grouped[norm]) grouped[norm] = [];
    grouped[norm].push(p.platform.name);
  });
  return Object.entries(grouped)
    .map(([norm, names]) => renderPlatformIcon(norm, names))
    .join("");
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
