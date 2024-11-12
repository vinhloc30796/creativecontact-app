-- Migration: add_portfolio_artworks
-- Created at: 2024-11-08 13:56:33
-- Description: Adds the portfolio_artworks table

BEGIN;

CREATE TABLE portfolio_artworks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    artwork_id UUID NOT NULL REFERENCES artworks(id) ON DELETE CASCADE,
    display_order INTEGER NOT NULL DEFAULT 0,
    is_highlighted BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    
    -- For each user, the artwork_id must be unique
    UNIQUE(user_id, artwork_id),
    -- For each user, the display_order must be unique
    UNIQUE(user_id, display_order)
);

-- Add comments to the columns
COMMENT ON COLUMN portfolio_artworks.display_order IS 'The order of the artwork in the portfolio';
COMMENT ON COLUMN portfolio_artworks.is_highlighted IS 'Whether the artwork is highlighted in the portfolio';

-- Add indexes
CREATE INDEX idx_portfolio_artworks_user_id ON portfolio_artworks(user_id);
CREATE INDEX idx_portfolio_artworks_artwork_id ON portfolio_artworks(artwork_id);
-- For each user, there must be at most 1 highlighted artwork
CREATE UNIQUE INDEX idx_portfolio_artworks_user_id_highlighted ON portfolio_artworks(user_id) WHERE is_highlighted = true;

-- Add function for updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger for portfolio_artworks.updated_at
CREATE TRIGGER update_portfolio_artworks_updated_at
    BEFORE UPDATE ON portfolio_artworks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- Verification
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_name = 'portfolio_artworks'
    ) THEN
        RAISE EXCEPTION 'Table "portfolio_artworks" was not created';
    END IF;
END $$;

-- Rollback function
-- CREATE OR REPLACE FUNCTION rollback_add_portfolio_artworks()
-- RETURNS void AS $$
-- BEGIN
--     DROP TABLE portfolio_artworks;
-- END;
-- $$ LANGUAGE plpgsql;

COMMIT;

-- End of migration