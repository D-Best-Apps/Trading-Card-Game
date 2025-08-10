// server/controllers/adminController.js
const pool = require('../config/db');
const bcrypt = require('bcryptjs');

// Admin Login
exports.adminLogin = async (req, res) => {
  const { username, password } = req.body;

  try {
    const dbResult = await pool.execute('SELECT * FROM admin_users WHERE username = ?', [username]);
    const admin = dbResult[0];

    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, admin.password_hash);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.status(200).json({ message: 'Admin login successful', adminId: admin.id });

  } catch (error) {
    console.error('Error during admin login:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


// Get all players with their unique cards and device IDs
exports.getAllPlayersData = async (req, res) => {
  try {
    const players = await pool.execute('SELECT id, device_id, player_name FROM players');

    const playersData = [];
    for (const player of players) {
      const uniqueCards = await pool.execute(
        'SELECT DISTINCT cd.card_id, cd.name, cd.rarity FROM player_cards pc JOIN card_definitions cd ON pc.card_id = cd.card_id WHERE pc.player_id = ?',
        [player.id]
      );
      playersData.push({ ...player, uniqueCards });
    }

    res.status(200).json(playersData);
  } catch (error) {
    console.error('Error fetching players data:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


// Get and Update required_cards setting
exports.getRequiredCards = async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT setting_value FROM settings WHERE setting_name = ?', ['required_cards']);
    if (rows.length > 0) {
      res.status(200).json({ required_cards: parseInt(rows[0].setting_value) });
    } else {
      res.status(404).json({ message: 'Setting not found' });
    }
  } catch (error) {
    console.error('Error fetching required_cards setting:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateRequiredCards = async (req, res) => {
  const { value } = req.body;
  if (typeof value !== 'number' || value < 0) {
    return res.status(400).json({ message: 'Invalid value for required_cards' });
  }

  try {
    await pool.execute('UPDATE settings SET setting_value = ? WHERE setting_name = ?', [value.toString(), 'required_cards']);
    res.status(200).json({ message: 'required_cards updated successfully' });
  } catch (error) {
    console.error('Error updating required_cards setting:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
