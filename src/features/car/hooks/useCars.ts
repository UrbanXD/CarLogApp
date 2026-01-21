import { useDatabase } from "../../../contexts/database/DatabaseContext.ts";
import { Car } from "../schemas/carSchema.ts";
import { WatchQueryOptions } from "../../../database/watcher/watcher.ts";
import { useWatchedQueryCollection } from "../../../database/hooks/useWatchedQueryCollection.ts";
import { useMemo } from "react";

function useCars<Mapped = Car>(options?: WatchQueryOptions & { extraMapper?: (cars: Array<Car>) => Array<Mapped> }) {
    const { carDao } = useDatabase();
    const { extraMapper, ...queryOptions } = options ?? {};

    const carsQuery = useMemo(() => {
        return carDao.carWatchedQueryCollection(options);
    }, [options]);

    const { data: rawCars, isLoading } = useWatchedQueryCollection(carsQuery);

    const cars = useMemo(() => {
        if(extraMapper) return extraMapper(rawCars);

        return rawCars as unknown as Array<Mapped>;
    }, [rawCars, extraMapper]);

    return { cars, isLoading };
}

export default useCars;