// backend/server.js
const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || process.env.NODE_ENV === "development") {
      callback(null, true);
    } else {
      const allowedOrigins = process.env.CORS_ORIGINS?.split(",") || [];
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    }
  },
  methods: ["GET"]
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
    const apiUrl = `https://www.cheapshark.com/api/1.0/deals?title=${encodeURIComponent(title)}&pageSize=${pageSize}`;
    const response = await fetch(apiUrl);
    const deals = await response.json();

    const matchedDeal = deals.find((deal) =>
      deal.title.toLowerCase().includes(title.toLowerCase())
    );

    if (!matchedDeal) {
      return res.status(404).json({ error: "No deal found" });
    }

    const mappedDeal = {
      title: matchedDeal.title,
      normalPrice: matchedDeal.normalPrice,
      salePrice: matchedDeal.salePrice,
      savings: matchedDeal.savings >= 1 ? `${Math.round(matchedDeal.savings)}%` : null,
      storeName: storeMap[matchedDeal.storeID] || matchedDeal.storeID
    };

    dealCache.set(title, mappedDeal);
    res.json(mappedDeal);
  } catch (err) {
    console.error("Error fetching deals:", err);
    res.status(500).json({ error: "Failed to fetch deal info" });
  }
});

loadStores();

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
