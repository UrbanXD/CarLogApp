import { OrderByDirectionExpression } from "kysely";
import { CursorDirection } from "../hooks/useInfiniteQuery.ts";

/*
 * If main order is 'desc' and cursor direction is 'next' -> '<' | '<='
 * If main order is 'asc' and cursor direction is 'next' -> '>' | '>='
 * If main order is 'desc' and cursor direction is 'prev' -> '>' | '>='
 * If main order is 'asc' and cursor direction is 'prev' -> '<' | '<='
 **/
export function getCursorOperator(
    orderDirection: OrderByDirectionExpression | Array<OrderByDirectionExpression>,
    cursorDirection: Omit<CursorDirection, "initial">,
    inclusive: boolean = false
): "<" | ">" | "<=" | ">=" {
    let mainOrderDirection = Array.isArray(orderDirection) ? orderDirection?.[0] : orderDirection;
    if(!mainOrderDirection) mainOrderDirection = "asc";

    let baseOperator: ">" | "<";

    if(mainOrderDirection === "desc") {
        baseOperator = cursorDirection === "next" ? "<" : ">";
    } else {
        baseOperator = cursorDirection === "next" ? ">" : "<";
    }

    return !inclusive ? baseOperator : `${ baseOperator }=` as ">=" | "<=";
}