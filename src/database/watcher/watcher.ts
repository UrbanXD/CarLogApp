import { AbstractPowerSyncDatabase, WatchedQuery } from "@powersync/react-native";
import { SelectQueryBuilder } from "kysely";
import { DatabaseType } from "../connector/powersync/AppSchema.ts";
import { jsonArrayParse } from "../utils/jsonArrayParse.ts";

export type WatchQueryOptions<WatchEntity = any> = {
    queryOnce?: boolean
    enabled?: boolean
    jsonArrayFields?: Array<keyof WatchEntity>
}

type WatcherEntry = {
    query: WatchedQuery
    cleanup: () => void
    count: number
    timeoutId?: ReturnType<typeof setTimeout>
    lastData?: any
    callbacks: Set<(data: any) => void>
};

const activeWatchers = new Map<string, WatcherEntry>();

export type WatchQueryProps<WatchEntity> = {
    powersync: AbstractPowerSyncDatabase
    query: SelectQueryBuilder<DatabaseType, any, any>
    onData: (data: Array<WatchEntity>) => void
    onError?: (error?: Error) => void
    options?: WatchQueryOptions<WatchEntity>
}

export function watchQuery<WatchEntity>({
    powersync,
    query,
    onData,
    onError,
    options
}: WatchQueryProps<WatchEntity>): (() => void) {
    const {
        queryOnce = false,
        enabled = true,
        jsonArrayFields = []
    } = options ?? {};

    if(!enabled) {
        onError?.();
        return () => {};
    }

    const compiled = query.compile();
    const sql = compiled.sql;
    const params = compiled.parameters as Array<any>;

    const watchKey = `${ sql }_${ JSON.stringify(params) }`;
    let entry = activeWatchers.get(watchKey);

    if(!entry) {
        const watchedQuery = powersync
        .query<WatchEntity>({ sql, parameters: params })
        .watch();

        entry = {
            query: watchedQuery,
            callbacks: new Set(),
            count: 0,
            cleanup: () => {}
        };

        const unregister = watchedQuery.registerListener({
            onData: (results) => {
                const parsedResults = results.map(row => jsonArrayParse(row, jsonArrayFields));

                entry!.lastData = parsedResults;
                entry!.callbacks.forEach(cb => cb(parsedResults));

                if(queryOnce) {
                    unregister();
                    onData(parsedResults);
                }
            },
            onError: (error) => {
                onError?.(error);
                console.log(`Watch Query Error [${ sql }, ${ params }]:`, error);
                if(queryOnce) unregister();
            }
        });

        entry.cleanup = unregister;
        if(!queryOnce) activeWatchers.set(watchKey, entry);
    }

    if(entry.lastData) {
        const cachedData = entry.lastData;
        setTimeout(() => onData(cachedData), 0);
    }

    if(!queryOnce) {
        entry.callbacks.add(onData);
        entry.count++;

        if(entry.timeoutId) {
            clearTimeout(entry.timeoutId);
            entry.timeoutId = undefined;
        }
    }

    return () => {
        const currentEntry = activeWatchers.get(watchKey);
        if(!currentEntry) return;

        currentEntry.callbacks.delete(onData);
        currentEntry.count--;

        if(currentEntry.count <= 0) {
            currentEntry.timeoutId = setTimeout(() => {
                currentEntry!.cleanup();
                activeWatchers.delete(watchKey);
            }, 5000);
        }
    };
}