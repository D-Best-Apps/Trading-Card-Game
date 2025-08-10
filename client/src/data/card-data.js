// client/src/data/card-data.js
// This file contains the card definitions and the logic for awarding a random card.

export const ALL_CARDS = [
  { name: 'SGT Pepper', rarity: 'Legendary', image: '/images/cards/6.webp', description: 'Provides moral boosting meow.' },
  { name: 'The Virtual Virtuoso', rarity: 'Epic', image: '/images/cards/7.webp', description: 'Long range skill bypasses all physical barriers.' },
  { name: 'The Proactive Pathfinder', rarity: 'Epic', image: '/images/cards/8.webp', description: 'Quick Learn buff allows him to quickly learn any new skill.' },
  { name: 'The Vanguard Engineer', rarity: 'Rare', image: '/images/cards/1.webp', description: 'Targets the most difficult Tech challenges.' },
  { name: 'The Master Crafter', rarity: 'Common', image: '/images/cards/2.webp', description: 'Hardware skill can revive bricked electronics.' },
  { name: 'Dark Web Tabby', rarity: 'Rare', image: '/images/cards/11.webp', description: 'A malicious attacker that bypasses security to infect hardware.' },
  { name: 'The Client Whisperer', rarity: 'Common', image: '/images/cards/10.webp', description: 'Passive aura that strengthens the bond between client and tech.' },
  { name: 'The Polished Professional', rarity: 'Rare', image: '/images/cards/9.webp', description: 'Ensures a smooth installation for new hardware.' },
  { name: 'The Velocity Victor', rarity: 'Epic', image: '/images/cards/5.webp', description: 'Clears multiple tickets from the queue at once.' },
  { name: 'The Nexus Coordinator', rarity: 'Rare', image: '/images/cards/3.webp', description: 'Powerful enchantment grants ‘High Morale’ Buff.' },
  { name: 'The Gilded Guardian', rarity: 'Rare', image: '/images/cards/4.webp', description: 'Erects an impenetrable shield around company assets.' },
];

// Pre-group cards by rarity for efficient lookups.
const CARDS_BY_RARITY = ALL_CARDS.reduce((acc, card) => {
  const { rarity } = card;
  if (!acc[rarity]) {
    acc[rarity] = [];
  }
  acc[rarity].push(card);
  return acc;
}, {});

export const getRandomCard = () => {
  // --- CHANCES UPDATED ---
  // Legendary and Epic cards are now much harder to get.
  const chances = {
    'Legendary': 0.01, // 1% chance (was 5%)
    'Epic': 0.09,      // 9% chance (was 15%)
    'Rare': 0.09,      // 20% chance (was 30%)
    'Common': 0.91,    // 91% chance (was 50%)
  };

  const random = Math.random();
  let cumulativeChance = 0;

  for (const rarity in chances) {
    cumulativeChance += chances[rarity];
    if (random <= cumulativeChance) {
      const cardsOfRarity = CARDS_BY_RARITY[rarity];
      if (cardsOfRarity && cardsOfRarity.length > 0) {
        return cardsOfRarity[Math.floor(Math.random() * cardsOfRarity.length)];
      }
    }
  }
  // Fallback to any random card if the logic fails for any reason.
  return ALL_CARDS[Math.floor(Math.random() * ALL_CARDS.length)];
};