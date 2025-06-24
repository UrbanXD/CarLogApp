import React from "react";
import { StyleSheet, View } from "react-native";
import { SEPARATOR_SIZES } from "../../../constants/index.ts";
import PickerItem, { PickerElement } from "./PickerItem.tsx";
import { usePicker } from "../../../hooks/usePicker.ts";

interface SimplePickerProps {
    elements: Array<PickerElement>;
    setValue?: (value: string) => void;
}

const SimplePicker: React.FC<SimplePickerProps> = ({
    elements,
    setValue
}) => {
    const { selectedElement, onSelect } = usePicker(elements, setValue);

    const renderElement = (element: PickerElement, index: number) =>
        <PickerItem
            key={ index }
            element={ element }
            onPress={ () => onSelect(element.id) }
            selected={ element.id === selectedElement?.id }
        />;

    return (
        <View style={ styles.container }>
            { elements.map(renderElement) }
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