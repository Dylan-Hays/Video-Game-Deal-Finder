# 🎮 Video Game Deal Tracker

Welcome to **Video Game Deal Finder** – a web application that allows you to search for video games and instantly discover where they’re on sale across multiple stores!

---

## 🚀 Project Overview

This capstone project was built for the Code:You web development program. It showcases integration of third-party APIs, frontend dynamic rendering, and a hosted backend proxy for working around CORS and rate-limiting issues. The application fetches data from the RAWG API and CheapShark API to display both game information and deal prices.

---

## 🧩 Features Implemented (Capstone Requirements)

✅ Use of arrays/objects to store and retrieve game data.  
✅ Retrieval and use of a third-party API (RAWG + CheapShark).  
✅ Analyzed data using sets to avoid rendering duplicate game cards.  
✅ Mobile & desktop responsive design using CSS Grid and Flexbox.  
✅ Hosted backend API proxy using Node.js + Express + Render.

---

## 💡 How It Works

- The frontend is a static HTML/CSS/JavaScript app.
- When the page loads, the user is prompted to enter their personal RAWG API key.
- This key is stored in the browser’s localStorage (never in code).
- Search queries return games via the RAWG API.
- The backend (hosted on Render) proxies CheapShark API requests for current game deals.
- The site dynamically renders game cards with title, rating, release date, and sale info.

---

## 🛠️ Tech Stack

- **HTML/CSS/JavaScript** – frontend UI
- **Node.js + Express** – backend proxy API
- **Render.com** – backend hosting
- **RAWG API** – game metadata (https://rawg.io/apidocs)
- **CheapShark API** – deal pricing (https://apidocs.cheapshark.com/)

---

## 📦 Setup Instructions

> 🧠 This project runs in the browser – no local server setup needed!

### 🖥 Frontend (Local)
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/video-game-deal-finder.git
   ```
2. Open the project folder.
3. Navigate to `frontend/` and open `index.html` in your browser.
4. You’ll be prompted for your **RAWG API key**.
   - Get one from https://rawg.io/apidocs.
5. Start searching for games!

### 🌐 Backend (Render.com)
- All deal data is proxied through a live Render server:
  ```
https://video-game-library-tracker.onrender.com
  ```
- You don’t need to run this locally – it’s already deployed and used by the frontend.

---

## 📎 Additional Notes

- This app is designed to run completely in the browser using live APIs.
- No API keys are stored in code or in the repository.
- Fully responsive layout tested across screen sizes.

---

## 🧠 Reflections & Learnings

This project taught me how to:
- Solve CORS issues using a hosted backend proxy
- Work with nested API data and conditionally render UI
- Design responsive layouts with CSS Grid and Flexbox
- Build a usable product around real-world API limitations
- Debug and test a full-stack app across devices

---
