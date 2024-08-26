-- Migration: update_unique_constraint_user_slot_registration
-- Created at: 2024-08-26 01:56:42
-- Description: Updates the unique constraint on event_registrations table from (created_by, slot) to (email, slot)

-- Author: Loc Nguyen <vinhloc30796@gmail.com>
-- Ticket: WEB-66 @ Linear

BEGIN;

-- Remove the existing unique constraint
ALTER TABLE public.event_registrations
DROP CONSTRAINT IF EXISTS unique_user_slot_registration;

-- Add the new unique constraint
ALTER TABLE public.event_registrations
ADD CONSTRAINT unique_user_slot_registration UNIQUE (email, slot);

-- Verification
DO $$
BEGIN 
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.table_constraints
        WHERE constraint_schema = 'public'
            AND table_name = 'event_registrations'
            AND constraint_name = 'unique_user_slot_registration'
    ) THEN
        RAISE EXCEPTION 'New unique constraint on (email, slot) does not exist in event_registrations table';
    END IF;
END $$;

-- Rollback function (if supported by your migration tool)
-- Uncomment and modify as needed
/*
CREATE OR REPLACE FUNCTION rollback_update_unique_constraint_user_slot_registration()
RETURNS void AS $$
BEGIN
    ALTER TABLE public.event_registrations
    DROP CONSTRAINT IF EXISTS unique_user_slot_registration;
    
    ALTER TABLE public.event_registrations
    ADD CONSTRAINT unique_user_slot_registration UNIQUE (created_by, slot);
END;
$$ LANGUAGE plpgsql;
*/

COMMIT;

-- End of migration