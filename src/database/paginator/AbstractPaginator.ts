import { Kysely, sql } from "@powersync/kysely-driver";
import { ComparisonOperatorExpression, SelectQueryBuilder } from "kysely";
import { DatabaseType } from "../connector/powersync/AppSchema.ts";

export type FilterCondition<TableItem, DB = DatabaseType, FieldName = keyof TableItem> = {
    field: FieldName
    operator: ComparisonOperatorExpression
    value: TableItem[FieldName]
    table?: keyof DB
    toLowerCase?: boolean
}

export type FilterGroup<TableItem, DB = DatabaseType> = {
    logic: "AND" | "OR"
    filters: Array<FilterCondition<TableItem, DB>>
}

export type PaginatorOptions<TableItem, MappedItem = any, DB = DatabaseType> = {
    baseQuery?: SelectQueryBuilder<DB, TableItem>
    filterBy?: FilterCondition<TableItem, DB> | Array<FilterGroup<TableItem, DB>>
    perPage?: number
    mapper?: (tableRow?: TableItem) => Promise<MappedItem>
}

export abstract class Paginator<TableItem, MappedItem, DB> {
    private database: Kysely<DB>;
    protected table: keyof DB;
    private baseQuery?: SelectQueryBuilder<DB, TableItem, any>;
    filterBy: Array<FilterGroup<DB, TableItem>> = [];
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

        this.filterBy.forEach((group) => {
            if(group.filters.length === 0) return;

            query = query.where((eb) => {
                const expressions: Expression<SqlBool>[] = [];

                group.filters.forEach((filter) => {
                    let filterField = sql.ref(`${ filter?.table ?? this.table }.${ filter.field }`);

                    // @formatter:off
                    if(filter.toLowerCase) filterField = sql`lower(filterField)`;
                    // @formatter:on

                    let filterValue = filter.value;
                    if(filter.toLowerCase && typeof filterValue === "string") {
                        filterValue = filterValue.toLowerCase();
                    }

                    expressions.push(eb(filterField, filter.operator, filterValue));
                });

                if(group.logic.toUpperCase() === "OR") {
                    return eb.or(expressions);
                }

                return eb.and(expressions);
            });
        });

        return query;
    }

    async map(tableItems: Array<TableItem>): Promise<Array<MappedItem>> {
        if(!this.mapper) return tableItems;

        return (await Promise.all(tableItems.map(await this.mapper).filter(element => element !== null)));
    }

    async filter(filterBy?: FilterCondition<TableItem, DB> | Array<FilterGroup<TableItem, DB>>): Promise<Array<TableItem>> {
        this.setFilter(filterBy);

        return await this.getBaseQuery().execute() as unknown as Array<TableItem>;
    }

    protected setFilter(filterBy?: FilterCondition<TableItem, DB> | Array<FilterGroup<TableItem, DB>>): void {
        if(!filterBy) return this.clearFilter();

        if(Array.isArray(filterBy)) return this.filterBy = filterBy;

        this.filterBy = [{ logic: "AND", filters: [filterBy] }];
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