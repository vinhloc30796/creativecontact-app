-- Migration: connect_industry_and_seniority
-- Created at: 2024-11-23 04:46:55
-- Description: Creates a new table to track user experience levels per industry

BEGIN;

-- First, create the new table to track user experience per industry
CREATE TABLE user_industry_experience (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES user_infos(id) ON DELETE CASCADE,
    industry industry NOT NULL,
    experience_level experience_level NOT NULL,
    UNIQUE(user_id, industry)
);

COMMENT ON TABLE user_industry_experience IS 'Tracks user experience levels per industry';
COMMENT ON COLUMN user_industry_experience.user_id IS 'The ID of the user';
COMMENT ON COLUMN user_industry_experience.industry IS 'The industry the user has experience in';
COMMENT ON COLUMN user_industry_experience.experience_level IS 'The experience level of the user in the industry';

-- Create index for faster lookups
CREATE INDEX idx_user_industry_experience_user_id ON user_industry_experience(user_id);

-- Then, copy existing industry and experience data to the new table,
-- assuming that the experience level is the same for all industries
-- knowing that industries is an array; and experience is a single value (use unnest)
INSERT INTO user_industry_experience (user_id, industry, experience_level)
SELECT id, industry, experience FROM user_infos, unnest(industries) AS industry;


-- Finally, remove existing industry and experience columns from user_infos
ALTER TABLE user_infos 
DROP COLUMN IF EXISTS industries,
DROP COLUMN IF EXISTS experience;

-- Verification
DO $$
BEGIN
    -- Check if the user_industry_experience table exists
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_name = 'user_industry_experience'
    ) THEN
        RAISE EXCEPTION 'Table "user_industry_experience" was not created';
    END IF;

    -- Check if the required columns exist
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'user_industry_experience'
          AND column_name IN ('id', 'user_id', 'industry', 'experience_level', 'years_of_experience')
    ) THEN
        RAISE EXCEPTION 'Required columns are missing in user_industry_experience table';
    END IF;
END $$;

COMMIT;
