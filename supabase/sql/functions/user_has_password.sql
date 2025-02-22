DROP FUNCTION IF EXISTS public.user_has_password(uuid);

CREATE FUNCTION public.user_has_password(user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public, auth
AS $$
BEGIN
RETURN EXISTS (
    SELECT 1
    FROM auth.users
    WHERE id = user_id AND encrypted_password IS NOT NULL AND encrypted_password != ''
);
END;
$$;