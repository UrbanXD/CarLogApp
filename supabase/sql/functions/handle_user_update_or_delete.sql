CREATE OR REPLACE FUNCTION public.handle_user_update_or_delete()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
    IF OLD."avatarImage" != NEW."avatarImage" THEN
        CALL public.delete_image(OLD."avatarImage");
    END IF;

    IF TG_OP = 'UPDATE' THEN
        UPDATE auth.users
        SET raw_user_meta_data =  raw_user_meta_data || jsonb_build_object(
            'firstname', NEW.firstname,
            'lastname', NEW.lastname,
            'avatarColor', NEW."avatarColor",
            'avatarImage', NEW."avatarImage"
        )
        WHERE id = NEW.id;

        RETURN NEW;
    END IF;

    RETURN OLD;
END;
$$;