// server/config/db.js
// This file configures the connection to your MariaDB server.

const mariadb = require('mariadb');
require('dotenv').config(); // Ensures your .env variables are loaded

// Create a connection pool. This is more efficient for managing connections.
const pool = mariadb.createPool({
  // These values should be in your server/.env file
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  connectionLimit: 5,

  // --- THIS IS THE FIX ---
  // This option is required to connect to MariaDB/MySQL servers that use
  // modern, secure authentication plugins like 'caching_sha2_password'.
  // It allows the driver to securely retrieve the public key from the server.
  allowPublicKeyRetrieval: true,
});

// Optional but recommended: Test the connection when the server starts up.
// This gives you immediate feedback if your credentials or host are wrong.
pool.getConnection()
  .then(conn => {
    console.log("Database connection successful!");
    conn.release(); // IMPORTANT: Always release the connection back to the pool
  })
  .catch(err => {
    console.error("Database connection failed:", err.message);
  });

module.exports = pool;
