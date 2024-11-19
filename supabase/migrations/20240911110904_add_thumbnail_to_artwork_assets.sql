-- Migration: add_thumbnail_to_artwork_assets
-- Created at: 2024-09-11 11:09:04
-- Description: Adds an is_thumbnail boolean column to the artwork_assets table

BEGIN;

-- Add is_thumbnail column to artwork_assets table
ALTER TABLE artwork_assets
ADD COLUMN is_thumbnail BOOLEAN DEFAULT FALSE;

-- Verification
DO $$
BEGIN
    -- Check if the column has been added
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'artwork_assets'
          AND column_name = 'is_thumbnail'
    ) THEN
        RAISE EXCEPTION 'Column "is_thumbnail" was not added to artwork_assets table';
    END IF;
END $$;

-- Rollback function
-- CREATE OR REPLACE FUNCTION rollback_add_thumbnail_to_artwork_assets()
-- RETURNS void AS $$
-- BEGIN
--     ALTER TABLE artwork_assets DROP COLUMN IF EXISTS is_thumbnail;
-- END;
-- $$ LANGUAGE plpgsql;

COMMIT;
