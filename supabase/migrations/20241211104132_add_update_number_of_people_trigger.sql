-- Migration: add_update_number_of_people_trigger
-- Description: Adds a trigger to update the number_of_people in the skills table

BEGIN;

-- Create function to update number_of_people
CREATE OR REPLACE FUNCTION update_number_of_people()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.skills
        SET number_of_people = number_of_people + 1
        WHERE id = NEW.skill_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.skills
        SET number_of_people = number_of_people - 1
        WHERE id = OLD.skill_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to call the function on insert and delete
CREATE TRIGGER user_skills_after_insert_delete
AFTER INSERT OR DELETE ON public.user_skills
FOR EACH ROW EXECUTE FUNCTION update_number_of_people();

COMMIT;

-- End of migration