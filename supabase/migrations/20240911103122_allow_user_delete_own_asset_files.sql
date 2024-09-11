-- Migration: allow_user_delete_own_asset_files
-- Created at: 2024-09-11 10:31:22
-- Description: Allows authenticated users to delete their own files in the artwork_assets bucket

BEGIN;

-- Create a policy to allow users to delete their own files in the artwork_assets bucket
CREATE POLICY "artwork_assets_delete_owned_besai6_0" 
ON storage.objects 
FOR DELETE 
TO authenticated 
USING (bucket_id = 'artwork_assets' AND owner_id::uuid = auth.uid());

-- Verification
DO $$
BEGIN
    -- Check if the policy has been created
    IF NOT EXISTS (
        SELECT 1
        FROM pg_policies
        WHERE schemaname = 'storage'
          AND tablename = 'objects'
          AND policyname = 'artwork_assets_delete_owned_besai6_0'
    ) THEN
        RAISE EXCEPTION 'Policy "artwork_assets_delete_owned_besai6_0" was not created';
    END IF;
END $$;

-- Rollback function
-- CREATE OR REPLACE FUNCTION rollback_allow_user_delete_own_asset_files()
-- RETURNS void AS $$
-- BEGIN
--     DROP POLICY IF EXISTS "artwork_assets_delete_owned_besai6_0" ON storage.objects;
-- END;
-- $$ LANGUAGE plpgsql;

COMMIT;
