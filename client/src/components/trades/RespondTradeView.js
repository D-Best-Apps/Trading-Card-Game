// client/src/components/trades/RespondTradeView.js (New File)
import React, { useState } from 'react';
import Card from '../cards/Card';

// This component handles responding to an incoming trade offer.
export default function RespondTradeView({ trade, myCards, onRespond, onCancel, currentUserDeviceID }) {
  const [cardToGive, setCardToGive] = useState(null);
  const [error, setError] = useState(null);

  const handleResponse = (action) => {
    if (action === 'accept' && !cardToGive) {
      setError("You must select a card to give in return.");
      return;
    }
    onRespond({
      deviceID: currentUserDeviceID,
      action,
      cardToGiveInstanceID: cardToGive?.instance_id,
    });
  };

  return (
    <div className="trade-container">
      <h1>Respond to Trade</h1>
      {error && <p className="error-message">{error}</p>}
      
      <div className="trade-offer-summary">
        <p><strong>{trade.other_player_name}</strong> is offering:</p>
        <div className="card-wrapper">
          <Card card={trade} onSelect={null} />
        </div>
      </div>

      <div className="trade-form-section">
        <h2>Select Your Card to Give in Return</h2>
        <div className="card-grid trade-selection">
          {myCards.map(card => (
            <Card
              key={card.instance_id}
              card={card}
              onSelect={() => setCardToGive(card)}
              isSelected={cardToGive?.instance_id === card.instance_id}
            />
          ))}
        </div>
      </div>

      <div className="trade-actions">
        <button type="button" className="trade-button accept" onClick={() => handleResponse('accept')}>
          Accept Trade
        </button>
        <button type="button" className="trade-button reject" onClick={() => handleResponse('reject')}>
          Reject Trade
        </button>
        <button type="button" className="trade-button cancel" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}