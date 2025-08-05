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

// A root API endpoint to confirm the server is running.
app.get('/api', (req, res) => {
  res.json({ message: "Scavenger Hunt API is running!" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});