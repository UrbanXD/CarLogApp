import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { SEPARATOR_SIZES } from "../../../constants/index.ts";
import PickerItem, { PickerItemType } from "./PickerItem.tsx";
import { useInputFieldContext } from "../../../contexts/inputField/InputFieldContext.ts";

type SimplePickerProps = {
    items: Array<PickerItemType>
    defaultValue?: string
    setValue?: (value: string) => void
}

const SimplePicker: React.FC<SimplePickerProps> = ({
    items,
    defaultValue,
    setValue
}) => {
    const inputFieldContext = useInputFieldContext();
    const onChange = inputFieldContext?.field?.onChange;
    const inputFieldValue = inputFieldContext?.field.value?.toString() ?? null;

    const findItemByValue = useCallback(
        (value: string) => items.find(item => item.value === value),
        [items]
    );

    const [selectedItem, setSelectedItem] = useState<PickerItemType | undefined>(
        findItemByValue(inputFieldValue ?? defaultValue)
    );

    useEffect(() => {
        if(!selectedItem) return;
        const item = findItemByValue(selectedItem.value);

        if(onChange) onChange(item?.value ?? "");
        if(setValue) setValue(item?.value ?? "");

        setSelectedItem(item);
    }, [items]);

    useEffect(() => {
        if(!inputFieldContext?.field.value) return setSelectedItem(undefined);

        const item = findItemByValue(inputFieldContext?.field?.value?.toString());
        setSelectedItem(item);
    }, [inputFieldContext?.field.value, items]);

    const onSelect = useCallback((value: string) => {
        const item = findItemByValue(value);
        if(!item) return;

        if(onChange) onChange(item.value);
        if(setValue) setValue(item.value);
        setSelectedItem(item);
    }, [items, setValue, onChange, findItemByValue]);

    const renderItem = useCallback((item: PickerItemType, index: number) => (
        <PickerItem
            key={ index }
            item={ item }
            onPress={ () => onSelect(item.value) }
            selected={ item.value === selectedItem?.value }
        />
    ), [selectedItem, onSelect]);

    return (
        <View style={ styles.container }>
            { items.map(renderItem) }
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: SEPARATOR_SIZES.small
    }
});

export default SimplePicker;