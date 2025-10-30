import { FilterCondition, FilterGroup, Paginator, PaginatorOptions } from "./AbstractPaginator.ts";
import { DatabaseType } from "../connector/powersync/AppSchema.ts";
import { Kysely } from "@powersync/kysely-driver";
import { OrderByDirectionExpression } from "kysely";
import { CursorValue } from "react-native";
import { addCursor } from "./utils/addCursor.ts";
import { defaultValueToCursorValue } from "./utils/defaultValueToCursorValue.ts";

export type CursorDirection = "initial" | "next" | "prev";
export type CursorValue<TableItem> = TableItem[keyof TableItem] | null;
export type Cursor<TableField, DB = DatabaseType> = {
    field: TableField,
    table?: keyof DB,
    order?: OrderByDirectionExpression
}
export type CursorOptions<TableField, DB = DatabaseType> = {
    cursor: Cursor<TableField, DB> | Array<Cursor<TableField, DB>>,
    defaultOrder?: OrderByDirectionExpression
}

export class CursorPaginator<TableItem, MappedItem = TableItem, DB = DatabaseType> extends Paginator<TableItem, MappedItem, DB> {
    private prevCursor: CursorValue<TableItem> | Array<CursorValue<TableItem>>;
    private nextCursor: CursorValue<TableItem> | Array<CursorValue<TableItem>>;
    private refreshCursor: CursorValue<TableItem> | Array<CursorValue<TableItem>>;
    cursorOptions: CursorOptions<keyof TableItem, DB>;

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
        if(Array.isArray(this.cursorOptions.cursor)) {
            this.nextCursor = this.cursorOptions.cursor.map((cursor) => lastItem[cursor.field] ?? null);
        } else {
            this.nextCursor = lastItem[this.cursorOptions.cursor.field] ?? null;
        }
    }

    private setPreviousCursor(firstItem: TableItem) {
        if(Array.isArray(this.cursorOptions.cursor)) {
            this.prevCursor = this.cursorOptions.cursor.map((cursor) => firstItem[cursor.field] ?? null);
        } else {
            this.prevCursor = firstItem[this.cursorOptions.cursor.field] ?? null;
        }
    }

    private setRefreshCursor(item: TableItem) {
        if(Array.isArray(this.cursorOptions.cursor)) {
            this.refreshCursor = this.cursorOptions.cursor.map((cursor) => item[cursor.field] ?? null);
        } else {
            this.refreshCursor = item[this.cursorOptions.cursor.field] ?? null;
        }
    }

    hasNext(): boolean {
        return !!this.nextCursor;
    }

    hasPrevious(): boolean {
        return !!this.prevCursor;
    }

    async changeCursorOptions(options: CursorOptions<keyof TableItem, DB>) {
        this.cursorOptions = options;
        return await this.initial();
    }

    async refresh(): Promise<Array<MappedItem>> {
        if(!this.refreshCursor) return this.initial();

        this.prevCursor = null;
        this.nextCursor = null;

        let query = this.getBaseQuery().limit(this.perPage + 2);
        query = addCursor(this.table, query, this.cursorOptions, this.refreshCursor, "next");

        const result = await query.execute() as unknown as Array<TableItem>;

        if(result.length > 1) this.setPreviousCursor(result.shift());
        if(result.length === 0) return [];

        this.setRefreshCursor(result[0]);
        if(result.length === this.perPage + 1) this.setNextCursor(result.pop());

        const refreshMappedResult = await super.map(result);
        //
        // if(result.length > 0 && result.length < this.perPage + 1) {
        //     const moreData = await this.previous();
        //     if(moreData) refreshMappedResult.unshift(...moreData);
        // }

        return refreshMappedResult;
    }

    async filter(filterBy: FilterCondition<TableItem, DB> | Array<FilterGroup<TableItem, DB>>): Promise<Array<MappedItem>> {
        this.setFilter(filterBy);
        return await this.initial();
    }

    async initial(defaultValue?: TableItem): Promise<Array<MappedItem>> {
        this.prevCursor = null;
        this.nextCursor = null;
        this.refreshCursor = null;

        const defaultCursor = defaultValueToCursorValue<TableItem>(defaultValue, this.cursorOptions.cursor);

        if(!defaultCursor) {
            let query = this.getBaseQuery();
            query = addCursor(this.table, query, this.cursorOptions, null, "initial");

            const result = await query.execute() as unknown as Array<TableItem>;

            if(result.length === this.perPage + 1) this.setNextCursor(result.pop());
            if(result.length !== 0) this.setRefreshCursor(result[0]);

            return await super.map(result);
        }

        if(!defaultValue) return;

        const halfPage = Math.floor(this.perPage / 2);

        let prevQuery = super.getBaseQuery().limit(halfPage + 1);
        let nextQuery = super.getBaseQuery().limit(halfPage + 1);

        prevQuery = addCursor(this.table, prevQuery, this.cursorOptions, defaultCursor, "prev");
        nextQuery = addCursor(this.table, nextQuery, this.cursorOptions, defaultCursor, "next");

        const prevResult = (await prevQuery.execute()).reverse() as unknown as Array<TableItem>;
        const nextResult = await nextQuery.execute() as unknown as Array<TableItem>;

        this.prevCursor = null;
        if(prevResult.length === halfPage + 1) this.setPreviousCursor(prevResult.shift()); // its over the limit that means the first element is a cursor for previous
        this.setRefreshCursor(prevResult?.[0] ?? defaultValue ?? nextResult?.[0] ?? null);

        this.nextCursor = null;
        if(nextResult.length === halfPage + 1) this.setNextCursor(nextResult.pop());  // its over the limit that means the last element is a cursor for next

        const result = [...prevResult, defaultValue, ...nextResult];
        this.refreshCursor = null;
        if(result.length !== 0) this.setRefreshCursor(result[0]);

        return await super.map(result);
    }

    async next(): Promise<Array<TableItem> | null> {
        if(!this.hasNext()) return null;

        let query = super.getBaseQuery();
        query = addCursor(this.table, query, this.cursorOptions, this.nextCursor, "next");

        const result = await query.execute() as unknown as Array<TableItem>;

        // if(result.length !== 0) this.setPreviousCursor(result);

        this.nextCursor = null;
        this.refreshCursor = null;
        if(result.length === this.perPage + 1) this.setNextCursor(result.pop());
        if(result.length !== 0) this.setRefreshCursor(result[0]);

        return await super.map(result);
    }

    async previous(): Promise<Array<TableItem> | null> {
        if(!this.hasPrevious()) return null;

        let query = this.getBaseQuery(true);
        query = addCursor(this.table, query, this.cursorOptions, this.prevCursor, "prev");

        const result = (await query.execute()).reverse() as unknown as Array<TableItem>;

        // if(result.length !== 0) this.setNextCursor(result);

        this.prevCursor = null;
        this.refreshCursor = null;
        if(result.length === this.perPage + 1) this.setPreviousCursor(result.shift());
        if(result.length !== 0) this.setRefreshCursor(result[0]);

        return await super.map(result);
    }
}