import { DatabaseType } from "../connector/powersync/AppSchema.ts";
import { Kysely, sql } from "@powersync/kysely-driver";
import { Paginator } from "../../types/index.ts";
import { SelectQueryBuilder } from "kysely";

export const paginate = <T, DB = DatabaseType>(
    database: Kysely<DB>,
    table: string,
    paginator: Paginator<T>
): SelectQueryBuilder<DB, T, any> => {
    console.log(paginator);
    const {
        search,
        pagination: { cursor, page, perPage = 15, order }
    } = paginator;

    let query = database
    .selectFrom(table)
    .selectAll()
    .limit(perPage);

    if(order) {
        query = query
        .orderBy(sql`lower(
        ${ sql.ref(order.by) }
        )`, order.direction ?? "asc")
        .orderBy("id", "asc");
    }

    if(cursor) { // cursor pagination
        if(cursor.value) {
            const operation = (!cursor?.direction || cursor?.direction === "next") ? ">" : "<";
            query = query
            .where(sql`lower(
            ${ sql.ref(cursor.fieldName) }
            )`, operation, cursor.value.toString().toLowerCase());
        }
    } else if(page) { // offset pagination
        query = query.offset(perPage * page);
    }

    if(search && search.term) {
        query = query.where(sql`lower(
        ${ sql.ref(search.fieldName) }
        )`, "like", `%${ search.term.toLowerCase() }%`);
    }

    return query;
};
