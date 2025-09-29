-- Migration: Add created_at to existing artwork_events table (idempotent)

BEGIN;

-- Ensure gen_random_uuid is available
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Add created_at column to existing table
ALTER TABLE public.artwork_events
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT now();

-- Ensure uniqueness/indexes exist (safe if already created in prior migration)
CREATE UNIQUE INDEX IF NOT EXISTS artwork_events_artwork_id_event_id_key
  ON public.artwork_events(artwork_id, event_id);

CREATE INDEX IF NOT EXISTS idx_artwork_events_artwork_id
  ON public.artwork_events(artwork_id);

CREATE INDEX IF NOT EXISTS idx_artwork_events_event_id
  ON public.artwork_events(event_id);

COMMIT;

