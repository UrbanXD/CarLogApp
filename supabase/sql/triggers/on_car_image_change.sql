DROP TRIGGER IF EXISTS public.on_car_image_change ON public.car;

CREATE TRIGGER public.on_car_image_change
AFTER UPDATE OF image ON public.car
FOR EACH ROW
WHEN (OLD.image != NEW.image)
EXECUTE FUNCTION public.delete_car_image();