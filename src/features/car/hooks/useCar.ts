import { useDatabase } from "../../../contexts/database/DatabaseContext.ts";
import { useWatchedQueryItem } from "../../../database/hooks/useWatchedQueryItem.ts";
import { WatchQueryOptions } from "../../../database/watcher/watcher.ts";
import { useMemo } from "react";

type UseCarProps = {
    carId?: string | null
    options?: WatchQueryOptions
}

export function useCar(props?: UseCarProps) {
    const { carId, options } = props ?? {};

    const { carDao } = useDatabase();

    const optionsKey = JSON.stringify(options);
    const carQuery = useMemo(() => {
        return carDao.carWatchedQueryItem(carId, options);
    }, [carId, optionsKey, carDao]);

    const { data, isLoading } = useWatchedQueryItem(carQuery);

    return { car: data, isLoading };
}