import { Paginator, PaginatorOptions } from "./AbstractPaginator.ts";
import { DatabaseType } from "../connector/powersync/AppSchema.ts";
import { Kysely } from "@powersync/kysely-driver";
import { SelectQueryBuilder } from "kysely";
import { CursorValue } from "react-native";

type CursorOperator = "<" | ">" | ">=";
type CursorValue<TableItem> = TableItem[keyof TableItem] | null;

export class CursorPaginator<TableItem, DB = DatabaseType> extends Paginator<TableItem, DB> {
    private prevCursor: CursorValue<TableItem>;
    private nextCursor: CursorValue<TableItem>;
    private readonly cursorFieldName: keyof TableItem;

    constructor(
        database: Kysely<DB>,
        table: keyof DB,
        key: keyof TableItem | Array<keyof TableItem>,
        cursorFieldName: keyof TableItem,
        options?: PaginatorOptions<keyof TableItem>
    ) {
        super(database, table, key, options);
        this.cursorFieldName = cursorFieldName;
    }

    private addCursorFilter(
        query: SelectQueryBuilder<DB, TableItem, any>,
        value: CursorValue<TableItem>,
        operator: CursorOperator
    ) {
        let reverse = false;
        if(operator === "<") reverse = true;
        let subQuery = super.addOrder(query, { field: this.cursorFieldName }, reverse);

        return super.addFilter(subQuery, { field: this.cursorFieldName, value, operator, toLowerCase: true });
    }

    hasNext(): boolean {
        return !!this.nextCursor;
    }

    hasPrevious(): boolean {
        return !!this.prevCursor;
    }

    async filter(searchTerm?: string): Promise<Array<TableItem>> {
        this.prevCursor = null;
        this.nextCursor = null;

        const result = await super.filter(searchTerm);

        if(result.length !== 0) this.nextCursor = result[result.length - 1][this.cursorFieldName];

        return result;
    }

    async initial(defaultValue?: string | number): Promise<Array<TableItem>> {
        if(!defaultValue) {
            let query = this.getBaseQuery();
            query = super.addOrder(query, { field: this.cursorFieldName, direction: "asc", toLowerCase: true });

            const result = await query.execute() as unknown as Array<TableItem>;

            if(result.length !== 0) this.nextCursor = result[result.length - 1][this.cursorFieldName];
            return result;
        }

        const halfPage = Math.floor(this.perPage / 2);

        let prevQuery = super.getBaseQuery(true).limit(halfPage);
        let nextQuery = super.getBaseQuery().limit(halfPage);

        prevQuery = this.addCursorFilter(prevQuery, defaultValue, "<");
        nextQuery = this.addCursorFilter(nextQuery, defaultValue, ">=");

        const prevResult = (await prevQuery.execute()).reverse() as unknown as Array<TableItem>;
        const nextResult = await nextQuery.execute() as unknown as Array<TableItem>;

        if(prevResult.length !== halfPage) {
            this.prevCursor = null;
        } else {
            this.prevCursor = prevResult[0][this.cursorFieldName];
        }

        if(nextResult.length !== halfPage) {
            this.nextCursor = null;
        } else {
            this.nextCursor = nextResult[nextResult.length - 1][this.cursorFieldName];
        }

        return [...prevResult, ...nextResult];
    }

    async next(searchTerm?: string): Promise<Array<TableItem> | null> {
        if(!this.hasNext()) return null;

        let query = super.getBaseQuery();
        query = this.addCursorFilter(query, this.nextCursor, ">");
        query = super.addSearchFilter(query, searchTerm);
        const result = await query.execute() as unknown as Array<TableItem>;

        if(result.length !== 0) {
            this.prevCursor = result[0][this.cursorFieldName];
        }

        if(result.length !== this.perPage) {
            this.nextCursor = null;
        } else {
            this.nextCursor = result[result.length - 1][this.cursorFieldName];
        }

        return result;
    }

    async previous(searchTerm?: string): Promise<Array<TableItem> | null> {
        if(!this.hasPrevious()) return null;

        let query = this.getBaseQuery(true);
        query = this.addCursorFilter(query, this.prevCursor, "<");
        query = super.addSearchFilter(query, searchTerm);

        const result = (await query.execute()).reverse() as unknown as Array<TableItem>;

        if(result.length !== 0) {
            this.nextCursor = result[result.length - 1][this.cursorFieldName];
        }

        if(result.length !== this.perPage) {
            this.prevCursor = null;
        } else {
            this.prevCursor = result[0][this.cursorFieldName];
        }

        return result;
    }
}