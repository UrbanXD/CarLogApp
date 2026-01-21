import { AbstractPowerSyncDatabase, WatchedQuery } from "@powersync/react-native";
import { SelectQueryBuilder } from "kysely";
import { DatabaseType } from "../connector/powersync/AppSchema.ts";

export type WatchQueryOptions = {
    queryOnce?: boolean
    enabled?: boolean
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

export function watchQuery<WatchEntity>(
    powersync: AbstractPowerSyncDatabase,
    query: SelectQueryBuilder<DatabaseType, any, any>,
    onData: (data: Array<WatchEntity>) => void,
    options?: WatchQueryOptions
): (() => void) {
    const {
        queryOnce = false,
        enabled = true
    } = options ?? {};

    if(!enabled) return () => {};

    const compiled = query.compile();
    const sql = compiled.sql;
    const params = compiled.parameters as Array<any>;

    const watchKey = `${ sql }_${ JSON.stringify(params) }`;
    let entry = activeWatchers.get(watchKey);

    if(!entry) {
        const watchedQuery = powersync
        .query({ sql, parameters: params })
        .watch({
            comparator: {
                checkEquality: (current, previous) => {
                    if(current.length !== previous.length) return false;
                    return JSON.stringify(current) === JSON.stringify(previous);
                }
            }
        });

        entry = {
            query: watchedQuery,
            callbacks: new Set(),
            count: 0,
            cleanup: () => {}
        };

        const unregister = watchedQuery.registerListener({
            onData: (results: any) => {
                entry!.lastData = results;
                entry!.callbacks.forEach(cb => cb(results));
                if(queryOnce) unregister();
            },
            onError: (error) => {
                console.log(`Watch Query Error [${ sql }, ${ params }]:`, error);
                if(queryOnce) unregister();
            }
        });

        if(queryOnce) return () => unregister();

        entry.cleanup = unregister;
        activeWatchers.set(watchKey, entry);
    }

    if(entry.lastData) {
        const cachedData = entry.lastData;
        setTimeout(() => onData(cachedData), 0);

        if(queryOnce) return () => {};
    }

    if(queryOnce) return () => {};

    entry.callbacks.add(onData);
    entry.count++;

    if(entry.timeoutId) {
        clearTimeout(entry.timeoutId);
        entry.timeoutId = undefined;
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