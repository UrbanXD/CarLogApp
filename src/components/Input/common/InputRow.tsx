import React, { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { SEPARATOR_SIZES } from "../../../constants/index.ts";
import { formTheme } from "../../../ui/form/constants/theme.ts";
import { useInputFieldContext } from "../../../contexts/inputField/InputFieldContext.ts";
import { ViewStyle } from "../../../types/index.ts";

const hasErrorForFields = (error: any, fieldNames: string[]): boolean => {
    if(typeof error !== "object" || error === null) {
        return false;
    }

    const childErrors = Object.values(error).filter(Boolean) as any[];

    for(const childError of childErrors) {
        if(
            typeof childError === "object" &&
            childError !== null &&
            "ref" in childError &&
            childError.ref?.name &&
            fieldNames.includes(childError.ref.name)
        ) {
            return true;
        }
    }
    return false;
};

type InputRowProps = {
    children?: ReactNode | Array<ReactNode>
    errorFieldNames?: Array<string>
    focused?: boolean
    style?: ViewStyle
}

export function InputRow({ children, focused = false, errorFieldNames, style }: InputRowProps) {
    const inputFieldContext = useInputFieldContext();
    let error = inputFieldContext?.fieldState?.error;

    let shouldShowErrorStyle = false;
    if(error) {
        if("ref" in error && error.ref?.name) {
            if(errorFieldNames && errorFieldNames.length > 0) {
                shouldShowErrorStyle = errorFieldNames.includes(error.ref.name);
            } else {
                shouldShowErrorStyle = true;
            }
        } else {
            if(errorFieldNames && errorFieldNames.length > 0) {
                shouldShowErrorStyle = hasErrorForFields(error, errorFieldNames);
            } else {
                shouldShowErrorStyle = true;
            }
        }
    }

    return (
        <View style={ [styles.container, focused && styles.focused, shouldShowErrorStyle && styles.error, style] }>
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