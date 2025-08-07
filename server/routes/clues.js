const express = require('express');
const router = express.Router();
const clueController = require('../controllers/clueController');

// POST /api/clues/scan
router.post('/scan', clueController.scanClue);

// GET /api/clues
router.get('/', clueController.getAllClues);

// POST /api/clues
router.post('/', clueController.createClue);

// PUT /api/clues/:id
router.put('/:id', clueController.updateClue);

// DELETE /api/clues/:id
router.delete('/:id', clueController.deleteClue);

module.exports = router;