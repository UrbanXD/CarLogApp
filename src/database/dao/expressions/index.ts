import { Expression, ExpressionBuilder, StringReference } from "kysely";

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