CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = 'public, auth'
AS $$
BEGIN
    INSERT INTO public.user (id, firstname, lastname)
    VALUES (NEW.id, NEW.raw_user_meta_data ->> 'firstname', NEW.raw_user_meta_data ->> 'lastname');

    UPDATE auth.users
    SET raw_user_meta_data = jsonb_set(
        raw_user_meta_data,
        '{has_password}',
        to_jsonb(NEW.encrypted_password IS NOT NULL AND NEW.encrypted_password != '')
    )
    WHERE id = NEW.id;

    RETURN NEW;
END;
$$;