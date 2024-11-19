-- Migration: remove_max_assets_from_artworks
-- Created at: 2024-09-04 04:27:28
-- Description: Removes the max_assets column from the public.artworks table

-- Author: Loc Nguyen <vinhloc30796@gmail.com>
-- Ticket: WEB-87 @ Linear

BEGIN;

-- Remove the comment
COMMENT ON COLUMN public.artworks.max_assets IS NULL;
-- Remove the max_assets column from the artworks table
ALTER TABLE public.artworks DROP COLUMN max_assets;


-- Verification
DO $$
BEGIN 
    -- Check if the max_assets column no longer exists
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
            AND table_name = 'artworks'
            AND column_name = 'max_assets'
    ) THEN
        RAISE EXCEPTION 'Column "max_assets" still exists in table "artworks"';
    END IF;
END $$;

-- Rollback function (if supported by your migration tool)
-- Uncomment and modify as needed
/*
CREATE OR REPLACE FUNCTION rollback_remove_max_assets_from_artworks()
RETURNS void AS $$
BEGIN
    ALTER TABLE public.artworks ADD COLUMN max_assets INTEGER NOT NULL DEFAULT 5;
    COMMENT ON COLUMN public.artworks.max_assets IS 'The maximum number of assets allowed for this artwork';
END;
$$ LANGUAGE plpgsql;
*/

COMMIT;

-- End of migration