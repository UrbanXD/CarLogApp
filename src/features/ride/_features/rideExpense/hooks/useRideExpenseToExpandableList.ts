import { useCallback } from "react";
import { ExpandableListItemProps } from "../../../../../components/expandableList/ExpandableListItem.tsx";
import { FormResultRideExpense } from "../schemas/rideExpenseSchema.ts";

export function useRideExpenseToExpandableList() {
    const rideExpenseToExpandableList = useCallback((
        item: FormResultRideExpense
    ): ExpandableListItemProps => {
        return {
            id: item.id,
            title: item.expense.type.key ?? "ismeretlen",
            amountProps: {
                amount: item.expense.amount.amount,
                currencyText: item.expense.amount.currency.symbol,
                exchangedAmount: item.expense.amount.exchangedAmount,
                exchangeCurrencyText: item.expense.amount.exchangeCurrency.symbol
            }
        };
    });

    return { rideExpenseToExpandableList };
}