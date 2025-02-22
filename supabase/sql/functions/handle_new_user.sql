CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = 'public, auth'
AS $$
BEGIN
INSERT INTO public.user (id, firstname, lastname)
VALUES (NEW.id, NEW.raw_user_meta_data ->> 'firstname', NEW.raw_user_meta_data ->> 'lastname');
RETURN NEW;
END;
$$;