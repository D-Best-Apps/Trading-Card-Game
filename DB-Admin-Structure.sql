-- Admin related tables for the Trading Game application.

USE `trading_game_db`;

-- -----------------------------------------------------
-- Table `admin_users`
-- Stores credentials for administrative users.
-- Passwords should be hashed before storing.
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `admin_users` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(45) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);

-- -----------------------------------------------------
-- Table `settings`
-- Stores application-wide settings, such as the required number of unique cards.
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `settings` (
  `setting_name` VARCHAR(100) NOT NULL,
  `setting_value` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`setting_name`)
);

-- Insert initial setting for required_cards
INSERT INTO `settings` (`setting_name`, `setting_value`) VALUES ('required_cards', '5');
INSERT INTO `admin_users` (`username`, `password_hash`) VALUES ('admin', '$2y$10$LgPpRxWxLTG7SO/Q7HIXKO1JrXHCAiru5ZrUQPnYc0K.U6qxUS/Rm')