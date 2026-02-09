import React, { ReactElement, useEffect, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { COLORS, SEPARATOR_SIZES } from "../../../constants/index.ts";
import { heightPercentageToDP } from "react-native-responsive-screen";
import { useInputFieldContext } from "../../../contexts/inputField/InputFieldContext.ts";
import { formTheme } from "../../../ui/form/constants/theme.ts";
import { Color } from "../../../types/index.ts";

type InputColorPickerProps = {
    colors: Array<string>
    defaultColor?: string | null
    setValue?: (color: string | null) => void
    renderSelectedColor?: (color: Color | null) => ReactElement
}

export function InputColorPicker({
    colors,
    defaultColor = null,
    setValue,
    renderSelectedColor
}: InputColorPickerProps) {
    const inputFieldContext = useInputFieldContext();
    const onChange = inputFieldContext?.field?.onChange;
    const fieldValue = inputFieldContext?.field?.value ?? defaultColor ?? colors?.[0] ?? null;

    const [selectedColor, setSelectedColor] = useState<string | null>(fieldValue);

    useEffect(() => {
        const newValue = inputFieldContext?.field?.value;
        if(newValue !== selectedColor) setSelectedColor(newValue ?? null);
    }, [inputFieldContext?.field?.value]);

    useEffect(() => {
        if(inputFieldContext?.field?.value !== selectedColor) {
            if(onChange) onChange(selectedColor);
            if(setValue) setValue(selectedColor);
        }
    }, [selectedColor]);

    return (
        <View style={ styles.container }>
            { renderSelectedColor && selectedColor && renderSelectedColor(selectedColor) }
            <View style={ styles.colorsContainer }>
                {
                    colors.map((color) => (
                        <Pressable
                            key={ color }
                            onPress={ () => setSelectedColor(color) }
                            style={ [
                                styles.colorDot,
                                { backgroundColor: color },
                                selectedColor === color && styles.selectedColorDot
                            ] }
                        />
                    ))
                }
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: formTheme.gap
    },
    colorsContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: SEPARATOR_SIZES.lightSmall,
        paddingHorizontal: SEPARATOR_SIZES.lightSmall / 2
    },
    colorDot: {
        height: heightPercentageToDP(3),
        width: heightPercentageToDP(3),
        borderRadius: 100
    },
    selectedColorDot: {
        transform: [{ scale: 1.25 }],
        borderColor: COLORS.gray1,
        borderWidth: 1.35
    }
});