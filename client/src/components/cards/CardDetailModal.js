// client/src/components/cards/CardDetailModal.js
// ACTION: Replace the entire contents of this file with the corrected code.

import React from 'react';
import './CardDetailModal.css';

function CardDetailModal({ card, onClose }) {
  if (!card) return null; // Don't render if no card is selected

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        {/* --- FIX --- */}
        {/* Use the correct property 'image_path' from your database */}
        <img src={card.image_path} alt={card.name} className="modal-image" />
        
        <h2>{card.name}</h2>
        <p className="modal-rarity">{card.rarity}</p>
        <p className="modal-description">{card.description}</p>
        <button className="modal-close-btn" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default CardDetailModal;
