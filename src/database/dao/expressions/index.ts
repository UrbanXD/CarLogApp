import { Expression, ExpressionBuilder, sql, StringReference } from "kysely";
import { RangeUnit } from "../../../features/statistics/utils/getRangeUnit.ts";

type Reference<DB, TB extends keyof DB> = StringReference<DB, TB> | Expression<any>

export function fieldRef<DB, TB extends keyof DB>(eb: ExpressionBuilder<DB, TB>, field: Reference<DB, TB>) {
    return typeof field === "string" ? eb.ref(field) : field;
}

export function simpleConversionExpression<DB, TB extends keyof DB>(
    eb: ExpressionBuilder<DB, TB>,
    valueField: Reference<DB, TB>,
    conversionFactorField: Reference<DB, TB>,
    round: boolean = false
) {
    const division = eb(
        fieldRef(eb, valueField),
        "/",
        eb.fn.coalesce(fieldRef(eb, conversionFactorField), eb.val(1))
    );

    if(!round) return division;
    return eb.fn("ROUND", [division, eb.val(0)]).$castTo<number>();
}

export function exchangedAmountExpression<DB, TB extends keyof DB>(
    eb: ExpressionBuilder<DB, TB>,
    amountField: Reference<DB, TB>,
    exchangedRateField: Reference<DB, TB>
) {
    return eb(
        fieldRef(eb, amountField),
        "*",
        eb.fn.coalesce(fieldRef(eb, exchangedRateField), eb.val(1))
    ).$castTo<number>();
}

export function pricePerUnitToAmountExpression<DB, TB extends keyof DB>(
    eb: ExpressionBuilder<DB, TB>,
    pricePerUnitField: Reference<DB, TB>,
    quantityField: Reference<DB, TB>
) {
    return eb(
        fieldRef(eb, pricePerUnitField),
        "*",
        eb.fn.coalesce(fieldRef(eb, quantityField), eb.val(0))
    ).$castTo<number>();
}

export function odometerValueExpression<DB, TB extends keyof DB>(
    eb: ExpressionBuilder<DB, TB>,
    valueField: Reference<DB, TB>,
    conversionFactorField: Reference<DB, TB>
) {
    return simpleConversionExpression(eb, valueField, conversionFactorField, true);
}

export function percentExpression<DB, TB extends keyof DB>(
    eb: ExpressionBuilder<DB, TB>,
    valueField: Reference<DB, TB>
) {
    //@formatter:off
    return sql<number>`SUM(${ fieldRef(eb, valueField) }) * 100.0 / SUM(SUM(${ fieldRef(eb, valueField) })) OVER ()`
    //@formatter:on
}

export function rangeExpression<DB, TB extends keyof DB>(
    eb: ExpressionBuilder<DB, TB>,
    field: Reference<DB, TB>,
    unit: RangeUnit
) {
    //@formatter:off
    switch(unit) {
        case "hour":
            return sql<string>`strftime('%Y-%m-%d %H:00:00', ${ fieldRef(eb, field) })`;
        case "day":
            return sql<string>`strftime('%Y-%m-%d', ${ fieldRef(eb, field) })`;
        case "month":
            return sql<string>`strftime('%Y-%m', ${ fieldRef(eb, field) })`;
        case "year":
            return sql<string>`strftime('%Y', ${ fieldRef(eb, field) })`;
    }
    //@formatter:on
}

export function julianDayExpression<DB, TB extends keyof DB>(
    eb: ExpressionBuilder<DB, TB>,
    field: Reference<DB, TB>
) {
    return eb.fn("JULIANDAY", [fieldRef(eb, field)]);
}