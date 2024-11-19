-- Migration: update_artwork_assets_storage_limit
-- Created at: 2024-09-09 15:45:37
-- Description: Updates the file size limit for the artwork_assets storage bucket to 25MB

-- Author: Loc Nguyen <vinhloc30796@gmail.com>
-- Ticket: WEB-86 @ Linear

BEGIN;

-- Update the storage bucket for artwork assets
UPDATE storage.buckets
SET file_size_limit = 26214400  -- 25MB in bytes
WHERE id = 'artwork_assets';

-- Verification
DO $$
BEGIN 
    -- Check if the bucket exists and has been updated
    IF NOT EXISTS (
        SELECT 1
        FROM storage.buckets
        WHERE id = 'artwork_assets' AND file_size_limit = 26214400
    ) THEN
        RAISE EXCEPTION 'Bucket "artwork_assets" does not exist or was not updated correctly';
    END IF;
END $$;

-- Rollback function (if supported by your migration tool)
-- Uncomment and modify as needed
/*
CREATE OR REPLACE FUNCTION rollback_update_artwork_assets_storage_limit()
RETURNS void AS $$
BEGIN
    UPDATE storage.buckets
    SET file_size_limit = 5242880  -- Revert to 5MB in bytes
    WHERE id = 'artwork_assets';
END;
$$ LANGUAGE plpgsql;
*/

COMMIT;

-- End of migration