import { RootState } from "../../../../database/redux/index.ts";
import { CarDto } from "../types/index.ts";

export const getCars = (state: RootState): Array<CarDto> => state.cars.cars;