-- Migration: create_artworks_and_related_tables
-- Created at: 2024-03-14 10:00:00
-- Description: Creates tables for artworks, artwork_credits, artwork_events, and artwork_assets

-- Author: Loc Nguyen <vinhloc30796@gmail.com>
-- Ticket: WEB-74 @ Linear

BEGIN;

-- Create artworks table
CREATE TABLE public.artworks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    title TEXT NOT NULL,
    description TEXT,
    max_assets INTEGER NOT NULL DEFAULT 5
);

-- Comments for the artworks table
COMMENT ON TABLE public.artworks IS 'Stores information about individual artworks';
-- and its columns
COMMENT ON COLUMN public.artworks.id IS 'The unique identifier for the artwork';
COMMENT ON COLUMN public.artworks.created_at IS 'The timestamp when the artwork was created';
COMMENT ON COLUMN public.artworks.title IS 'The title of the artwork';
COMMENT ON COLUMN public.artworks.description IS 'The description of the artwork';
COMMENT ON COLUMN public.artworks.max_assets IS 'The maximum number of assets allowed for this artwork';

-- Indexing the artworks table
CREATE INDEX idx_artworks_title ON public.artworks(title);
-- Free text index for the title & description
CREATE INDEX idx_artworks_fts ON public.artworks USING GIN (to_tsvector('english', title || ' ' || coalesce(description, '')));

-- Create artwork_credits table for the one-to-many relationship with auth.users
CREATE TABLE public.artwork_credits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    artwork_id UUID NOT NULL REFERENCES public.artworks(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT,
    UNIQUE(artwork_id, user_id)
);

-- Comments for the artwork_credits table
COMMENT ON TABLE public.artwork_credits IS 'Links artworks to users credited for creating them';
-- and its columns
COMMENT ON COLUMN public.artwork_credits.id IS 'The unique identifier for the artwork credit';
COMMENT ON COLUMN public.artwork_credits.artwork_id IS 'The ID of the artwork that the credit is for';
COMMENT ON COLUMN public.artwork_credits.user_id IS 'The ID of the user credited for creating the artwork';
COMMENT ON COLUMN public.artwork_credits.role IS 'The role of the user in the creation of the artwork';

-- Indexing the artwork_credits table
CREATE INDEX idx_artwork_credits_artwork_id ON public.artwork_credits(artwork_id);
CREATE INDEX idx_artwork_credits_user_id ON public.artwork_credits(user_id);

-- Create artwork_events table for the many-to-many relationship
CREATE TABLE public.artwork_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    artwork_id UUID NOT NULL REFERENCES public.artworks(id) ON DELETE CASCADE,
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    UNIQUE(artwork_id, event_id)
);

-- Comments for the artwork_events table
COMMENT ON TABLE public.artwork_events IS 'Links artworks to events where they are showcased';
-- and its columns
COMMENT ON COLUMN public.artwork_events.id IS 'The unique identifier for the artwork event';
COMMENT ON COLUMN public.artwork_events.artwork_id IS 'The ID of the artwork that the event is for';
COMMENT ON COLUMN public.artwork_events.event_id IS 'The ID of the event where the artwork is showcased';

-- Indexing the artwork_events table
CREATE INDEX idx_artwork_events_artwork_id ON public.artwork_events(artwork_id);
CREATE INDEX idx_artwork_events_event_id ON public.artwork_events(event_id);

-- Create the asset_type enum
CREATE TYPE public.asset_type AS ENUM ('image', 'video', 'audio', 'font');

-- Create artwork_assets table for multiple media assets per artwork
CREATE TABLE public.artwork_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    artwork_id UUID NOT NULL REFERENCES public.artworks(id) ON DELETE CASCADE,
    file_path TEXT NOT NULL,
    description TEXT,
    asset_type public.asset_type NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    bucket_id TEXT NOT NULL DEFAULT 'artwork_assets',
    CONSTRAINT fk_artwork_assets_bucket FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id)
);

-- Comments for the artwork_assets table
COMMENT ON TABLE public.artwork_assets IS 'Stores media assets associated with artworks';
-- and its columns
COMMENT ON COLUMN public.artwork_assets.id IS 'The unique identifier for the artwork asset';
COMMENT ON COLUMN public.artwork_assets.artwork_id IS 'The ID of the artwork that the asset is for';
COMMENT ON COLUMN public.artwork_assets.file_path IS 'The path to the file containing the asset';
COMMENT ON COLUMN public.artwork_assets.description IS 'The description of the asset';
COMMENT ON COLUMN public.artwork_assets.asset_type IS 'The type of asset';
COMMENT ON COLUMN public.artwork_assets.created_at IS 'The timestamp when the asset was created';
COMMENT ON COLUMN public.artwork_assets.bucket_id IS 'The ID of the storage bucket containing the asset';
-- and the enum
COMMENT ON TYPE public.asset_type IS 'The type of asset';

-- Create indexes for the artwork_assets table
CREATE INDEX idx_artwork_assets_artwork_id ON public.artwork_assets(artwork_id);
-- Free text index for the file_path & description
CREATE INDEX idx_artwork_assets_fts ON public.artwork_assets USING GIN (to_tsvector('english', file_path || ' ' || coalesce(description, '')));

-- Create a storage bucket for artwork assets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'artwork_assets',
    'artwork_assets',
    -- Public buckets are more performant than private buckets since they are cached differently.
    true, 
    -- 5MB in bytes, because Supabase free tier includes 1GB of storage total
    -- 5MB gives us a total of 1GB / 5MB = 200 assets -> 40 artworks (at 5 assets/artwork)
    5242880, 
    ARRAY['image/*', 'video/*', 'audio/*', 'font/*']::text[]
);

/* Rationale: asset quality at 50MB size (5MB is a 10x reduction)
1. Images (image/):

Static images:
- PNG: Max dimensions ~16,000 x 16,000 pixels (depends on color depth)
- JPEG: Max dimensions ~30,000 x 30,000 pixels (at high quality)
- WebP: Max dimensions 16,383 x 16,383 pixels
- SVG: Theoretically unlimited size (depends on complexity, not dimensions)

Animated images:
- GIF: Max dimensions ~10,000 x 10,000 pixels (depends on frame count)

2. Videos (video/):

For a 50MB file:
- MP4 (H.264):
  Resolution: Up to 1080p (1920x1080)
  Length: 2-3 minutes (good quality), 5-7 minutes (medium quality)
- WebM (VP9):
  Resolution: Up to 1080p (1920x1080)
  Length: 3-4 minutes (good quality), 6-8 minutes (medium quality)
- MPEG, Ogg, 3GPP2: Similar to MP4, varies with specific codecs

3. Audio (audio/):

For a 50MB file:
- AAC:
  Bitrate: 256 kbps (high quality)
  Length: ~26 minutes
- WAV (uncompressed):
  Quality: 16-bit, 44.1 kHz (CD quality)
  Length: ~5 minutes
- MIDI: Potentially hours (depends on complexity)
- WebM (audio): Similar to AAC, depends on specific audio codec

Note: These are approximate values and can vary based on encoding settings and content complexity.
*/

-- Verification
DO $$
BEGIN 
    -- Check if the tables exist
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = 'public'
            AND table_name = 'artworks'
    ) THEN
        RAISE EXCEPTION 'Table "artworks" does not exist';
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = 'public'
            AND table_name = 'artwork_assets'
    ) THEN
        RAISE EXCEPTION 'Table "artwork_assets" does not exist';
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = 'public'
            AND table_name = 'artwork_events'
    ) THEN
        RAISE EXCEPTION 'Table "artwork_events" does not exist';
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = 'public'
            AND table_name = 'artwork_credits'
    ) THEN
        RAISE EXCEPTION 'Table "artwork_credits" does not exist';
    END IF;
    
    -- Check if the bucket exists
    IF NOT EXISTS (
        SELECT 1
        FROM storage.buckets
        WHERE id = 'artwork_assets'
    ) THEN
        RAISE EXCEPTION 'Bucket "artwork_assets" does not exist';
    END IF;
END $$;

-- Rollback function (if supported by your migration tool)
-- Uncomment and modify as needed
/*
CREATE OR REPLACE FUNCTION rollback_create_artworks_and_related_tables()
RETURNS void AS $$
BEGIN
    DROP TABLE IF EXISTS public.artwork_assets;
    DROP TABLE IF EXISTS public.artwork_events;
    DROP TABLE IF EXISTS public.artwork_credits;
    DROP TABLE IF EXISTS public.artworks;
    -- Note: We're not dropping the events table as it might be used elsewhere
END;
$$ LANGUAGE plpgsql;
*/

COMMIT;

-- End of migration