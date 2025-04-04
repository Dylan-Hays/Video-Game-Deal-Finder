// server.js
const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();// Load environment variables from .env file

const app = express();
const PORT = process.env.PORT;

app.use(cors());// Enable CORS for all routes

let storeMap = {};// Maps storeID to storeName
const dealCache = new Map();// In-memory cache for deal results

// Load store metadata from CheapShark API and build the storeMap
async function loadStores() {
  try {
    const res = await fetch("https://www.cheapshark.com/api/1.0/stores");
    const stores = await res.json();
    for (const store of stores) {
      storeMap[String(store.storeID)] = store.storeName;
    }
    console.log("Store map loaded");
  } catch (err) {
    console.error("Failed to load store data:", err);
  }
}

// Route to fetch deals for a game title from CheapShark
app.get("/api/deals", async (req, res) => {
  const title = req.query.title;
  const pageSize = req.query.pageSize || 3;

  if (!title) return res.status(400).json({ error: "Missing game title" });

  if (dealCache.has(title)) return res.json(dealCache.get(title));// Return from cache if available

  try {
    const apiUrl = `https://www.cheapshark.com/api/1.0/deals?title=${encodeURIComponent(title)}&pageSize=${pageSize}`;
    const dealRes = await fetch(apiUrl);
    const deals = await dealRes.json();

    if (!Array.isArray(deals)) {
      console.error("Unexpected CheapShark API response:", deals);
      return res.status(502).json({ error: "Unexpected response from deals API" });
    }
    
        // Enrich deals with store names
    const enriched = deals.map(deal => ({
      ...deal,
      storeName: storeMap[deal.storeID] || "Unknown Store"
    }));    

    dealCache.set(title, enriched);// Save to cache
    res.json(enriched);
  } catch (err) {
    console.error("Error fetching deal:", err);
    res.status(500).json({ error: "Failed to fetch deal data" });
  }
});

// Route to fetch game metadata from RAWG API
app.get("/api/games", async (req, res) => {
  const title = req.query.title;
  const key = req.query.key || process.env.RAWG_API_KEY;

  if (!title || !key) return res.status(400).json({ error: "Missing title or RAWG API key" });

  try {
    const response = await fetch(`https://api.rawg.io/api/games?search=${encodeURIComponent(title)}&key=${key}`);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("RAWG error:", err);
    res.status(500).json({ error: "Failed to fetch RAWG data" });
  }
});

app.get("/healthz", (req, res) => {
  res.status(200).send("OK");
});

app.listen(PORT, async () => {
  await loadStores();// Load store metadata before accepting requests
  console.log(`Server running on port ${PORT}`);
});
