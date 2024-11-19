-- Migration: add_contacts_table
-- Created at: 2024-09-20 00:00:00
-- Description: Adds a contacts table for users to maintain their contact book

BEGIN;

-- Step 1: Create the contacts table
CREATE TABLE public.contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    contact_id UUID NOT NULL
        CONSTRAINT contact_id_cannot_be_user_id
        CHECK (contact_id != user_id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
    FOREIGN KEY (contact_id) REFERENCES auth.users(id) ON DELETE CASCADE,
    UNIQUE (user_id, contact_id)
);

-- Step 2: Add an index for improved query performance
CREATE INDEX idx_contacts_user_id ON public.contacts(user_id);
CREATE INDEX idx_contacts_contact_id ON public.contacts(contact_id);

-- Step 3: Add table and column comments
COMMENT ON TABLE public.contacts IS 'Stores user contacts for the contact book feature';
COMMENT ON COLUMN public.contacts.user_id IS 'The ID of the user who added the contact';
COMMENT ON COLUMN public.contacts.contact_id IS 'The ID of the user added as a contact';

-- Verification
DO $$
BEGIN
    -- Check if the contacts table exists
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'contacts'
    ) THEN
        RAISE EXCEPTION 'Table "contacts" does not exist';
    END IF;

    -- Check if the index exists
    IF NOT EXISTS (
        SELECT 1
        FROM pg_indexes
        WHERE schemaname = 'public'
        AND tablename = 'contacts'
        AND indexname = 'idx_contacts_user_id'
    ) THEN
        RAISE EXCEPTION 'Index "idx_contacts_user_id" does not exist';
    END IF;
END $$;

-- Rollback function (if needed)
/*
CREATE OR REPLACE FUNCTION rollback_add_contacts_table()
RETURNS void AS $$
BEGIN
    DROP TABLE IF EXISTS public.contacts;
    DROP FUNCTION IF EXISTS prevent_self_contact();
END;
$$ LANGUAGE plpgsql;
*/

COMMIT;

-- End of migration
