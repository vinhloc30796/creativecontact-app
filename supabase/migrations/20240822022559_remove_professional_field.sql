-- Migration: remove_user_infos_field_column
-- Created at: 2024-08-22 14:30:00
-- Description: Removes the 'field' column from the user_infos table

-- Author: Loc Nguyen <vinhloc30796@gmail.com>
-- Ticket: WEB-57 @ Linear

-- Remove user_infos.field column, result:
-- postgres=> \d user_infos
--                     Table "public.user_infos"
--     Column    |       Type       | Collation | Nullable | Default 
-- --------------+------------------+-----------+----------+---------
--  id           | uuid             |           | not null | 
--  display_name | text             |           |          | 
--  location     | text             |           |          | 
--  occupation   | text             |           |          | 
--  about        | text             |           |          | 
--  industries   | industry[]       |           |          | 
--  experience   | experience_level |           |          | 
-- Indexes:
--     "user_infos_pkey" PRIMARY KEY, btree (id)
--     "idx_user_infos_industries" gin (industries)
-- Foreign-key constraints:
--     "user_infos_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id)
-- Policies (row security enabled): (none)

BEGIN;

-- Remove the 'field' column from user_infos table
ALTER TABLE public.user_infos DROP COLUMN field;

-- Verification
DO $$
BEGIN 
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
            AND table_name = 'user_infos'
            AND column_name = 'field'
    ) THEN
        RAISE EXCEPTION 'Column "field" still exists in user_infos table';
    END IF;
END $$;

-- Rollback function (if supported by your migration tool)
-- Uncomment and modify as needed
/*
CREATE OR REPLACE FUNCTION rollback_remove_user_infos_field_column()
RETURNS void AS $$
BEGIN
    ALTER TABLE public.user_infos ADD COLUMN field text;
END;
$$ LANGUAGE plpgsql;
*/

COMMIT;

-- End of migration
