import { Paginator, PaginatorOptions } from "./AbstractPaginator.ts";
import { DatabaseType } from "../connector/powersync/AppSchema.ts";
import { Kysely, sql } from "@powersync/kysely-driver";
import { OrderByDirectionExpression, SelectQueryBuilder } from "kysely";
import { addCursor } from "./utils/addCursor.ts";

export type CursorDirection = "initial" | "next" | "prev";

export type CursorValue<TableItem> = TableItem[keyof TableItem];

export type Cursor<TableField> = {
    field: TableField,
    table?: keyof DatabaseType | null,
    order?: OrderByDirectionExpression,
    toLowerCase?: boolean
}
export type CursorOptions<TableField> = {
    cursor: Cursor<TableField> | Array<Cursor<TableField>>,
    defaultOrder?: OrderByDirectionExpression
}

export class CursorPaginator<
    TableItem extends { id: any },
    MappedItem = TableItem
> extends Paginator<TableItem, MappedItem> {
    private prevCursor: CursorValue<TableItem> | Array<CursorValue<TableItem>> | null = null;
    private nextCursor: CursorValue<TableItem> | Array<CursorValue<TableItem>> | null = null;
    private refreshCursorId: keyof TableItem | null = null;
    cursorOptions: CursorOptions<keyof TableItem>;

    constructor(
        database: Kysely<DatabaseType>,
        table: keyof DatabaseType,
        cursorOptions: CursorOptions<keyof TableItem>,
        options?: PaginatorOptions<TableItem, MappedItem>
    ) {
        super(database, table, options);
        this.cursorOptions = cursorOptions;
    }

    protected getBaseQuery(): SelectQueryBuilder<DatabaseType, any, TableItem> {
        let query = super.getBaseQuery();

        const cursors = Array.isArray(this.cursorOptions.cursor)
                        ? this.cursorOptions.cursor
                        : [this.cursorOptions.cursor];

        for(const cursor of cursors) {
            const tableName = cursor?.table === null ? null : cursor?.table ?? this.table;
            const fieldPath = tableName ? `${ String(tableName) }.${ String(cursor.field) }` : String(cursor.field);

            query = query.select(sql.ref(fieldPath) as any);
        }

        return query;
    }

    private setNextCursor(lastItem: TableItem) {
        if(Array.isArray(this.cursorOptions.cursor)) {
            this.nextCursor = this.cursorOptions.cursor.map((cursor) => lastItem[cursor.field]);
        } else {
            this.nextCursor = lastItem[this.cursorOptions.cursor.field] ?? null;
        }
    }

    private setPreviousCursor(firstItem: TableItem) {
        if(Array.isArray(this.cursorOptions.cursor)) {
            this.prevCursor = this.cursorOptions.cursor.map((cursor) => firstItem[cursor.field]);
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

    async changeCursorOptions(options: CursorOptions<keyof TableItem>) {
        this.cursorOptions = options;
        return await this.initial();
    }

    async refresh(): Promise<Array<MappedItem>> {
        return await this.initial(this.refreshCursorId);
    }

    async initial(defaultItemId?: keyof TableItem | null): Promise<Array<MappedItem>> {
        this.prevCursor = null;
        this.nextCursor = null;
        this.refreshCursorId = null;

        let defaultCursor: CursorValue<TableItem> | Array<CursorValue<TableItem>> | null = null;
        let defaultItem: TableItem | null = null;

        if(defaultItemId) {
            let filterField = sql.ref(`${ this.table }.id`);
            const result = await this.getBaseQuery().where(filterField, "=", defaultItemId).executeTakeFirst();
            defaultItem = (result as TableItem) ?? null;

            if(defaultItem) {
                if(Array.isArray(this.cursorOptions.cursor)) {
                    const tmpCursor = this.cursorOptions.cursor.map((cursorField) => defaultItem?.[cursorField.field]);
                    defaultCursor = tmpCursor.filter(cursorValue => cursorValue) as Array<CursorValue<TableItem>>;
                } else {
                    defaultCursor = defaultItem?.[this.cursorOptions.cursor.field];
                }
            }
        }

        if(!defaultCursor) {
            let query = this.getBaseQuery();
            query = addCursor(this.table, query, this.cursorOptions, null, "initial");

            const result = await query.execute() as unknown as Array<TableItem>;

            if(result.length !== 0 && result.length === this.perPage + 1) this.setNextCursor(result.pop() as TableItem);
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
        if(prevResult.length > 0 && prevResult.length === halfPage + 1) this.setPreviousCursor(prevResult.shift() as TableItem); // its over the limit that means the first element is a cursor for previous

        this.nextCursor = null;
        if(prevResult.length > 0 && nextResult.length === halfPage + 1) this.setNextCursor(nextResult.pop() as TableItem);  // its over the limit that means the last element is a cursor for next

        const result = [...prevResult, defaultItem, ...nextResult] as unknown as Array<TableItem>;

        this.refreshCursorId = null;
        if(result.length !== 0) this.refreshCursorId = defaultItem?.id ?? result[0]?.id;

        return await super.map(result);
    }

    async next(): Promise<Array<MappedItem> | null> {
        if(!this.hasNext()) return null;

        let query = super.getBaseQuery();
        query = addCursor(this.table, query, this.cursorOptions, this.nextCursor, "next");

        const result = await query.execute() as unknown as Array<TableItem>;

        // if(result.length !== 0) this.setPreviousCursor(result);

        this.nextCursor = null;
        this.refreshCursorId = null;
        if(result.length > 0 && result.length === this.perPage + 1) this.setNextCursor(result.pop() as TableItem);
        if(result.length !== 0) this.refreshCursorId = result[0].id;

        return await super.map(result);
    }

    async previous(): Promise<Array<MappedItem> | null> {
        if(!this.hasPrevious()) return null;

        let query = this.getBaseQuery();
        query = addCursor(this.table, query, this.cursorOptions, this.prevCursor, "prev");

        const result = (await query.execute()).reverse() as unknown as Array<TableItem>;

        // if(result.length !== 0) this.setNextCursor(result);

        this.prevCursor = null;
        this.refreshCursorId = null;
        if(result.length > 0 && result.length === this.perPage + 1) this.setPreviousCursor(result.shift() as TableItem);
        if(result.length !== 0) this.refreshCursorId = result[0].id;

        return await super.map(result);
    }
}