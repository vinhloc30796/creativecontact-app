-- Seed data for users table
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    last_sign_in_at,
    created_at,
    updated_at,
    is_anonymous
) VALUES (
    '00000000-0000-0000-0000-000000000000',  -- instance_id
    '7c37e6b3-5e62-4f76-b67c-0d5a42b92a2d',  -- id
    'authenticated',                         -- aud
    'authenticated',                         -- role
    'admin@lukewarm.io',                     -- email
    '2024-07-31 13:29:02.201874+00',         -- last_sign_in_at
    '2024-07-31 13:29:02.199319+00',         -- created_at
    '2024-07-31 13:29:02.204237+00',         -- updated_at
    false                                    -- is_anonymous
);
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
    '00000000-0000-0000-0000-000000000000',                             -- instance_id
    '314f834c-3ff2-4382-bc92-d37cbe2286a8',                             -- id
    'authenticated',                                                    -- aud
    'authenticated',                                                    -- role
    'vinhloc30796@gmail.com',                                           -- email
    '',                                                                 -- encrypted_password
    '2024-07-31 13:29:02.204237+00',                                    -- email_confirmed_at
    NULL,                                                               -- invited_at
    '',                                                                 -- confirmation_token
    '2024-07-31 13:29:02.201874+00',                                    -- confirmation_sent_at
    '',                                                                 -- recovery_token
    NULL,                                                               -- recovery_sent_at
    '',                                                                 -- email_change_token_new
    '',                                                                 -- email_change
    NULL,                                                               -- email_change_sent_at
    '2024-07-31 13:29:02.201874+00',                                    -- last_sign_in_at
    '{"provider": ["email"], "providers": ["email", "github"]}'::jsonb, -- raw_app_meta_data
    '{"type": "user", "email": "vinhloc30796@gmail.com"}'::jsonb,       -- raw_user_meta_data
    NULL,                                                               -- is_super_admin
    '2024-07-31 13:29:02.199319+00',                                    -- created_at
    '2024-07-31 13:29:02.204237+00',                                    -- updated_at
    NULL,                                                               -- phone
    NULL,                                                               -- phone_confirmed_at
    '',                                                                 -- phone_change
    '',                                                                 -- phone_change_token
    NULL,                                                               -- phone_change_sent_at
    '',                                                                 -- email_change_token_current
    0,                                                                  -- email_change_confirm_status
    NULL,                                                               -- banned_until
    '',                                                                 -- reauthentication_token
    NULL,                                                               -- reauthentication_sent_at
    false,                                                              -- is_sso_user
    NULL,                                                               -- deleted_at
    false                                                               -- is_anonymous
);

-- Seed data for user_infos table
INSERT INTO user_infos (
    id,
    first_name,
    last_name,
    display_name,
    phone_country_code,
    phone_number,
    phone_country_alpha3,
    location,
    occupation,
    about,
    industries,
    experience,
    profile_picture,
    instagram_handle,
    facebook_handle
) VALUES (
    '7c37e6b3-5e62-4f76-b67c-0d5a42b92a2d',
    'Admin',
    'User',
    'Admin User',
    '1',
    '2345678901',
    'USA',
    'New York',
    'System Administrator',
    'Experienced creative technologist with a passion for integrating cutting-edge technology into artistic projects and interactive experiences.',
    ARRAY['Software and Interactive', 'Other']::industry[],
    'Senior'::experience_level,
    '7c37e6b3-5e62-4f76-b67c-0d5a42b92a2d/lukewarm._Abstract_expressionism_emerald-powered_river-dwelling_9c99d61d-cd4b-4534-8a4e-ee60d1862ed2.png',
    'admin_insta',
    'admin_fb'
), (
    '13f60da9-8dd4-42f9-8a57-c0569a158857',
    'Regular',
    'User',
    'Regular User',
    '1',
    '9876543210',
    'USA',
    'San Francisco',
    'Software Developer',
    'Passionate software developer with a focus on creative technologies, eager to innovate at the intersection of art and code.',
    ARRAY['Software and Interactive']::industry[],
    'Entry'::experience_level,
    NULL,
    'user_insta',
    'user_fb'
), (
    '314f834c-3ff2-4382-bc92-d37cbe2286a8',
    'Hoang Vinh Loc',
    'Nguyen',
    'Vinh Loc Nguyen',
    '84',
    '1234567890',
    'VNM',
    'Lam Dong, Vietnam',
    'Software Developer',
    'Passionate software developer with a focus on creative technologies, eager to innovate at the intersection of art and code.',
    ARRAY['Software and Interactive']::industry[],
    'Senior'::experience_level,
    '314f834c-3ff2-4382-bc92-d37cbe2286a8/lukewarm._a_river_water-elemental_lion_drawing_power_from_emera_cd875218-db8a-4ab4-afdd-a00a1a6deb49.png',
    'vl307',
    'vl307'
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

INSERT INTO events (id, created_at, name, slug, created_by, time_end)
VALUES (
    '9419ee07-81ed-4114-8143-1fff084d019a', -- Random UUID
    CURRENT_TIMESTAMP, -- Current timestamp
    'Trung Thu Creative Archive 2024',
    'trungthu-archive-2024',
    '7c37e6b3-5e62-4f76-b67c-0d5a42b92a2d', -- Assuming this is a valid user UUID
    '2024-10-01 00:00:00+00' -- Oct 1st, 2024
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
    E'An abstract representation of the universe''s interconnectedness, showcasing the delicate balance between chaos and order. The artwork explores the intricate web of relationships that bind celestial bodies, from the tiniest particles to the grandest galaxies. Through a mesmerizing blend of colors and forms, it invites viewers to contemplate their place in the vast cosmic tapestry.\r\nThe piece draws inspiration from cutting-edge scientific theories, including string theory and quantum entanglement, translating complex concepts into visually stunning imagery. It challenges observers to reconsider their perception of reality, suggesting that everything in the universe is fundamentally connected on a deep, often imperceptible level. By merging art and science, the work aims to spark curiosity and wonder about the nature of existence and our collective journey through the cosmos.'
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
    E'The Starry Night is an iconic painting by the Dutch post-impressionist painter Vincent van Gogh. Created in 1889, it is one of his most famous and recognizable works. The painting depicts a nocturnal landscape with a vivid depiction of the night sky, filled with swirling stars and a bright crescent moon. The central focus of the composition is a small village with a thatched-roof church and a cypress tree, which stands prominently in the foreground. The use of impasto brushstrokes and contrasting colors creates a sense of movement and depth, giving the impression of a dynamic and ever-changing sky. Van Gogh''s expressive and emotional style is evident in the swirling, almost frenzied quality of the stars and the serene, tranquil atmosphere of the village below. The Starry Night is celebrated for its ability to evoke a sense of awe and wonder, capturing the essence of the night sky and the human experience.\n\nThe painting''s creation is deeply rooted in Van Gogh''s personal experiences and mental state at the time. In 1889, the artist voluntarily admitted himself to the Saint-Paul-de-Mausole asylum in Saint-Rémy-de-Provence, France, following a series of mental health crises. It was during his stay at the asylum that Van Gogh painted The Starry Night, drawing inspiration from the view from his east-facing window. However, the scene is not an exact representation of what he saw. Instead, it is a fusion of observed reality and imagination, reflecting Van Gogh''s inner turmoil and his quest for spiritual meaning. The cypress tree, often associated with death and eternity in Mediterranean cultures, takes on a flame-like appearance, potentially symbolizing the connection between earth and heaven.\n\nThe color palette of The Starry Night is particularly striking and contributes significantly to its emotional impact. Van Gogh uses a combination of cool blues and greens for the night sky, contrasted with the warm yellows and oranges of the stars and crescent moon. This interplay of cool and warm colors creates a sense of vibration and energy throughout the painting. The village below is rendered in more muted tones, emphasizing the contrast between the celestial drama above and the quiet earthly realm below. Van Gogh''s bold use of color was revolutionary for his time and has continued to influence artists for generations.\n\nThe enduring appeal of The Starry Night lies not only in its visual beauty but also in its ability to resonate with viewers on an emotional and philosophical level. The painting seems to capture the sublime nature of the cosmos, inviting contemplation of humanity place within the vast universe. The swirling sky can be interpreted as a representation of the turbulent emotions and mental state of the artist, while the serene village below might symbolize the desire for peace and stability. This juxtaposition of chaos and calm, of the cosmic and the mundane, speaks to the universal human experience of grappling with our own insignificance in the face of the infinite. Today, The Starry Night remains one of the most reproduced and recognizable paintings in the world, its influence extending far beyond the realm of fine art into popular culture, where it continues to inspire and captivate audiences more than a century after its creation.'
);

INSERT INTO artworks (
    id,
    created_at,
    title,
    description
) VALUES (
    '3197dbc5-711d-4c84-8db2-6ac20a2ded25',
    CURRENT_TIMESTAMP,
    'Ethereal Whispers',
    'A mesmerizing digital artwork that captures the delicate dance of light and shadow, evoking a sense of mystery and wonder'
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
), (
    'bc9d8116-4af5-4006-bc2b-fd9f5ec691be',
    'b6f0f651-c954-4c88-8486-2d1d5b0a4b1c',
    '7c37e6b3-5e62-4f76-b67c-0d5a42b92a2d',
    'Artist'
), (
    '6a856ada-98d5-41dc-801f-230fb76958ad',
    '247dbc2a-3d80-49f6-83db-6a6ae3497b2a',
    '13f60da9-8dd4-42f9-8a57-c0569a158857',
    'Uploader'
), (
    '8c89a0cc-fa3e-4eca-8e02-0abc39cbf0ff',
    '247dbc2a-3d80-49f6-83db-6a6ae3497b2a',
    '7c37e6b3-5e62-4f76-b67c-0d5a42b92a2d',
    'Artist'
), (
    'f3a9c6b2-7d8e-4a1f-9b0c-5d6e8f3a2c1d',
    '3197dbc5-711d-4c84-8db2-6ac20a2ded25',
    '13f60da9-8dd4-42f9-8a57-c0569a158857',
    'Uploader'
), (
    'e2b1d8a7-6c9f-4b5e-8d3a-7f4c9e0b1a2d',
    '3197dbc5-711d-4c84-8db2-6ac20a2ded25',
    '7c37e6b3-5e62-4f76-b67c-0d5a42b92a2d',
    'Artist'
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
), (
    '2fdbe299-4267-4faa-8170-7bde048062d9',
    '3197dbc5-711d-4c84-8db2-6ac20a2ded25',
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
), (
    '751d51e9-675b-44ba-b2b0-daac08e30ee9',
    '3197dbc5-711d-4c84-8db2-6ac20a2ded25',
    '3197dbc5-711d-4c84-8db2-6ac20a2ded25/lukewarm._Ethereal_Whispers_A_mesmerizing_digital_artwork_that__1ba69160-20f1-4221-a03a-04917a5ab90e.png',
    'image',
    CURRENT_TIMESTAMP,
    'artwork_assets',
    false
), (
    'a99eaa31-f672-4194-95b2-d2848b832787',
    '3197dbc5-711d-4c84-8db2-6ac20a2ded25',
    '3197dbc5-711d-4c84-8db2-6ac20a2ded25/lukewarm._Ethereal_Whispers_A_mesmerizing_digital_artwork_that__3702d92e-7bf6-4b3f-a356-1fd43d7f0437.png',
    'image',
    CURRENT_TIMESTAMP,
    'artwork_assets',
    false
), (
    'fa869ede-9390-4ad6-82b2-cc4b446d976c',
    '3197dbc5-711d-4c84-8db2-6ac20a2ded25',
    '3197dbc5-711d-4c84-8db2-6ac20a2ded25/lukewarm._Ethereal_Whispers_A_mesmerizing_digital_artwork_that__51b78df0-75ae-4d99-a71b-a6b865877b3b.png',
    'image',
    CURRENT_TIMESTAMP,
    'artwork_assets',
    false
), (
    'eacdf935-3090-4b27-8591-8480fff4f91a',
    '3197dbc5-711d-4c84-8db2-6ac20a2ded25',
    '3197dbc5-711d-4c84-8db2-6ac20a2ded25/lukewarm._Ethereal_Whispers_A_mesmerizing_digital_artwork_that__8afb789f-958d-4011-afda-507c9a86d864.png',
    'image',
    CURRENT_TIMESTAMP,
    'artwork_assets',
    false
), (
    '85699a87-bb54-497a-96dc-e9942dd71ff7',
    '3197dbc5-711d-4c84-8db2-6ac20a2ded25',
    '3197dbc5-711d-4c84-8db2-6ac20a2ded25/Ethereal_Whispers__A_mesmerizing_digital_artwork_that_captures_the_delicate_dance_of_light_and_shado_seed7848757570724325.mp4',
    'video',
    CURRENT_TIMESTAMP,
    'artwork_assets',
    true
);

-- Seed contacts table
INSERT INTO contacts (
    id,
    user_id,
    contact_id
) VALUES (
    '12912ab4-4e74-42d5-8977-cb387fba64b6',
    '314f834c-3ff2-4382-bc92-d37cbe2286a8', -- vinhloc30796@gmail.com
    '7c37e6b3-5e62-4f76-b67c-0d5a42b92a2d' -- admin@lukewarm.io
);

-- Seed portfolio_artworks table
INSERT INTO portfolio_artworks (
    id,
    user_id,
    artwork_id,
    display_order,
    is_highlighted
) VALUES (
    '12912ab4-4e74-42d5-8977-cb387fba64b6',
    '314f834c-3ff2-4382-bc92-d37cbe2286a8',
    'b6f0f651-c954-4c88-8486-2d1d5b0a4b1c',
    0,
    true
), (
    '182f415e-aa64-4153-80d3-515e9e9bb825',
    '314f834c-3ff2-4382-bc92-d37cbe2286a8',
    '247dbc2a-3d80-49f6-83db-6a6ae3497b2a',
    1,
    false
);