import { Control, useFieldArray } from "react-hook-form";
import { useRidePassengerToExpandableList } from "../../../hooks/useRidePassengerToExpandableList.ts";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSharedValue } from "react-native-reanimated";
import { ExpandableList } from "../../../../../../../components/expandableList/ExpandableList.tsx";
import { ICON_NAMES } from "../../../../../../../constants/index.ts";
import { PopupView } from "../../../../../../../components/popupView/PopupView.tsx";
import Input from "../../../../../../../components/Input/Input.ts";
import { RidePassengerForm } from "../RidePassengerForm.tsx";
import { useTranslation } from "react-i18next";
import { ArrayInputToast } from "../../../../../../../ui/alert/presets/toast/index.ts";
import { useAlert } from "../../../../../../../ui/alert/hooks/useAlert.ts";
import { debounce } from "es-toolkit";
import { RidePassengerFormFields } from "../../../schemas/form/ridePassengerForm.ts";

type RidePassengerInputProps = {
    control: Control<any>
    fieldName: string
    title?: string
    maxItemCount?: number
    minItemCount?: number
}

export function RidePassengerInput({
    control,
    fieldName,
    title,
    minItemCount = 0,
    maxItemCount = 8
}: RidePassengerInputProps) {
    if(minItemCount > maxItemCount) maxItemCount = minItemCount;

    const { t } = useTranslation();
    const { ridePassengerToExpandableList } = useRidePassengerToExpandableList();
    const { openToast } = useAlert();

    const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);

    const isExpandedAddForm = useSharedValue(false);
    const isExpandedUpdateForm = useSharedValue(false);

    const { fields: items, append, update, remove } = useFieldArray<RidePassengerFormFields>({
        control,
        name: fieldName,
        keyName: "fieldId"
    });

    useEffect(() => {
        if(selectedItemIndex === null) return;
        if(!items?.[selectedItemIndex]) return setSelectedItemIndex(null);

        isExpandedUpdateForm.value = true;
    }, [selectedItemIndex]);

    const openAddItemForm = useCallback(() => {
        isExpandedAddForm.value = true;
    });

    const openUpdateItemForm = useCallback((index: number) => {
        setSelectedItemIndex(null); // reset selected item index to prevent not opening form with the latest index
        setTimeout(() => setSelectedItemIndex(index), 0);
    });

    const addItem = useCallback((item: RidePassengerFormFields) => {
        if(items.length >= maxItemCount) return openToast(ArrayInputToast.limit());
        if(items.some(_item => _item.id === item.id)) return;
        if(items.some(_item => _item?.passengerId === item.passengerId)) return openToast(ArrayInputToast.alreadyAdded());

        append(item);
        isExpandedAddForm.value = false;
    }, [items, maxItemCount, append]);

    const updateItem = useCallback((item: RidePassengerFormFields, index: number) => {
        if(items.some(_item => _item.id !== item.id && _item?.passengerId === item.passengerId)) {
            return openToast(ArrayInputToast.alreadyAdded());
        }

        update(index, item);
        isExpandedUpdateForm.value = false;
        setSelectedItemIndex(null);
    }, [update, items]);

    const removeItem = useCallback((index: number) => {
        remove(index);
    }, [items.length, minItemCount, remove]);

    const debouncedAddItem = useMemo(() => debounce(addItem, 250), [addItem]);
    const debouncedUpdateItem = useMemo(() => debounce(updateItem, 250), [updateItem]);
    const debouncedRemoveItem = useMemo(() => debounce(removeItem, 250), [removeItem]);

    return (
        <Input.Field control={ control } fieldName={ fieldName }>
            <ExpandableList
                expanded={ true }
                data={ items.map(ridePassengerToExpandableList) }
                title={ title ?? t("passengers.title") }
                actionIcon={ ICON_NAMES.add }
                onAction={ openAddItemForm }
                onRemoveItem={ debouncedRemoveItem }
                onItemPress={ openUpdateItemForm }
            />
            <PopupView opened={ isExpandedAddForm }>
                <RidePassengerForm onSubmit={ debouncedAddItem }/>
            </PopupView>
            <PopupView opened={ isExpandedUpdateForm }>
                <RidePassengerForm
                    defaultRidePassenger={ items?.[selectedItemIndex] }
                    onSubmit={ (result) => debouncedUpdateItem(result, selectedItemIndex) }
                />
            </PopupView>
        </Input.Field>
    );
}