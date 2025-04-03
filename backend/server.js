// server.js
const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(cors());

let storeMap = {};
const dealCache = new Map();

async function loadStores() {
  try {
    const res = await fetch("https://www.cheapshark.com/api/1.0/stores");
    const stores = await res.json();
    for (const store of stores) {
      storeMap[String(store.storeID)] = store.storeName;
    }
    console.log("✅ Store map loaded");
  } catch (err) {
    console.error("❌ Failed to load store data:", err);
  }
}

app.get("/api/deals", async (req, res) => {
  const title = req.query.title;
  const pageSize = req.query.pageSize || 3;

  if (!title) return res.status(400).json({ error: "Missing game title" });

  if (dealCache.has(title)) return res.json(dealCache.get(title));

  try {
    const apiUrl = `https://www.cheapshark.com/api/1.0/deals?title=${encodeURIComponent(title)}&pageSize=${pageSize}`;
    const dealRes = await fetch(apiUrl);
    const deals = await dealRes.json();

    const enriched = deals.map(deal => ({
      ...deal,
      storeName: storeMap[deal.storeID] || "Unknown Store"
    }));

    dealCache.set(title, enriched);
    res.json(enriched);
  } catch (err) {
    console.error("❌ Error fetching deal:", err);
    res.status(500).json({ error: "Failed to fetch deal data" });
  }
});

app.get("/api/games", async (req, res) => {
  const title = req.query.title;
  const key = req.query.key || process.env.RAWG_API_KEY;

  if (!title || !key) return res.status(400).json({ error: "Missing title or RAWG API key" });

  try {
    const response = await fetch(`https://api.rawg.io/api/games?search=${encodeURIComponent(title)}&key=${key}`);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("❌ RAWG error:", err);
    res.status(500).json({ error: "Failed to fetch RAWG data" });
  }
});

app.listen(PORT, async () => {
  await loadStores();
  console.log(`✅ Server running on port ${PORT}`);
});
