// cards.js

export function createGameCard(game) {
  const card = document.createElement("div");
  card.classList.add("game-card");

  const thumbnail = document.createElement("div");
  thumbnail.classList.add("thumbnail");
  const image = document.createElement("img");
  image.src = game.background_image || "placeholder";
  image.alt = `${game.name} cover`;
  thumbnail.appendChild(image);

  const info = document.createElement("div");
  info.classList.add("info");

  const details = document.createElement("div");
  details.classList.add("card-details");

  const title = document.createElement("h4");
  title.textContent = game.name;

  const platforms = document.createElement("div");
  platforms.classList.add("platforms");
  game.platforms?.forEach(({ platform }) => {
    const icon = document.createElement("i");
    icon.classList.add("platform-icon", "fa-brands", getPlatformIcon(platform.slug));
    platforms.appendChild(icon);
  });

  const metadata = document.createElement("ul");

  const rating = document.createElement("li");
  rating.innerHTML = `<i class="fa-solid fa-star"></i> ${game.rating || "N/A"}`;

  const released = document.createElement("li");
  released.innerHTML = `<i class="fa-solid fa-calendar"></i> ${game.released || "Unknown"}`;

  metadata.appendChild(rating);
  metadata.appendChild(released);

  details.appendChild(title);
  details.appendChild(platforms);
  details.appendChild(metadata);
  info.appendChild(details);

  card.appendChild(thumbnail);
  card.appendChild(info);

  return card;
}

function getPlatformIcon(slug) {
  switch (slug) {
    case "playstation":
    case "playstation5":
    case "playstation4":
      return "fa-playstation";
    case "xbox":
    case "xbox-one":
    case "xbox-series-x":
      return "fa-xbox";
    case "pc":
      return "fa-windows";
    case "nintendo-switch":
      return "fa-nintendo-switch";
    case "mac":
      return "fa-apple";
    default:
      return "fa-gamepad";
  }
}

