import { CarTableType } from "../../../../database/connector/powersync/AppSchema.ts";
import { Image } from "../../../../types/index.ts";

export type CarDto = Omit<CarTableType, "image"> & { image: Image | null };

export type CarsState = {
    loading: boolean
    loadError: boolean
    cars: Array<CarDto>
    selectedCarId: CarDto["id"]
}