-- =====================================================================
-- HomeFit MySQL schema
-- Run this whole file in MySQL Workbench (or `mysql -u root -p < schema.sql`)
-- to create the database and every table from scratch.
-- =====================================================================

CREATE DATABASE IF NOT EXISTS homefit_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE homefit_db;

-- ---------------------------------------------------------------------
-- users: one row per registered person. `user_id` is the permanent,
-- public, auto-generated identifier (USR000001, USR000002, ...).
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  user_id       VARCHAR(20)  NOT NULL,
  name          VARCHAR(255) NOT NULL,
  email         VARCHAR(255) NOT NULL,
  phone         VARCHAR(30)  NULL,
  password_hash VARCHAR(255) NOT NULL,
  role          ENUM('user', 'admin') NOT NULL DEFAULT 'user',
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_users_user_id (user_id),
  UNIQUE KEY uq_users_email (email),
  UNIQUE KEY uq_users_phone (phone)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- onboarding: one JSON blob of onboarding answers per user.
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS onboarding (
  user_id    VARCHAR(20) NOT NULL PRIMARY KEY,
  data       JSON NOT NULL,
  completed  BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_onboarding_user FOREIGN KEY (user_id)
    REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- workout_logs: one row per completed practice session.
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS workout_logs (
  id              CHAR(36) NOT NULL PRIMARY KEY,
  user_id         VARCHAR(20) NOT NULL,
  log_date        DATE NOT NULL,
  name            VARCHAR(255) NOT NULL,
  kind            VARCHAR(50) NOT NULL DEFAULT 'yoga',
  category_id     VARCHAR(100) NULL,
  source          ENUM('plan', 'free') NOT NULL DEFAULT 'free',
  plan_day        INT NULL,
  is_completed    BOOLEAN NOT NULL DEFAULT TRUE,
  duration_min    INT NOT NULL DEFAULT 0,
  calories        INT NOT NULL DEFAULT 0,
  poses_completed INT NOT NULL DEFAULT 0,
  created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_workout_logs_user FOREIGN KEY (user_id)
    REFERENCES users(user_id) ON DELETE CASCADE,
  INDEX idx_workout_logs_user_date (user_id, log_date DESC)
) ENGINE=InnoDB;

SET @has_source := (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'workout_logs' AND COLUMN_NAME = 'source'
);
SET @sql := IF(@has_source = 0,
  'ALTER TABLE workout_logs ADD COLUMN source ENUM(''plan'', ''free'') NOT NULL DEFAULT ''free'' AFTER category_id',
  'SELECT 1'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @has_plan_day := (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'workout_logs' AND COLUMN_NAME = 'plan_day'
);
SET @sql := IF(@has_plan_day = 0,
  'ALTER TABLE workout_logs ADD COLUMN plan_day INT NULL AFTER source',
  'SELECT 1'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @has_is_completed := (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'workout_logs' AND COLUMN_NAME = 'is_completed'
);
SET @sql := IF(@has_is_completed = 0,
  'ALTER TABLE workout_logs ADD COLUMN is_completed BOOLEAN NOT NULL DEFAULT TRUE AFTER plan_day',
  'SELECT 1'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @has_duration_sec := (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'workout_logs' AND COLUMN_NAME = 'duration_sec'
);
SET @sql := IF(@has_duration_sec = 0,
  'ALTER TABLE workout_logs ADD COLUMN duration_sec INT NULL AFTER duration_min',
  'SELECT 1'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- ---------------------------------------------------------------------
-- notes: motivation / journal entries.
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS notes (
  id         CHAR(36) NOT NULL PRIMARY KEY,
  user_id    VARCHAR(20) NOT NULL,
  note_date  DATE NOT NULL,
  title      VARCHAR(255) NOT NULL DEFAULT '',
  body       TEXT NOT NULL,
  mood       VARCHAR(50) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_notes_user FOREIGN KEY (user_id)
    REFERENCES users(user_id) ON DELETE CASCADE,
  INDEX idx_notes_user_date (user_id, note_date DESC)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- goals: "future self" 21/30/60/90-day commitments.
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS goals (
  id          CHAR(36) NOT NULL PRIMARY KEY,
  user_id     VARCHAR(20) NOT NULL,
  title       VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  target_days INT NOT NULL DEFAULT 30,
  start_date  DATE NOT NULL,
  archived    BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_goals_user FOREIGN KEY (user_id)
    REFERENCES users(user_id) ON DELETE CASCADE,
  INDEX idx_goals_user (user_id, created_at DESC)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- goal_checkins: one row per day a goal was checked off.
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS goal_checkins (
  id         CHAR(36) NOT NULL PRIMARY KEY,
  goal_id    CHAR(36) NOT NULL,
  user_id    VARCHAR(20) NOT NULL,
  check_date DATE NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_checkins_goal FOREIGN KEY (goal_id)
    REFERENCES goals(id) ON DELETE CASCADE,
  CONSTRAINT fk_checkins_user FOREIGN KEY (user_id)
    REFERENCES users(user_id) ON DELETE CASCADE,
  UNIQUE KEY uq_goal_checkin (goal_id, check_date)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- content_overrides: admin-managed edits/hides of static content
-- (poses, recipes, guides, books). Readable by everyone, writable by
-- admins only (enforced in the backend, not in MySQL).
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS content_overrides (
  id         CHAR(36) NOT NULL PRIMARY KEY,
  kind       VARCHAR(50) NOT NULL,
  slug       VARCHAR(150) NOT NULL,
  payload    JSON NOT NULL,
  hidden     BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_content_kind_slug (kind, slug)
) ENGINE=InnoDB;

-- No seed data on purpose: the database starts with zero users,
-- zero workouts, zero goals, zero notes. Rows only appear once a
-- real person registers and uses the app.
