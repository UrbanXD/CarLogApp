DROP TRIGGER IF EXISTS on_password_change ON auth.users;

CREATE TRIGGER on_password_change
AFTER UPDATE OF encrypted_password ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_user_password_change();