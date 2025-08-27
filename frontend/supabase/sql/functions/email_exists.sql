DROP FUNCTION IF EXISTS public.email_exists(text);

CREATE FUNCTION public.email_exists(email_address text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public, auth
AS $$
BEGIN
RETURN EXISTS (
    SELECT 1
    FROM auth.users
    WHERE email = email_address
);
END;
$$;
