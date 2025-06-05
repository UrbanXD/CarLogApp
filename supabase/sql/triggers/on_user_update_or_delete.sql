CREATE OR REPLACE TRIGGER on_user_update_or_delete
AFTER DELETE OR UPDATE OF lastname, firstname, "avatarColor", "avatarImage" ON public.user
FOR EACH ROW
EXECUTE FUNCTION public.handle_user_update_or_delete();