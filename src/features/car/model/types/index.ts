import { Car } from "../../schemas/carSchema.ts";

export type CarsState = {
    loading: boolean
    loadError: boolean
    cars: Array<Car>
    selectedCar: Car | null
}