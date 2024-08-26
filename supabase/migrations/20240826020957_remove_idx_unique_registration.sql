-- Migration: drop_idx_unique_registration
-- Created at: 2024-08-26 02:00:00
-- Description: Drops the idx_unique_registration index from the event_registrations table

-- Author: Loc Nguyen <vinhloc30796@gmail.com>
-- Ticket: WEB-66 @ Linear

BEGIN;

-- Drop the existing unique index
DROP INDEX IF EXISTS public.idx_unique_registration;

-- Verification
DO $$
BEGIN 
    IF EXISTS (
        SELECT 1
        FROM pg_indexes
        WHERE schemaname = 'public'
            AND tablename = 'event_registrations'
            AND indexname = 'idx_unique_registration'
    ) THEN
        RAISE EXCEPTION 'Index idx_unique_registration still exists on event_registrations table';
    END IF;
END $$;

-- Rollback function (if supported by your migration tool)
-- Uncomment and modify as needed
/*
CREATE OR REPLACE FUNCTION rollback_drop_idx_unique_registration()
RETURNS void AS $$
BEGIN
    CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_registration 
    ON public.event_registrations USING btree (created_by, slot);
END;
$$ LANGUAGE plpgsql;
*/

COMMIT;

-- End of migration
