CREATE OR REPLACE FUNCTION handle_car_update_or_delete()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
    IF OLD.image != NEW.image THEN
        CALL public.delete_image(OLD.image);
    END IF;

    RETURN OLD;
END;
$$;