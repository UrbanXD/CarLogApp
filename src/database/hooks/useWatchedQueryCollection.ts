import { Dao, WatcherOptions } from "../dao/Dao.ts";
import { useEffect, useState } from "react";

type UseWatchedCollectionResult<Dto> = {
    data: Array<Dto>
    isLoading: boolean
}

export function useWatchedCollection<Dto>(
    dao: Dao<any, Dto, any, any>,
    options?: WatcherOptions
): UseWatchedCollectionResult<Dto> {
    const [data, setData] = useState<Dto[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        const unwatch = dao.watchCollection((updatedList) => {
            setData(updatedList);
            setIsLoading(false);
        }, options);

        return unwatch;
    }, [dao]);

    return { data, isLoading };
}