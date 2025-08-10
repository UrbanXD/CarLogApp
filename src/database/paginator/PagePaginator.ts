import { Paginator, PaginatorOptions, Search } from "./AbstractPaginator.ts";
import { DatabaseType } from "../connector/powersync/AppSchema.ts";
import { Kysely } from "@powersync/kysely-driver";
import { SelectQueryBuilder } from "kysely";

export class PagePaginator<TableItem, DB = DatabaseType> extends Paginator<TableItem, DB> {
    private page: number = 0;
    private maxPage: number;
    private readonly orderByFieldName: keyof TableItem;

    constructor(
        database: Kysely<DB>,
        table: keyof DB,
        settings?: PaginatorOptions<keyof TableItem> & { orderByFieldName?: keyof TableItem }
    ) {
        super(database, table, settings);
        this.maxPage = 30;
        this.orderByFieldName = settings?.orderByFieldName;
    }

    hasNext(): boolean {
        return this.page < this.maxPage;
    }

    hasPrevious(): boolean {
        return this.page > 0;
    }

    private addOffset(query: SelectQueryBuilder<DB, TableItem, any>): SelectQueryBuilder<DB, TableItem, any> {
        return query.offset(this.perPage * this.page);
    }

    private async fetchData(search?: Search<keyof TableItem>) {
        let query = super.getBaseQuery();
        query = super.addOrderBy(query, this.orderByFieldName);
        query = this.addOffset(query);
        query = super.addSearchBy(query, search);

        return await query.execute() as unknown as Array<TableItem>;
    }

    async initial(defaultValue?: string | number): Promise<Array<TableItem>> {
        if(!defaultValue) {
            this.page = 0;
            let query = super.getBaseQuery();
            query = super.addOrderBy(query, this.orderByFieldName);
            return await query.execute() as unknown as Array<TableItem>;
        }

        return [];
        //megvalositani hogy default value page-t megkeresseeeeeeee
    }

    async next(search?: Search<keyof TableItem>): Promise<Array<TableItem> | null> {
        if(!this.hasNext()) return null;
        this.page += 1;

        return await this.fetchData();
    }

    async previous(search?: Search<keyof TableItem>): Promise<Array<TableItem> | null> {
        if(!this.hasPrevious()) return null;
        this.page -= 1;

        return await this.fetchData();
    }


    async filter(search?: Search<keyof TableItem>): Promise<Array<TableItem>> {
        return super.filter(search);
    }
}