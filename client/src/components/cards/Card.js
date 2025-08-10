// client/src/components/cards/Card.js
// ACTION: Replace the entire contents of this file with the corrected code below.

import React from 'react';
import './Card.css';

function Card({ card, onSelect, isSelected }) {
  // Defensive check in case card is null
  if (!card) {
    return null;
  }

  const rarityColor = {
    Legendary: 'legendary',
    Epic: 'epic',
    Rare: 'rare',
    Common: 'common',
  }[card.rarity];

  const classNames = [
    'card',
    rarityColor,
    onSelect && 'clickable', // Add 'clickable' class if onSelect is provided
    isSelected && 'selected', // Add 'selected' class if isSelected is true
  ].filter(Boolean).join(' '); // filter(Boolean) removes any falsey values

  return (
    <div className={classNames} onClick={onSelect}>
      <div className="card-image-wrapper">
        {/* --- FIX --- */}
        {/* Use the correct property name 'image_path' from your database */}
        <img src={card.image_path} alt={card.name} className="card-image" />
      </div>
      <h3 className="card-name">{card.name}</h3>
      <div className="card-rarity">{card.rarity}</div>
    </div>
  );
}

export default Card;
