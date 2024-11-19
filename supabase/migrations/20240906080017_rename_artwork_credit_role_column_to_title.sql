-- Migration: rename_artwork_credit_role_column_to_title
-- Created at: 2024-09-06 08:00:17
-- Description: Renames the 'role' column to 'title' in the artwork_credits table

BEGIN;

-- Rename the 'role' column to 'title'
ALTER TABLE public.artwork_credits RENAME COLUMN role TO title;

-- Update the comment for the renamed column
COMMENT ON COLUMN public.artwork_credits.title IS 'The title or role of the user in the creation of the artwork';

-- Verification
DO $$
BEGIN
    -- Check if the column has been renamed
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'artwork_credits'
          AND column_name = 'title'
    ) THEN
        RAISE EXCEPTION 'Column "title" does not exist in table "artwork_credits"';
    END IF;

    -- Check if the old column name no longer exists
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'artwork_credits'
          AND column_name = 'role'
    ) THEN
        RAISE EXCEPTION 'Column "role" still exists in table "artwork_credits"';
    END IF;
END $$;

-- Rollback function
-- CREATE OR REPLACE FUNCTION rollback_rename_artwork_credit_role_column_to_title()
-- RETURNS void AS $$
-- BEGIN
--     ALTER TABLE public.artwork_credits RENAME COLUMN title TO role;
--     COMMENT ON COLUMN public.artwork_credits.role IS 'The role of the user in the creation of the artwork';
-- END;
-- $$ LANGUAGE plpgsql;

COMMIT;
