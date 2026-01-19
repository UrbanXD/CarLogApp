import { Dao, WatcherOptions } from "../dao/Dao.ts";
import { useEffect, useState } from "react";

type UseWatchedItemResult<Dto> = {
    data: Dto | null
    isLoading: boolean
}

export function useWatchedQueryItem<Dto>(
    dao: Dao<any, Dto, any, any>,
    id: any,
    options?: WatcherOptions
): UseWatchedItemResult<Dto> {
    const [data, setData] = useState<Dto | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);

        if(id === undefined || id === null) {
            setIsLoading(false);
            return;
        }

        const unwatch = dao.watch(id, (updated) => {
            setData(updated);
            setIsLoading(false);
        }, options);

        return () => unwatch();
    }, [id, dao]);

    return { data, isLoading };
}