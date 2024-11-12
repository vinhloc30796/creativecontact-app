-- Migration: add_time_end_column_to_events_table
-- Created at: 2024-11-12 17:18:36
-- Description: Adds a time_end column to the public.events table

BEGIN;

  -- Step 1: Add new column
  ALTER TABLE public.events
  ADD COLUMN time_end TIMESTAMPTZ;
  
  -- Step 2: Add comment to the new column
  COMMENT ON COLUMN public.events.time_end IS 'End time of the event';

  -- Step 3: Add value now for all events
  UPDATE public.events
  SET time_end = now();
  
  -- Step 3.1: time end of trungthu-archive-2024 is Oct 1st, 20Ã
  UPDATE public.events
  SET time_end = '2024-10-01 00:00:00'
  WHERE id= '9419ee07-81ed-4114-8143-1fff084d019a';
  
  -- Step 4: constraints not null
  ALTER TABLE public.events
  ALTER COLUMN time_end SET NOT NULL;

  -- Note: index to be added later

  -- Verification
  DO $$
  BEGIN
      -- Check if the new column exists
      IF NOT EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_schema = 'public'
              AND table_name = 'events'
              AND column_name = 'time_end'
      ) THEN
          RAISE EXCEPTION 'Column "time_end" does not exist in table "events"';
      END IF;
  END $$;

  -- Rollback function (if supported by your migration tool)
  /* DO $$
  BEGIN
      ALTER TABLE public.events DROP COLUMN time_end;
  END $$; */ 
COMMIT;

-- End of migration