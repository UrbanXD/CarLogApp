import { Dao } from "../dao/Dao.ts";
import { useEffect, useState } from "react";

type UseWatchedQueryResult<Dto> = {
    data: Dto | null
    isLoading: boolean
}

export function useWatchedQueryItem<Dto>(dao: Dao<any, Dto, any, any>, id: any): UseWatchedQueryResult<Dto> {
    const [data, setData] = useState<Dto | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if(id === undefined || id === null) {
            setIsLoading(false);
            return;
        }

        setIsLoading(true);

        const unwatch = dao.watch(id, (updated) => {
            setData(updated);
            setIsLoading(false);
        });

        return () => unwatch();
    }, [id, dao]);

    return { data, isLoading };
}