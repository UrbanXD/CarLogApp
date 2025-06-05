CREATE OR REPLACE TRIGGER on_car_update_or_delete
AFTER DELETE OR UPDATE OF image ON car
FOR EACH ROW
EXECUTE FUNCTION handle_car_update_or_delete();