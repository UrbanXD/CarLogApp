import { useCallback } from "react";
import { ExpandableListItemProps } from "../../../../../components/expandableList/ExpandableListItem.tsx";
import { useTranslation } from "react-i18next";
import { ServiceItemFormTransformedFields } from "../schemas/form/serviceItemForm.ts";

export function useServiceItemToExpandableList() {
    const { t } = useTranslation();

    const serviceItemToExpandableListItem = useCallback((item: ServiceItemFormTransformedFields): ExpandableListItemProps => {
        return {
            id: item.id,
            title: t(`service.items.types.${ item.type.key }`),
            count: item.quantity,
            amountProps: {
                amount: item.pricePerUnit.amount,
                currencyText: item.pricePerUnit.currency.symbol,
                exchangedAmount: item.pricePerUnit.exchangedAmount,
                exchangeCurrencyText: item.pricePerUnit.exchangeCurrency.symbol
            }
        };
    }, [t]);

    return { serviceItemToExpandableListItem };
}