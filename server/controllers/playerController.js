// server/controllers/playerController.js
// This controller handles all API requests related to player profiles and their cards.

const db = require('../config/db');
const { toJSONSafe } = require('../utils/helpers'); // Import the shared helper

// GET /api/players/:deviceID - Get a single player's profile
exports.getPlayerProfile = async (req, res) => {
  const { deviceID } = req.params;
  try {
    const [player] = await db.query('SELECT id, device_id, player_name, created_at FROM players WHERE device_id = ?', [deviceID]);
    if (!player) {
      return res.status(404).json({ error: 'Player not found.' });
    }
    res.json(toJSONSafe(player));
  } catch (err) {
    console.error(`Error fetching profile for player ${deviceID}:`, err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// GET /api/players/:deviceID/cards - Get a player's card collection
exports.getPlayerCards = async (req, res) => {
  const { deviceID } = req.params;
  try {
    const [player] = await db.query('SELECT id FROM players WHERE device_id = ?', [deviceID]);
    if (!player) {
      return res.status(404).json({ error: 'Player not found.' });
    }
    const query = `
      SELECT pc.instance_id, cd.*
      FROM player_cards pc
      JOIN card_definitions cd ON pc.card_id = cd.card_id
      WHERE pc.player_id = ?
      ORDER BY cd.name;
    `;
    const cards = await db.query(query, [player.id]);
    res.json({ cards: toJSONSafe(cards) });
  } catch (err) {
    console.error(`Error fetching cards for player ${deviceID}:`, err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// POST /api/players - Create a new player profile
exports.createPlayer = async (req, res) => {
  const { deviceID, playerName } = req.body;
  if (!deviceID || !playerName) {
    return res.status(400).json({ error: 'deviceID and playerName are required.' });
  }
  try {
    const insertQuery = 'INSERT INTO players (device_id, player_name) VALUES (?, ?)';
    const result = await db.query(insertQuery, [deviceID, playerName]);
    const [player] = await db.query('SELECT * FROM players WHERE id = ?', [result.insertId]);
    res.status(201).json(toJSONSafe(player));
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'A player with this device ID already exists.' });
    }
    console.error(`Error creating player ${playerName}:`, err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// PUT /api/players/:deviceID - Update a player's name
exports.updatePlayer = async (req, res) => {
  const { deviceID } = req.params;
  const { playerName } = req.body;
  if (!playerName) {
    return res.status(400).json({ error: 'playerName is required.' });
  }
  try {
    const result = await db.query('UPDATE players SET player_name = ? WHERE device_id = ?', [playerName, deviceID]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Player not found.' });
    }
    const [player] = await db.query('SELECT * FROM players WHERE device_id = ?', [deviceID]);
    res.json(toJSONSafe(player));
  } catch (err) {
    console.error(`Error updating player ${deviceID}:`, err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// GET /api/players/search - Search for players by name
exports.searchPlayers = async (req, res) => {
  const { term, excludeDeviceID } = req.query;
  if (!term || term.trim().length < 2) {
    return res.status(400).json({ error: 'A search term of at least 2 characters is required.' });
  }
  try {
    const query = 'SELECT device_id, player_name FROM players WHERE player_name LIKE ? AND device_id != ? LIMIT 10';
    const players = await db.query(query, [`%${term}%`, excludeDeviceID]);
    res.json({ players: toJSONSafe(players) });
  } catch (err) {
    console.error(`Error searching for players with term "${term}":`, err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// POST /api/players/:deviceID/award-random-card - Award a random card
exports.awardRandomCard = async (req, res) => {
  const { deviceID } = req.params;
  try {
    const [player] = await db.query('SELECT id FROM players WHERE device_id = ?', [deviceID]);
    if (!player) {
      return res.status(404).json({ error: 'Player not found.' });
    }
    const [randomCard] = await db.query('SELECT card_id FROM card_definitions ORDER BY RAND() LIMIT 1');
    if (!randomCard) {
      return res.status(404).json({ error: 'No cards available in the game to award.' });
    }
    const insertResult = await db.query('INSERT INTO player_cards (player_id, card_id) VALUES (?, ?)', [player.id, randomCard.card_id]);
    const [newCardDetails] = await db.query('SELECT * FROM card_definitions WHERE card_id = ?', [randomCard.card_id]);
    res.status(201).json(toJSONSafe({
      instance_id: insertResult.insertId,
      player_id: player.id,
      ...newCardDetails
    }));
  } catch (err) {
    console.error(`Failed to award random card for deviceID ${deviceID}:`, err);
    res.status(500).json({ error: 'An internal server error occurred while awarding a card.' });
  }
};
