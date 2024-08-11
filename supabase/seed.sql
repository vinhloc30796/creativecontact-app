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
    'f47ac10b-58cc-4372-a567-0e02b2c3d479', -- Random UUID
    CURRENT_TIMESTAMP, -- Current timestamp
    'Summer Tech Conference 2024',
    'summer-tech-conf-2024',
    '7c37e6b3-5e62-4f76-b67c-0d5a42b92a2d' -- Assuming this is a valid user UUID
);

-- Seed data into the event_slots table
INSERT INTO event_slots (id, created_at, event, time_start, time_end, capacity) VALUES 
('29c5f10f-416e-45cd-a13d-3527c69f3474', CURRENT_TIMESTAMP, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', '2024-08-15T10:00+07'::timestamptz, '2024-08-15T10:45+07'::timestamptz, 30),
('46cc2182-3e6a-48ff-b9e0-58e42f6532df', CURRENT_TIMESTAMP, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', '2024-08-15T10:45+07'::timestamptz, '2024-08-15T11:30+07'::timestamptz, 24),
('982e5399-72c0-4332-afb9-f9c75b6f5ac0', CURRENT_TIMESTAMP, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', '2024-08-15T11:30+07'::timestamptz, '2024-08-15T12:15+07'::timestamptz, 40),
('cf8d5568-c061-4336-8566-cedf025b24a0', CURRENT_TIMESTAMP, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', '2024-08-15T12:15+07'::timestamptz, '2024-08-15T13:00+07'::timestamptz, 33),
('1ed5df6f-22f1-4798-999e-ced86695e0c8', CURRENT_TIMESTAMP, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', '2024-08-15T13:00+07'::timestamptz, '2024-08-15T13:45+07'::timestamptz, 34),
('167e6b19-eef0-46c9-93f9-124e5e5e1190', CURRENT_TIMESTAMP, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', '2024-08-15T13:45+07'::timestamptz, '2024-08-15T14:30+07'::timestamptz, 40),
('7eeb1b90-fd67-4eff-8442-97f2ab8ea906', CURRENT_TIMESTAMP, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', '2024-08-15T14:30+07'::timestamptz, '2024-08-15T15:15+07'::timestamptz, 33),
('cac2bd34-8b94-45ca-9e9c-6d212cf0df02', CURRENT_TIMESTAMP, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', '2024-08-15T15:15+07'::timestamptz, '2024-08-15T16:00+07'::timestamptz, 35),
('40a1276b-b2d0-4ad8-9c12-0fe7d419c44d', CURRENT_TIMESTAMP, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', '2024-08-16T10:00+07'::timestamptz, '2024-08-16T10:45+07'::timestamptz, 26),
('73e0204d-6b0a-450c-9286-b16dc021b3c1', CURRENT_TIMESTAMP, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', '2024-08-16T10:45+07'::timestamptz, '2024-08-16T11:30+07'::timestamptz, 28),
('49cc88df-f30e-4a2c-a215-596ca84f73f6', CURRENT_TIMESTAMP, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', '2024-08-16T11:30+07'::timestamptz, '2024-08-16T12:15+07'::timestamptz, 38),
('ed5d4053-751c-4b21-8971-713c25d9ecb9', CURRENT_TIMESTAMP, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', '2024-08-16T12:15+07'::timestamptz, '2024-08-16T13:00+07'::timestamptz, 40),
('b6fb8368-0313-451d-a557-75daf99a1e0d', CURRENT_TIMESTAMP, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', '2024-08-16T13:00+07'::timestamptz, '2024-08-16T13:45+07'::timestamptz, 38),
('4af2bbbb-82c2-4152-bf2c-883043a4178f', CURRENT_TIMESTAMP, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', '2024-08-16T13:45+07'::timestamptz, '2024-08-16T14:30+07'::timestamptz, 24),
('1b2511eb-68c6-4dfe-b1f3-20db25e32a1a', CURRENT_TIMESTAMP, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', '2024-08-16T14:30+07'::timestamptz, '2024-08-16T15:15+07'::timestamptz, 21),
('c13243e5-ac40-4d5f-832c-0aa68b68acc6', CURRENT_TIMESTAMP, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', '2024-08-16T15:15+07'::timestamptz, '2024-08-16T16:00+07'::timestamptz, 40),
('ad2e2dc8-29cc-4daa-b21a-ce8990b99c1d', CURRENT_TIMESTAMP, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', '2024-08-17T10:00+07'::timestamptz, '2024-08-17T10:45+07'::timestamptz, 37),
('8bb5f5b1-036d-4036-ba2d-618691778d91', CURRENT_TIMESTAMP, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', '2024-08-17T10:45+07'::timestamptz, '2024-08-17T11:30+07'::timestamptz, 32),
('953ddc23-845f-4be1-8018-97ead638079a', CURRENT_TIMESTAMP, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', '2024-08-17T11:30+07'::timestamptz, '2024-08-17T12:15+07'::timestamptz, 28),
('fdfadb77-9f08-4387-8270-c81ba0ab80d8', CURRENT_TIMESTAMP, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', '2024-08-17T12:15+07'::timestamptz, '2024-08-17T13:00+07'::timestamptz, 40),
('c5fc2936-b3bf-4f35-a37a-c7d7b46378ee', CURRENT_TIMESTAMP, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', '2024-08-17T13:00+07'::timestamptz, '2024-08-17T13:45+07'::timestamptz, 20),
('0ab76d6e-c08f-446a-9ef3-451d0326d98d', CURRENT_TIMESTAMP, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', '2024-08-17T13:45+07'::timestamptz, '2024-08-17T14:30+07'::timestamptz, 40),
('76b418b5-2ee7-41b1-8011-c007ac6cba9b', CURRENT_TIMESTAMP, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', '2024-08-17T14:30+07'::timestamptz, '2024-08-17T15:15+07'::timestamptz, 37),
('340127c3-ee01-4874-973f-b8506188c068', CURRENT_TIMESTAMP, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', '2024-08-17T15:15+07'::timestamptz, '2024-08-17T16:00+07'::timestamptz, 27),
('a33a6dfa-8026-4654-b2a2-f7afd95f1cf7', CURRENT_TIMESTAMP, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', '2024-08-18T10:00+07'::timestamptz, '2024-08-18T10:45+07'::timestamptz, 23),
('21863beb-b696-4e2b-b95d-9ade29831f5b', CURRENT_TIMESTAMP, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', '2024-08-18T10:45+07'::timestamptz, '2024-08-18T11:30+07'::timestamptz, 40),
('6ead8d2e-9510-4fdb-be7e-861bfefb2668', CURRENT_TIMESTAMP, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', '2024-08-18T11:30+07'::timestamptz, '2024-08-18T12:15+07'::timestamptz, 32),
('5d5936ba-e458-447e-8bba-dd83fe1c16d9', CURRENT_TIMESTAMP, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', '2024-08-18T12:15+07'::timestamptz, '2024-08-18T13:00+07'::timestamptz, 38),
('4a25c217-8c72-4147-b6d5-5bbf768b2d4f', CURRENT_TIMESTAMP, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', '2024-08-18T13:00+07'::timestamptz, '2024-08-18T13:45+07'::timestamptz, 34),
('bc1278aa-a85f-435c-9a38-c068a74315e9', CURRENT_TIMESTAMP, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', '2024-08-18T13:45+07'::timestamptz, '2024-08-18T14:30+07'::timestamptz, 39),
('ddc69a31-371b-4617-8624-c35d5773d578', CURRENT_TIMESTAMP, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', '2024-08-18T14:30+07'::timestamptz, '2024-08-18T15:15+07'::timestamptz, 40),
('49b6b664-98e9-4258-8d20-4e41b48e406d', CURRENT_TIMESTAMP, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', '2024-08-18T15:15+07'::timestamptz, '2024-08-18T16:00+07'::timestamptz, 26),
('242c5a93-7759-418a-a6d8-cffb53d60f8a', CURRENT_TIMESTAMP, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', '2024-08-19T10:00+07'::timestamptz, '2024-08-19T10:45+07'::timestamptz, 37),
('e9768bed-30ec-4fec-a44a-df8038e4f505', CURRENT_TIMESTAMP, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', '2024-08-19T10:45+07'::timestamptz, '2024-08-19T11:30+07'::timestamptz, 29),
('a627c306-2dfd-45c7-8fe6-d34a77517cce', CURRENT_TIMESTAMP, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', '2024-08-19T11:30+07'::timestamptz, '2024-08-19T12:15+07'::timestamptz, 27),
('c431bf91-6ec7-4e58-af39-7ba64b9ad8e2', CURRENT_TIMESTAMP, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', '2024-08-19T12:15+07'::timestamptz, '2024-08-19T13:00+07'::timestamptz, 24),
('7aada20c-e7a6-4c3f-b1ae-71ae9eda4101', CURRENT_TIMESTAMP, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', '2024-08-19T13:00+07'::timestamptz, '2024-08-19T13:45+07'::timestamptz, 40),
('9f64a90b-be07-453c-9596-8cfc9ac49c9c', CURRENT_TIMESTAMP, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', '2024-08-19T13:45+07'::timestamptz, '2024-08-19T14:30+07'::timestamptz, 40),
('0e8d62c9-10dd-4e7d-8876-0519438ec233', CURRENT_TIMESTAMP, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', '2024-08-19T14:30+07'::timestamptz, '2024-08-19T15:15+07'::timestamptz, 30),
('9957e285-582d-4c34-98c0-34898b503bc8', CURRENT_TIMESTAMP, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', '2024-08-19T15:15+07'::timestamptz, '2024-08-19T16:00+07'::timestamptz, 28),
('d6af840b-cbda-4a07-8d21-91bd839646ad', CURRENT_TIMESTAMP, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', '2024-08-20T10:00+07'::timestamptz, '2024-08-20T10:45+07'::timestamptz, 26),
('158979cc-d117-49c3-b525-9528bfb0d06c', CURRENT_TIMESTAMP, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', '2024-08-20T10:45+07'::timestamptz, '2024-08-20T11:30+07'::timestamptz, 36),
('c45bb1fc-a97b-4a7d-8096-81daa5d98412', CURRENT_TIMESTAMP, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', '2024-08-20T11:30+07'::timestamptz, '2024-08-20T12:15+07'::timestamptz, 35),
('7b1b1136-6186-4489-8cf8-7b2f9aee3fad', CURRENT_TIMESTAMP, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', '2024-08-20T12:15+07'::timestamptz, '2024-08-20T13:00+07'::timestamptz, 40),
('fe79d477-783e-40fc-a812-e90c47b50070', CURRENT_TIMESTAMP, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', '2024-08-20T13:00+07'::timestamptz, '2024-08-20T13:45+07'::timestamptz, 31),
('a5966e1f-1a65-4287-81a2-fc21d98dfd5b', CURRENT_TIMESTAMP, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', '2024-08-20T13:45+07'::timestamptz, '2024-08-20T14:30+07'::timestamptz, 26),
('0a21b972-7757-480c-ac85-3a1d589ab079', CURRENT_TIMESTAMP, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', '2024-08-20T14:30+07'::timestamptz, '2024-08-20T15:15+07'::timestamptz, 40),
('9ca69d90-a814-477e-afd4-65fcf24909d1', CURRENT_TIMESTAMP, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', '2024-08-20T15:15+07'::timestamptz, '2024-08-20T16:00+07'::timestamptz, 23),
('daa33221-afa6-487a-8958-bafb1f9156df', CURRENT_TIMESTAMP, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', '2024-08-21T10:00+07'::timestamptz, '2024-08-21T10:45+07'::timestamptz, 40),
('562e1dac-1f03-4b22-9505-288da1039af3', CURRENT_TIMESTAMP, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', '2024-08-21T10:45+07'::timestamptz, '2024-08-21T11:30+07'::timestamptz, 38),
('372aff72-59d1-4c45-a128-21823edb0162', CURRENT_TIMESTAMP, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', '2024-08-21T11:30+07'::timestamptz, '2024-08-21T12:15+07'::timestamptz, 30),
('5257f858-1765-485b-9ecf-899cdc08bbef', CURRENT_TIMESTAMP, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', '2024-08-21T12:15+07'::timestamptz, '2024-08-21T13:00+07'::timestamptz, 22),
('006a3015-1603-4ccc-91ce-2b04536ba0cb', CURRENT_TIMESTAMP, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', '2024-08-21T13:00+07'::timestamptz, '2024-08-21T13:45+07'::timestamptz, 32),
('599a100a-ac0f-42e3-9c68-47d6224f8b15', CURRENT_TIMESTAMP, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', '2024-08-21T13:45+07'::timestamptz, '2024-08-21T14:30+07'::timestamptz, 35),
('e0a283cd-890f-44ff-a952-8e32641b5adb', CURRENT_TIMESTAMP, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', '2024-08-21T14:30+07'::timestamptz, '2024-08-21T15:15+07'::timestamptz, 39),
('75725f98-2866-442f-87e3-56f58af9dd31', CURRENT_TIMESTAMP, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', '2024-08-21T15:15+07'::timestamptz, '2024-08-21T16:00+07'::timestamptz, 40),
('a98336b2-5be3-4adf-ae5f-0c638328b245', CURRENT_TIMESTAMP, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', '2024-08-22T10:00+07'::timestamptz, '2024-08-22T10:45+07'::timestamptz, 27),
('47287c46-419b-426c-a853-2aee0f45bc47', CURRENT_TIMESTAMP, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', '2024-08-22T10:45+07'::timestamptz, '2024-08-22T11:30+07'::timestamptz, 25),
('c7d65d03-ca2c-4cd4-adbf-3dd9bd896c84', CURRENT_TIMESTAMP, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', '2024-08-22T11:30+07'::timestamptz, '2024-08-22T12:15+07'::timestamptz, 40),
('07c0f9de-1654-4837-ae82-1c6fca5857be', CURRENT_TIMESTAMP, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', '2024-08-22T12:15+07'::timestamptz, '2024-08-22T13:00+07'::timestamptz, 24),
('57613207-69b6-4911-9f53-c9823ce3ea68', CURRENT_TIMESTAMP, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', '2024-08-22T13:00+07'::timestamptz, '2024-08-22T13:45+07'::timestamptz, 40),
('8e4e1c8d-728d-4eaf-aefe-fdaa5af8e5a7', CURRENT_TIMESTAMP, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', '2024-08-22T13:45+07'::timestamptz, '2024-08-22T14:30+07'::timestamptz, 32),
('bc26f06e-8e6a-43cd-b033-ba4db1fdfd5e', CURRENT_TIMESTAMP, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', '2024-08-22T14:30+07'::timestamptz, '2024-08-22T15:15+07'::timestamptz, 22),
('a49c08a2-5511-4c42-b069-473fa342d54b', CURRENT_TIMESTAMP, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', '2024-08-22T15:15+07'::timestamptz, '2024-08-22T16:00+07'::timestamptz, 27),
('662d3cbe-a9e5-4062-903f-57fc0a3ac593', CURRENT_TIMESTAMP, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', '2024-08-23T10:00+07'::timestamptz, '2024-08-23T10:45+07'::timestamptz, 40),
('b910bd0f-f948-45a9-9a04-7d5774033735', CURRENT_TIMESTAMP, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', '2024-08-23T10:45+07'::timestamptz, '2024-08-23T11:30+07'::timestamptz, 21),
('0d634d2e-3395-4ed3-9842-4f9855a6595b', CURRENT_TIMESTAMP, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', '2024-08-23T11:30+07'::timestamptz, '2024-08-23T12:15+07'::timestamptz, 26),
('cfde7cdf-df09-44aa-90ec-6cd794327868', CURRENT_TIMESTAMP, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', '2024-08-23T12:15+07'::timestamptz, '2024-08-23T13:00+07'::timestamptz, 21),
('da3af6e8-41e8-44ea-91d7-24592b7fdf98', CURRENT_TIMESTAMP, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', '2024-08-23T13:00+07'::timestamptz, '2024-08-23T13:45+07'::timestamptz, 30),
('3747d78a-b912-478d-93f1-76bc579ee058', CURRENT_TIMESTAMP, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', '2024-08-23T13:45+07'::timestamptz, '2024-08-23T14:30+07'::timestamptz, 40),
('bee67828-3ba0-4b37-b15c-923446d3a666', CURRENT_TIMESTAMP, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', '2024-08-23T14:30+07'::timestamptz, '2024-08-23T15:15+07'::timestamptz, 38),
('e16819ff-91c2-4ac7-8759-9b635cf1040b', CURRENT_TIMESTAMP, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', '2024-08-23T15:15+07'::timestamptz, '2024-08-23T16:00+07'::timestamptz, 24),
('fb57e31c-4d84-44f8-97d3-5a8c02d6af19', CURRENT_TIMESTAMP, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', '2024-08-24T10:00+07'::timestamptz, '2024-08-24T10:45+07'::timestamptz, 40),
('d700f0de-51b9-4871-b0b1-29f01b11061f', CURRENT_TIMESTAMP, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', '2024-08-24T10:45+07'::timestamptz, '2024-08-24T11:30+07'::timestamptz, 23),
('aa7506a8-be92-4f74-87bb-cfd0474edf96', CURRENT_TIMESTAMP, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', '2024-08-24T11:30+07'::timestamptz, '2024-08-24T12:15+07'::timestamptz, 37),
('ec817773-6457-4347-b981-8a096c1c1464', CURRENT_TIMESTAMP, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', '2024-08-24T12:15+07'::timestamptz, '2024-08-24T13:00+07'::timestamptz, 24),
('8d71b6c4-38ab-4e34-88b4-85e88503ee80', CURRENT_TIMESTAMP, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', '2024-08-24T13:00+07'::timestamptz, '2024-08-24T13:45+07'::timestamptz, 24),
('56c613c5-cf8f-4c78-9a6e-22fcb9fc3245', CURRENT_TIMESTAMP, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', '2024-08-24T13:45+07'::timestamptz, '2024-08-24T14:30+07'::timestamptz, 40),
('8c922256-8a97-4b98-960e-0131eed0f7b7', CURRENT_TIMESTAMP, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', '2024-08-24T14:30+07'::timestamptz, '2024-08-24T15:15+07'::timestamptz, 32),
('d560559f-bb65-4c7e-815b-9f44ff9c8f49', CURRENT_TIMESTAMP, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', '2024-08-24T15:15+07'::timestamptz, '2024-08-24T16:00+07'::timestamptz, 25),
('65c78dc0-13a7-4e20-8a8b-0463b618f246', CURRENT_TIMESTAMP, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', '2024-08-25T10:00+07'::timestamptz, '2024-08-25T10:45+07'::timestamptz, 34),
('0c8c5f55-9b1a-4bc1-a33a-14a36e66cace', CURRENT_TIMESTAMP, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', '2024-08-25T10:45+07'::timestamptz, '2024-08-25T11:30+07'::timestamptz, 37),
('dccb47e0-fe0d-45a9-9428-5b151c0ba284', CURRENT_TIMESTAMP, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', '2024-08-25T11:30+07'::timestamptz, '2024-08-25T12:15+07'::timestamptz, 28),
('410b8002-ba0a-4e09-9b91-ecf60a5e0bcd', CURRENT_TIMESTAMP, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', '2024-08-25T12:15+07'::timestamptz, '2024-08-25T13:00+07'::timestamptz, 40),
('d1aa6ff2-7c0d-4017-a94e-e42bd4775156', CURRENT_TIMESTAMP, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', '2024-08-25T13:00+07'::timestamptz, '2024-08-25T13:45+07'::timestamptz, 21),
('39248311-8829-4a89-92c2-c4fbb00cbe4b', CURRENT_TIMESTAMP, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', '2024-08-25T13:45+07'::timestamptz, '2024-08-25T14:30+07'::timestamptz, 32),
('373cc506-3b7e-4a53-bb87-656e0cb747dc', CURRENT_TIMESTAMP, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', '2024-08-25T14:30+07'::timestamptz, '2024-08-25T15:15+07'::timestamptz, 40),
('c8d83960-46e8-4352-abd3-53017f583013', CURRENT_TIMESTAMP, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', '2024-08-25T15:15+07'::timestamptz, '2024-08-25T16:00+07'::timestamptz, 32),
('19cdde58-660e-4df6-931c-ce34d368ece1', CURRENT_TIMESTAMP, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', '2024-08-26T10:00+07'::timestamptz, '2024-08-26T10:45+07'::timestamptz, 32),
('23284761-ec19-4d17-afd4-df1e85d01e3d', CURRENT_TIMESTAMP, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', '2024-08-26T10:45+07'::timestamptz, '2024-08-26T11:30+07'::timestamptz, 24),
('4a84b608-93be-4c6e-8ab3-052ff2669ed3', CURRENT_TIMESTAMP, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', '2024-08-26T11:30+07'::timestamptz, '2024-08-26T12:15+07'::timestamptz, 40),
('6630a2a9-49a7-4253-80f6-5ba6298f7afb', CURRENT_TIMESTAMP, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', '2024-08-26T12:15+07'::timestamptz, '2024-08-26T13:00+07'::timestamptz, 35),
('379bb4eb-1d94-4019-a6fb-788babbcc024', CURRENT_TIMESTAMP, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', '2024-08-26T13:00+07'::timestamptz, '2024-08-26T13:45+07'::timestamptz, 36),
('893c2cb6-c7da-4c2b-bafb-99bc0ed4726e', CURRENT_TIMESTAMP, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', '2024-08-26T13:45+07'::timestamptz, '2024-08-26T14:30+07'::timestamptz, 29),
('54bc86d3-d2cd-4793-b3ca-e53dba05c1ee', CURRENT_TIMESTAMP, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', '2024-08-26T14:30+07'::timestamptz, '2024-08-26T15:15+07'::timestamptz, 24),
('1e442091-61bb-4f6e-afba-aa1657450a12', CURRENT_TIMESTAMP, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', '2024-08-26T15:15+07'::timestamptz, '2024-08-26T16:00+07'::timestamptz, 40),
('69fe5466-a4cb-4cd0-a2bb-0b27f6f65828', CURRENT_TIMESTAMP, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', '2024-08-27T10:00+07'::timestamptz, '2024-08-27T10:45+07'::timestamptz, 26),
('b573333b-b275-4b66-958c-a4d9b2db8db6', CURRENT_TIMESTAMP, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', '2024-08-27T10:45+07'::timestamptz, '2024-08-27T11:30+07'::timestamptz, 27),
('17c7e965-a135-4c72-a9e1-145c755511c6', CURRENT_TIMESTAMP, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', '2024-08-27T11:30+07'::timestamptz, '2024-08-27T12:15+07'::timestamptz, 29),
('062e5c4e-ecd9-4e9a-a201-de4638ff8b8e', CURRENT_TIMESTAMP, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', '2024-08-27T12:15+07'::timestamptz, '2024-08-27T13:00+07'::timestamptz, 23),
('b6386518-213a-4bf6-b8e5-e8933190a25c', CURRENT_TIMESTAMP, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', '2024-08-27T13:00+07'::timestamptz, '2024-08-27T13:45+07'::timestamptz, 29),
('b647b4b6-60db-4afe-a787-dc74d329b530', CURRENT_TIMESTAMP, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', '2024-08-27T13:45+07'::timestamptz, '2024-08-27T14:30+07'::timestamptz, 29),
('ece6d0e4-692e-4292-8bcc-53a40e174c99', CURRENT_TIMESTAMP, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', '2024-08-27T14:30+07'::timestamptz, '2024-08-27T15:15+07'::timestamptz, 40),
('a28f24c5-acb4-43d1-9590-2f7a650ffc29', CURRENT_TIMESTAMP, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', '2024-08-27T15:15+07'::timestamptz, '2024-08-27T16:00+07'::timestamptz, 40),
('c6b9429c-27f7-45fd-875b-ad21927f3f9a', CURRENT_TIMESTAMP, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', '2024-08-28T10:00+07'::timestamptz, '2024-08-28T10:45+07'::timestamptz, 40),
('dc9590b6-bbf6-4826-b4bc-a0e851ca6220', CURRENT_TIMESTAMP, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', '2024-08-28T10:45+07'::timestamptz, '2024-08-28T11:30+07'::timestamptz, 23),
('c8cedc19-8aa6-40b4-8c1d-c4429baad045', CURRENT_TIMESTAMP, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', '2024-08-28T11:30+07'::timestamptz, '2024-08-28T12:15+07'::timestamptz, 29),
('7f83878a-5e30-47d7-8646-bf75a7ef7c39', CURRENT_TIMESTAMP, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', '2024-08-28T12:15+07'::timestamptz, '2024-08-28T13:00+07'::timestamptz, 35),
('b92c19ff-1555-4ac1-a68f-8dd321f54318', CURRENT_TIMESTAMP, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', '2024-08-28T13:00+07'::timestamptz, '2024-08-28T13:45+07'::timestamptz, 31),
('c3af29fa-e1f9-4b3e-b439-4c219af4efb0', CURRENT_TIMESTAMP, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', '2024-08-28T13:45+07'::timestamptz, '2024-08-28T14:30+07'::timestamptz, 40),
('7335002c-9cdb-4dc5-ad8c-366e313a79a5', CURRENT_TIMESTAMP, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', '2024-08-28T14:30+07'::timestamptz, '2024-08-28T15:15+07'::timestamptz, 26),
('ed14150e-d464-4566-a858-b89081b578f3', CURRENT_TIMESTAMP, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', '2024-08-28T15:15+07'::timestamptz, '2024-08-28T16:00+07'::timestamptz, 22);

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