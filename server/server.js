// server/server.js
// This is the main entry point for your backend server.

const express = require('express');
require('dotenv').config(); // Ensures your .env variables are loaded

// --- Import all your route modules ---
const playerRoutes = require('./routes/players');
const cardRoutes = require('./routes/cards');
const tradeRoutes = require('./routes/trades');
const statusRoutes = require('./routes/status');
const adminRoutes = require('./routes/admin');
const clueRoutes = require('./routes/clues'); // Import the new clue routes

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON bodies from incoming requests.
app.use(express.json());

// --- Register all your routers with the main app ---
app.use('/api/players', playerRoutes);
app.use('/api/cards', cardRoutes);
app.use('/api/trades', tradeRoutes);
app.use('/api/status', statusRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/clues', clueRoutes); // Register the new clue routes

// A root API endpoint to confirm the server is running.
const path = require('path');

// Serve static files from the React app's build directory
app.use(express.static(path.join(__dirname, '..', 'client', 'build')));

// All other GET requests not handled by the API will return your React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});