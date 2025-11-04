import { useAppSelector } from "../../../hooks/index.ts";
import { getCars, getSelectedCar, isLoading } from "../model/selectors/index.ts";
import { Car } from "../schemas/carSchema.ts";
import { useCallback } from "react";

const useCars = () => {
    const cars = useAppSelector(getCars);
    const selectedCar = useAppSelector(getSelectedCar);
    const loading = useAppSelector(isLoading);

    const getCar = useCallback((id: string): Car | undefined => cars.find(car => car.id === id), [cars]);

    return { cars, selectedCar, loading, getCar };
};

export default useCars;