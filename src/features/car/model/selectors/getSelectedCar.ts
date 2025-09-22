import { RootState } from "../../../../database/redux/index.ts";
import { Car } from "../../schemas/carSchema.ts";

export const getSelectedCar = (state: RootState): Car | null => state.cars.selectedCar;