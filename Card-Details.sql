-- This script populates the `card_definitions` table with the initial set of cards.
-- Make sure you have run the schema from "sql-schema-trading-db" first.
USE Trading_game_DB;

-- It's good practice to clear existing definitions if you are re-running this script.
-- DELETE FROM card_definitions;

-- Note: If any description contains a single quote, it must be escaped by doubling it up.
-- For example: 'It's a card' would become 'It''s a card'.

INSERT INTO `card_definitions` (`card_id`, `name`, `rarity`, `description`, `image_path`) VALUES
('C001', 'SGT Pepper', 'Legendary', 'Provides moral boosting meow.', '/images/cards/6.png'),
('C002', 'The Virtual Virtuoso', 'Epic', 'Long range skill bypasses all physical barriers.', '/images/cards/7.png'),
('C003', 'The Proactive Pathfinder', 'Epic', 'Quick Learn buff allows him to quickly learn any new skill.', '/images/cards/8.png'),
('C004', 'The Vanguard Engineer', 'Rare', 'Targets the most difficult Tech challenges.', '/images/cards/1.png'),
('C005', 'The Master Crafter', 'Common', 'Hardware skill can revive bricked electronics.', '/images/cards/2.png'),
('C006', 'Dark Web Tabby', 'Rare', 'A malicious attacker that bypasses security to infect hardware.', '/images/cards/11.png'),
('C007', 'The Client Whisperer', 'Common', 'Passive aura that strengthens the bond between client and tech.', '/images/cards/10.png'),
('C008', 'The Polished Professional', 'Rare', 'Ensures a smooth installation for new hardware.', '/images/cards/9.png'),
('C009', 'The Velocity Victor', 'Epic', 'Clears multiple tickets from the queue at once.', '/images/cards/5.png'),
('C010', 'The Nexus Coordinator', 'Rare', 'Powerful enchantment grants ‘High Morale’ Buff.', '/images/cards/3.png'),
('C011', 'The Gilded Guardian', 'Rare', 'Erects an impenetrable shield around company assets.', '/images/cards/4.png');
