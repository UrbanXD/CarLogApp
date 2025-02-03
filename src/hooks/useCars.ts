import { useAppSelector } from "./index.ts";
import { CarsState } from "../features/Database/redux/cars/cars.slices.ts";

const useCars = () => {
    const cars = useAppSelector(state => state.cars.cars) as CarsState["cars"];
    const carsImage = useAppSelector(state => state.cars.carsImage) as CarsState["carsImage"];
    const isLoading = useAppSelector(state => state.cars.loading) as CarsState["loading"];

    const getCar = (id: string) =>
        cars.find(car => car.id === id) || cars[0];

    const getCarImage = (id: string) =>
        carsImage.find(image => image.path === getCar(id)?.image);

    return {
        cars,
        carsImage,
        isLoading,
        getCar,
        getCarImage
    }
}

export default useCars;