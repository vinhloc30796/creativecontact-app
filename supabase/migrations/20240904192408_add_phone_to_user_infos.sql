-- Migration: add_phone_to_user_infos
-- Created at: 2024-09-05 02:24:19
-- Description: Adds phone column to the public.user_infos table

-- Author: Loc Nguyen <vinhloc30796@gmail.com>
-- Ticket: WEB-88

BEGIN;

-- Step 1: Add new column
ALTER TABLE public.user_infos
ADD COLUMN phone TEXT;

-- Verification
DO $$
BEGIN 
    -- Check if the new column exists
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
            AND table_name = 'user_infos'
            AND column_name = 'phone'
    ) THEN
        RAISE EXCEPTION 'Column "phone" does not exist in table "user_infos"';
    END IF;
END $$;

-- Rollback function (if supported by your migration tool)
-- Uncomment and modify as needed
/*
CREATE OR REPLACE FUNCTION rollback_add_phone_to_user_infos()
RETURNS void AS $$
BEGIN
    ALTER TABLE public.user_infos DROP COLUMN IF EXISTS phone;
END;
$$ LANGUAGE plpgsql;
*/

COMMIT;

-- End of migration