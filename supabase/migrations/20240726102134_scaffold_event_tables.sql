-- Create the events table and its indexes
CREATE TABLE events (
    id UUID PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL,
    name VARCHAR NOT NULL,
    slug VARCHAR NOT NULL,
    created_by UUID NOT NULL
);

CREATE INDEX idx_events_slug ON events(slug);

-- Add table comment
COMMENT ON TABLE events IS 'Stores information about individual events';

-- Add column comments
COMMENT ON COLUMN events.id IS 'Unique identifier for each event';
COMMENT ON COLUMN events.created_at IS 'Timestamp when the event was created';
COMMENT ON COLUMN events.name IS 'Full name or title of the event';
COMMENT ON COLUMN events.slug IS 'URL-friendly version of the event name for use in web addresses';
COMMENT ON COLUMN events.created_by IS 'UUID of the user who created this event';

-- Create the event_slots table and its indexes
CREATE TABLE event_slots (
    id UUID PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL,
    event UUID NOT NULL,
    time_start TIMESTAMPTZ NOT NULL,
    time_end TIMESTAMPTZ NOT NULL,
    capacity NUMERIC NOT NULL,
    FOREIGN KEY (event) REFERENCES events(id)
);

CREATE INDEX idx_event_slots_event ON event_slots(event);
CREATE INDEX idx_event_slots_time_start ON event_slots(time_start);

-- Add table comment
COMMENT ON TABLE event_slots IS 'Stores information about individual time slots for events, including capacity';

-- Add column comments
COMMENT ON COLUMN event_slots.id IS 'Unique identifier for each event slot';
COMMENT ON COLUMN event_slots.created_at IS 'Timestamp when the event slot was created';
COMMENT ON COLUMN event_slots.event IS 'Reference to the event this slot belongs to';
COMMENT ON COLUMN event_slots.time_start IS 'Start time of the event slot';
COMMENT ON COLUMN event_slots.time_end IS 'End time of the event slot';
COMMENT ON COLUMN event_slots.capacity IS 'Maximum number of attendees for this slot';

-- Create the event_registrations table and its indexes
-- Enums
CREATE TYPE registration_status AS ENUM ('pending', 'confirmed', 'checked-in', 'cancelled');
CREATE TABLE event_registrations (
    id UUID PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL,
    created_by UUID NOT NULL,
    status registration_status NOT NULL DEFAULT 'pending'::registration_status,
    signature TEXT,
    slot UUID NOT NULL,
    FOREIGN KEY (slot) REFERENCES event_slots(id)
);

CREATE INDEX idx_event_registrations_slot ON event_registrations(slot);
CREATE INDEX idx_event_registrations_created_by ON event_registrations(created_by);
CREATE UNIQUE INDEX idx_unique_registration ON event_registrations(created_by, slot);

-- Add table comment
COMMENT ON TABLE event_registrations IS 'Stores information about user registrations for event slots';

-- Add column comments
COMMENT ON COLUMN event_registrations.id IS 'Unique identifier for each event registration';
COMMENT ON COLUMN event_registrations.created_at IS 'Timestamp when the registration was created';
COMMENT ON COLUMN event_registrations.created_by IS 'UUID of the user who created this registration';
COMMENT ON COLUMN event_registrations.status IS 'Current status of the registration (pending, confirmed, checked-in, or cancelled)';
COMMENT ON COLUMN event_registrations.signature IS 'Optional field for storing a digital signature or consent confirmation';
COMMENT ON COLUMN event_registrations.slot IS 'Reference to the event slot this registration is for';

-- Comment on the foreign key constraint
COMMENT ON CONSTRAINT event_registrations_slot_fkey ON event_registrations IS 'Ensures each registration is associated with a valid event slot';