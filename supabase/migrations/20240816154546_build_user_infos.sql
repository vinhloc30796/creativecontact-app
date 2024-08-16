-- Migration file: build_user_infos.sql

-- Create industry enum type
CREATE TYPE industry AS ENUM (
  'Advertising',
  'Architecture',
  'Arts and Crafts',
  'Design',
  'Fashion',
  'Film, Video, and Photography',
  'Music',
  'Performing Arts',
  'Publishing',
  'Software and Interactive',
  'Television and Radio',
  'Visual Arts',
  'Other'
);

-- Create experience_level enum type
CREATE TYPE experience_level AS ENUM (
  'Entry',
  'Junior',
  'Mid-level',
  'Senior',
  'Manager',
  'C-level'
);

ALTER TABLE public.user_infos
ADD COLUMN industries industry[] ,
ADD COLUMN experience experience_level,
ADD COLUMN field TEXT;

-- Add comment to the table
COMMENT ON TABLE public.user_infos IS 'User information table, e.g. location, industries, experience level, and field';

-- Add comments to the new columns
COMMENT ON COLUMN public.user_infos.industries IS 'Array of industries the user is associated with';
COMMENT ON COLUMN public.user_infos.experience IS 'User''s experience level';
COMMENT ON COLUMN public.user_infos.field IS 'User''s specific field or area of expertise';

-- Create an index on the industries column for better performance
CREATE INDEX idx_user_infos_industries ON public.user_infos USING GIN (industries);
