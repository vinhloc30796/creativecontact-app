CREATE OR REPLACE FUNCTION get_user_id_by_email(email TEXT)
RETURNS UUID
SECURITY definer
AS $$
BEGIN
  RETURN (SELECT id FROM auth.users au WHERE au.email = $1);
END;
$$ LANGUAGE plpgsql;