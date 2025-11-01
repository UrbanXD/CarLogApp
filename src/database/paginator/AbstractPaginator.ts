import { Kysely, sql } from "@powersync/kysely-driver";
import { ComparisonOperatorExpression, SelectQueryBuilder } from "kysely";
import { DatabaseType } from "../connector/powersync/AppSchema.ts";
import { EventEmitter } from "events";

export const FILTER_CHANGED_EVENT = "filterChanged";

export type FilterCondition<TableItem, DB = DatabaseType, FieldName = keyof TableItem> = {
    field: FieldName
    operator: ComparisonOperatorExpression
    value: TableItem[FieldName]
    table?: keyof DB
    customSql?: (fieldRef: string) => string
}

export type FilterGroup<TableItem, DB = DatabaseType> = {
    logic: "AND" | "OR"
    filters: Array<FilterCondition<TableItem, DB>>
}

export type AddFilterArgs<TableItem, DB = DatabaseType> = {
    groupKey: string,
    filter: FilterCondition<TableItem, DB> | Array<FilterCondition<TableItem, DB>>,
    logic?: "OR" | "AND"
}

export type ReplaceFilterArgs<TableItem, DB = DatabaseType> = {
    groupKey: string,
    filter: FilterCondition<TableItem, DB>,
    logic?: "OR" | "AND"
}

export type RemoveFilterArgs<TableItem, DB = DatabaseType> = {
    groupKey: string,
    filter: FilterCondition<TableItem, DB>,
    byValue?: boolean
}

export type PaginatorOptions<TableItem, MappedItem = TableItem, DB = DatabaseType> = {
    baseQuery?: SelectQueryBuilder<DB, TableItem>
    filterBy?: Partial<FilterGroup<TableItem, DB>> & { group?: string }
    perPage?: number
    mapper?: (tableRow?: TableItem) => Promise<MappedItem>
}

export abstract class Paginator<TableItem, MappedItem = TableItem, DB = DatabaseType> extends EventEmitter {
    private database: Kysely<DB>;
    protected table: keyof DB;
    private readonly baseQuery?: SelectQueryBuilder<DB, TableItem, any>;
    filterBy: Map<string, FilterGroup<TableItem, DB>> = new Map();
    private readonly mapper?: (tableRow?: TableItem) => Promise<MappedItem>;
    protected perPage: number;

    protected constructor(
        database: Kysely<DB>,
        table: keyof DB,
        options?: PaginatorOptions<TableItem, MappedItem, DB>
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

    protected getBaseQuery() {
        let query = this.baseQuery ?? this.database
        .selectFrom(this.table)
        .selectAll();

        this.filterBy.forEach((group) => {
            if(group.filters.length === 0) return;

            query = query.where((eb) => {
                const expressions: Expression<SqlBool>[] = [];

                group.filters.forEach((filter) => {
                    let filterField = sql.ref(`${ filter?.table ?? this.table }.${ filter.field }`);

                    let filterValue = filter.value;
                    if(filter.toLowerCase && typeof filterValue === "string") {
                        filterValue = filterValue.toLowerCase();
                    }

                    expressions.push(eb(
                        filter.customSql ? filter.customSql(filterField) : filterField,
                        filter.operator,
                        filterValue
                    ));
                });

                if(group.logic.toUpperCase() === "OR") {
                    return eb.or(expressions);
                }

                return eb.and(expressions);
            });
        });

        query = query.limit(this.perPage + 1); // add plus 1 for get the cursor element as well

        return query;
    }

    async map(tableItems: Array<TableItem>): Promise<Array<MappedItem>> {
        if(!this.mapper) return tableItems;

        return (await Promise.all(tableItems.map(await this.mapper).filter(element => element !== null)));
    }

    async addFilter({ groupKey, filter, logic = "AND" }: AddFilterArgs<TableItem, DB>): Promise<Array<MappedItem>> {
        const group = this.filterBy.get(groupKey);
        if(!group) {
            this.filterBy.set(
                groupKey,
                { logic, filters: Array.isArray(filter) ? filter : [filter] }
            );
            this.emit(FILTER_CHANGED_EVENT, new Map(this.filterBy));

            return await this.initial();
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

        return await this.initial();
    }

    async replaceFilter({
        groupKey,
        filter,
        logic = "AND"
    }: ReplaceFilterArgs<TableItem, DB>): Promise<Array<MappedItem>> {
        const group = this.filterBy.get(groupKey);
        if(!group) {
            this.filterBy.set(
                groupKey,
                { logic, filters: [filter] }
            );
            this.emit(FILTER_CHANGED_EVENT, new Map(this.filterBy));

            return await this.initial();
        }

        const filterExpression = (groupFilter: FilterCondition<TableItem, DB>) =>
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

        return await this.initial();
    }

    async removeFilter({
        groupKey,
        filter,
        byValue = true
    }: RemoveFilterArgs<TableItem, DB>): Promise<Array<MappedItem>> | null {
        const group = this.filterBy.get(groupKey);
        if(!group) return null;

        const filterExpression = (groupFilter: FilterCondition<TableItem, DB>) =>
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

        return await this.initial();
    }

    async clearFilters(groupKey?: string): Promise<Array<MappedItem>> | null {
        if(!groupKey) { //if undefined then clear all groups
            this.filterBy.clear();
            this.emit(FILTER_CHANGED_EVENT, new Map());

            return await this.initial();
        }

        const group = this.filterBy.get(groupKey);
        if(!group) return null;

        this.filterBy.delete(groupKey);
        this.emit(FILTER_CHANGED_EVENT, new Map(this.filterBy));

        return await this.initial();
    }

    abstract hasNext(): boolean;

    abstract hasPrevious(): boolean;

    abstract async initial(defaultValue?: TableItem): Promise<Array<MappedItem>>;

    abstract async refresh(): Promise<Array<MappedItem>>;

    abstract async next(): Promise<Array<MappedItem> | null>;

    abstract async previous(): Promise<Array<MappedItem> | null>;
}