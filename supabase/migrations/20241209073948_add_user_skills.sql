CREATE TABLE user_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.user_infos(id) ON DELETE CASCADE
);

-- Comments for the user_skills table
COMMENT ON TABLE user_skills IS 'Links users to their skills';
-- and its columns
COMMENT ON COLUMN user_skills.id IS 'The unique identifier for the user skill';
COMMENT ON COLUMN user_skills.skill_id IS 'The ID of the skill';
COMMENT ON COLUMN user_skills.user_id IS 'The ID of the user who has the skill';

-- Indexing the user_skills table
CREATE INDEX idx_user_skills_skill_id ON public.user_skills(skill_id);
CREATE INDEX idx_user_skills_user_id ON public.user_skills(user_id);