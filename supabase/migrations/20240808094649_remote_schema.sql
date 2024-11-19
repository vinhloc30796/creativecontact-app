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


