import { useAppSelector } from "../../../hooks";
import { getSelectedCarId } from "../model/selectors/getSelectedCarId.ts";
import { useDatabase } from "../../../contexts/database/DatabaseContext.ts";
import { useWatchedQueryItem } from "../../../database/hooks/useWatchedQueryItem.ts";
import { WatchQueryOptions } from "../../../database/watcher/watcher.ts";
import { useMemo } from "react";

type UseCarProps = {
    carId?: string
    options?: WatchQueryOptions
}

export function useCar(props?: UseCarProps) {
    const { carId, options } = props ?? {};

    const { carDao } = useDatabase();
    const selectedCarId = useAppSelector(getSelectedCarId);

    const queryCarId = carId ?? selectedCarId;

    const carQuery = useMemo(() => {
        return carDao.carWatchedQueryItem(queryCarId, options);
    }, [queryCarId, options]);

    const { data, isLoading } = useWatchedQueryItem(carQuery);

    return { car: data, isLoading };
}