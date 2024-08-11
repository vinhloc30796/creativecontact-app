-- Add missing columns to event_registrations table
ALTER TABLE event_registrations
ADD COLUMN name TEXT,
ADD COLUMN email TEXT,
ADD COLUMN phone TEXT,
ADD COLUMN qr_code TEXT;
