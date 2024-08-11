create table "public"."event_checkins" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "registration" uuid,
    "status" text,
    "staff" uuid
);


alter table "public"."event_checkins" enable row level security;

create table "public"."user_infos" (
    "id" uuid not null,
    "display_name" text,
    "location" text,
    "occupation" text,
    "about" text
);


alter table "public"."user_infos" enable row level security;

alter table "public"."event_registrations" alter column "created_at" set default now();

alter table "public"."event_registrations" alter column "id" set default gen_random_uuid();

alter table "public"."event_slots" alter column "capacity" drop not null;

alter table "public"."event_slots" alter column "created_at" set default now();

alter table "public"."event_slots" alter column "event" drop not null;

alter table "public"."event_slots" alter column "id" set default gen_random_uuid();

alter table "public"."event_slots" alter column "time_end" drop not null;

alter table "public"."event_slots" alter column "time_start" drop not null;

alter table "public"."events" alter column "created_at" set default now();

alter table "public"."events" alter column "created_by" drop not null;

alter table "public"."events" alter column "id" set default gen_random_uuid();

alter table "public"."events" alter column "name" drop not null;

alter table "public"."events" alter column "slug" drop not null;

alter table "public"."events" enable row level security;

CREATE UNIQUE INDEX event_checkins_pkey ON public.event_checkins USING btree (id);

CREATE UNIQUE INDEX user_infos_pkey ON public.user_infos USING btree (id);

alter table "public"."event_checkins" add constraint "event_checkins_pkey" PRIMARY KEY using index "event_checkins_pkey";

alter table "public"."user_infos" add constraint "user_infos_pkey" PRIMARY KEY using index "user_infos_pkey";

alter table "public"."event_checkins" add constraint "event_checkins_registration_fkey" FOREIGN KEY (registration) REFERENCES event_registrations(id) not valid;

alter table "public"."event_checkins" validate constraint "event_checkins_registration_fkey";

alter table "public"."event_checkins" add constraint "event_checkins_staff_fkey" FOREIGN KEY (staff) REFERENCES auth.users(id) not valid;

alter table "public"."event_checkins" validate constraint "event_checkins_staff_fkey";

alter table "public"."events" add constraint "events_created_by_fkey" FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL not valid;

alter table "public"."events" validate constraint "events_created_by_fkey";

alter table "public"."user_infos" add constraint "user_infos_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) not valid;

alter table "public"."user_infos" validate constraint "user_infos_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.cancel_expired_registrations()
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
  UPDATE event_registrations
  SET status = 'cancelled'
  WHERE (status = 'unconfirmed' OR status = 'pending')
    AND created_at < NOW() - INTERVAL '12 hours';
END;
$function$
;

CREATE OR REPLACE FUNCTION public.submit_registration(form_data jsonb, existing_registration_id uuid DEFAULT NULL::uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
AS $function$
DECLARE
  new_registration_id UUID;
  is_authenticated BOOLEAN;
BEGIN
  -- Start transaction
  BEGIN
    -- If there's an existing registration, cancel it
    IF existing_registration_id IS NOT NULL THEN
      UPDATE event_registrations
      SET status = 'cancelled'::registration_status
      WHERE id = existing_registration_id;
    END IF;

    -- Determine if the registration is authenticated
    is_authenticated := NOT (form_data->>'is_anonymous')::BOOLEAN;

    -- Insert new registration
    INSERT INTO event_registrations (
      slot,
      email,
      name,
      phone,
      created_by,
      status
    ) VALUES (
      (form_data->>'slot')::UUID,
      form_data->>'email',
      form_data->>'name',
      form_data->>'phone',
      (form_data->>'created_by')::UUID,
      CASE WHEN is_authenticated THEN 'confirmed'::registration_status ELSE 'pending'::registration_status END
    ) RETURNING id INTO new_registration_id;

    -- Commit transaction
    RETURN jsonb_build_object(
      'success', true, 
      'id', new_registration_id, 
      'status', CASE WHEN is_authenticated THEN 'confirmed'::registration_status ELSE 'pending'::registration_status END
    );
  EXCEPTION WHEN OTHERS THEN
    -- Rollback transaction on error
    RAISE;
  END;
END;
$function$
;

grant delete on table "public"."event_checkins" to "anon";

grant insert on table "public"."event_checkins" to "anon";

grant references on table "public"."event_checkins" to "anon";

grant select on table "public"."event_checkins" to "anon";

grant trigger on table "public"."event_checkins" to "anon";

grant truncate on table "public"."event_checkins" to "anon";

grant update on table "public"."event_checkins" to "anon";

grant delete on table "public"."event_checkins" to "authenticated";

grant insert on table "public"."event_checkins" to "authenticated";

grant references on table "public"."event_checkins" to "authenticated";

grant select on table "public"."event_checkins" to "authenticated";

grant trigger on table "public"."event_checkins" to "authenticated";

grant truncate on table "public"."event_checkins" to "authenticated";

grant update on table "public"."event_checkins" to "authenticated";

grant delete on table "public"."event_checkins" to "service_role";

grant insert on table "public"."event_checkins" to "service_role";

grant references on table "public"."event_checkins" to "service_role";

grant select on table "public"."event_checkins" to "service_role";

grant trigger on table "public"."event_checkins" to "service_role";

grant truncate on table "public"."event_checkins" to "service_role";

grant update on table "public"."event_checkins" to "service_role";

grant delete on table "public"."user_infos" to "anon";

grant insert on table "public"."user_infos" to "anon";

grant references on table "public"."user_infos" to "anon";

grant select on table "public"."user_infos" to "anon";

grant trigger on table "public"."user_infos" to "anon";

grant truncate on table "public"."user_infos" to "anon";

grant update on table "public"."user_infos" to "anon";

grant delete on table "public"."user_infos" to "authenticated";

grant insert on table "public"."user_infos" to "authenticated";

grant references on table "public"."user_infos" to "authenticated";

grant select on table "public"."user_infos" to "authenticated";

grant trigger on table "public"."user_infos" to "authenticated";

grant truncate on table "public"."user_infos" to "authenticated";

grant update on table "public"."user_infos" to "authenticated";

grant delete on table "public"."user_infos" to "service_role";

grant insert on table "public"."user_infos" to "service_role";

grant references on table "public"."user_infos" to "service_role";

grant select on table "public"."user_infos" to "service_role";

grant trigger on table "public"."user_infos" to "service_role";

grant truncate on table "public"."user_infos" to "service_role";

grant update on table "public"."user_infos" to "service_role";


