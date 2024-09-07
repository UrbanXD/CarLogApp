import React, {useCallback, useState} from "react";
import {
    StyleProp,
    StyleSheet,
    TextInput,
    TextStyle,
    Text,
    View,
    ViewStyle,
    NativeSyntheticEvent,
    TextInputFocusEventData
} from "react-native";
import {Control, Controller, FieldError, FieldValues} from "react-hook-form";
import {GLOBAL_STYLE, ICON_COLORS, ICON_NAMES, SEPARATOR_SIZES} from "../../constants/constants";
import {Divider, Icon, IconButton} from "react-native-paper";
import {heightPercentageToDP as hp, heightPercentageToDP} from "react-native-responsive-screen";
import {theme} from "../../constants/theme";
import {useBottomSheetInternal} from "@gorhom/bottom-sheet";
import InputTitle from "./InputTitle";

interface InputTextProps {
    control: Control<any>
    fieldName: string
    fieldNameText?: string
    fieldInfoText?: string
    icon?: string
    placeholder?: string
    numeric?: boolean
    isSecure?: boolean
    isEditable?: boolean
    style?: StyleProp<ViewStyle>
    textStyle?: StyleProp<TextStyle>
    isInBottomSheet?: boolean
}

const InputText: React.FC<InputTextProps> = ({
    control,
    fieldName,
    fieldNameText,
    fieldInfoText,
    icon,
    placeholder = "",
    numeric = false,
    isSecure= false,
    isEditable = true,
    style,
    textStyle,
    isInBottomSheet = false
}) => {
    const [focused, setFocused] = useState(false);
    const [secure, setSecure] = useState(isSecure);

    const changeSecure = () => setSecure(!secure);

    const onFocus = () => setFocused(true);
    const onBlur = () => setFocused(false);

    const handleOnFocus = useCallback(
        (args: NativeSyntheticEvent<TextInputFocusEventData>) => {
            if (isInBottomSheet) {
                const { shouldHandleKeyboardEvents } = useBottomSheetInternal();
                shouldHandleKeyboardEvents.value = true;
            }
            onFocus();
        },
        [onFocus, isInBottomSheet]
    );

    const handleOnBlur = useCallback(
        (args: NativeSyntheticEvent<TextInputFocusEventData>) => {
            if (isInBottomSheet) {
                const { shouldHandleKeyboardEvents } = useBottomSheetInternal();
                shouldHandleKeyboardEvents.value = false;
            }
            onBlur();
        },
        [onBlur, isInBottomSheet]
    );

    return (
        <View style={ styles.inputContainer }>
            {
                fieldNameText &&
                    <InputTitle
                        title={ fieldNameText }
                        subtitle={ fieldInfoText }
                    />
            }
            <Controller
                control={ control }
                name={ fieldName }
                render={({ field: { value, onChange }, fieldState: { error }})=>
                    <>
                        <View style={ [style, isEditable && styles.formFieldContainer, focused && isEditable && styles.activeFormFieldContainer] }>
                            {
                                icon &&
                                <View style={ styles.formFieldIconContainer }>
                                    <Icon source={ icon } size={ heightPercentageToDP(4.5) } color={ styles.textInput.color } />
                                </View>
                            }
                            <TextInput
                                placeholder={ placeholder }
                                style={ [textStyle, styles.textInput] }
                                placeholderTextColor={ styles.placeholderText.color }
                                value={ value }
                                keyboardType={ numeric ? "numeric" : "default" }
                                secureTextEntry={ secure }
                                onChangeText={ onChange }
                                onBlur={ onBlur }
                                onFocus={ onFocus }
                                editable={ isEditable }
                            />
                            <View style={ styles.formFieldIconContainer }>
                                {
                                    isSecure &&
                                    <IconButton
                                        icon={ secure ? ICON_NAMES.eyeOff : ICON_NAMES.eye }
                                        size={ hp(3.25) }
                                        iconColor={ ICON_COLORS.default }
                                        onPress={ changeSecure }
                                    />
                                }
                            </View>
                        </View>
                        {
                            error &&
                            <Text style={ styles.errorText }>
                                { error.message }
                            </Text>
                        }
                    </>
                }
            />
        </View>
    )
}

const styles = StyleSheet.create({
    inputContainer: {
        flexDirection: "column",
        gap: SEPARATOR_SIZES.lightSmall
    },
    formFieldContainer: {
        minHeight: hp(6),
        maxHeight: hp(6),
        flexDirection: "row",
        alignItems: "center",
        gap: hp(1.5),
        backgroundColor: theme.colors.gray4,
        paddingHorizontal: hp(1.5),
        borderRadius: 20,
        overflow: "hidden"
    },
    activeFormFieldContainer: {
        borderWidth: 1,
        borderColor: theme.colors.gray1
    },
    formFieldIconContainer: {
        flex: 0.2,
        alignItems: "center",
    },
    textInput: {
        flex: 1,
        color: theme.colors.gray1,
        // fontFamily: "Gilroy-Medium",
        fontSize: hp(2.25)
    },
    placeholderText: {
        color: theme.colors.gray2
    },
    errorText: {
        paddingLeft: hp(2),
        fontFamily: "Gilroy-Medium",
        fontSize: hp(1.85),
        letterSpacing: hp(1.85) * 0.05,
        color: theme.colors.redLight
    }
})

export default InputText;