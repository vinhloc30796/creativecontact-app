-- Add special notes column to event_slots
ALTER TABLE event_slots
ADD COLUMN special_notes TEXT;

-- Add column comment
COMMENT ON COLUMN event_slots.special_notes IS 'Additional information or instructions for this event slot';