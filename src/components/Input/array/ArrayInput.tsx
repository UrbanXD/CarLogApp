import { Control, FieldArrayPath, FieldArrayWithId, FieldValues, useFieldArray } from "react-hook-form";
import { ExpandableListItemProps } from "../../expandableList/ExpandableListItem.tsx";
import { useAlert } from "../../../ui/alert/hooks/useAlert.ts";
import React, { ReactElement, useCallback, useEffect, useMemo, useState } from "react";
import { useSharedValue } from "react-native-reanimated";
import { ArrayInputToast } from "../../../ui/alert/presets/toast/index.ts";
import { debounce } from "es-toolkit";
import Input from "../Input.ts";
import { ExpandableList } from "../../expandableList/ExpandableList.tsx";
import { ICON_NAMES } from "../../../constants/index.ts";
import { PopupView } from "../../popupView/PopupView.tsx";
import { Amount } from "../../../features/_shared/currency/schemas/amountSchema.ts";

export type ArrayInputProps<
    FormFieldValues extends FieldValues,
    Path extends FieldArrayPath<FormFieldValues>,
    KeyName extends string = "fieldId",
> = {
    control: Control<FormFieldValues>
    fieldName: Path
    mapperToExpandableList: (
        item: FieldArrayWithId<FormFieldValues, Path, KeyName>,
        index: number,
        array: Array<FieldArrayWithId<FormFieldValues, Path, KeyName>>
    ) => ExpandableListItemProps
    renderForm: (
        onSubmit: (result: Omit<FieldArrayWithId<FormFieldValues, Path, KeyName>, KeyName>) => void,
        item?: FieldArrayWithId<FormFieldValues, Path, KeyName> | null
    ) => ReactElement | null
    keyName?: KeyName
    title?: string
    subtitle?: string
    maxItemCount?: number
    minItemCount?: number
    itemIdKey?: keyof FieldArrayWithId<FormFieldValues, Path, KeyName>
    checkItemAlreadyAdded?: boolean
    alreadyAddedItemExpression?: (
        itemA: FieldArrayWithId<FormFieldValues, Path, KeyName>,
        itemB: FieldArrayWithId<FormFieldValues, Path, KeyName>
    ) => boolean
    calculateItemAmount?: (item: FieldArrayWithId<FormFieldValues, Path, KeyName>) => Omit<Amount, "exchangeRate">
    showTotalAmounts?: boolean
}

export function ArrayInput<
    FormFieldValues extends FieldValues,
    Path extends FieldArrayPath<FormFieldValues>,
    KeyName extends string = "fieldId",
>({
    control,
    fieldName,
    mapperToExpandableList,
    renderForm,
    title,
    subtitle,
    minItemCount,
    maxItemCount,
    itemIdKey,
    keyName,
    checkItemAlreadyAdded = false,
    alreadyAddedItemExpression,
    calculateItemAmount,
    showTotalAmounts
}: ArrayInputProps<FormFieldValues, Path, KeyName>) {
    const { openToast } = useAlert();
    const activeKeyName = (keyName ?? "fieldId") as KeyName;

    const {
        fields: items,
        append,
        update,
        remove
    } = useFieldArray<FormFieldValues, Path, KeyName>({
        control,
        name: fieldName,
        keyName: activeKeyName
    });

    const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);
    const isExpandedAddForm = useSharedValue(false);
    const isExpandedUpdateForm = useSharedValue(false);

    const max = useMemo(() => {
        const min = minItemCount ?? 0;
        const maxLimit = maxItemCount ?? 8;
        return min > maxLimit ? min : maxLimit;
    }, [minItemCount, maxItemCount]);

    useEffect(() => {
        if(selectedItemIndex === null) return;
        if(!items?.[selectedItemIndex]) {
            setSelectedItemIndex(null);
            return;
        }
        isExpandedUpdateForm.value = true;
    }, [selectedItemIndex, items]);

    const openAddItemForm = useCallback(() => {
        isExpandedAddForm.value = true;
    }, []);

    const openUpdateItemForm = useCallback((index: number) => {
        setSelectedItemIndex(null);
        setTimeout(() => setSelectedItemIndex(index), 0);
    }, []);

    const itemAlreadyInItems = useCallback((newItem: FieldArrayWithId<FormFieldValues, Path, KeyName>) => {
        if(!checkItemAlreadyAdded) return false;

        return items.some(_item => {
            if(alreadyAddedItemExpression) return alreadyAddedItemExpression(_item, newItem);

            const key = itemIdKey ?? ("id" as keyof FieldArrayWithId<FormFieldValues, Path, KeyName>);
            return _item[key] === newItem[key];
        });
    }, [items, itemIdKey, checkItemAlreadyAdded, alreadyAddedItemExpression]);

    const addItem = useCallback((item: any) => {
        if(items.length >= max) return openToast(ArrayInputToast.limit());
        if(itemAlreadyInItems(item)) return openToast(ArrayInputToast.alreadyAdded());

        append(item);
        isExpandedAddForm.value = false;
    }, [items.length, max, append, itemAlreadyInItems, openToast]);

    const updateItem = useCallback((item: any, index: number | null) => {
        if(index === null) return;

        const otherItems = items.filter((_, i) => i !== index);
        const existsElsewhere = otherItems.some(_item => {
            if(alreadyAddedItemExpression) return alreadyAddedItemExpression(_item, item);

            const key = (itemIdKey ?? "id") as keyof typeof _item;

            if(key in _item && key in item) return _item[key] === item[key];
            return false;
        });

        if(existsElsewhere) return openToast(ArrayInputToast.alreadyAdded());

        update(index, item);
        isExpandedUpdateForm.value = false;
        setSelectedItemIndex(null);
    }, [update, items, alreadyAddedItemExpression, itemIdKey, openToast]);

    const removeItem = useCallback((index: number | null) => {
        if(index === null) return;
        remove(index);
    }, [remove]);

    const debouncedAddItem = useMemo(() => debounce(addItem, 250), [addItem]);
    const debouncedUpdateItem = useMemo(
        () => debounce((item: any) => updateItem(item, selectedItemIndex), 250),
        [updateItem, selectedItemIndex]
    );
    const debouncedRemoveItem = useMemo(() => debounce(removeItem, 250), [removeItem]);

    const getTotalAmount = useCallback(() => {
        if(items.length === 0 || !showTotalAmounts || !calculateItemAmount) return undefined;

        const totals = new Map<string, Omit<Amount, "exchangeRate">>();

        for(const item of items) {
            const amount = calculateItemAmount(item);
            const key = amount.currency.key;
            const existing = totals.get(key);

            if(existing) {
                totals.set(key, {
                    ...existing,
                    amount: existing.amount + amount.amount,
                    exchangedAmount: existing.exchangedAmount + amount.exchangedAmount
                });
            } else {
                totals.set(key, amount);
            }
        }

        return Array.from(totals.values()).sort((a, b) => b.amount - a.amount);
    }, [items, showTotalAmounts, calculateItemAmount]);

    return (
        <Input.Field control={ control } fieldName={ fieldName }>
            <ExpandableList
                expanded={ true }
                data={ items.map(mapperToExpandableList) }
                title={ title }
                subtitle={ subtitle }
                totalAmount={ getTotalAmount() }
                actionIcon={ ICON_NAMES.add }
                onAction={ openAddItemForm }
                onRemoveItem={ debouncedRemoveItem }
                onItemPress={ openUpdateItemForm }
            />
            <PopupView opened={ isExpandedAddForm }>
                { renderForm(debouncedAddItem) }
            </PopupView>
            <PopupView opened={ isExpandedUpdateForm }>
                { renderForm(
                    debouncedUpdateItem,
                    selectedItemIndex !== null ? items[selectedItemIndex] : null
                ) }
            </PopupView>
        </Input.Field>
    );
}