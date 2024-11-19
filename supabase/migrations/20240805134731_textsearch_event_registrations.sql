ALTER TABLE event_registrations
ADD COLUMN search_column tsvector
GENERATED ALWAYS AS (
  to_tsvector('english', coalesce(name, '') || ' ' || coalesce(email, '') || ' ' || coalesce(phone, ''))
) STORED;

CREATE INDEX search_column_idx ON event_registrations USING GIN (search_column);
