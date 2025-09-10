import { RootState } from "../../../../database/redux/index.ts";
import { Car } from "../../schemas/carSchema.ts";

export const getCars = (state: RootState): Array<Car> => state.cars.cars;