import { Dao } from "../dao/Dao.ts";
import { useEffect, useState } from "react";

export function useWatchedCollection<Dto>(dao: Dao<any, Dto, any, any>): { data: Array<Dto>, isLoading: boolean } {
    const [data, setData] = useState<Dto[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        const unwatch = dao.watchCollection((updatedList) => {
            setData(updatedList);
            setIsLoading(false);
        });

        return unwatch;
    }, [dao]);

    return { data, isLoading };
}