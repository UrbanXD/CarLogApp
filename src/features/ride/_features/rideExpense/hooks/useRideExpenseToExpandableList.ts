import { useCallback } from "react";
import { ExpandableListItemProps } from "../../../../../components/expandableList/ExpandableListItem.tsx";
import { useTranslation } from "react-i18next";
import { RideExpenseFormTransformedFields } from "../schemas/form/rideExpenseForm.ts";

export function useRideExpenseToExpandableList() {
    const { t } = useTranslation();

    const rideExpenseToExpandableList = useCallback((item: RideExpenseFormTransformedFields): ExpandableListItemProps => {
        return {
            id: item.id,
            title: item.expense.type.key ? t(`expenses.types.${ item.expense.type.key }`) : t("common.unknown"),
            amountProps: {
                amount: item.expense.amount.amount,
                currencyText: item.expense.amount.currency.symbol,
                exchangedAmount: item.expense.amount.exchangedAmount,
                exchangeCurrencyText: item.expense.amount.exchangeCurrency.symbol
            }
        };
    }, [t]);

    return { rideExpenseToExpandableList };
}