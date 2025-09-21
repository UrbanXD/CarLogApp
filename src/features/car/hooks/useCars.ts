import { useAppSelector } from "../../../hooks/index.ts";
import { getCars, getSelectedCarId, isLoading } from "../model/selectors/index.ts";
import { Car } from "../schemas/carSchema.ts";
import { useCallback } from "react";

const useCars = () => {
    const cars = useAppSelector(getCars);
    const selectedCarId = useAppSelector(getSelectedCarId);
    const loading = useAppSelector(isLoading);

    const getCar = useCallback((id: string): Car | undefined => cars.find(car => car.id === id), [cars]);

    return { cars, selectedCarId, loading, getCar };
};

export default useCars;