import React, { ReactElement } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { SEPARATOR_SIZES } from "../../../constants/index.ts";
import { formTheme } from "../../../ui/form/constants/theme.ts";
import { useInputFieldContext } from "../../../contexts/inputField/InputFieldContext.ts";

type InputRowProps = {
    children?: ReactElement
    focused?: boolean
    style?: ViewStyle
}

export function InputRow({ children, focused = false, style }: InputRowProps) {
    const inputFieldContext = useInputFieldContext();
    const error = inputFieldContext?.fieldState?.error;

    return (
        <View style={ [styles.container, focused && styles.focused, error && styles.error, style] }>
            { children }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row",
        gap: SEPARATOR_SIZES.small,
        height: formTheme.containerHeight,
        backgroundColor: formTheme.containerBackgroundColor,
        borderRadius: formTheme.borderRadius,
        paddingHorizontal: formTheme.containerPaddingHorizontal,
        borderWidth: 1,
        borderColor: formTheme.borderColor
    },
    focused: {
        borderColor: formTheme.activeColor
    },
    error: {
        borderColor: formTheme.errorColor
    }
});

export default InputRow;