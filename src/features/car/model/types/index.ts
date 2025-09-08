import { CarTableType } from "../../../../database/connector/powersync/AppSchema.ts";
import { Image } from "../../../../types/index.ts";
import { Car } from "../../schemas/carSchema.ts";

export type CarDto = Omit<CarTableType, "image"> & { image: Image | null };

export type CarsState = {
    loading: boolean
    loadError: boolean
    cars: Array<Car>
    selectedCarId: Car["id"]
}