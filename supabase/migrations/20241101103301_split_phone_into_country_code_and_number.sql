-- Migration: split_phone_into_country_code_and_number
-- Created at: 2024-11-01 17:33:01
-- Description: Splits the phone column into phone_country_code and phone_number

BEGIN;

-- Step 1: Add new columns
ALTER TABLE public.user_infos
ADD COLUMN phone_country_code TEXT DEFAULT '84',
ADD COLUMN phone_number TEXT,
ADD COLUMN phone_country_alpha3 CHAR(3) DEFAULT 'VNM';

ALTER TABLE public.event_registrations
ADD COLUMN phone_country_code TEXT DEFAULT '84',
ADD COLUMN phone_number TEXT,
ADD COLUMN phone_country_alpha3 CHAR(3) DEFAULT 'VNM';

-- Step 2: Migrate existing data
UPDATE public.user_infos
SET 
    phone_country_code = REGEXP_REPLACE(phone, '^\+(\d+).*$', '\1'),
    phone_number = REGEXP_REPLACE(phone, '^\+\d+(.*)$', '\1')
WHERE phone IS NOT NULL;

UPDATE public.event_registrations
SET 
    phone_country_code = REGEXP_REPLACE(phone, '^\+(\d+).*$', '\1'),
    phone_number = REGEXP_REPLACE(phone, '^\+\d+(.*)$', '\1')
WHERE phone IS NOT NULL;

-- Step 3: Add comments to the new columns
COMMENT ON COLUMN public.user_infos.phone_country_code IS 'Country calling code (without + prefix)';
COMMENT ON COLUMN public.user_infos.phone_number IS 'Phone number without country code';
COMMENT ON COLUMN public.user_infos.phone_country_alpha3 IS 'ISO 3166-1 alpha-3 country code for the phone number';

COMMENT ON COLUMN public.event_registrations.phone_country_code IS 'Country calling code (without + prefix)';
COMMENT ON COLUMN public.event_registrations.phone_number IS 'Phone number without country code';
COMMENT ON COLUMN public.event_registrations.phone_country_alpha3 IS 'ISO 3166-1 alpha-3 country code for the phone number';

-- Verification (updated to include event_registrations table)
DO $$
BEGIN
    -- Check if the new columns exist in both tables
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
            AND table_name = 'user_infos'
            AND column_name IN ('phone_country_code', 'phone_number')
    ) OR NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
            AND table_name = 'event_registrations'
            AND column_name IN ('phone_country_code', 'phone_number')
    ) THEN
        RAISE EXCEPTION 'New phone columns do not exist in tables';
    END IF;

    -- Verify data migration for both tables
    IF EXISTS (
        SELECT 1
        FROM public.user_infos
        WHERE phone IS NOT NULL 
        AND (phone_country_code IS NULL OR phone_number IS NULL)
    ) OR EXISTS (
        SELECT 1
        FROM public.event_registrations
        WHERE phone IS NOT NULL 
        AND (phone_country_code IS NULL OR phone_number IS NULL)
    ) THEN
        RAISE EXCEPTION 'Some phone numbers were not correctly split';
    END IF;
END $$;

-- Step 4: Drop old column (optional - you might want to keep it temporarily)
-- ALTER TABLE public.user_infos DROP COLUMN phone;
-- ALTER TABLE public.event_registrations DROP COLUMN phone;

-- Rollback function (updated to include event_registrations table)
/*
CREATE OR REPLACE FUNCTION rollback_split_phone_into_country_code_and_number()
RETURNS void AS $$
BEGIN
    ALTER TABLE public.user_infos DROP COLUMN IF EXISTS phone_country_code;
    ALTER TABLE public.user_infos DROP COLUMN IF EXISTS phone_number;
    ALTER TABLE public.user_infos DROP COLUMN IF EXISTS phone_country_alpha3;
    
    ALTER TABLE public.event_registrations DROP COLUMN IF EXISTS phone_country_code;
    ALTER TABLE public.event_registrations DROP COLUMN IF EXISTS phone_number;
    ALTER TABLE public.event_registrations DROP COLUMN IF EXISTS phone_country_alpha3;
END;
$$ LANGUAGE plpgsql;
*/

COMMIT;

-- End of migration