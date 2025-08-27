CREATE OR REPLACE FUNCTION public.handle_user_password_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = 'public, auth'
AS $$
BEGIN
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