-- This database will hold all the data for the scavenger hunt and trading game.
CREATE DATABASE IF NOT EXISTS `trading_game_db`;
USE `trading_game_db`;

-- -----------------------------------------------------
-- Table `players`
-- Stores each unique user, identified by their device ID.
-- We use an integer `id` as the primary key for performance in joins.
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `players` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `device_id` VARCHAR(45) NOT NULL,
  `player_name` VARCHAR(45) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `device_id_UNIQUE` (`device_id` ASC));

-- -----------------------------------------------------
-- Table `card_definitions`
-- Stores the blueprint for every type of card available in the game.
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `card_definitions` (
  `card_id` VARCHAR(10) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `rarity` VARCHAR(20) NOT NULL,
  `description` TEXT NULL,
  `image_path` VARCHAR(255) NULL,
  PRIMARY KEY (`card_id`));

-- -----------------------------------------------------
-- Table `player_cards`
-- Tracks each individual card instance owned by a player.
-- This allows for multiple copies of the same card to exist.
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `player_cards` (
  `instance_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `player_id` INT UNSIGNED NOT NULL,
  `card_id` VARCHAR(10) NOT NULL,
  `acquired_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`instance_id`),
  INDEX `fk_player_cards_players_idx` (`player_id` ASC),
  INDEX `fk_player_cards_definitions_idx` (`card_id` ASC),
  CONSTRAINT `fk_player_cards_players`
    FOREIGN KEY (`player_id`)
    REFERENCES `players` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `fk_player_cards_definitions`
    FOREIGN KEY (`card_id`)
    REFERENCES `card_definitions` (`card_id`)
    ON DELETE RESTRICT);

-- -----------------------------------------------------
-- Table `trades`
-- Stores a 1-for-1 trade offer between two players.
-- Includes the final state of the trade for history purposes.
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `trades` (
  `trade_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `offering_player_id` INT UNSIGNED NOT NULL,
  `receiving_player_id` INT UNSIGNED NOT NULL,
  `offered_card_instance_id` INT UNSIGNED NOT NULL,
  `requested_card_id` VARCHAR(10) NULL, -- Optional: specific card requested in return
  
  -- NEW COLUMN FOR TRADE HISTORY --
  `accepted_card_instance_id` INT UNSIGNED NULL DEFAULT NULL, -- Stores the card given in return if the trade was accepted.
  
  `status` ENUM('pending', 'accepted', 'rejected', 'cancelled') NOT NULL DEFAULT 'pending',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`trade_id`),
  INDEX `fk_trades_offering_player_idx` (`offering_player_id` ASC),
  INDEX `fk_trades_receiving_player_idx` (`receiving_player_id` ASC),
  INDEX `fk_trades_offered_card_idx` (`offered_card_instance_id` ASC),
  
  -- NEW INDEX FOR TRADE HISTORY --
  INDEX `fk_trades_accepted_card_idx` (`accepted_card_instance_id` ASC),
  
  CONSTRAINT `fk_trades_offering_player`
    FOREIGN KEY (`offering_player_id`)
    REFERENCES `players`(`id`)
    ON DELETE CASCADE,
  CONSTRAINT `fk_trades_receiving_player`
    FOREIGN KEY (`receiving_player_id`)
    REFERENCES `players`(`id`)
    ON DELETE CASCADE,
  CONSTRAINT `fk_trades_offered_card`
    FOREIGN KEY (`offered_card_instance_id`)
    REFERENCES `player_cards`(`instance_id`)
    ON DELETE CASCADE,
    
  -- NEW CONSTRAINT FOR TRADE HISTORY --
  CONSTRAINT `fk_trades_accepted_card`
    FOREIGN KEY (`accepted_card_instance_id`)
    REFERENCES `player_cards`(`instance_id`)
    ON DELETE SET NULL);

-- -----------------------------------------------------
-- Table `clues`
-- Stores the clues for the scavenger hunt part of the game.
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `clues` (
  `id` INT UNSIGNED NOT NULL,
  `message` TEXT NOT NULL,
  PRIMARY KEY (`id`)
);

-- -----------------------------------------------------
-- Table `player_clues`
-- Tracks which clues a player has successfully scanned.
-- Prevents a player from scanning the same clue multiple times.
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `player_clues` (
  `player_id` INT UNSIGNED NOT NULL,
  `clue_id` INT UNSIGNED NOT NULL,
  `scanned_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`player_id`, `clue_id`),
  INDEX `fk_player_clues_clues_idx` (`clue_id` ASC),
  CONSTRAINT `fk_player_clues_players`
    FOREIGN KEY (`player_id`)
    REFERENCES `players` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `fk_player_clues_clues`
    FOREIGN KEY (`clue_id`)
    REFERENCES `clues` (`id`)
    ON DELETE CASCADE
);