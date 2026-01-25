import { useDatabase } from "../../../contexts/database/DatabaseContext.ts";
import { Car } from "../schemas/carSchema.ts";
import { WatchQueryOptions } from "../../../database/watcher/watcher.ts";
import { useWatchedQueryCollection } from "../../../database/hooks/useWatchedQueryCollection.ts";
import { useMemo, useRef } from "react";

function useCars<Mapped = Car>(options?: WatchQueryOptions & { extraMapper?: (cars: Array<Car>) => Array<Mapped> }) {
    const { carDao } = useDatabase();

    const { extraMapper, ...queryOptions } = options ?? {};

    const queryOptionsKey = JSON.stringify(queryOptions);
    const carsQuery = useMemo(() => {
        return carDao.carWatchedQueryCollection(queryOptions);
    }, [queryOptionsKey]);

    const { data: rawCars, isLoading } = useWatchedQueryCollection(carsQuery);

    const mapperRef = useRef(extraMapper);
    mapperRef.current = extraMapper;

    const cars = useMemo(() => {
        if(mapperRef.current) {
            return mapperRef.current(rawCars);
        }
        return rawCars as unknown as Array<Mapped>;
    }, [rawCars]);

    return { cars, isLoading };
}

export default useCars;