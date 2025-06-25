import React, { useState } from "react";
import { StyleSheet, TextInput as TextInputRN, View } from "react-native";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { COLORS, ICON_COLORS, ICON_NAMES } from "../../../constants/index.ts";
import Icon from "../../Icon.tsx";
import { useInputFieldContext } from "../../../contexts/inputField/InputFieldContext.ts";

export interface TextInputProps {
    type?: "primary" | "secondary";
    value?: string;
    setValue?: (text: string) => void;
    icon?: string;
    actionIcon?: string;
    onAction?: () => void;
    placeholder?: string;
    numeric?: boolean;
    secure?: boolean;
    editable?: boolean;
    multiline?: boolean;
    alwaysFocused?: boolean; // csak design szempont
}

const TextInput: React.FC<TextInputProps> = ({
    type = "primary",
    value,
    setValue,
    icon,
    actionIcon,
    onAction,
    placeholder,
    numeric,
    secure: isSecure,
    editable,
    multiline,
    alwaysFocused
}) => {
    // const { shouldHandleKeyboardEvents } = useBottomSheetInternal();

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

    const changeSecure = () => setSecure(prevState => !prevState);
    const onFocus = () => setFocused(true);
    const onBlur = () => setFocused(false);

    // useEffect(() => {
    //     shouldHandleKeyboardEvents.value = focused;
    // }, [focused, shouldHandleKeyboardEvents]);

    return (
        <View
            style={ [
                styles.formFieldContainer,
                type === "primary" && styles.primaryFormFieldContainer,
                (focused || alwaysFocused) && styles.activeFormFieldContainer,
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
                multiline={ multiline }
                keyboardType={ numeric ? "numeric" : "default" }
                secureTextEntry={ secure }
                onChangeText={ updateFieldValue }
                onBlur={ onBlur }
                onFocus={ onFocus }
                editable={ editable }
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
        overflow: "hidden"
    },
    primaryFormFieldContainer: {
        backgroundColor: COLORS.gray5,
        paddingHorizontal: hp(1.5),
        borderRadius: 20,
        borderWidth: 1,
        borderColor: COLORS.gray5
    },
    activeFormFieldContainer: {
        borderColor: COLORS.gray2
    },
    errorFormFieldContainer: {
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