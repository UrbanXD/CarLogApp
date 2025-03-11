CREATE OR REPLACE FUNCTION update_auth_metadata()
RETURNS TRIGGER
SECURITY DEFINER
AS $$
BEGIN
UPDATE auth.users
SET raw_user_meta_data =  raw_user_meta_data || jsonb_build_object(
        'firstname', NEW.firstname,
        'lastname', NEW.lastname,
        'avatarColor', NEW."avatarColor",
        'avatarImage', NEW."avatarImage"
                                                )
WHERE id = NEW.id;

RETURN NEW;
END;
$$ LANGUAGE plpgsql;