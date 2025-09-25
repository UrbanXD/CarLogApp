import { Paginator, PaginatorOptions } from "./AbstractPaginator.ts";
import { DatabaseType } from "../connector/powersync/AppSchema.ts";
import { Kysely } from "@powersync/kysely-driver";
import { OrderByDirectionExpression } from "kysely";
import { CursorValue } from "react-native";
import { addSearchFilter } from "./utils/addSearchFilter.ts";
import { addCursor } from "./utils/addCursor.ts";

export type CursorDirection = "initial" | "next" | "prev";
export type CursorValue<TableItem> = TableItem[keyof TableItem] | null;
export type CursorOptions<TableField> = {
    field: TableField | Array<TableField>
    order?: OrderByDirectionExpression | Array<OrderByDirectionExpression>
}

export class CursorPaginator<TableItem, MappedItem = TableItem, DB = DatabaseType> extends Paginator<TableItem, MappedItem, DB> {
    private prevCursor: CursorValue<TableItem> | Array<CursorValue<TableItem>>;
    private nextCursor: CursorValue<TableItem> | Array<CursorValue<TableItem>>;
    private readonly cursorOptions: CursorOptions<keyof TableItem>;

    constructor(
        database: Kysely<DB>,
        table: keyof DB,
        cursorOptions: CursorOptions<keyof TableItem>,
        options?: PaginatorOptions<keyof TableItem, MappedItem>
    ) {
        super(database, table, options);
        this.cursorOptions = cursorOptions;
    }

    private setNextCursor(data: Array<TableItem>) {
        if(Array.isArray(this.cursorOptions.field)) {
            this.nextCursor = this.cursorOptions.field.map((cursorField) => data[data.length - 1][cursorField]);
        } else {
            this.nextCursor = data[data.length - 1][this.cursorOptions.cursorField];
        }
    }

    private setPreviousCursor(data: Array<TableItem>) {
        if(Array.isArray(this.cursorOptions.field)) {
            this.prevCursor = this.cursorOptions.field.map((cursorField) => data[0][cursorField]);
        } else {
            this.prevCursor = data[0][this.cursorOptions.field];
        }
    }

    hasNext(): boolean {
        return !!this.nextCursor;
    }

    hasPrevious(): boolean {
        return !!this.prevCursor;
    }

    async filter(searchTerm?: string): Promise<Array<MappedItem>> {
        this.prevCursor = null;
        this.nextCursor = null;

        const result = await super.filter(searchTerm);

        if(result.length !== 0) this.setNextCursor(result);

        return await super.map(result);
    }

    async initial(defaultValue?: string | number): Promise<Array<MappedItem>> {
        this.prevCursor = null;
        this.nextCursor = null;

        if(!defaultValue) {
            let query = this.getBaseQuery();
            query = addCursor(query, this.cursorOptions, null, "initial");

            const result = await query.execute() as unknown as Array<TableItem>;

            if(result.length !== 0) this.setNextCursor(result);

            return await super.map(result);
        }

        const halfPage = Math.floor(this.perPage / 2);

        let prevQuery = super.getBaseQuery().limit(halfPage);
        let nextQuery = super.getBaseQuery().limit(halfPage);

        prevQuery = addCursor(prevQuery, this.cursorOptions, defaultValue, "prev"); // TODO fix with default value
        nextQuery = addCursor(nextQuery, this.cursorOptions, defaultValue, "next"); // TODO fix for >=

        const prevResult = (await prevQuery.execute()).reverse() as unknown as Array<TableItem>; //lehet kiveheto a reverse
        const nextResult = await nextQuery.execute() as unknown as Array<TableItem>;

        if(prevResult.length !== halfPage) {
            this.prevCursor = null;
        } else {
            this.setPreviousCursor(prevResult);
        }

        if(nextResult.length !== halfPage) {
            this.nextCursor = null;
        } else {
            this.setNextCursor(nextResult);
        }

        return await super.map([...prevResult, ...nextResult]);
    }

    async next(searchTerm?: string): Promise<Array<TableItem> | null> {
        if(!this.hasNext()) return null;

        let query = super.getBaseQuery();
        query = addCursor(query, this.cursorOptions, this.nextCursor, "next");
        query = addSearchFilter(query, searchTerm);

        const result = await query.execute() as unknown as Array<TableItem>;

        if(result.length !== 0) this.setPreviousCursor(result);

        if(result.length !== this.perPage) {
            this.nextCursor = null;
        } else {
            this.nextCursor(result);
        }

        return await super.map(result);
    }

    async previous(searchTerm?: string): Promise<Array<TableItem> | null> {
        if(!this.hasPrevious()) return null;

        let query = this.getBaseQuery(true);
        query = addCursor(query, this.cursorOptions, this.prevCursor, "<");
        query = addSearchFilter(query, searchTerm);

        const result = (await query.execute()).reverse() as unknown as Array<TableItem>; /// lehet kiveheto a reverse

        if(result.length !== 0) this.setNextCursor(result);

        if(result.length !== this.perPage) {
            this.prevCursor = null;
        } else {
            this.setPreviousCursor(result);
        }

        return await super.map(result);
    }
}