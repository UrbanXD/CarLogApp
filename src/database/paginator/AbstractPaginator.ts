import { Kysely, sql } from "@powersync/kysely-driver";
import { ComparisonOperatorExpression, Expression, RawBuilder, SelectQueryBuilder, SqlBool } from "kysely";
import { DatabaseType } from "../connector/powersync/AppSchema.ts";
import { EventEmitter } from "events";

export const FILTER_CHANGED_EVENT = "filterChanged";

export type FilterCondition<TableItem> = {
    field: keyof TableItem
    operator: ComparisonOperatorExpression
    value: any
    table?: keyof DatabaseType | null
    customSql?: (fieldRef: string | RawBuilder<any>) => RawBuilder<any>
}

export type FilterGroup<TableItem> = {
    logic: "AND" | "OR"
    filters: Array<FilterCondition<TableItem>>
}

export type AddFilterArgs<TableItem> = {
    groupKey: string,
    filter: FilterCondition<TableItem> | Array<FilterCondition<TableItem>>,
    logic?: "OR" | "AND",
    defaultItemId?: any
}

export type ReplaceFilterArgs<TableItem> = {
    groupKey: string,
    filter: FilterCondition<TableItem>,
    logic?: "OR" | "AND",
    defaultItemId?: any
}

export type RemoveFilterArgs<TableItem> = {
    groupKey: string,
    filter: FilterCondition<TableItem>,
    byValue?: boolean,
    defaultItemId?: any
}

export type PaginatorOptions<TableItem, MappedItem = TableItem> = {
    baseQuery?: SelectQueryBuilder<DatabaseType, any, TableItem>
    filterBy?: Partial<FilterGroup<TableItem>> & { group?: string }
    perPage?: number
    mapper?: (tableRow: TableItem) => Promise<MappedItem> | MappedItem
}

export abstract class Paginator<TableItem, MappedItem = TableItem> extends EventEmitter {
    private database: Kysely<DatabaseType>;
    table: keyof DatabaseType;
    private readonly baseQuery?: SelectQueryBuilder<DatabaseType, any, TableItem>;
    filterBy: Map<string, FilterGroup<TableItem>> = new Map();
    private readonly mapper?: (tableRow: TableItem) => Promise<MappedItem> | MappedItem;
    protected perPage: number;

    protected constructor(
        database: Kysely<DatabaseType>,
        table: keyof DatabaseType,
        options?: PaginatorOptions<TableItem, MappedItem>
    ) {
        super();

        this.database = database;
        this.table = table;

        this.perPage = options?.perPage ?? 15;
        this.baseQuery = options?.baseQuery;
        this.mapper = options?.mapper;
        if(options?.filterBy) {
            this.filterBy.set(
                options.filterBy?.group ?? "default",
                { logic: options.filterBy?.logic ?? "AND", filters: options.filterBy?.filters ?? [] }
            );
        }
    }

    protected getBaseQuery(): SelectQueryBuilder<DatabaseType, any, TableItem> {
        let query = (this.baseQuery ?? this.database
        .selectFrom(this.table)
        .selectAll()) as SelectQueryBuilder<DatabaseType, any, TableItem>;

        this.filterBy.forEach((group) => {
            if(group.filters.length === 0) return;

            query = query.where((eb) => {
                const expressions: Expression<SqlBool>[] = [];

                group.filters.forEach((filter) => {
                    const fieldName = `${ String(filter?.table ?? this.table) }.${ String(filter.field) }`;
                    const filterField = sql.ref(fieldName);

                    const operand = filter.customSql
                                    ? filter.customSql(filterField)
                                    : filterField;

                    expressions.push(eb.eb(operand, filter.operator, filter.value));
                });

                if(group.logic.toUpperCase() === "OR") {
                    return eb.or(expressions);
                }

                return eb.and(expressions);
            });
        });

        return query.limit(this.perPage + 1); // add plus 1 for get the cursor element as well
    }

    async map(tableItems: Array<TableItem>): Promise<Array<MappedItem>> {
        if(!this.mapper) {
            if(tableItems.length > 0 && typeof tableItems[0] !== typeof {} as any) {
                return [];
            }

            return tableItems as unknown as Array<MappedItem>;
        }

        return (await Promise.all(tableItems.map(await this.mapper).filter(element => element !== null)));
    }

    async addFilter({
        groupKey,
        filter,
        logic = "AND",
        defaultItemId
    }: AddFilterArgs<TableItem>): Promise<Array<MappedItem>> {
        const group = this.filterBy.get(groupKey);
        if(!group) {
            this.filterBy.set(
                groupKey,
                { logic, filters: Array.isArray(filter) ? filter : [filter] }
            );
            this.emit(FILTER_CHANGED_EVENT, new Map(this.filterBy));

            return await this.initial(defaultItemId);
        }

        const groupFilters = group.filters;
        if(Array.isArray(filter)) {
            groupFilters.push(...filter);
        } else {
            groupFilters.push(filter);
        }

        this.filterBy.set(
            groupKey,
            { logic: group?.logic ?? logic, filters: groupFilters }
        );
        this.emit(FILTER_CHANGED_EVENT, new Map(this.filterBy));

        return await this.initial(defaultItemId);
    }

    async replaceFilter({
        groupKey,
        filter,
        logic = "AND",
        defaultItemId
    }: ReplaceFilterArgs<TableItem>): Promise<Array<MappedItem>> {
        const group = this.filterBy.get(groupKey);
        if(!group) {
            this.filterBy.set(
                groupKey,
                { logic, filters: [filter] }
            );
            this.emit(FILTER_CHANGED_EVENT, new Map(this.filterBy));

            return await this.initial(defaultItemId);
        }

        const filterExpression = (groupFilter: FilterCondition<TableItem>) =>
            groupFilter.field !== filter.field ||
            groupFilter.table !== filter.table ||
            groupFilter.operator !== filter.operator;

        const groupFilters = group.filters.filter(filterExpression);
        groupFilters.push(filter);

        this.filterBy.set(
            groupKey,
            { logic: group?.logic ?? logic, filters: groupFilters }
        );
        this.emit(FILTER_CHANGED_EVENT, new Map(this.filterBy));

        return await this.initial(defaultItemId);
    }

    async removeFilter({
        groupKey,
        filter,
        byValue = true,
        defaultItemId
    }: RemoveFilterArgs<TableItem>): Promise<Array<MappedItem> | null> {
        const group = this.filterBy.get(groupKey);
        if(!group) return null;

        const filterExpression = (groupFilter: FilterCondition<TableItem>) =>
            groupFilter.field !== filter.field ||
            groupFilter.table !== filter.table ||
            groupFilter.operator !== filter.operator ||
            (!byValue ? false : groupFilter.value !== filter.value);

        this.filterBy.set(
            groupKey,
            {
                ...group,
                filters: group.filters.filter(filterExpression)
            }
        );
        this.emit(FILTER_CHANGED_EVENT, new Map(this.filterBy));

        return await this.initial(defaultItemId);
    }

    async clearFilters(groupKey?: string, defaultItemId?: string | number): Promise<Array<MappedItem> | null> {
        if(!groupKey) { //if undefined then clear all groups
            this.filterBy.clear();
            this.emit(FILTER_CHANGED_EVENT, new Map());

            return await this.initial(defaultItemId);
        }

        const group = this.filterBy.get(groupKey);
        if(!group) return null;

        this.filterBy.delete(groupKey);
        this.emit(FILTER_CHANGED_EVENT, new Map(this.filterBy));

        return await this.initial();
    }

    abstract hasNext(): boolean;

    abstract hasPrevious(): boolean;

    abstract initial(defaultItemId?: any): Promise<Array<MappedItem>>;

    abstract refresh(): Promise<Array<MappedItem>>;

    abstract next(): Promise<Array<MappedItem> | null>;

    abstract previous(): Promise<Array<MappedItem> | null>;
}