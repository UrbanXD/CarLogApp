DROP TRIGGER IF EXISTS public.on_delete_car ON public.car;

CREATE TRIGGER public.on_delete_car
AFTER DELETE ON public.car
FOR EACH ROW EXECUTE FUNCTION public.delete_car_image();