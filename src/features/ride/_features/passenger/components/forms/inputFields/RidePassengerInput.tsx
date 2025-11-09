import { Control, useFieldArray } from "react-hook-form";
import { useRidePassengerToExpandableList } from "../../../hooks/useRidePassengerToExpandableList.ts";
import React, { useCallback, useEffect, useState } from "react";
import { useSharedValue } from "react-native-reanimated";
import { PassengerFormFields } from "../../../schemas/form/passengerForm.ts";
import { ExpandableList } from "../../../../../../../components/expandableList/ExpandableList.tsx";
import { ICON_NAMES } from "../../../../../../../constants/index.ts";
import { PopupView } from "../../../../../../../components/popupView/PopupView.tsx";
import Input from "../../../../../../../components/Input/Input.ts";
import { RidePassengerForm } from "../RidePassengerForm.tsx";

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
    title = "Utasok",
    minItemCount = 0,
    maxItemCount = 8
}: RidePassengerInputProps) {
    if(minItemCount > maxItemCount) maxItemCount = minItemCount;

    const { ridePassengerToExpandableList } = useRidePassengerToExpandableList();

    const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);

    const isExpandedAddForm = useSharedValue(false);
    const isExpandedUpdateForm = useSharedValue(false);

    const { fields: items, append, update, remove } = useFieldArray<PassengerFormFields>({
        control,
        name: fieldName
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

    const addItem = useCallback((item: PassengerFormFields) => {
        if(items.length >= maxItemCount) return;

        append(item);
        isExpandedAddForm.value = false;
    }, [items.length, maxItemCount, append]);

    const updateItem = useCallback((item: PassengerFormFields, index: number) => {
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
                data={ items.map(ridePassengerToExpandableList) }
                title={ title }
                actionIcon={ ICON_NAMES.add }
                onAction={ openAddItemForm }
                onRemoveItem={ removeItem }
                onItemPress={ openUpdateItemForm }
            />
            <PopupView opened={ isExpandedAddForm }>
                <RidePassengerForm onSubmit={ (result) => addItem(result) }/>
            </PopupView>
            <PopupView opened={ isExpandedUpdateForm }>
                <RidePassengerForm
                    defaultRidePassenger={ items?.[selectedItemIndex] }
                    onSubmit={ (result) => updateItem(result, selectedItemIndex) }
                />
            </PopupView>
        </Input.Field>
    );
}