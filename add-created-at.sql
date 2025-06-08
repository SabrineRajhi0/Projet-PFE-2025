-- SQL script to add created_at column to all user tables
ALTER TABLE admin ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE apprenant ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE enseignant ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Update existing records to have a timestamp
UPDATE admin SET created_at = NOW() WHERE created_at IS NULL;
UPDATE apprenant SET created_at = NOW() WHERE created_at IS NULL;
UPDATE enseignant SET created_at = NOW() WHERE created_at IS NULL;
