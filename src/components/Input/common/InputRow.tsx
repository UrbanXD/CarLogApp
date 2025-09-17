import React, { ReactElement } from "react";
import { StyleSheet, View } from "react-native";
import { SEPARATOR_SIZES } from "../../../constants/index.ts";
import { formTheme } from "../../../ui/form/constants/theme.ts";

type InputRowProps = {
    children?: ReactElement
    focused?: boolean
}

export function InputRow({ children, focused = false }: InputRowProps) {
    return (
        <View style={ [styles.container, focused && styles.focused] }>
            { children }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
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
    }
});