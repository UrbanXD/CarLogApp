import { useCallback } from "react";
import { ServiceItem } from "../schemas/serviceItemSchema.ts";
import { ExpandableListItemProps } from "../../../../../components/expandableList/ExpandableListItem.tsx";

export function useServiceItemToExpandableList() {
    const serviceItemToExpandableListItem = useCallback((item: ServiceItem): ExpandableListItemProps => {
        return {
            id: item.id,
            title: item.type.key,
            count: item.quantity,
            amountProps: {
                amount: item.pricePerUnit.amount,
                currencyText: item.pricePerUnit.currency.symbol,
                exchangedAmount: item.pricePerUnit.exchangedAmount,
                exchangeCurrencyText: item.pricePerUnit.exchangeCurrency.symbol
            }
        };
    }, []);

    return { serviceItemToExpandableListItem };
}