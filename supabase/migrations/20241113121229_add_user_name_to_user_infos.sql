-- Migration: add_user_name_to_user_infos
-- Created at: 2024-11-13 19:13:29
-- Description: Adds user_name column to the user_infos table
--
-- Step 1: Add user_name column without NOT NULL constraint
ALTER TABLE user_infos
ADD COLUMN user_name TEXT;

-- Step 2: Update existing rows with unique default values
UPDATE user_infos
SET user_name = CONCAT('default_user_name_', id)
WHERE user_name IS NULL;

-- Step 3: Add UNIQUE constraint
ALTER TABLE user_infos
ADD CONSTRAINT user_name_unique UNIQUE (user_name);

-- Step 4: Alter column to add NOT NULL constraint
ALTER TABLE user_infos
ALTER COLUMN user_name SET NOT NULL;

-- Verification
DO $$
BEGIN
    -- Check if the user_name column has been added
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'user_infos'
          AND column_name = 'user_name'
    ) THEN
        RAISE EXCEPTION 'Column "user_name" was not added to user_infos table';
    END IF;
END $$;

-- Rollback function
-- CREATE OR REPLACE FUNCTION rollback_add_user_name_to_user_infos()
-- RETURNS void AS $$
-- BEGIN
--     ALTER TABLE user_infos DROP COLUMN IF EXISTS user_name;
-- END;
-- $$ LANGUAGE plpgsql;

COMMIT;
