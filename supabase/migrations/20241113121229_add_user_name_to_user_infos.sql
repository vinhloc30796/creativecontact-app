-- Migration: add_user_name_to_user_infos
-- Created at: 2024-11-13 19:13:29
-- Description: Adds user_name column to the user_infos table
--
BEGIN;

-- Add user_name column to user_infos table
ALTER TABLE user_infos
ADD COLUMN user_name TEXT NOT NULL UNIQUE;

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
