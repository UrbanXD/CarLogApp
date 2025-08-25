import { Paginator, PaginatorOptions } from "./AbstractPaginator.ts";
import { CursorPaginator } from "./CursorPaginator.ts";
import { Kysely } from "@powersync/kysely-driver";
import { DatabaseType } from "../connector/powersync/AppSchema.ts";
import { PagePaginator } from "./PagePaginator.ts";

export enum PaginatorType {
    cursor,
    page
}

export class PaginatorFactory {
    static createPaginator<TableItem, DB = DatabaseType>(
        type: PaginatorType,
        database: Kysely<DB>,
        table: keyof DB,
        key: keyof TableItem | Array<keyof TableItem>,
        options?: PaginatorOptions<TableItem>,
        cursorFieldName?: keyof TableItem
    ): Paginator<TableItem, DB> {
        if(Array.isArray(key) && (key as (Array<keyof TableItem>)).length === 0) {
            throw new Error("At least one key must be in the key array");
        }

        switch(type) {
            case PaginatorType.cursor:
                let cursorField = cursorFieldName;
                if(!cursorField && Array.isArray(key)) {
                    cursorField = key[0];
                } else if(!cursorField) {
                    cursorField = key;
                }

                return new CursorPaginator<TableItem, DB>(database, table, key, cursorField, options);
            case PaginatorType.page:
                return new PagePaginator<TableItem, DB>(database, table, key, options);
            default:
                throw new Error("Invalid paginator type");
        }
    }
}