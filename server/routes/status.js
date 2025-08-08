const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// GET /api/status - Check database connection status
router.get('/', async (req, res) => {
  let connection;
  try {
    // Get a connection from the pool to verify connectivity
    connection = await pool.getConnection();
    // If we get a connection, it's successful
    res.json({ status: 'ok', message: 'Database connection successful.' });
  } catch (err) {
    // If there's an error, the connection failed
    console.error('Database connection check failed:', err);
    res.status(500).json({ status: 'error', message: 'Database connection failed.' });
  } finally {
    // Make sure to release the connection back to the pool
    if (connection) {
      connection.release();
    }
  }
});

module.exports = router;