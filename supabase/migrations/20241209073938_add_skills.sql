-- Create skills table
CREATE TABLE skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    skill_name VARCHAR(255) UNIQUE NOT NULL,
    number_of_people INT DEFAULT 0
);

-- Comments for the skills table
COMMENT ON TABLE skills IS 'Stores information about skills and the number of people who have them';
-- and its columns
COMMENT ON COLUMN skills.id IS 'The unique identifier for the skill';
COMMENT ON COLUMN skills.skill_name IS 'The name of the skill';
COMMENT ON COLUMN skills.number_of_people IS 'The number of people who have this skill';

-- Indexing the skills table
CREATE INDEX idx_skills_skill_name ON public.skills(skill_name);

BEGIN;

-- Insert pre-defined skills
INSERT INTO skills (skill_name) VALUES
('Graphic Design'),
('Photography'),
('Illustration'),
('3D Art'),
('UI/UX'),
('Motion'),
('Architecture'),
('Product Design'),
('Fashion'),
('Advertising'),
('Fine Arts'),
('Crafts'),
('Game Design'),
('Sound'),
('Creative Challenges'),
('Photoshop'),
('Lightroom'),
('Illustrator'),
('InDesign'),
('XD'),
('Premiere Pro'),
('After Effects'),
('Illustrator Draw'),
('Photoshop Sketch'),
('Photoshop Mix'),
('Stock'),
('Dimension'),
('Capture'),
('Substance 3D Designer'),
('Substance 3D Sampler'),
('Substance 3D Stager'),
('Fresco'),
('Aero');

COMMIT;

-- End of migration