CREATE OR REPLACE TRIGGER on_user_data_change
AFTER UPDATE OF lastname, firstname, "avatarColor", "avatarImage" ON public.user
FOR EACH ROW
EXECUTE FUNCTION update_auth_metadata();