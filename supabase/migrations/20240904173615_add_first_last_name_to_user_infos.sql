-- Migration: add_first_last_name_to_user_infos
-- Created at: 2024-09-05 00:36:15
-- Description: Adds first_name and last_name columns to the public.user_infos table and populates them based on display_name

-- Author: Loc Nguyen <vinhloc30796@gmail.com>
-- Ticket: WEB-88

BEGIN;

-- Step 1: Add new columns
ALTER TABLE public.user_infos
ADD COLUMN first_name TEXT,
ADD COLUMN last_name TEXT;

-- Step 2: Update existing rows
UPDATE public.user_infos
SET 
    first_name = CASE 
        WHEN display_name IS NOT NULL THEN
            SPLIT_PART(display_name, ' ', 1)
        ELSE
            NULL
    END,
    last_name = CASE 
        WHEN display_name IS NOT NULL THEN
            SUBSTRING(display_name FROM POSITION(' ' IN display_name) + 1)
        ELSE
            NULL
    END
WHERE display_name IS NOT NULL;

-- Verification
DO $$
BEGIN 
    -- Check if the new columns exist
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
            AND table_name = 'user_infos'
            AND column_name IN ('first_name', 'last_name')
    ) THEN
        RAISE EXCEPTION 'Columns "first_name" and "last_name" do not exist in table "user_infos"';
    END IF;

    -- Check if data was populated correctly
    IF EXISTS (
        SELECT 1
        FROM public.user_infos
        WHERE display_name IS NOT NULL
            AND (first_name IS NULL OR last_name IS NULL)
    ) THEN
        RAISE EXCEPTION 'Some rows with non-null display_name have null first_name or last_name';
    END IF;
END $$;

-- Rollback function (if supported by your migration tool)
-- Uncomment and modify as needed
/*
CREATE OR REPLACE FUNCTION rollback_add_first_last_name_to_user_infos()
RETURNS void AS $$
BEGIN
    ALTER TABLE public.user_infos DROP COLUMN IF EXISTS first_name;
    ALTER TABLE public.user_infos DROP COLUMN IF EXISTS last_name;
END;
$$ LANGUAGE plpgsql;
*/

COMMIT;

-- End of migration