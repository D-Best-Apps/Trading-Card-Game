// FILE 3 of 3: server/routes/Trades.js (Updated)
// ACTION: Add the new route for fetching trade history.

const express = require('express');
const router = express.Router();
const tradeController = require('../controllers/tradeController');

// POST /api/trades - Create a new trade offer
router.post('/', tradeController.createTrade);

// GET /api/trades/:deviceID - Get all pending trades for a player
router.get('/:deviceID', tradeController.getTrades);

// --- NEW ROUTE ---
// GET /api/trades/:deviceID/history - Get completed trades for a player
router.get('/:deviceID/history', tradeController.getTradeHistory);

// PUT /api/trades/:tradeId - Update a trade's status (accept, reject, cancel)
router.put('/:tradeId', tradeController.updateTradeStatus);

module.exports = router;
