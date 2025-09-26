import { Paginator, PaginatorOptions } from "./AbstractPaginator.ts";
import { DatabaseType } from "../connector/powersync/AppSchema.ts";
import { Kysely } from "@powersync/kysely-driver";
import { OrderByDirectionExpression } from "kysely";
import { CursorValue } from "react-native";
import { addSearchFilter } from "./utils/addSearchFilter.ts";
import { addCursor } from "./utils/addCursor.ts";
import { defaultValueToCursorValue } from "./utils/defaultValueToCursorValue.ts";

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

    private setNextCursor(lastItem: TableItem) {
        if(Array.isArray(this.cursorOptions.field)) {
            this.nextCursor = this.cursorOptions.field.map((cursorField) => lastItem[cursorField] ?? null);
        } else {
            this.nextCursor = lastItem[this.cursorOptions.cursorField] ?? null;
        }
    }

    private setPreviousCursor(firstItem: TableItem) {
        if(Array.isArray(this.cursorOptions.field)) {
            this.prevCursor = this.cursorOptions.field.map((cursorField) => firstItem[cursorField] ?? null);
        } else {
            this.prevCursor = firstItem[this.cursorOptions.field] ?? null;
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

        if(result.length === this.perPage + 1) this.setNextCursor(result.pop());

        return await super.map(result);
    }

    async initial(defaultValue?: TableItem): Promise<Array<MappedItem>> {
        this.prevCursor = null;
        this.nextCursor = null;

        const defaultCursor = defaultValueToCursorValue<TableItem>(defaultValue, this.cursorOptions.field);

        if(!defaultCursor) {
            let query = this.getBaseQuery();
            query = addCursor(query, this.cursorOptions, null, "initial");

            const result = await query.execute() as unknown as Array<TableItem>;

            if(result.length === this.perPage + 1) this.setNextCursor(result.pop());
            return await super.map(result);
        }

        const halfPage = Math.floor(this.perPage / 2);

        let prevQuery = super.getBaseQuery().limit(halfPage + 1);
        let nextQuery = super.getBaseQuery().limit(halfPage + 1);

        prevQuery = addCursor(prevQuery, this.cursorOptions, defaultCursor, "prev");
        nextQuery = addCursor(nextQuery, this.cursorOptions, defaultCursor, "next");

        const prevResult = (await prevQuery.execute()).reverse() as unknown as Array<TableItem>;
        const nextResult = await nextQuery.execute() as unknown as Array<TableItem>;

        this.prevCursor = null;
        if(prevResult.length === halfPage + 1) this.setPreviousCursor(prevResult.shift()); // its over the limit that means the first element is a cursor for previous

        this.nextCursor = null;
        if(nextResult.length === halfPage + 1) this.setNextCursor(nextResult.pop());  // its over the limit that means the last element is a cursor for next

        return await super.map([...prevResult, defaultValue, ...nextResult]);
    }

    async next(searchTerm?: string): Promise<Array<TableItem> | null> {
        if(!this.hasNext()) return null;

        let query = super.getBaseQuery();
        query = addCursor(query, this.cursorOptions, this.nextCursor, "next");
        query = addSearchFilter(query, searchTerm);

        const result = await query.execute() as unknown as Array<TableItem>;

        // if(result.length !== 0) this.setPreviousCursor(result);

        this.nextCursor = null;
        console.log(result.length, this.perPage + 1);
        if(result.length === this.perPage + 1) this.setNextCursor(result.pop());
        console.log(result.length);

        return await super.map(result);
    }

    async previous(searchTerm?: string): Promise<Array<TableItem> | null> {
        if(!this.hasPrevious()) return null;

        let query = this.getBaseQuery(true);
        query = addCursor(query, this.cursorOptions, this.prevCursor, "prev");
        query = addSearchFilter(query, searchTerm);

        const result = (await query.execute()).reverse() as unknown as Array<TableItem>;

        // if(result.length !== 0) this.setNextCursor(result);

        this.prevCursor = null;
        if(result.length === this.perPage + 1) this.setPreviousCursor(result.shift());

        return await super.map(result);
    }
}