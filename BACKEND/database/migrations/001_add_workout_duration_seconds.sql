-- Backward-compatible, idempotent migration. Safe to run more than once.
-- Adds exact elapsed seconds for a session. Existing rows keep duration_min and get NULL here.
-- (The Flask app also applies this automatically at startup.)
USE homefit_db;

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
