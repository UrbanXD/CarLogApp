import React, { useState } from "react";
import { StyleSheet, Text, View, TextInput as TextInputRN } from "react-native";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { ICON_COLORS, ICON_NAMES } from "../../../constants/constants";
import { theme } from "../../../constants/theme";
import Icon from "../../shared/Icon";

interface TextInputProps {
    value?: string
    setValue?: (text: string) => void
    icon?: string
    actionIcon?: string
    onAction?: () => void
    placeholder?: string
    error?: string
    numeric?: boolean
    isSecure?: boolean
    isEditable?: boolean
    isPickerHeader?: boolean
}

const TextInput: React.FC<TextInputProps> = ({
    value,
    setValue,
    icon,
    actionIcon,
    onAction,
    placeholder,
    error,
    numeric,
    isSecure,
    isEditable = true,
    isPickerHeader
}) => {
    const [focused, setFocused] = useState(false);
    const [secure, setSecure] = useState(isSecure);

    const changeSecure = () => setSecure(!secure);
    const onFocus = () => setFocused(true);
    const onBlur = () => setFocused(false);

    return (
        <>
            <View style={ [(isEditable || isPickerHeader) && styles.formFieldContainer, focused && isEditable && styles.activeFormFieldContainer] }>
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
                    value={ value }
                    keyboardType={ numeric ? "numeric" : "default" }
                    secureTextEntry={ secure }
                    onChangeText={ setValue }
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
            {
                error &&
                <Text style={ styles.errorText }>
                    { error }
                </Text>
            }
        </>
    )
}

const styles = StyleSheet.create({
    formFieldContainer: {
        minHeight: hp(6),
        maxHeight: hp(6),
        flexDirection: "row",
        alignItems: "center",
        gap: hp(1.5),
        backgroundColor: theme.colors.gray5,
        paddingHorizontal: hp(1.5),
        borderRadius: 20,
        overflow: "hidden"
    },
    activeFormFieldContainer: {
        borderWidth: 1,
        borderColor: theme.colors.gray1
    },
    formFieldIconContainer: {
        flex: 0.15,
        alignItems: "center",
    },
    textInput: {
        flex: 1,
        color: theme.colors.gray1,
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

export default TextInput;