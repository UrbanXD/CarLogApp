import { useEffect, useState } from "react";
import { SelectQueryBuilder } from "kysely";
import { DatabaseType } from "../connector/powersync/AppSchema.ts";
import { watchQuery, WatchQueryOptions } from "../watcher/watcher.ts";
import { useDatabase } from "../../contexts/database/DatabaseContext.ts";

export type UseWatchedQueryCollectionProps<Dto, WatchEntity = any> = {
    query: SelectQueryBuilder<DatabaseType, any, WatchEntity>,
    mapper?: (watchEntity: Array<WatchEntity>) => Dto | Promise<Dto>,
    options?: WatchQueryOptions<WatchEntity>
}

type UseWatchedCollectionResult<Dto> = {
    data: Dto | null
    isLoading: boolean
}

export function useWatchedQueryCollection<Dto, WatchEntity = any>(props: UseWatchedQueryCollectionProps<Dto, WatchEntity> | null): UseWatchedCollectionResult<Dto> {
    const { powersync } = useDatabase();

    const {
        query,
        mapper,
        options
    } = props ?? {};


    const [data, setData] = useState<Dto | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let active = true;

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
                if(!active) return;

                try {
                    setData(mapper ? await mapper(result) : result as unknown as Dto);
                } catch(e) {
                    console.log("useWatchedQueryCollection error: ", e);
                } finally {
                    setIsLoading(false);
                }
            },
            onError: () => {
                if(!active) return;

                setData(null);
                setIsLoading(false);
            },
            options
        });

        return () => {
            active = false;
            if(unwatch) unwatch();
        };
    }, [props]);

    return { data, isLoading };
}