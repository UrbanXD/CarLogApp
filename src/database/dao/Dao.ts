import { Kysely } from "@powersync/kysely-driver";
import { DatabaseType } from "../connector/powersync/AppSchema.ts";
import { AbstractMapper } from "./AbstractMapper.ts";
import { SelectQueryBuilder } from "kysely";
import { AbstractPowerSyncDatabase, WatchedQuery } from "@powersync/react-native";

type SingleCallback<Dto> = (data: Dto) => void;
type CollectionCallback<Dto> = (data: Array<Dto>) => void

export type WatcherOptions = {
    queryOnce?: boolean
}

type WatcherEntry<Dto> =
    | {
    type: "single"
    query: WatchedQuery
    cleanup: () => void
    count: number
    timeoutId?: any
    lastData?: Dto
    callbacks: Set<SingleCallback<Dto>>
}
    | {
    type: "collection"
    query: WatchedQuery
    cleanup: () => void
    count: number
    timeoutId?: any
    lastData?: Array<Dto>
    callbacks: Set<CollectionCallback<Dto>>
};

export class Dao<
    Entity extends { id: string | number },
    Dto,
    Mapper extends AbstractMapper<Entity, Dto, SelectEntity>,
    SelectEntity extends { id: string | number } = Entity
> {
    protected readonly db: Kysely<DatabaseType>;
    protected readonly powersync: AbstractPowerSyncDatabase;
    protected readonly table: keyof DatabaseType & string;
    readonly mapper: Mapper;
    private activeWatchers = new Map<string, WatcherEntry<Dto>>();

    constructor(
        db: Kysely<DatabaseType>,
        powersync: AbstractPowerSyncDatabase,
        table: keyof DatabaseType & string,
        mapper: Mapper
    ) {
        this.db = db;
        this.powersync = powersync;
        this.table = table;
        this.mapper = mapper;
    }

    selectQuery(): SelectQueryBuilder<DatabaseType, any, SelectEntity> {
        return this.db
        .selectFrom(this.table)
        .selectAll() as any;
    }

    private _internalWatch(
        key: string,
        isCollection: boolean,
        onData: any,
        watcherOptions?: WatcherOptions
    ): () => void {
        const queryOnce = watcherOptions?.queryOnce ?? false;

        const getWatchedQuery = () => {
            const query = isCollection
                          ? this.selectQuery()
                          : this.selectQuery().where(`${ this.table }.id` as any, "=", key);

            const compiled = query.compile();
            const watchedQuery = this.powersync.query<SelectEntity>({
                sql: compiled.sql,
                parameters: compiled.parameters as any[]
            }).watch({
                comparator: {
                    checkEquality: (current, previous) => {
                        if(current.length !== previous.length) return false;
                        return JSON.stringify(current) === JSON.stringify(previous);
                    }
                }
            });

            return watchedQuery;
        };

        let entry = this.activeWatchers.get(key) as WatcherEntry<Dto> | undefined;

        if(queryOnce && entry?.lastData) {
            setTimeout(() => onData(entry?.lastData), 0);
            return () => {};
        }

        if(queryOnce && !entry) {
            const watchedQuery = getWatchedQuery();

            const unregister = watchedQuery.registerListener({
                onData: (results) => {
                    if(!results) return;
                    const data = isCollection
                                 ? this.mapper.toDtoArray(results as Array<SelectEntity>)
                                 : (results.length > 0 ? this.mapper.toDto(results[0]) : null);
                    onData(data);
                    unregister();
                },
                onError: (err) => {
                    console.error(`DAO QueryOnce Error:`, err);
                    unregister();
                }
            });
            return () => unregister();
        }

        if(queryOnce) return () => {};

        if(entry?.timeoutId) {
            clearTimeout(entry.timeoutId);
            entry.timeoutId = undefined;
        }

        if(!entry) {
            const watchedQuery = getWatchedQuery();

            const newEntry: WatcherEntry<Dto> = isCollection ? {
                type: "collection",
                query: watchedQuery,
                cleanup: () => {},
                count: 0,
                callbacks: new Set(),
                lastData: undefined
            } : {
                type: "single",
                query: watchedQuery,
                cleanup: () => {},
                count: 0,
                callbacks: new Set(),
                lastData: undefined
            };

            const unregister = watchedQuery.registerListener({
                onData: (results) => {
                    if(!results) return;

                    try {
                        if(newEntry.type === "collection") {
                            const dtos = this.mapper.toDtoArray(results as Array<SelectEntity>);
                            newEntry.lastData = dtos;
                            newEntry.callbacks.forEach(cb => cb(dtos));
                        } else if(results.length > 0) {
                            const dto = this.mapper.toDto(results[0]);
                            newEntry.lastData = dto;
                            newEntry.callbacks.forEach(cb => cb(dto));
                        }
                    } catch(e) {
                        console.log("Error at watchedQuery listener onData: ", e);
                    }
                },
                onError: (err) => console.error(`DAO Watch Error [${ this.table }]:`, err)
            });

            newEntry.cleanup = unregister;
            entry = newEntry;
            this.activeWatchers.set(key, entry);
        }

        (entry.callbacks as Set<any>).add(onData);
        entry.count++;
        if(entry.lastData) {
            const cachedData = entry.lastData;
            setTimeout(() => onData(cachedData), 200);
        }

        return () => {
            const currentEntry = this.activeWatchers.get(key) as WatcherEntry<Dto>;
            if(!currentEntry) return;

            (currentEntry.callbacks as Set<any>).delete(onData);
            currentEntry.count--;

            if(currentEntry.count <= 0) {
                currentEntry.timeoutId = setTimeout(() => {
                    currentEntry.cleanup();
                    this.activeWatchers.delete(key);
                }, 5000);
            }
        };
    }

    watch(id: string | number, onData: SingleCallback<Dto>, options?: WatcherOptions): () => void {
        return this._internalWatch(String(id), false, onData, options);
    }

    watchCollection(onData: CollectionCallback<Dto>, options?: WatcherOptions): () => void {
        return this._internalWatch(`COLLECTION_${ this.table }`, true, onData, options);
    }

    async getAll(): Promise<Array<Dto>> {
        const entities = await this.selectQuery().execute();
        return this.mapper.toDtoArray(entities);
    }

    async getById(id: string | number | null, safe: boolean = true): Promise<Dto | null> {
        if(!id) {
            if(safe) throw new Error(`ID is required for ${ this.table }`);
            return null;
        }

        const entity = await this.selectQuery()
        .where(`${ this.table }.id` as any, "=", id as any)
        .executeTakeFirst() as unknown as SelectEntity;

        if(safe && !entity) throw new Error(`Table item not found by ${ id } id. [${ this.table }]`);

        return entity ? await this.mapper.toDto(entity) : null;
    }

    async create(entity: Entity): Promise<Entity["id"]> {
        const result = await this.db
        .insertInto(this.table as any)
        .values(entity as any)
        .returning("id" as any)
        .executeTakeFirst();

        const insertedId = (result as any)?.id;
        if(!insertedId) throw new Error(`Failed to create item in [${ this.table }]`);

        return insertedId;
    }

    async update(entity: Partial<Entity> & Pick<Entity, "id">): Promise<Entity["id"]> {
        const { id, ...updateData } = entity;

        const result = await this.db
        .updateTable(this.table)
        .set(updateData)
        .where("id", "=", id as any)
        .returning("id")
        .executeTakeFirst();

        const updatedId = result?.id;
        if(!updatedId) throw new Error(`Table item not found by ${ id } id. [${ this.table }]`);

        return updatedId;
    }

    async delete(id: string | number | null): Promise<Entity["id"]> {
        if(!id) throw new Error(`Table item not found by ${ id }. [${ this.table }]`);

        const result = await this.db
        .deleteFrom(this.table)
        .where("id", "=", id as any)
        .returning("id")
        .executeTakeFirst();

        const deletedId = result?.id;
        if(!deletedId) throw new Error(`Table item not found by ${ id }. [${ this.table }]`);

        return deletedId;
    }
}