-- Create the events table and its indexes
CREATE TABLE events (
    id UUID PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL,
    name VARCHAR NOT NULL,
    slug VARCHAR NOT NULL,
    created_by UUID NOT NULL
);

CREATE INDEX idx_events_slug ON events(slug);

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