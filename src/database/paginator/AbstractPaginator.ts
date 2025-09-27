import { Kysely } from "@powersync/kysely-driver";
import { ComparisonOperatorExpression } from "kysely";
import { addFilter } from "./utils/addFilter.ts";

export type FilterCondition<TableItem, FieldName = keyof TableItem> = {
    field: FieldName
    operator: ComparisonOperatorExpression
    value: TableItem[FieldName]
    toLowerCase?: boolean
}

export type PaginatorOptions<TableItem, MappedItem = any> = {
    filterBy?: FilterCondition<TableItem> | Array<FilterCondition<TableItem>>
    perPage?: number
    mapper?: (tableRow?: TableItem) => MappedItem
}

export abstract class Paginator<TableItem, MappedItem, DB> {
    private database: Kysely<DB>;
    private table: keyof DB;
    private filterBy: Array<FilterCondition<TableItem>>;
    private readonly mapper?: (tableRow?: TableItem) => MappedItem | Promise<MappedItem>;
    protected perPage: number;

    protected constructor(
        database: Kysely<DB>,
        table: keyof DB,
        options?: PaginatorOptions<TableItem>
    ) {
        this.database = database;
        this.table = table;

        this.perPage = options?.perPage ?? 15;
        this.mapper = options?.mapper;
        this.setFilter(options?.filterBy);
    }

    protected getBaseQuery() {
        let query = this.database
        .selectFrom(this.table)
        .selectAll()
        .limit(this.perPage + 1); // add plus 1 for get the cursor element as well

        this.filterBy.forEach(filter => {
            query = addFilter<TableItem, DB>(query, filter);
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

    abstract async next(): Promise<Array<MappedItem> | null>;

    abstract async previous(): Promise<Array<MappedItem> | null>;
}