-- Step 1: Add foreign key constraint to auth.users table if it doesn't exist
ALTER TABLE event_registrations
ADD CONSTRAINT fk_event_registrations_user
FOREIGN KEY (created_by) REFERENCES auth.users(id);

-- Step 2: Add an index on created_by for improved query performance
CREATE INDEX IF NOT EXISTS idx_event_registrations_created_by ON event_registrations(created_by);

-- Comment on the foreign key constraint
COMMENT ON CONSTRAINT fk_event_registrations_user ON event_registrations IS 'Ensures each registration is associated with a valid user';

-- Step 3: Add a unique constraint to prevent duplicate registrations
ALTER TABLE event_registrations
ADD CONSTRAINT unique_user_slot_registration 
UNIQUE (created_by, slot);

-- Comment on the unique constraint
COMMENT ON CONSTRAINT unique_user_slot_registration ON event_registrations IS 'Ensures each user can only register once for each event slot';

-- Step 4: Create event_registration_logs table
CREATE TABLE event_registration_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_registration_id UUID NOT NULL,
  staff_id UUID NOT NULL,
  status_before registration_status NOT NULL,
  status_after registration_status NOT NULL,
  changed_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  FOREIGN KEY (event_registration_id) REFERENCES event_registrations(id),
  FOREIGN KEY (staff_id) REFERENCES auth.users(id)
);

-- Add an index for improved query performance
CREATE INDEX idx_event_registration_logs_registration_id ON event_registration_logs(event_registration_id);

-- Add table comment
COMMENT ON TABLE event_registration_logs IS 'Tracks changes to event registration statuses';

-- Add column comments
COMMENT ON COLUMN event_registration_logs.event_registration_id IS 'The ID of the event registration being modified';
COMMENT ON COLUMN event_registration_logs.staff_id IS 'The ID of the staff member making the change';
COMMENT ON COLUMN event_registration_logs.status_before IS 'The registration status before the change';
COMMENT ON COLUMN event_registration_logs.status_after IS 'The registration status after the change';
COMMENT ON COLUMN event_registration_logs.changed_at IS 'Timestamp of when the change occurred';
