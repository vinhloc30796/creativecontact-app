-- Migration: add_unique_constraint_to_event_slug
-- Created at: 2024-08-29 16:04:15
-- Description: Adds a unique constraint to the slug column in the events table

-- Author: Loc Nguyen <vinhloc30796@gmail.com>
-- Ticket: WEB-75 @ Linear

BEGIN;

-- Add unique constraint to the slug column
ALTER TABLE public.events
ADD CONSTRAINT events_slug_key UNIQUE (slug);

-- Add a comment to explain the constraint
COMMENT ON CONSTRAINT events_slug_key ON public.events IS 'Ensures each event has a unique slug for use in URLs';

-- Verification
DO $$
BEGIN 
    -- Check if the unique constraint exists
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.table_constraints
        WHERE constraint_schema = 'public'
            AND table_name = 'events'
            AND constraint_name = 'events_slug_key'
            AND constraint_type = 'UNIQUE'
    ) THEN
        RAISE EXCEPTION 'Unique constraint "events_slug_key" does not exist on table "events"';
    END IF;
END $$;

-- Rollback function (if supported by your migration tool)
-- Uncomment and modify as needed
/*
CREATE OR REPLACE FUNCTION rollback_add_unique_constraint_to_event_slug()
RETURNS void AS $$
BEGIN
    ALTER TABLE public.events DROP CONSTRAINT IF EXISTS events_slug_key;
END;
$$ LANGUAGE plpgsql;
*/

COMMIT;

-- End of migration