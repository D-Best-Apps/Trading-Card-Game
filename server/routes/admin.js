// server/routes/admin.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Admin login route
router.post('/login', adminController.adminLogin);

// Get all players data (requires authentication/authorization in a real app)
router.get('/players', adminController.getAllPlayersData);

// Get and update required_cards setting (requires authentication/authorization)
router.get('/settings/required-cards', adminController.getRequiredCards);
router.put('/settings/required-cards', adminController.updateRequiredCards);

module.exports = router;
