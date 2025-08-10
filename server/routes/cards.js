const express = require('express');
const router = express.Router();
const cardController = require('../controllers/cardController');

// GET /api/cards - Get all card definitions
router.get('/', cardController.getCardDefinitions);

module.exports = router;