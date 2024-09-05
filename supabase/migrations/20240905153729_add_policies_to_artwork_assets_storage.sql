-- Migration: add_policies_to_artwork_assets_storage
-- Created at: 2024-09-05 02:14:19
-- Description: Adds policies for read and write access to the artwork_assets bucket in storage

-- Author: Loc Nguyen <vinhloc30796@gmail.com>
-- Ticket: WEB-93

BEGIN;

-- Step 1: Create policy for SELECT (read) access
CREATE POLICY "artwork_assets_read_besai6_0" 
ON storage.objects 
FOR SELECT 
TO public 
USING (bucket_id = 'artwork_assets');

-- Step 2: Create policy for INSERT (write) access
CREATE POLICY "artwork_assets_write_besai6_1" 
ON storage.objects 
FOR INSERT 
TO public 
WITH CHECK (bucket_id = 'artwork_assets');

-- Verification
DO $$
BEGIN 
    -- Check if the policies exist
    IF NOT EXISTS (
        SELECT 1
        FROM pg_policies
        WHERE schemaname = 'storage'
          AND tablename = 'objects'
          AND policyname IN ('artwork_assets_read_besai6_0', 'artwork_assets_write_besai6_1')
    ) THEN
        RAISE EXCEPTION 'Policies for artwork_assets were not created successfully';
    END IF;
END $$;

-- Rollback function (if supported by your migration tool)
-- Uncomment and modify as needed
/*
CREATE OR REPLACE FUNCTION rollback_add_policies_to_artwork_assets_storage()
RETURNS void AS $$
BEGIN
    DROP POLICY IF EXISTS "artwork_assets_read_besai6_0" ON storage.objects;
    DROP POLICY IF EXISTS "artwork_assets_write_besai6_1" ON storage.objects;
END;
$$ LANGUAGE plpgsql;
*/

COMMIT;

-- End of migration