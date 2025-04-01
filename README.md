# Video Game Library Tracker

"STILL IN DEVELOPMENT!"

## Overview

**Video Game Library Tracker** is a web application designed to help users identify whether they own a specific video game across various digital platforms and alert them to current sales. By integrating multiple APIs and parsing local data, the application provides a centralized solution to manage and track game ownership and deals.

## Features

- **Ownership Verification:** Determine if a game is already present in your digital library across platforms like Steam, GoG, Epic Games, PlayStation, Nintendo, and Xbox Game Pass.
- **Sale Notifications:** Receive real-time information about ongoing sales for specific games across supported platforms.
- **User-Friendly Interface:** Simple and intuitive UI for searching and displaying game information.

## Technologies Used

- **Frontend:**
  - HTML5
  - CSS3
  - JavaScript (ES6+)
- **APIs Integrated:**
  - [RAWG API](https://rawg.io/apidocs): Fetch comprehensive game data.
  - [CheapShark API](https://apidocs.cheapshark.com/): Retrieve current game sale information.
  - [Steam API](https://steamcommunity.com/dev): Access user's Steam library data.
- **Data Parsing:**
  - [Playnite](https://playnite.link/): Import and parse JSON files from Playnite to aggregate game libraries.
