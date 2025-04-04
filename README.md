# Video Game Deal Tracker

A responsive web application that helps gamers find the best video game deals across various platforms and stores. Users can search by title, view detailed pricing info, and see platform compatibility. Built as a capstone project for the August 2024 Web Development cohort at Code:You.

---

## 🚀 Features Implemented
This application meets and exceeds the Code:You Capstone requirements:

### Selected Features
- ✅ **Use of Arrays/Objects**: Stores and renders game metadata such as price, ratings, platform support, and release dates.
- ✅ **Analyze Data**: Calculates discounts and displays savings percentages.
- ✅ **Retrieve from Third-Party API**: 
  - [RAWG API](https://rawg.io/apidocs) for game data
  - [CheapShark API](https://apidocs.cheapshark.com/) for live deal prices
- ✅ **Responsive Design**: Optimized for both desktop and mobile screens using CSS Flexbox and Media Queries.
- ✅ **Node.js + Express Server**: Serves the frontend and acts as a proxy to secure API keys.

---

## 📖 How It Works
- Type a game title into the search bar.
- Results are fetched from RAWG, then matched with CheapShark's pricing.
- Users can view discount %, old/new prices, ratings, and supported platforms.
- If a sale is found, a green discount tag is shown and users can click the store name to go directly to the storefront.

---

## 💡 Technologies Used
- HTML5, CSS3
- JavaScript (ES6+)
- Node.js + Express (backend proxy)
- RAWG API, CheapShark API
- Render.com for deployment

---

## 💻 Installation Instructions
> You don't need to install anything. It runs locally.

### Run Locally
```bash
git clone https://github.com/your-username/video-game-deal-tracker.git
```
1. Navigate to the `frontend` folder.
2. Open the `index.html` file in your browser.
3. When prompted, input your personal RAWG API key. (You can get this by creating a free account at [RAWG.io](https://rawg.io/apidocs))
4. After input, the application will initialize.
5. Type a game name into the search bar and enjoy real-time deal tracking!

---

## 📈 Capstone Alignment Checklist
- [x] GitHub Repo with 10+ commits
- [x] Detailed `README.md`
- [x] Responsive layout (desktop + mobile)
- [x] Uses 2+ features from list A (data structures, analysis)
- [x] Uses 1+ feature from list B (3rd party API)
- [x] Demonstrates clean UI design + UX
- [x] Clear setup instructions

---

## 🤔 Challenges & Wins
- Successfully combined two APIs with different schemas and ensured correct mapping.
- Created mobile-first layout that degrades gracefully.
- Learned server-side proxying to secure API access.

---

## ⚖️ License
This project is open source and available under the [MIT License](LICENSE).

---

## 🙇️ Acknowledgments
- [RAWG](https://rawg.io/) and [CheapShark](https://cheapshark.com/) for their APIs.
- Code:You mentors for support and guidance.

---

## 👤 Author
**Dylan Hays**  
Web Development Capstone | Code:You (August 2024 Cohort)

---

## 🔄 Future Improvements
- Add wish list system
- Add filter options when searching for games (Sorting games by genre or most popular)
- Add the ability to search for console games with digital store fronts. (CheapShark API only shows games on PC)
