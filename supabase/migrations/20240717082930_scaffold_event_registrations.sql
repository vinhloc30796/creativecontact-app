-- Events Table
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    date DATE,
    checkin_token VARCHAR(64),
    checkin_token_expiration TIMESTAMP
);

CREATE INDEX idx_event_date ON events(date);
CREATE INDEX idx_checkin_token ON events(checkin_token);

COMMENT ON TABLE events IS 'Stores information about individual events, including check-in tokens';
COMMENT ON COLUMN events.checkin_token IS 'Unique token for event check-in, typically embedded in a QR code';
COMMENT ON COLUMN events.checkin_token_expiration IS 'Expiration timestamp for the check-in token';

-- Time Slots Table
CREATE TABLE time_slots (
    id SERIAL PRIMARY KEY,
    event_id INT,
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    capacity INT,
    FOREIGN KEY (event_id) REFERENCES events(id)
);

CREATE INDEX idx_time_slots_event_id ON time_slots(event_id);
CREATE INDEX idx_time_slots_start_time ON time_slots(start_time);

COMMENT ON TABLE time_slots IS 'Defines specific time slots for events, including capacity limits';

-- Users Table
-- ENUMs
CREATE TYPE creative_job_type AS ENUM ('designer', 'copywriter', 'planner', 'advertiser', 'art_director', 'creative_director', 'content_creator', 'illustrator');
COMMENT ON TYPE creative_job_type IS 'Enumeration of possible creative job roles';

CREATE TYPE creative_side_type AS ENUM ('agency', 'in-house', 'freelance');
COMMENT ON TYPE creative_side_type IS 'Enumeration of possible work environments in the creative industry';

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255),
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255),
    phone_country VARCHAR(2),
    phone_number VARCHAR(20),
    creative_job creative_job_type,
    creative_side creative_side_type
);

CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_phone ON users(phone_country, phone_number);

COMMENT ON TABLE users IS 'Stores user account information, including contact details and professional information';
COMMENT ON COLUMN users.first_name IS 'User''s first name (required)';
COMMENT ON COLUMN users.last_name IS 'User''s last name (optional)';
COMMENT ON COLUMN users.phone_country IS 'Two-letter country code (ISO 3166-1 alpha-2) for the user''s phone number';
COMMENT ON COLUMN users.phone_number IS 'User''s phone number. Recommended to store in E.164 format for consistency';
COMMENT ON COLUMN users.creative_job IS 'User''s primary creative role or job title';
COMMENT ON COLUMN users.creative_side IS 'User''s primary work environment or employment type in the creative industry';

-- Event User Slots Table
CREATE TABLE event_user_slots (
    event_id INT,
    user_id INT,
    time_slot_id INT,
    check_in_time TIMESTAMP,
    PRIMARY KEY (event_id, user_id, time_slot_id),
    FOREIGN KEY (event_id) REFERENCES events(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (time_slot_id) REFERENCES time_slots(id)
);

CREATE INDEX idx_event_user_slots_user_id ON event_user_slots(user_id);
CREATE INDEX idx_event_user_slots_time_slot_id ON event_user_slots(time_slot_id);
CREATE INDEX idx_event_user_slots_check_in_time ON event_user_slots(check_in_time);

COMMENT ON TABLE event_user_slots IS 'Links users to specific time slots for events, representing registrations and check-ins';
COMMENT ON COLUMN event_user_slots.check_in_time IS 'Timestamp of user check-in, NULL if not checked in yet';