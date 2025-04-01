// backend/server.js
const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
const PORT = 3001;

// Accept any localhost or 127.0.0.1 origin
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET"],
};

app.use(cors(corsOptions));

let storeMap = {};
const dealCache = new Map();

async function loadStores() {
  try {
    const res = await fetch("https://www.cheapshark.com/api/1.0/stores");
    const stores = await res.json();
    for (const store of stores) {
      storeMap[String(store.storeID)] = store.storeName;
    }
    console.log("Store map loaded.");
  } catch (err) {
    console.error("Failed to load store data:", err);
  }
}

app.get("/api/deals", async (req, res) => {
  const title = req.query.title;
  const pageSize = req.query.pageSize || 3;

  if (!title) {
    return res.status(400).json({ error: "Missing game title" });
  }

  if (dealCache.has(title)) {
    return res.json(dealCache.get(title));
  }

  try {
    const apiUrl = `https://www.cheapshark.com/api/1.0/deals?title=${encodeURIComponent(
      title
    )}&pageSize=${pageSize}`;
    const response = await fetch(apiUrl);
    const deals = await response.json();

    const matchedDeal = deals.find((deal) =>
      deal.title.toLowerCase().includes(title.toLowerCase())
    );

    if (matchedDeal) {
      const result = {
        title: matchedDeal.title,
        normalPrice: matchedDeal.normalPrice,
        salePrice: matchedDeal.salePrice,
        savings: `${Math.round(matchedDeal.savings)}%`,
        storeName: storeMap[matchedDeal.storeID] || "Unknown Store",
      };
      dealCache.set(title, result);
      return res.json(result);
    } else {
      dealCache.set(title, null);
      return res.json(null);
    }
  } catch (error) {
    console.error("Error fetching deals:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, async () => {
  await loadStores();
  console.log(`Server is running on http://localhost:${PORT}`);
});
