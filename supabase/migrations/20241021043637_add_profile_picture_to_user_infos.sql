-- Migration: add_profile_picture_to_user_infos
-- Created at: 2024-10-21 11:36:37
-- Description: Adds a profile_picture column to the public.user_infos table

BEGIN;

-- Step 1: Add new column
ALTER TABLE public.user_infos
ADD COLUMN profile_picture TEXT;

-- Step 2: Add comment to the new column
COMMENT ON COLUMN public.user_infos.profile_picture IS 'URL or file path of the user''s profile picture';

-- Verification
DO $$
BEGIN
    -- Check if the new column exists
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
            AND table_name = 'user_infos'
            AND column_name = 'profile_picture'
    ) THEN
        RAISE EXCEPTION 'Column "profile_picture" does not exist in table "user_infos"';
    END IF;
END $$;

-- Rollback function (if needed)
/*
CREATE OR REPLACE FUNCTION rollback_add_profile_picture_to_user_infos()
RETURNS void AS $$
BEGIN
    DROP FUNCTION IF EXISTS update_user_infos_updated_at();
END;
$$ LANGUAGE plpgsql;
*/

COMMIT;

-- End of migration