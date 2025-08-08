// client/src/components/trades/NewTradeView.js (New File)
import React, { useState, useEffect } from 'react';
import * as api from '../../services/api';
import Card from '../cards/Card';

// This component handles the entire "Create New Trade" flow.
export default function NewTradeView({ myCards, onCreate, onCancel, currentUserDeviceID }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [cardToOffer, setCardToOffer] = useState(null);
  const [error, setError] = useState(null);

  // Debounced player search
  useEffect(() => {
    if (searchTerm.trim().length < 2) {
      setSearchResults([]);
      return;
    }
    const handler = setTimeout(() => {
      api.searchPlayers(searchTerm, currentUserDeviceID)
        .then(data => setSearchResults(data.players || []))
        .catch(() => setSearchResults([]));
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm, currentUserDeviceID]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedPlayer || !cardToOffer) {
      setError("You must select a player and a card to offer.");
      return;
    }
    onCreate({
      offeringPlayerDeviceID: currentUserDeviceID,
      receivingPlayerDeviceID: selectedPlayer.device_id,
      offeredCardInstanceID: cardToOffer.instance_id,
    });
  };

  return (
    <div className="trade-container">
      <h1>Create New Trade</h1>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="trade-form-section">
          <h2>1. Find a Player</h2>
          <div className="search-container">
            <input
              type="text"
              value={searchTerm}
              onChange={e => {
                setSearchTerm(e.target.value);
                setSelectedPlayer(null); // Clear selection when typing
              }}
              placeholder="Search by player name..."
              className="trade-input"
            />
            {searchResults.length > 0 && (
              <div className="search-results">
                {searchResults.map(p => (
                  <div key={p.device_id} onClick={() => {
                    setSelectedPlayer(p);
                    setSearchTerm(p.player_name);
                    setSearchResults([]);
                  }} className="search-result-item">
                    {p.player_name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="trade-form-section">
          <h2>2. Select Your Card to Offer</h2>
          <div className="card-grid trade-selection">
            {myCards.map(card => (
              <Card
                key={card.instance_id}
                card={card}
                onSelect={() => setCardToOffer(card)}
                isSelected={cardToOffer?.instance_id === card.instance_id}
              />
            ))}
          </div>
        </div>

        <div className="trade-actions">
          <button type="submit" className="trade-button primary" disabled={!selectedPlayer || !cardToOffer}>
            Submit Trade Offer
          </button>
          <button type="button" className="trade-button cancel" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}