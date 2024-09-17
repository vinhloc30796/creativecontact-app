-- Migration: add_social_handles
-- Created at: 2024-09-15 07:32:46
-- Description: Adds instagram_handle and facebook_handle columns to the user_infos table

BEGIN;

-- Add instagram_handle column to user_infos table
ALTER TABLE user_infos
ADD COLUMN instagram_handle TEXT;

-- Add facebook_handle column to user_infos table
ALTER TABLE user_infos
ADD COLUMN facebook_handle TEXT;

-- Verification
DO $$
BEGIN
    -- Check if the instagram_handle column has been added
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'user_infos'
          AND column_name = 'instagram_handle'
    ) THEN
        RAISE EXCEPTION 'Column "instagram_handle" was not added to user_infos table';
    END IF;

    -- Check if the facebook_handle column has been added
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'user_infos'
          AND column_name = 'facebook_handle'
    ) THEN
        RAISE EXCEPTION 'Column "facebook_handle" was not added to user_infos table';
    END IF;
END $$;

-- Rollback function
-- CREATE OR REPLACE FUNCTION rollback_add_social_handles()
-- RETURNS void AS $$
-- BEGIN
--     ALTER TABLE user_infos DROP COLUMN IF EXISTS instagram_handle;
--     ALTER TABLE user_infos DROP COLUMN IF EXISTS facebook_handle;
-- END;
-- $$ LANGUAGE plpgsql;

COMMIT;
