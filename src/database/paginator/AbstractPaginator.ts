import { Kysely, sql } from "@powersync/kysely-driver";
import { ComparisonOperatorExpression, OrderByDirectionExpression, SelectQueryBuilder } from "kysely";

export type FilterCondition<TableItem, FieldName = keyof TableItem> = {
    field: FieldName
    operator: ComparisonOperatorExpression
    value: TableItem[FieldName]
    toLowerCase?: boolean
}

export type OrderCondition<FieldName> = {
    field: FieldName
    direction?: OrderByDirectionExpression
    toLowerCase?: boolean
}

export type PaginatorOptions<TableItem> = {
    filterBy?: FilterCondition<TableItem> | Array<FilterCondition<TableItem>>
    orderBy?: OrderCondition<keyof TableItem> | Array<OrderCondition<keyof TableItem>>
    searchBy?: keyof TableItem | Array<keyof TableItem>
    perPage?: number
}


export abstract class Paginator<TableItem, DB> {
    private database: Kysely<DB>;
    private table: keyof DB;
    private readonly key: keyof TableItem | Array<keyof TableItem>;
    private readonly filterBy?: FilterCondition<TableItem> | Array<FilterCondition<TableItem>>;
    private readonly orderBy?: OrderCondition<keyof TableItem> | Array<OrderCondition<keyof TableItem>>;
    private readonly searchBy?: keyof TableItem | Array<keyof TableItem>;
    protected perPage: number;

    protected constructor(
        database: Kysely<DB>,
        table: keyof DB,
        key: keyof TableItem | Array<keyof TableItem>,
        options?: PaginatorOptions<TableItem>
    ) {
        this.database = database;
        this.table = table;
        this.key = key;

        this.perPage = options?.perPage ?? 15;
        this.filterBy = options?.filterBy;
        this.orderBy = options?.orderBy;
        this.searchBy = options?.searchBy;
    }

    protected getBaseQuery(reverseOrder?: boolean) {
        let query = this.database
        .selectFrom(this.table)
        .selectAll()
        .limit(this.perPage);

        if(this.filterBy && Array.isArray(this.filterBy)) {
            this.filterBy.forEach(filter => {
                query = this.addFilter(query, filter);
            });
        } else if(this.filterBy) {
            query = this.addFilter(query, this.filterBy);
        }

        if(this.orderBy && Array.isArray(this.orderBy)) {
            this.orderBy.forEach(order => {
                query = this.addOrder(query, order, reverseOrder);
            });
        } else if(this.orderBy) {
            query = this.addOrder(query, this.orderBy, reverseOrder);
        }

        if(Array.isArray(this.key)) {
            (this.key as Array<keyof TableItem>).forEach(keyField => {
                query = this.addOrder(query, { field: keyField, direction: "asc" });
            });
        } else {
            query = this.addOrder(query, { field: this.key, direction: "asc" });
        }

        return query;
    }

    protected addFilter(
        query: SelectQueryBuilder<DB, TableItem, any>,
        filterCondition: FilterCondition<TableItem>
    ): SelectQueryBuilder<DB, TableItem, any> {
        let filterField = filterCondition.field;
        if(filterCondition.toLowerCase) {
            filterField = sql`lower(
            ${ sql.ref(filterField) }
            )`;
        }

        let filterValue = filterCondition.value;
        if(filterCondition.toLowerCase && typeof filterValue === "string") {
            filterValue = filterValue.toLowerCase();
        }

        return query.where(filterField, filterCondition.operator, filterValue);
    }

    protected addSearchFilter(
        query: SelectQueryBuilder<DB, TableItem, any>,
        searchTerm?: string
    ): SelectQueryBuilder<DB, TableItem, any> {
        if(!searchTerm || searchTerm.length === 0) return query;

        return this.addFilter(
            query,
            {
                field: this.searchBy,
                value: `%${ searchTerm }%`,
                operator: "like",
                toLowerCase: true
            }
        );
    }

    protected addOrder(
        query: SelectQueryBuilder<DB, TableItem, any>,
        orderCondition: OrderCondition<keyof TableItem>,
        reverse?: boolean
    ): SelectQueryBuilder<DB, TableItem, any> {
        let orderDirection = orderCondition?.direction ?? "asc";
        if(reverse) orderDirection = orderDirection === "asc" ? "desc" : "asc";

        let orderByField = orderCondition.field;
        if(orderCondition?.toLowerCase) {
            orderByField = sql`lower(
            ${ sql.ref(orderByField) }
            )`;
        }

        return query.orderBy(orderByField, orderDirection);
    }

    async filter(searchTerm?: string): Promise<Array<TableItem>> {
        let query = this.getBaseQuery();
        query = this.addSearchFilter(query, searchTerm);

        return await query.execute() as unknown as Array<TableItem>;
    }

    abstract hasNext(): boolean;

    abstract hasPrevious(): boolean;

    abstract async initial(defaultValue?: string | number): Promise<Array<TableItem>>;

    abstract async next(searchTerm?: string): Promise<Array<TableItem> | null>;

    abstract async previous(searchTerm?: string): Promise<Array<TableItem> | null>;
}