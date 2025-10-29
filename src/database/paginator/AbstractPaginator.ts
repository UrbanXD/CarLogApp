import { Kysely } from "@powersync/kysely-driver";
import { ComparisonOperatorExpression, SelectQueryBuilder } from "kysely";
import { addFilter } from "./utils/addFilter.ts";

export type FilterCondition<DB, TableItem, FieldName = keyof TableItem> = {
    field: FieldName
    operator: ComparisonOperatorExpression
    value: TableItem[FieldName]
    table?: keyof DB
    toLowerCase?: boolean
}

export type PaginatorOptions<DB, TableItem, MappedItem = any> = {
    baseQuery?: SelectQueryBuilder<TableItem>
    filterBy?: FilterCondition<DB, TableItem> | Array<FilterCondition<DB, TableItem>>
    perPage?: number
    mapper?: (tableRow?: TableItem) => Promise<MappedItem>
}

export abstract class Paginator<TableItem, MappedItem, DB> {
    private database: Kysely<DB>;
    protected table: keyof DB;
    private baseQuery?: SelectQueryBuilder<DB, TableItem, any>;
    filterBy: Array<FilterCondition<TableItem>>;
    private readonly mapper?: (tableRow?: TableItem) => Promise<MappedItem>;
    protected perPage: number;

    protected constructor(
        database: Kysely<DB>,
        table: keyof DB,
        options?: PaginatorOptions<TableItem>
    ) {
        this.database = database;
        this.table = table;

        this.perPage = options?.perPage ?? 15;
        this.baseQuery = options?.baseQuery;
        this.mapper = options?.mapper;
        this.setFilter(options?.filterBy);
    }

    protected getBaseQuery() {
        let query = this.baseQuery ?? this.database
        .selectFrom(this.table)
        .selectAll();

        query.limit(this.perPage + 1); // add plus 1 for get the cursor element as well

        this.filterBy.forEach(filter => {
            query = addFilter<TableItem, DB>(this.table, query, filter);
        });

        return query;
    }

    async map(tableItems: Array<TableItem>): Promise<Array<MappedItem>> {
        if(!this.mapper) return tableItems;

        return (await Promise.all(tableItems.map(await this.mapper).filter(element => element !== null)));
    }

    async filter(filterBy?: FilterCondition<TableItem> | Array<FilterCondition<TableItem>>): Promise<Array<TableItem>> {
        this.setFilter(filterBy);

        return await this.getBaseQuery().execute() as unknown as Array<TableItem>;
    }

    protected setFilter(filterBy?: FilterCondition<TableItem> | Array<FilterCondition<TableItem>>): void {
        if(!filterBy) return this.clearFilter();

        if(Array.isArray(filterBy)) return this.filterBy = filterBy;

        this.filterBy = [filterBy];
    }

    protected clearFilter() {
        this.filterBy = [];
    }

    abstract hasNext(): boolean;

    abstract hasPrevious(): boolean;

    abstract async initial(defaultValue?: TableItem): Promise<Array<MappedItem>>;

    abstract async refresh(): Promise<Array<MappedItem>>;

    abstract async next(): Promise<Array<MappedItem> | null>;

    abstract async previous(): Promise<Array<MappedItem> | null>;
}