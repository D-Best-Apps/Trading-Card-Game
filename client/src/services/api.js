// client/src/services/api.js
// This file centralizes all API calls to the backend.

const API_BASE_URL = '/api';

/**
 * A helper function to handle fetch responses.
 * It checks for non-ok responses and parses JSON.
 */
async function handleResponse(response) {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      error: `HTTP error! status: ${response.status} ${response.statusText}`,
    }));
    throw new Error(errorData.error || 'An unknown error occurred.');
  }
  return response.json();
}

/**
 * Registers a new player on the server.
 * @param {string} deviceID - The unique ID for the device.
 * @param {string} playerName - The chosen name for the player.
 * @returns {Promise<object>} The server response.
 */
export const registerPlayer = (deviceID, playerName) => {
  return fetch(`${API_BASE_URL}/players`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ deviceID, playerName }),
  }).then(handleResponse);
};

/**
 * Updates an existing player's name.
 * @param {string} deviceID - The unique ID for the device.
 * @param {string} playerName - The new name for the player.
 * @returns {Promise<object>} The server response.
 */
export const updatePlayer = (deviceID, playerName) => {
  return fetch(`${API_BASE_URL}/players/${deviceID}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ playerName }),
  }).then(handleResponse);
};

/**
 * Checks the database connection status.
 */
export const checkDbStatus = () => {
  return fetch(`${API_BASE_URL}/status`).then(handleResponse);
};

/**
 * Gets a player's profile from the server.
 * @param {string} deviceID - The player's device ID.
 * @returns {Promise<object>} The player profile data.
 */
export const getPlayerProfile = (deviceID) => {
  if (!deviceID) return Promise.reject(new Error("Device ID is required to get a profile."));
  return fetch(`${API_BASE_URL}/players/${deviceID}`).then(handleResponse);
};

/**
 * Fetches all cards for a given player.
 * @param {string} deviceID - The player's device ID.
 * @returns {Promise<object>} An object containing the list of cards.
 */
export const getPlayerCards = (deviceID) => {
  if (!deviceID) return Promise.reject(new Error("Device ID is required to fetch cards."));
  return fetch(`${API_BASE_URL}/players/${deviceID}/cards`).then(handleResponse);
};

/**
 * Adds a card to a player's collection.
 * @param {string} deviceID - The player's device ID.
 * @param {string} cardId - The ID of the card to add.
 * @returns {Promise<object>} The awarded card details.
 */
export const addCardToCollection = (deviceID, cardId) => {
  return fetch(`${API_BASE_URL}/players/${deviceID}/cards`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cardId }),
  }).then(handleResponse);
};

/**
 * Requests the server to award a random card to the player.
 * @param {string} deviceID - The player's device ID.
 * @returns {Promise<object>} The awarded card details.
 */
export const awardRandomCard = (deviceID) => {
  return fetch(`${API_BASE_URL}/players/${deviceID}/award-random-card`, {
    method: 'POST',
  }).then(handleResponse);
};

/**
 * Searches for players by name.
 * @param {string} searchTerm - The name to search for.
 * @param {string} excludeDeviceID - The deviceID of the current user to exclude from results.
 * @returns {Promise<Array>} A list of matching players.
 */
export const searchPlayers = (searchTerm, excludeDeviceID) => {
  // --- FIX ---
  // The backend route is /players/search, and it expects a 'term' parameter.
  const params = new URLSearchParams({ term: searchTerm, excludeDeviceID });
  return fetch(`${API_BASE_URL}/players/search?${params}`).then(handleResponse);
};

/**
 * Fetches all pending trades for a player.
 * @param {string} deviceID - The player's device ID.
 * @returns {Promise<object>} An object containing incoming and outgoing trades.
 */
export const getTrades = (deviceID) => {
  return fetch(`${API_BASE_URL}/trades/${deviceID}`).then(handleResponse);
};

/**
 * Creates a new trade offer.
 * @param {object} tradeData - The data for the trade.
 * @param {string} tradeData.offeringPlayerDeviceID
 * @param {string} tradeData.receivingPlayerDeviceID
 * @param {number} tradeData.offeredCardInstanceID
 * @returns {Promise<object>} The server response.
 */
export const createTrade = (tradeData) => {
  return fetch(`${API_BASE_URL}/trades`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tradeData),
  }).then(handleResponse);
};

/**
 * Responds to a trade offer (accept, reject, cancel).
 * @param {number} tradeId - The ID of the trade to update.
 * @param {object} tradeResponse - The response data.
 * @returns {Promise<object>} The server response.
 */
export const updateTradeStatus = (tradeId, tradeResponse) => {
  return fetch(`${API_BASE_URL}/trades/${tradeId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tradeResponse),
  }).then(handleResponse);
};

/**
 * Fetches all card definitions from the server.
 */
export const getCardDefinitions = () => {
  return fetch(`${API_BASE_URL}/cards`).then(handleResponse);
};

/**
 * Fetches the completed trade history for a player, with optional filters.
 * @param {string} deviceID - The player's device ID.
 * @param {object} filters - Optional filters for the query.
 * @param {string} filters.status - Filter by 'accepted', 'rejected', etc.
 * @param {string} filters.playerName - Filter by the other player's name.
 * @returns {Promise<object>} An object containing the trade history.
 */
export const getTradeHistory = (deviceID, filters = {}) => {
  const params = new URLSearchParams(filters);
  return fetch(`${API_BASE_URL}/trades/${deviceID}/history?${params}`).then(handleResponse);
};

/**
 * Scans a clue and returns the message.
 * @param {string} deviceID - The player's device ID.
 * @param {string} clueId - The ID of the clue to scan.
 * @returns {Promise<object>} The server response.
 */
export const scanClue = (deviceID, clueId) => {
  return fetch(`${API_BASE_URL}/clues/scan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ deviceID, clueId }),
  }).then(handleResponse);
};
