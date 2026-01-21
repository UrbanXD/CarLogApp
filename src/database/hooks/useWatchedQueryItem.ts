import { useEffect, useState } from "react";
import { SelectQueryBuilder } from "kysely";
import { DatabaseType } from "../connector/powersync/AppSchema.ts";
import { useDatabase } from "../../contexts/database/DatabaseContext.ts";
import { watchQuery, WatchQueryOptions } from "../watcher/watcher.ts";

type UseWatchedItemResult<Dto> = {
    data: Dto | null
    isLoading: boolean
}

export function useWatchedQueryItem<Dto, WatchEntity = any>(
    query: SelectQueryBuilder<DatabaseType, any, WatchEntity>,
    mapper: (watchEntity: WatchEntity) => Dto,
    options?: WatchQueryOptions
): UseWatchedItemResult<Dto> {
    const { powersync } = useDatabase();

    const [data, setData] = useState<Dto | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);

        const unwatch = watchQuery<WatchEntity>(
            powersync,
            query,
            (result) => {
                try {
                    setData(result.length > 0 ? mapper(result[0]) : null);
                    setIsLoading(false);
                } catch(e) {
                    console.log("useWatchedQueryItem error: ", e);
                }
            },
            options
        );

        return unwatch;
    }, [query, mapper, options]);

    return { data, isLoading };
}