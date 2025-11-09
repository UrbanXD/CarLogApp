import { Control, useFieldArray } from "react-hook-form";
import Input from "../../../../../../../components/Input/Input.ts";
import React, { useCallback, useEffect, useState } from "react";
import { useSharedValue } from "react-native-reanimated";
import { PopupView } from "../../../../../../../components/popupView/PopupView.tsx";
import { ICON_NAMES } from "../../../../../../../constants/index.ts";
import { ExpandableList } from "../../../../../../../components/expandableList/ExpandableList.tsx";
import { useRidePlaceToExpandableList } from "../../../../../hooks/useRidePlaceToExpandableList.ts";
import { PlaceFormFields } from "../../../schemas/form/placeForm.ts";
import { RidePlaceForm } from "../RidePlaceForm.tsx";

type RidePlaceInputProps = {
    control: Control<any>
    fieldName: string
    title?: string
    maxItemCount?: number
    minItemCount?: number
}

export function RidePlaceInput({
    control,
    fieldName,
    title = "Helyszínek",
    minItemCount = 0,
    maxItemCount = 8
}: RidePlaceInputProps) {
    if(minItemCount > maxItemCount) maxItemCount = minItemCount;

    const { ridePlaceToExpandableList } = useRidePlaceToExpandableList();

    const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);

    const isExpandedAddForm = useSharedValue(false);
    const isExpandedUpdateForm = useSharedValue(false);

    const { fields: items, append, update, remove } = useFieldArray<PlaceFormFields>({
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

    const addItem = useCallback((item: PlaceFormFields) => {
        if(items.length >= maxItemCount) return;

        append(item);
        isExpandedAddForm.value = false;
    }, [items.length, maxItemCount, append]);

    const updateItem = useCallback((item: PlaceFormFields, index: number) => {
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
                data={ items.map(ridePlaceToExpandableList) }
                title={ title }
                actionIcon={ ICON_NAMES.add }
                onAction={ openAddItemForm }
                onRemoveItem={ removeItem }
                onItemPress={ openUpdateItemForm }
            />
            <PopupView opened={ isExpandedAddForm }>
                <RidePlaceForm onSubmit={ (result) => addItem(result) }/>
            </PopupView>
            <PopupView opened={ isExpandedUpdateForm }>
                <RidePlaceForm
                    defaultRidePlace={ items?.[selectedItemIndex] }
                    onSubmit={ (result) => updateItem(result, selectedItemIndex) }
                />
            </PopupView>
        </Input.Field>
    );
}