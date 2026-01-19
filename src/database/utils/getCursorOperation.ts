import { OrderByDirectionExpression } from "kysely";
import { CursorDirection } from "../hooks/useInfiniteQuery.ts";

/*
 * If main order is 'desc' and cursor direction is 'next' -> '<'
 * If main order is 'asc' and cursor direction is 'next' -> '>'
 * If main order is 'desc' and cursor direction is 'prev' -> '>'
 * If main order is 'asc' and cursor direction is 'prev' -> '<'
 **/
export function getCursorOperator(
    orderDirection: OrderByDirectionExpression | Array<OrderByDirectionExpression>,
    cursorDirection: Omit<CursorDirection, "initial">
): "<" | ">" {
    let mainOrderDirection = Array.isArray(orderDirection) ? orderDirection?.[0] : orderDirection;
    if(!mainOrderDirection) mainOrderDirection = "asc";

    if(mainOrderDirection === "desc") return cursorDirection === "next" ? "<" : ">";
    return cursorDirection === "next" ? ">" : "<";
}