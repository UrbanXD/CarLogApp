import { useAppSelector } from "../../../hooks/index.ts";
import { getCars, isLoading } from "../model/selectors/index.ts";
import { CarDto } from "../model/types/index.ts";

const useCars = () => {
    const cars = useAppSelector(getCars);
    const loading = useAppSelector(isLoading);

    const getCar = (id: string): CarDto =>
        cars.find(car => car.id === id) || cars[0];

    return {
        cars,
        loading,
        getCar
    }
}

export default useCars;