import { Paginator, PaginatorOptions } from "./AbstractPaginator.ts";
import { DatabaseType } from "../connector/powersync/AppSchema.ts";
import { Kysely } from "@powersync/kysely-driver";
import { SelectQueryBuilder } from "kysely";

export class PagePaginator<TableItem, MappedItem = TableItem, DB = DatabaseType> extends Paginator<TableItem, DB> {
    private page: number = 0;
    private readonly maxPage: number;
    private readonly orderByFieldName: keyof TableItem;

    constructor(
        database: Kysely<DB>,
        table: keyof DB,
        key: keyof TableItem | Array<keyof TableItem>,
        settings?: PaginatorOptions<keyof TableItem> & { orderByFieldName?: keyof TableItem }
    ) {
        super(database, table, key, settings);
        this.maxPage = 30; //get from db
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

    private async fetchData(searchTerm?: string) {
        let query = super.getBaseQuery();
        query = this.addOffset(query);
        query = super.addSearchFilter(query, searchTerm);

        const result = await query.execute() as unknown as Array<TableItem>;

        return await super.map(result);
    }

    async initial(defaultValue?: string | number): Promise<Array<MappedItem>> {
        if(!defaultValue) {
            this.page = 0;
            let query = super.getBaseQuery();
            query = super.addOrderBy(query, this.orderByFieldName);

            const result = await query.execute() as unknown as Array<TableItem>;

            return await super.map(result);
        }

        return [];
        //megvalositani hogy default value page-t megkeresseeeeeeee
    }

    async next(searchTerm?: string): Promise<Array<MappedItem> | null> {
        if(!this.hasNext()) return null;
        this.page += 1;

        return await this.fetchData(searchTerm);
    }

    async previous(searchTerm?: string): Promise<Array<MappedItem> | null> {
        if(!this.hasPrevious()) return null;
        this.page -= 1;

        return await this.fetchData(searchTerm);
    }


    async filter(searchTerm?: string): Promise<Array<MappedItem>> {
        this.page = 0;
        const result = await super.filter(searchTerm);

        return await super.map(result);
    }
}