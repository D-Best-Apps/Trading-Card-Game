// server/controllers/cardController.js
// This controller handles API requests related to the master list of all cards.

const pool = require('../config/db');
const { toJSONSafe } = require('../utils/helpers'); // Import the shared helper

/**
 * GET /api/cards - Get all card definitions from the database.
 * This provides the frontend with a complete library of all possible cards in the game.
 */
exports.getCardDefinitions = async (req, res) => {
    let connection;
    try {
        connection = await pool.getConnection();
        const query = 'SELECT card_id, name, rarity, description, image_path FROM card_definitions ORDER BY name';
        const cards = await connection.query(query);
        
        // Use the toJSONSafe helper in case any data types need conversion.
        res.json({ cards: toJSONSafe(cards) });

    } catch (err) {
        console.error('Failed to fetch card definitions:', err);
        res.status(500).json({ error: 'An internal server error occurred while fetching card definitions.' });
    } finally {
        if (connection) connection.release();
    }
};