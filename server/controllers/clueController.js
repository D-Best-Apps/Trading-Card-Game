const db = require('../config/db');

// Scan a clue and return the message
exports.scanClue = async (req, res) => {
  const { deviceID, clueId } = req.body;

  if (!deviceID || !clueId) {
    return res.status(400).json({ message: 'Device ID and Clue ID are required.' });
  }

  try {
    // Get player id from device id
    const rows = await db.query('SELECT id FROM players WHERE device_id = ?', [deviceID]);

    // Check if a player was found
    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: 'Player not found. Please register first.' });
    }

    const playerId = rows[0].id;

    // Check if the player has already scanned this clue
    const existingScan = await db.query('SELECT * FROM player_clues WHERE player_id = ? AND clue_id = ?', [playerId, clueId]);

    if (existingScan.length > 0) {
      const clue = await db.query('SELECT message FROM clues WHERE id = ?', [clueId]);
      const message = clue.length > 0 ? clue[0].message : 'This clue seems to be a mystery!';
      return res.json({
        message: `You have already found this clue: "${message}"`,
        alreadyScanned: true,
      });
    }

    // Get the clue message
    const clue = await db.query('SELECT message FROM clues WHERE id = ?', [clueId]);
    if (clue.length === 0) {
      return res.status(404).json({ message: 'Clue not found.' });
    }

    // Add the scan to the player_clues table
    await db.query('INSERT INTO player_clues (player_id, clue_id) VALUES (?, ?)', [playerId, clueId]);

    res.json({ message: clue[0].message, alreadyScanned: false });
  } catch (error) {
    console.error('Error scanning clue:', error);
    res.status(500).json({ message: 'Server error while scanning clue.' });
  }
};

// Get all clues
exports.getAllClues = async (req, res) => {
  try {
    const clues = await db.query('SELECT * FROM clues ORDER BY id');
    res.json(clues);
  } catch (error) {
    console.error('Error fetching clues:', error);
    res.status(500).json({ message: 'Server error while fetching clues.' });
  }
};

// Create a new clue
exports.createClue = async (req, res) => {
  const { id, message } = req.body;
  if (!id || !message) {
    return res.status(400).json({ message: 'Clue ID and message are required.' });
  }
  try {
    await db.query('INSERT INTO clues (id, message) VALUES (?, ?)', [id, message]);
    res.status(201).json({ id, message });
  } catch (error) {
    console.error('Error creating clue:', error);
    res.status(500).json({ message: 'Server error while creating clue.' });
  }
};

// Update a clue
exports.updateClue = async (req, res) => {
  const { id } = req.params;
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ message: 'Clue message is required.' });
  }
  try {
    const result = await db.query('UPDATE clues SET message = ? WHERE id = ?', [message, id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Clue not found.' });
    }
    res.json({ id, message });
  } catch (error) {
    console.error(`Error updating clue ${id}:`, error);
    res.status(500).json({ message: 'Server error while updating clue.' });
  }
};

// Delete a clue
exports.deleteClue = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('DELETE FROM clues WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Clue not found.' });
    }
    res.status(204).send();
  } catch (error) {
    console.error(`Error deleting clue ${id}:`, error);
    res.status(500).json({ message: 'Server error while deleting clue.' });
  }
};