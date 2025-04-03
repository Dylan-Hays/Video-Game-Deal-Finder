// /frontend/js/cards.js

import { RAWG_API_KEY, RAWG_BASE_URL, CHEAPSHARK_BASE_URL } from '../../data/fetch.env.js';

const createGameCard = (game) => {
  const card = document.createElement('div');
  card.classList.add('game-card');

  const image = document.createElement('img');
  image.src = game.background_image;
  image.alt = `${game.name} Cover`;

  const title = document.createElement('h3');
  title.textContent = game.name;

  const rating = document.createElement('p');
  rating.textContent = `Rating: ${game.rating}`;

  const price = document.createElement('p');
  price.classList.add('deal-info');
  price.textContent = 'Loading deal...';

  card.appendChild(image);
  card.appendChild(title);
  card.appendChild(rating);
  card.appendChild(price);

  fetchGameDeal(game.name, price);

  return card;
};

const fetchGameDeal = async (gameTitle, priceElement) => {
  const encodedTitle = encodeURIComponent(gameTitle);
  const proxy = location.protocol === 'file:' ? 'https://corsproxy.io/?' : '';
  const url = `http://localhost:3001/api/deals?title=${encodedTitle}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Network response was not ok');

    const data = await response.json();
    const deal = data[0];

    if (deal && deal.salePrice) {
      priceElement.textContent = `On Sale: $${deal.salePrice}`;
    } else {
      priceElement.textContent = 'No current deals';
    }
  } catch (error) {
    priceElement.textContent = 'Deal info unavailable';
  }
};

export { createGameCard };


// Utility: Platform Icon Map
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
