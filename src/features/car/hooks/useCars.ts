import { useAppSelector } from "../../../hooks/index.ts";
import { getCars, isLoading } from "../model/selectors/index.ts";
import { Car } from "../schemas/carSchema.ts";

const useCars = () => {
    const cars = useAppSelector(getCars);
    const loading = useAppSelector(isLoading);

    const getCar = (id: string): Car | undefined => cars.find(car => car.id === id);

    return { cars, loading, getCar };
};

export default useCars;