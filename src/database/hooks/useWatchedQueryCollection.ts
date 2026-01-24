import { useEffect, useState } from "react";
import { SelectQueryBuilder } from "kysely";
import { DatabaseType } from "../connector/powersync/AppSchema.ts";
import { watchQuery, WatchQueryOptions } from "../watcher/watcher.ts";
import { useDatabase } from "../../contexts/database/DatabaseContext.ts";

export type UseWatchedQueryCollectionProps<Dto, WatchEntity = any> = {
    query: SelectQueryBuilder<DatabaseType, any, WatchEntity>,
    mapper: (watchEntity: Array<WatchEntity>) => Array<Dto>,
    options?: WatchQueryOptions<WatchEntity>
}

type UseWatchedCollectionResult<Dto> = {
    data: Array<Dto>
    isLoading: boolean
}

export function useWatchedQueryCollection<Dto, WatchEntity = any>({
    query,
    mapper,
    options
}: UseWatchedQueryCollectionProps<Dto, WatchEntity>): UseWatchedCollectionResult<Dto> {
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
                } catch(e) {
                    console.log("useWatchedQueryCollection error: ", e);
                } finally {
                    setIsLoading(false);
                }
            },
            options
        );

        return unwatch;
    }, [query, mapper, options]);

    return { data, isLoading };
}