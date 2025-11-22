import { Control, useFieldArray, useWatch } from "react-hook-form";
import React, { useCallback, useEffect, useState } from "react";
import { useSharedValue } from "react-native-reanimated";
import { PlaceFormFields } from "../../../../place/schemas/form/placeForm.ts";
import Input from "../../../../../../../components/Input/Input.ts";
import { ExpandableList } from "../../../../../../../components/expandableList/ExpandableList.tsx";
import { ICON_NAMES } from "../../../../../../../constants/index.ts";
import { PopupView } from "../../../../../../../components/popupView/PopupView.tsx";
import { Car } from "../../../../../../car/schemas/carSchema.ts";
import { Amount } from "../../../../../../_shared/currency/schemas/amountSchema.ts";
import useCars from "../../../../../../car/hooks/useCars.ts";
import { useRideExpenseToExpandableList } from "../../../hooks/useRideExpenseToExpandableList.ts";
import { RideExpenseForm } from "../RideExpenseForm.tsx";
import { FormResultRideExpense } from "../../../schemas/rideExpenseSchema.ts";
import { useTranslation } from "react-i18next";
import { useAlert } from "../../../../../../../ui/alert/hooks/useAlert.ts";
import { ArrayInputToast } from "../../../../../../../ui/alert/presets/toast/index.ts";

type RideExpenseInputProps = {
    control: Control<any>
    fieldName: string
    carIdFieldName: string
    startTimeFieldName?: string
    title?: string
    maxItemCount?: number
    minItemCount?: number
}

export function RideExpenseInput({
    control,
    fieldName,
    carIdFieldName,
    startTimeFieldName,
    title,
    minItemCount = 0,
    maxItemCount = 8
}: RideExpenseInputProps) {
    if(minItemCount > maxItemCount) maxItemCount = minItemCount;

    const { t } = useTranslation();
    const { getCar } = useCars();
    const { rideExpenseToExpandableList } = useRideExpenseToExpandableList();
    const { openToast } = useAlert();

    const [car, setCar] = useState<Car | null>(null);
    const [totalAmount, setTotalAmount] = useState<Array<Amount>>([]);
    const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);

    const isExpandedAddForm = useSharedValue(false);
    const isExpandedUpdateForm = useSharedValue(false);

    const formCarId = useWatch({ control, name: carIdFieldName });
    const formStartTime = useWatch({ control, name: startTimeFieldName });

    const { fields: items, append, update, remove } = useFieldArray<FormResultRideExpense>({
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

        for(const item: FormResultRideExpense of items) {
            const key = item.expense.amount.currency.id;

            const existing = totals.get(key);
            if(existing) {
                const newAmount = existing.amount + item.expense.amount.amount;
                const newExchangedAmount = existing.exchangedAmount + item.expense.amount.exchangedAmount;

                totals.set(key, { ...existing, amount: newAmount, exchangedAmount: newExchangedAmount });
            } else {
                totals.set(key, item.expense.amount);
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

    const addItem = useCallback((item: PlaceFormFields) => {
        if(items.length >= maxItemCount) return openToast(ArrayInputToast.limit());

        append(item);
        isExpandedAddForm.value = false;
    }, [items.length, maxItemCount, append]);

    const updateItem = useCallback((item: PlaceFormFields, index: number) => {
        update(index, item);
        isExpandedUpdateForm.value = false;
        setSelectedItemIndex(null);
    }, [update]);

    const removeItem = useCallback((index: number) => {
        remove(index);
    }, [items.length, remove]);

    return (
        <Input.Field control={ control } fieldName={ fieldName }>
            <ExpandableList
                expanded={ true }
                data={ items.map(rideExpenseToExpandableList) }
                totalAmount={ items.length >= 1 && totalAmount }
                title={ title ?? t("rides.other_expenses") }
                actionIcon={ ICON_NAMES.add }
                onAction={ openAddItemForm }
                onRemoveItem={ removeItem }
                onItemPress={ openUpdateItemForm }
            />
            <PopupView opened={ isExpandedAddForm }>
                <RideExpenseForm
                    car={ car }
                    defaultDate={ formStartTime }
                    onSubmit={ (result) => addItem(result) }
                />
            </PopupView>
            <PopupView opened={ isExpandedUpdateForm }>
                <RideExpenseForm
                    car={ car }
                    defaultRideExpense={ items?.[selectedItemIndex] }
                    defaultDate={ formStartTime }
                    onSubmit={ (result) => updateItem(result, selectedItemIndex) }
                />
            </PopupView>
        </Input.Field>
    );
}