-- Add localized summary JSONB projection for events
-- Idempotent: uses IF NOT EXISTS

ALTER TABLE public.events
ADD COLUMN IF NOT EXISTS summary_i18n jsonb;

-- Optional: comment for clarity in the DB
COMMENT ON COLUMN public.events.summary_i18n IS 'Localized summary projection (e.g., {"en": "...", "vi": "..."})';


