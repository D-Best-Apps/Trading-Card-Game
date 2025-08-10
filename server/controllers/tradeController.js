const pool = require('../config/db');
const { toJSONSafe } = require('../utils/helpers');

// ... (keep the existing createTrade function as is)
exports.createTrade = async (req, res) => {
  const {
    offeringPlayerDeviceID,
    receivingPlayerDeviceID,
    offeredCardInstanceID,
    requestedCardID, // This can be null
  } = req.body;

  // Basic validation
  if (!offeringPlayerDeviceID || !receivingPlayerDeviceID || !offeredCardInstanceID) {
    return res.status(400).json({ error: 'Missing required fields for creating a trade.' });
  }

  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    // 1. Get player IDs from device IDs
    const [offeringPlayer] = await connection.query('SELECT id FROM players WHERE device_id = ?', [offeringPlayerDeviceID]);
    const [receivingPlayer] = await connection.query('SELECT id FROM players WHERE device_id = ?', [receivingPlayerDeviceID]);

    if (!offeringPlayer || !receivingPlayer) {
      await connection.rollback();
      return res.status(404).json({ error: 'One or both players not found.' });
    }
    const offeringPlayerId = offeringPlayer.id;
    const receivingPlayerId = receivingPlayer.id;

    // 2. Verify card ownership
    const [cardOwner] = await connection.query('SELECT player_id FROM player_cards WHERE instance_id = ?', [offeredCardInstanceID]);
    if (!cardOwner || cardOwner.player_id !== offeringPlayerId) {
      await connection.rollback();
      return res.status(403).json({ error: 'You do not own the card you are trying to trade.' });
    }

    // 3. Insert the new trade
    const insertQuery = `
      INSERT INTO trades (
        offering_player_id,
        receiving_player_id,
        offered_card_instance_id,
        requested_card_id,
        status
      ) VALUES (?, ?, ?, ?, 'pending');
    `;
    const [result] = await connection.query(insertQuery, [
      offeringPlayerId,
      receivingPlayerId,
      offeredCardInstanceID,
      requestedCardID,
    ]);

    await connection.commit();

    // 4. Send success response
    res.status(201).json({
      message: 'Trade offer created successfully!',
      tradeId: result.insertId,
    });

  } catch (err) {
    if (connection) await connection.rollback();
    console.error('Failed to create trade:', err);
    res.status(500).json({ error: 'An internal server error occurred while creating the trade.' });
  } finally {
    if (connection) connection.release();
  }
};


// GET /api/trades/:deviceID - Get all PENDING trades for a player
exports.getTrades = async (req, res) => {
  const { deviceID } = req.params;

  try {
    // First, find the player's internal ID from their deviceID
    const [player] = await pool.query('SELECT id FROM players WHERE device_id = ?', [deviceID]);
    if (!player) {
      return res.status(404).json({ error: 'Player not found.' });
    }
    const playerId = player.id;

    // This query will fetch all trades where the player is either the offerer or the receiver
    // and the trade is still pending.
    const query = `
      SELECT
        t.trade_id,
        t.status,
        t.created_at,
        
        -- Details of the offering player
        op.player_name as offering_player_name,
        op.device_id as offering_player_device_id,
        
        -- Details of the receiving player
        rp.player_name as receiving_player_name,
        rp.device_id as receiving_player_device_id,

        -- Details of the card being offered
        ocd.name as offered_card_name,
        ocd.rarity as offered_card_rarity,
        ocd.image_path as offered_card_image_path,
        
        -- Details of the specific card being requested (if any)
        rcd.name as requested_card_name,
        rcd.rarity as requested_card_rarity
      FROM trades t
      
      -- Join to get the offering player's details
      JOIN players op ON t.offering_player_id = op.id
      
      -- Join to get the receiving player's details
      JOIN players rp ON t.receiving_player_id = rp.id
      
      -- Join to get the offered card's instance and definition details
      JOIN player_cards oc ON t.offered_card_instance_id = oc.instance_id
      JOIN card_definitions ocd ON oc.card_id = ocd.card_id
      
      -- Left Join for the requested card's definition (it might be null)
      LEFT JOIN card_definitions rcd ON t.requested_card_id = rcd.card_id
      
      WHERE (t.offering_player_id = ? OR t.receiving_player_id = ?) AND t.status = 'pending'
      ORDER BY t.created_at DESC;
    `;

    const [trades] = await pool.query(query, [playerId, playerId]);

    // Return the list of trades
    res.json({ trades: toJSONSafe(trades) });

  } catch (err) {
    console.error('Failed to get trades:', err);
    res.status(500).json({ error: 'An internal server error occurred while fetching trades.' });
  }
};

// --- NEW FUNCTION (CORRECTED) ---
// GET /api/trades/:deviceID/history - Get COMPLETED trades for a player
exports.getTradeHistory = async (req, res) => {
  const { deviceID } = req.params;

  try {
    const [player] = await pool.query('SELECT id FROM players WHERE device_id = ?', [deviceID]);
    if (!player) {
      return res.status(404).json({ error: 'Player not found.' });
    }
    const playerId = player.id;

    const historyQuery = `
      SELECT
        t.trade_id,
        t.status,
        IF(t.offering_player_id = ?, rp.player_name, op.player_name) as other_player_name,
        IF(t.offering_player_id = ?, 'offered', 'received') as my_role,
        offered_card_def.name as offered_card_name,
        offered_card_def.image_path as offered_card_image_path,
        accepted_card_def.name as accepted_card_name,
        accepted_card_def.image_path as accepted_card_image_path
      FROM trades t
      JOIN players op ON t.offering_player_id = op.id
      JOIN players rp ON t.receiving_player_id = rp.id
      JOIN player_cards offered_pc ON t.offered_card_instance_id = offered_pc.instance_id
      JOIN card_definitions offered_card_def ON offered_pc.card_id = offered_card_def.card_id
      LEFT JOIN player_cards accepted_pc ON t.accepted_card_instance_id = accepted_pc.instance_id
      LEFT JOIN card_definitions accepted_card_def ON accepted_pc.card_id = accepted_card_def.card_id
      WHERE (t.offering_player_id = ? OR t.receiving_player_id = ?) AND t.status != 'pending'
      ORDER BY t.created_at DESC;
    `;
    
    const [history] = await pool.query(historyQuery, [playerId, playerId, playerId, playerId]);
    res.json({ history: toJSONSafe(history) });

  } catch (err) {
    console.error('Failed to get trade history:', err);
    res.status(500).json({ error: 'An internal server error occurred.' });
  }
};


// PUT /api/trades/:tradeId - Update the status of a trade
exports.updateTradeStatus = async (req, res) => {
  const { tradeId } = req.params;
  const { deviceID, action, cardToGiveInstanceID } = req.body;

  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    const [player] = await connection.query('SELECT id FROM players WHERE device_id = ?', [deviceID]);
    if (!player) throw new Error('Player not found.');
    const playerId = player.id;

    const [trade] = await connection.query('SELECT * FROM trades WHERE trade_id = ? FOR UPDATE', [tradeId]);
    if (!trade) throw new Error('Trade not found.');
    if (trade.status !== 'pending') throw new Error('This trade is no longer pending.');

    let message = '';
    if (action === 'accept' && trade.receiving_player_id === playerId) {
      if (!cardToGiveInstanceID) throw new Error('A card must be selected to complete the trade.');
      
      const [cardToGiveOwner] = await connection.query('SELECT player_id FROM player_cards WHERE instance_id = ?', [cardToGiveInstanceID]);
      if (!cardToGiveOwner || cardToGiveOwner.player_id !== playerId) {
        throw new Error('You do not own the card you are trying to give.');
      }

      // Swap card ownership
      await connection.query('UPDATE player_cards SET player_id = ? WHERE instance_id = ?', [trade.receiving_player_id, trade.offered_card_instance_id]);
      await connection.query('UPDATE player_cards SET player_id = ? WHERE instance_id = ?', [trade.offering_player_id, cardToGiveInstanceID]);
      
      // --- UPDATE ---
      // Record which card was given in return and update the status.
      await connection.query('UPDATE trades SET status = "accepted", accepted_card_instance_id = ? WHERE trade_id = ?', [cardToGiveInstanceID, tradeId]);
      message = 'Trade accepted!';
    
    } else if (action === 'reject' && trade.receiving_player_id === playerId) {
      await connection.query('UPDATE trades SET status = "rejected" WHERE trade_id = ?', [tradeId]);
      message = 'Trade rejected.';
    
    } else if (action === 'cancel' && trade.offering_player_id === playerId) {
      await connection.query('UPDATE trades SET status = "cancelled" WHERE trade_id = ?', [tradeId]);
      message = 'Trade cancelled.';
    
    } else {
      throw new Error('Invalid action or you do not have permission to modify this trade.');
    }

    await connection.commit();
    res.json({ message });

  } catch (err) {
    if (connection) await connection.rollback();
    console.error('Failed to update trade status:', err);
    res.status(500).json({ error: err.message || 'An internal server error occurred.' });
  } finally {
    if (connection) connection.release();
  }
};