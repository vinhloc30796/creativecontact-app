-- Seed data for users table
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    last_sign_in_at,
    created_at,
    updated_at,
    is_anonymous
) VALUES (
    '00000000-0000-0000-0000-000000000000',  -- instance_id
    '7c37e6b3-5e62-4f76-b67c-0d5a42b92a2d',  -- id
    'authenticated',                         -- aud
    'authenticated',                         -- role
    '2024-07-31 13:29:02.201874+00',         -- last_sign_in_at
    '2024-07-31 13:29:02.199319+00',         -- created_at
    '2024-07-31 13:29:02.204237+00',         -- updated_at
    false                                    -- is_anonymous
);
-- {
--   "instance_id": "00000000-0000-0000-0000-000000000000",
--   "id": "13f60da9-8dd4-42f9-8a57-c0569a158857",
--   "aud": "authenticated",
--   "role": "authenticated",
--   "email": null,
--   "encrypted_password": "",
--   "email_confirmed_at": null,
--   "invited_at": null,
--   "confirmation_token": "",
--   "confirmation_sent_at": null,
--   "recovery_token": "",
--   "recovery_sent_at": null,
--   "email_change_token_new": "",
--   "email_change": "",
--   "email_change_sent_at": null,
--   "last_sign_in_at": "2024-07-31 13:29:02.201874+00",
--   "raw_app_meta_data": {},
--   "raw_user_meta_data": {},
--   "is_super_admin": null,
--   "created_at": "2024-07-31 13:29:02.199319+00",
--   "updated_at": "2024-07-31 13:29:02.204237+00",
--   "phone": null,
--   "phone_confirmed_at": null,
--   "phone_change": "",
--   "phone_change_token": "",
--   "phone_change_sent_at": null,
--   "confirmed_at": null,
--   "email_change_token_current": "",
--   "email_change_confirm_status": 0,
--   "banned_until": null,
--   "reauthentication_token": "",
--   "reauthentication_sent_at": null,
--   "is_sso_user": false,
--   "deleted_at": null,
--   "is_anonymous": true
-- }
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    invited_at,
    confirmation_token,
    confirmation_sent_at,
    recovery_token,
    recovery_sent_at,
    email_change_token_new,
    email_change,
    email_change_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    created_at,
    updated_at,
    phone,
    phone_confirmed_at,
    phone_change,
    phone_change_token,
    phone_change_sent_at,
    email_change_token_current,
    email_change_confirm_status,
    banned_until,
    reauthentication_token,
    reauthentication_sent_at,
    is_sso_user,
    deleted_at,
    is_anonymous
) VALUES (
    '00000000-0000-0000-0000-000000000000',  -- instance_id
    '13f60da9-8dd4-42f9-8a57-c0569a158857',  -- id
    'authenticated',                         -- aud
    'authenticated',                         -- role
    NULL,                                    -- email
    '',                                      -- encrypted_password
    NULL,                                    -- email_confirmed_at
    NULL,                                    -- invited_at
    '',                                      -- confirmation_token
    NULL,                                    -- confirmation_sent_at
    '',                                      -- recovery_token
    NULL,                                    -- recovery_sent_at
    '',                                      -- email_change_token_new
    '',                                      -- email_change
    NULL,                                    -- email_change_sent_at
    '2024-07-31 13:29:02.201874+00',         -- last_sign_in_at
    '{}'::jsonb,                             -- raw_app_meta_data
    '{}'::jsonb,                             -- raw_user_meta_data
    NULL,                                    -- is_super_admin
    '2024-07-31 13:29:02.199319+00',         -- created_at
    '2024-07-31 13:29:02.204237+00',         -- updated_at
    NULL,                                    -- phone
    NULL,                                    -- phone_confirmed_at
    '',                                      -- phone_change
    '',                                      -- phone_change_token
    NULL,                                    -- phone_change_sent_at
    '',                                      -- email_change_token_current
    0,                                       -- email_change_confirm_status
    NULL,                                    -- banned_until
    '',                                      -- reauthentication_token
    NULL,                                    -- reauthentication_sent_at
    false,                                   -- is_sso_user
    NULL,                                    -- deleted_at
    true                                     -- is_anonymous
);


-- Seed data for events table
INSERT INTO events (id, created_at, name, slug, created_by)
VALUES (
    '10177076-f591-49c8-a87d-042ba7aa6345', -- Random UUID
    CURRENT_TIMESTAMP, -- Current timestamp
    'Hoàn Tất 2024',
    'hoantat-2024',
    '7c37e6b3-5e62-4f76-b67c-0d5a42b92a2d' -- Assuming this is a valid user UUID
);

INSERT INTO events (id, created_at, name, slug, created_by)
VALUES (
    '9419ee07-81ed-4114-8143-1fff084d019a', -- Random UUID
    CURRENT_TIMESTAMP, -- Current timestamp
    'Trung Thu Creative Archive 2024',
    'trungthu-archive-2024',
    '7c37e6b3-5e62-4f76-b67c-0d5a42b92a2d' -- Assuming this is a valid user UUID
);

INSERT INTO events (id, created_at, name, slug, created_by)
VALUES (
    '849fb451-1129-4f6a-8daf-9ad32a26c172', -- Random UUID
    CURRENT_TIMESTAMP, -- Current timestamp
    'Early Access 2024',
    'early-access-2024',
    '7c37e6b3-5e62-4f76-b67c-0d5a42b92a2d' -- Assuming this is a valid user UUID
);

-- Static special slot
INSERT INTO event_slots (id, created_at, event, time_start, time_end, capacity, special_notes)
VALUES (
    '29c5f10f-416e-45cd-a13d-3527c69f3474'::uuid,
    CURRENT_TIMESTAMP AT TIME ZONE 'UTC+7',
    '10177076-f591-49c8-a87d-042ba7aa6345'::uuid,
    ((CURRENT_DATE + INTERVAL '7 hours')::timestamptz AT TIME ZONE 'UTC+7')::timestamptz,
    ((CURRENT_DATE + INTERVAL '7 hours' + INTERVAL '1 hour')::timestamptz AT TIME ZONE 'UTC+7')::timestamptz,
    20,
    'My super special event'
);
-- Seed data into the event_slots table
WITH 
slots AS (
    SELECT 
        gen_random_uuid() AS id,
        CURRENT_TIMESTAMP AT TIME ZONE 'UTC+7' AS created_at,
        '10177076-f591-49c8-a87d-042ba7aa6345'::uuid AS event, -- Replace with your event ID
        ((date + MAKE_INTERVAL(HOURS => time))::timestamptz AT TIME ZONE 'UTC+7')::timestamptz AS time_start,
        ((date + MAKE_INTERVAL(HOURS => time + 1))::timestamptz AT TIME ZONE 'UTC+7')::timestamptz AS time_end,
        20 AS capacity, -- Replace with your desired capacity
        NULL AS special_notes
    FROM generate_series(
        CURRENT_DATE + INTERVAL '0 hours',
        CURRENT_DATE + INTERVAL '4 days',
        INTERVAL '1 day'
    ) AS date
    CROSS JOIN generate_series(
        8,
        20,
        1
    ) AS time
)
INSERT INTO event_slots (id, created_at, event, time_start, time_end, capacity, special_notes)
SELECT * FROM slots;

INSERT INTO event_registrations (
    id,
    created_at,
    created_by,
    status,
    signature,
    slot,
    name,
    email,
    phone,
    qr_code
) VALUES (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', -- UUID for id
    CURRENT_TIMESTAMP,                      -- Current timestamp for created_at
    '13f60da9-8dd4-42f9-8a57-c0569a158857', -- UUID for created_by (user id)
    'confirmed',                            -- status
    'John Doe',                             -- signature
    '29c5f10f-416e-45cd-a13d-3527c69f3474', -- UUID for slot
    'Doe John',                             -- name
    'john.doe@example.com',                 -- email
    '+1234567890',                          -- phone
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==' -- qr_code (dummy base64 encoded image)
);

-- Seed artworks table
INSERT INTO artworks (
    id,
    created_at,
    title,
    description
) VALUES (
    'b6f0f651-c954-4c88-8486-2d1d5b0a4b1c',
    CURRENT_TIMESTAMP,
    'Cosmic Harmony',
    'An abstract representation of the universe''s interconnectedness'
);

INSERT INTO artworks (
    id,
    created_at,
    title,
    description
) VALUES (
    '247dbc2a-3d80-49f6-83db-6a6ae3497b2a',
    CURRENT_TIMESTAMP,
    'The Starry Night',
    'A depiction of the night sky with a village and a cypress tree'
);

-- Seed artwork_credits table
INSERT INTO artwork_credits (
    id,
    artwork_id,
    user_id,
    title
) VALUES (
    '92d3899c-5d10-4bb0-be0c-d2f059839b82',
    'b6f0f651-c954-4c88-8486-2d1d5b0a4b1c',
    '13f60da9-8dd4-42f9-8a57-c0569a158857',
    'Uploader'
);

-- Seed artwork_events table
INSERT INTO artwork_events (
    id,
    artwork_id,
    event_id
) VALUES (
    '72ac8c15-c9f2-4faa-b9f9-397e0b35fb92',
    'b6f0f651-c954-4c88-8486-2d1d5b0a4b1c',
    '9419ee07-81ed-4114-8143-1fff084d019a'
), (
    '2bca5406-bab2-4f02-88c9-3153b1b9b6cd',
    '247dbc2a-3d80-49f6-83db-6a6ae3497b2a',
    '9419ee07-81ed-4114-8143-1fff084d019a'
);

-- Seed artwork_assets table
INSERT INTO artwork_assets (
    id,
    artwork_id,
    file_path,
    asset_type,
    created_at,
    bucket_id,
    is_thumbnail
) VALUES (
    '8690f354-c948-4335-b0ba-82bdc2e9ccad',
    'b6f0f651-c954-4c88-8486-2d1d5b0a4b1c',
    'b6f0f651-c954-4c88-8486-2d1d5b0a4b1c/lukewarm._cosmic_harmony_d3c493e9-306e-46a2-86cb-c36a234763da.png',
    'image',
    CURRENT_TIMESTAMP,
    'artwork_assets',
    true
), (
    'ca6e7d44-d402-4cc6-9d36-691e1cfb8d87',
    'b6f0f651-c954-4c88-8486-2d1d5b0a4b1c',
    'b6f0f651-c954-4c88-8486-2d1d5b0a4b1c/lukewarm._cosmic_harmony_d9ed4a30-7a99-44b8-ab97-84b3fcfb099f.png',
    'image',
    CURRENT_TIMESTAMP,
    'artwork_assets',
    false
), (
    '0e950002-4574-405b-9dff-df8fe7a3894d',
    '247dbc2a-3d80-49f6-83db-6a6ae3497b2a',
    '247dbc2a-3d80-49f6-83db-6a6ae3497b2a/lukewarm._the_starry_night_3f67cc86-d07f-4e37-8f4a-c60b4405832c.png',
    'image',
    CURRENT_TIMESTAMP,
    'artwork_assets',
    true
), (
    '07c90874-d851-46cf-9f8b-562e74ff3111',
    '247dbc2a-3d80-49f6-83db-6a6ae3497b2a',
    '247dbc2a-3d80-49f6-83db-6a6ae3497b2a/lukewarm._the_starry_night_18ab7709-6645-4df4-9234-63567bec9fd0.png',
    'image',
    CURRENT_TIMESTAMP,
    'artwork_assets',
    false
);
