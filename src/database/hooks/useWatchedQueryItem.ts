import { useEffect, useState } from "react";
import { SelectQueryBuilder } from "kysely";
import { DatabaseType } from "../connector/powersync/AppSchema.ts";
import { useDatabase } from "../../contexts/database/DatabaseContext.ts";
import { watchQuery, WatchQueryOptions } from "../watcher/watcher.ts";

export type UseWatchedQueryItemProps<Dto, WatchEntity = any> = {
    query: SelectQueryBuilder<DatabaseType, any, WatchEntity>,
    mapper?: (watchEntity: WatchEntity) => Dto | Promise<Dto>,
    options?: WatchQueryOptions<WatchEntity>
}

type UseWatchedItemResult<Dto> = {
    data: Dto | null
    isLoading: boolean
}

export function useWatchedQueryItem<Dto, WatchEntity = any>(props: UseWatchedQueryItemProps<Dto, WatchEntity> | null): UseWatchedItemResult<Dto> {
    const { powersync } = useDatabase();

    const {
        query,
        mapper,
        options
    } = props ?? {};


    const [data, setData] = useState<Dto | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if(!query) {
            setData(null);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);

        const unwatch = watchQuery<WatchEntity>({
            powersync,
            query,
            onData: async (result) => {
                try {
                    setData(result.length > 0
                            ? (mapper ? await mapper(result[0]) : result[0] as unknown as Dto)
                            : null);
                } catch(e) {
                    console.log("useWatchedQueryItem error: ", e);
                } finally {
                    setIsLoading(false);
                }
            },
            onError: () => setIsLoading(false),
            options
        });

        return unwatch;
    }, [props]);

    return { data, isLoading };
}