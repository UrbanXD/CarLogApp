import { Control, useFieldArray, useWatch } from "react-hook-form";
import Input from "../../../../../../../components/Input/Input.ts";
import React, { useCallback, useEffect, useState } from "react";
import { FormResultServiceItem } from "../../../schemas/serviceItemSchema.ts";
import { useSharedValue } from "react-native-reanimated";
import { Car } from "../../../../../../car/schemas/carSchema.ts";
import { PopupView } from "../../../../../../../components/popupView/PopupView.tsx";
import { ServiceLogFields } from "../../../schemas/form/serviceLogForm.ts";
import useCars from "../../../../../../car/hooks/useCars.ts";
import { ICON_NAMES } from "../../../../../../../constants/index.ts";
import { CurrencyEnum } from "../../../../../../_shared/currency/enums/currencyEnum.ts";
import { ServiceItemForm } from "../ServiceItemForm.tsx";
import { Amount } from "../../../../../../_shared/currency/schemas/amountSchema.ts";
import { useServiceItemToExpandableList } from "../../../hooks/useServiceItemToExpandableList.ts";
import { ExpandableList } from "../../../../../../../components/expandableList/ExpandableList.tsx";
import { useTranslation } from "react-i18next";

type ServiceItemInputProps = {
    control: Control<any>
    fieldName: string
    carIdFieldName: string
    title?: string
    maxItemCount?: number
    minItemCount?: number
}


export function ServiceItemInput({
    control,
    fieldName,
    carIdFieldName,
    title,
    minItemCount = 0,
    maxItemCount = 5
}: ServiceItemInputProps) {
    if(minItemCount > maxItemCount) maxItemCount = minItemCount;

    const { t } = useTranslation();
    const { getCar } = useCars();
    const { serviceItemToExpandableListItem } = useServiceItemToExpandableList();

    const [car, setCar] = useState<Car | null>(null);
    const [totalAmount, setTotalAmount] = useState<Array<Amount>>([]);
    const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);

    const isExpandedAddForm = useSharedValue(false);
    const isExpandedUpdateForm = useSharedValue(false);

    const formCarId = useWatch({ control, name: carIdFieldName });

    const { fields: items, append, update, remove } = useFieldArray<ServiceLogFields["items"]>({
        control,
        name: fieldName,
        keyName: "fieldId"
    });

    useEffect(() => {
        const car = getCar(formCarId);
        setCar(car ?? null);
    }, [formCarId]);

    useEffect(() => {
        if(selectedItemIndex === null) return;
        if(!items?.[selectedItemIndex]) return setSelectedItemIndex(null);

        isExpandedUpdateForm.value = true;
    }, [selectedItemIndex]);

    useEffect(() => {
        const totals = new Map<string, Amount>();

        for(const item of items) {
            const { pricePerUnit, quantity } = item;
            const { currency, exchangeCurrency, exchangeRate } = pricePerUnit;

            const key = currency.key;

            const existing = totals.get(key);
            const amount = pricePerUnit.amount * quantity;
            const exchangedAmount = pricePerUnit.exchangedAmount * quantity;

            if(existing) {
                const newAmount = existing.amount + amount;
                const newExchangedAmount = existing.exchangedAmount + exchangedAmount;

                totals.set(key, { ...existing, amount: newAmount, exchangedAmount: newExchangedAmount });
            } else {
                totals.set(key, {
                    amount,
                    exchangedAmount,
                    exchangeRate,
                    currency,
                    exchangeCurrency
                });
            }
        }
        setTotalAmount(
            Array.from(totals.values()).sort((a, b) => b.amount - a.amount)
        );
    }, [items]);

    const openAddItemForm = useCallback(() => {
        isExpandedAddForm.value = true;
    });

    const openUpdateItemForm = useCallback((index: number) => {
        setSelectedItemIndex(null); // reset selected item index to prevent not opening form with the latest index
        setTimeout(() => setSelectedItemIndex(index), 0);
    });

    const addItem = useCallback((item: FormResultServiceItem) => {
        if(items.length >= maxItemCount) return;

        append(item);
        isExpandedAddForm.value = false;
    }, [items.length, maxItemCount, append]);

    const updateItem = useCallback((item: FormResultServiceItem, index: number) => {
        update(index, item);
        isExpandedUpdateForm.value = false;
        setSelectedItemIndex(null);
    }, [update]);

    const removeItem = useCallback((index: number) => {
        if(items.length <= minItemCount) return;

        remove(index);
    }, [items.length, minItemCount, remove]);

    return (
        <Input.Field control={ control } fieldName={ fieldName }>
            <ExpandableList
                expanded={ true }
                data={ items.map(serviceItemToExpandableListItem) }
                title={ title ?? t("service.items.title") }
                subtitle={ t("currency.price_per_unit") }
                totalAmount={ totalAmount }
                actionIcon={ ICON_NAMES.add }
                onAction={ openAddItemForm }
                onRemoveItem={ removeItem }
                onItemPress={ openUpdateItemForm }
            />
            <PopupView opened={ isExpandedAddForm }>
                <ServiceItemForm
                    carCurrencyId={ car?.currency.id ?? CurrencyEnum.EUR }
                    onSubmit={ (result) => addItem(result) }
                />
            </PopupView>
            <PopupView opened={ isExpandedUpdateForm }>
                <ServiceItemForm
                    defaultServiceItem={ items?.[selectedItemIndex] }
                    carCurrencyId={ car?.currency.id ?? CurrencyEnum.EUR }
                    onSubmit={ (result) => updateItem(result, selectedItemIndex) }
                />
            </PopupView>
        </Input.Field>
    );
}