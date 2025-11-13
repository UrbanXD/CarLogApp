import { Paginator, PaginatorOptions } from "./AbstractPaginator.ts";
import { DatabaseType } from "../connector/powersync/AppSchema.ts";
import { Kysely, sql } from "@powersync/kysely-driver";
import { OrderByDirectionExpression, SelectQueryBuilder } from "kysely";
import { CursorValue } from "react-native";
import { addCursor } from "./utils/addCursor.ts";

export type CursorDirection = "initial" | "next" | "prev";
export type CursorValue<TableItem> = TableItem[keyof TableItem] | null;
export type Cursor<TableField, DB = DatabaseType> = {
    field: TableField,
    table?: keyof DB,
    order?: OrderByDirectionExpression,
    toLowerCase?: boolean
}
export type CursorOptions<TableField, DB = DatabaseType> = {
    cursor: Cursor<TableField, DB> | Array<Cursor<TableField, DB>>,
    defaultOrder?: OrderByDirectionExpression
}

export class CursorPaginator<TableItem extends {
    id: string | number
}, MappedItem = TableItem, DB = DatabaseType> extends Paginator<TableItem, MappedItem, DB> {
    private prevCursor: CursorValue<TableItem> | Array<CursorValue<TableItem>>;
    private nextCursor: CursorValue<TableItem> | Array<CursorValue<TableItem>>;
    private refreshCursorId: string | number | null;
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

    protected getBaseQuery(): SelectQueryBuilder<DB, TableItem, any> {
        let query = super.getBaseQuery();

        if(Array.isArray(this.cursorOptions.cursor)) {
            this.cursorOptions.cursor.map((cursor) => {
                const tableName = cursor?.table === null ? null : cursor?.table ?? this.table;
                const cursorField = tableName ? sql.ref([tableName, cursor.field].join(".")) : sql.ref(cursor.field);
                query = query.select(cursorField);
            });
        } else {
            const tableName = cursor?.table === null ? null : cursor?.table ?? this.table;
            const cursorField = tableName ? sql.ref([tableName, cursor.field].join(".")) : sql.ref(cursor.field);
            query = query.select(cursorField);
        }

        return query;
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
        return await this.initial(this.refreshCursorId);
    }

    async initial(defaultItemId?: string | number): Promise<Array<MappedItem>> {
        this.prevCursor = null;
        this.nextCursor = null;
        this.refreshCursorId = null;

        let defaultCursor = null;
        let defaultItem = null;
        if(defaultItemId) {
            let filterField = sql.ref(`${ this.table }.id`);
            defaultItem = await this.getBaseQuery().where(filterField, "=", defaultItemId).executeTakeFirst();
            if(defaultItem) {
                if(Array.isArray(this.cursorOptions.cursor)) {
                    defaultCursor = this.cursorOptions.cursor.map((cursorField) => defaultItem?.[cursorField.field]);
                } else {
                    defaultCursor = defaultItem?.[this.cursorOptions.cursor.field];
                }
            }
        }

        if(!defaultCursor) {
            let query = this.getBaseQuery();
            query = addCursor(this.table, query, this.cursorOptions, null, "initial");

            const result = await query.execute() as unknown as Array<TableItem>;

            if(result.length === this.perPage + 1) this.setNextCursor(result.pop());
            if(result.length !== 0) this.refreshCursorId = result[0].id;

            return await super.map(result);
        }

        const halfPage = Math.floor(this.perPage / 2);

        let prevQuery = super.getBaseQuery().limit(halfPage + 1);
        let nextQuery = super.getBaseQuery().limit(halfPage + 1);

        prevQuery = addCursor(this.table, prevQuery, this.cursorOptions, defaultCursor, "prev");
        nextQuery = addCursor(this.table, nextQuery, this.cursorOptions, defaultCursor, "next");

        const prevResult = (await prevQuery.execute()).reverse() as unknown as Array<TableItem>;
        const nextResult = await nextQuery.execute() as unknown as Array<TableItem>;

        this.prevCursor = null;
        if(prevResult.length === halfPage + 1) this.setPreviousCursor(prevResult.shift()); // its over the limit that means the first element is a cursor for previous

        this.nextCursor = null;
        if(nextResult.length === halfPage + 1) this.setNextCursor(nextResult.pop());  // its over the limit that means the last element is a cursor for next

        const result = [...prevResult, defaultItem, ...nextResult];

        this.refreshCursorId = null;
        if(result.length !== 0) this.refreshCursorId = defaultItem?.id ?? result[0].id;

        return await super.map(result);
    }

    async next(): Promise<Array<TableItem> | null> {
        if(!this.hasNext()) return null;

        let query = super.getBaseQuery();
        query = addCursor(this.table, query, this.cursorOptions, this.nextCursor, "next");

        const result = await query.execute() as unknown as Array<TableItem>;

        // if(result.length !== 0) this.setPreviousCursor(result);

        this.nextCursor = null;
        this.refreshCursorId = null;
        if(result.length === this.perPage + 1) this.setNextCursor(result.pop());
        if(result.length !== 0) this.refreshCursorId = result[0].id;

        return await super.map(result);
    }

    async previous(): Promise<Array<TableItem> | null> {
        if(!this.hasPrevious()) return null;

        let query = this.getBaseQuery();
        query = addCursor(this.table, query, this.cursorOptions, this.prevCursor, "prev");

        const result = (await query.execute()).reverse() as unknown as Array<TableItem>;

        // if(result.length !== 0) this.setNextCursor(result);

        this.prevCursor = null;
        this.refreshCursorId = null;
        if(result.length === this.perPage + 1) this.setPreviousCursor(result.shift());
        if(result.length !== 0) this.refreshCursorId = result[0].id;

        return await super.map(result);
    }
}