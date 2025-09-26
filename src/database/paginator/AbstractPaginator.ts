import { Kysely } from "@powersync/kysely-driver";
import { ComparisonOperatorExpression } from "kysely";
import { addFilter } from "./utils/addFilter.ts";
import { addSearchFilter } from "./utils/addSearchFilter.ts";

export type FilterCondition<TableItem, FieldName = keyof TableItem> = {
    field: FieldName
    operator: ComparisonOperatorExpression
    value: TableItem[FieldName]
    toLowerCase?: boolean
}

export type PaginatorOptions<TableItem, MappedItem = any> = {
    filterBy?: FilterCondition<TableItem> | Array<FilterCondition<TableItem>>
    searchBy?: keyof TableItem | Array<keyof TableItem>
    perPage?: number
    mapper?: (tableRow?: TableItem) => MappedItem
}

export abstract class Paginator<TableItem, MappedItem, DB> {
    private database: Kysely<DB>;
    private table: keyof DB;
    private readonly filterBy?: FilterCondition<TableItem> | Array<FilterCondition<TableItem>>;
    private readonly searchBy?: keyof TableItem | Array<keyof TableItem>;
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
        this.filterBy = options?.filterBy;
        this.searchBy = options?.searchBy;
        this.mapper = options?.mapper;
    }

    protected getBaseQuery() {
        let query = this.database
        .selectFrom(this.table)
        .selectAll()
        .limit(this.perPage + 1); // add plus 1 for get the cursor element as well

        if(this.filterBy && Array.isArray(this.filterBy)) {
            this.filterBy.forEach(filter => {
                query = addFilter<TableItem, DB>(query, filter);
            });
        } else if(this.filterBy) {
            query = addFilter<TableItem, DB>(query, this.filterBy);
        }

        return query;
    }

    async map(tableItems: Array<TableItem>): Promise<Array<MappedItem>> {
        if(!this.mapper) return tableItems;

        return (await Promise.all(tableItems.map(await this.mapper).filter(element => element !== null)));
    }

    async filter(searchTerm?: string): Promise<Array<MappedItem>> {
        let query = this.getBaseQuery();
        query = addSearchFilter<TableItem, DB>(query, searchTerm);

        const result = await query.execute() as unknown as Array<TableItem>;

        return await this.map(result);
    }

    abstract hasNext(): boolean;

    abstract hasPrevious(): boolean;

    abstract async initial(defaultValue?: string | number): Promise<Array<MappedItem>>;

    abstract async next(searchTerm?: string): Promise<Array<MappedItem> | null>;

    abstract async previous(searchTerm?: string): Promise<Array<MappedItem> | null>;
}