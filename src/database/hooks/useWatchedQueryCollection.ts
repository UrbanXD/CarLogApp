import { useEffect, useState } from "react";
import { SelectQueryBuilder } from "kysely";
import { DatabaseType } from "../connector/powersync/AppSchema.ts";
import { watchQuery, WatchQueryOptions } from "../watcher/watcher.ts";
import { useDatabase } from "../../contexts/database/DatabaseContext.ts";

type UseWatchedCollectionResult<Dto> = {
    data: Array<Dto>
    isLoading: boolean
}

export function useWatchedQueryCollection<Dto, WatchEntity = any>(
    query: SelectQueryBuilder<DatabaseType, any, WatchEntity>,
    mapper: (watchEntities: Array<WatchEntity>) => Array<Dto>,
    options?: WatchQueryOptions
): UseWatchedCollectionResult<Dto> {
    const { powersync } = useDatabase();

    const [data, setData] = useState<Array<Dto>>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);

        const unwatch = watchQuery<WatchEntity>(
            powersync,
            query,
            (result) => {
                try {
                    setData(mapper(result));
                    setIsLoading(false);
                } catch(e) {
                    console.log("useWatchedQueryCollection error: ", e);
                }
            },
            options
        );

        return unwatch;
    }, [query, mapper]);

    return { data, isLoading };
}