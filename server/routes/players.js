// server/routes/players.js
// ACTION: Replace the entire contents of your players.js file with this.
// This version corrects the order of routes to ensure '/search' is matched correctly.

const express = require('express');
const router = express.Router();
const playerController = require('../controllers/playerController');

// --- IMPORTANT ---
// Specific routes (like '/search') MUST be defined BEFORE general,
// parameterized routes (like '/:deviceID'). Otherwise, Express will think
// 'search' is a deviceID.

// GET /api/players/search - Search for players by name
router.get('/search', playerController.searchPlayers);

// POST /api/players - Create a new player
router.post('/', playerController.createPlayer);

// --- Routes with a :deviceID parameter ---

// GET /api/players/:deviceID - Get a single player's profile
router.get('/:deviceID', playerController.getPlayerProfile);

// PUT /api/players/:deviceID - Update a player's name
router.put('/:deviceID', playerController.updatePlayer);

// GET /api/players/:deviceID/cards - Get a player's card collection
router.get('/:deviceID/cards', playerController.getPlayerCards);

// POST /api/players/:deviceID/award-random-card - Award a random card to a player
router.post('/:deviceID/award-random-card', playerController.awardRandomCard);


module.exports = router;
