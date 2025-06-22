import React, { useEffect, useState } from "react";
import { StyleSheet, TextInput as TextInputRN, View } from "react-native";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { COLORS, ICON_COLORS, ICON_NAMES } from "../../../constants/index.ts";
import Icon from "../../Icon.tsx";
import { useBottomSheetInternal } from "@gorhom/bottom-sheet";
import { useInputFieldContext } from "../../../contexts/inputField/InputFieldContext.ts";

interface TextInputProps {
    value?: string;
    setValue?: (text: string) => void;
    icon?: string;
    actionIcon?: string;
    onAction?: () => void;
    placeholder?: string;
    numeric?: boolean;
    isSecure?: boolean;
    isEditable?: boolean;
}

const TextInput: React.FC<TextInputProps> = ({
    value,
    setValue,
    icon,
    actionIcon,
    onAction,
    placeholder,
    numeric,
    isSecure,
    isEditable
}) => {
    const { shouldHandleKeyboardEvents } = useBottomSheetInternal();

    const inputFieldContext = useInputFieldContext();
    const fieldValue = inputFieldContext?.field?.value || value;
    const onChange = inputFieldContext?.field?.onChange;
    const error = inputFieldContext?.fieldState?.error;

    const updateFieldValue = (value: string) => {
        if(onChange) onChange(value);
        if(setValue) setValue(value);
    };

    const [focused, setFocused] = useState(false);
    const [secure, setSecure] = useState(isSecure);

    const changeSecure = () => setSecure(!secure);
    const onFocus = () => setFocused(true);
    const onBlur = () => setFocused(false);

    useEffect(() => {
        shouldHandleKeyboardEvents.value = focused;
    }, [focused, shouldHandleKeyboardEvents]);

    return (
        <View
            style={ [
                styles.formFieldContainer,
                focused && styles.activeFormFieldContainer,
                !!error && styles.errorFormFieldContainer
            ] }>
            {
                icon &&
               <View style={ styles.formFieldIconContainer }>
                  <Icon
                     icon={ icon }
                     size={ hp(4.5) }
                     color={ styles.textInput.color }
                  />
               </View>
            }
            <TextInputRN
                placeholder={ placeholder }
                style={ styles.textInput }
                placeholderTextColor={ styles.placeholderText.color }
                value={ fieldValue }
                keyboardType={ numeric ? "numeric" : "default" }
                secureTextEntry={ secure }
                onChangeText={ updateFieldValue }
                onBlur={ onBlur }
                onFocus={ onFocus }
                editable={ isEditable }
            />
            {
                isSecure &&
               <View style={ styles.formFieldIconContainer }>
                  <Icon
                     icon={ secure ? ICON_NAMES.eyeOff : ICON_NAMES.eye }
                     size={ hp(3.25) }
                     color={ ICON_COLORS.default }
                     onPress={ changeSecure }
                  />
               </View>
            }
            {
                actionIcon &&
               <View style={ styles.formFieldIconContainer }>
                  <Icon
                     icon={ actionIcon }
                     size={ hp(4.5) }
                     color={ ICON_COLORS.default }
                      // style={{ alignSelf: "center" }}
                     onPress={ onAction }
                  />
               </View>
            }
        </View>
    );
};

const styles = StyleSheet.create({
    formFieldContainer: {
        minHeight: hp(6),
        maxHeight: hp(6),
        flexDirection: "row",
        alignItems: "center",
        gap: hp(1.5),
        backgroundColor: COLORS.gray5,
        paddingHorizontal: hp(1.5),
        borderRadius: 20,
        overflow: "hidden"
    },
    activeFormFieldContainer: {
        borderWidth: 1,
        borderColor: COLORS.gray1
    },
    errorFormFieldContainer: {
        borderWidth: 1,
        borderColor: COLORS.redLight
    },
    formFieldIconContainer: {
        flex: 0.15,
        alignItems: "center"
    },
    textInput: {
        flex: 1,
        color: COLORS.gray1,
        fontSize: hp(2.25)
    },
    placeholderText: {
        color: COLORS.gray2
    }
});

export default TextInput;