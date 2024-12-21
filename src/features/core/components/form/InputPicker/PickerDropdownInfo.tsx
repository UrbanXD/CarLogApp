import React, { useEffect, useState } from "react";
import { GLOBAL_STYLE, ICON_NAMES, SEPARATOR_SIZES } from "../../../constants/constants";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import TextInput from "../InputText/TextInput";
import { theme } from "../../../constants/theme";
import Icon from "../../shared/Icon";

interface PickerDropdownInfoProps {
    toggleDropdown?: () => void
    icon?: string
    title?: string
    subtitle?: string
    placeholder?: string
    error?: string
    isHorizontal: boolean
    disabled: boolean
}

export const PickerDropdownInfo: React.FC<PickerDropdownInfoProps> = ({
    toggleDropdown,
    icon,
    title,
    subtitle,
    placeholder,
    isHorizontal,
    disabled
}) => {
    return (
        <TouchableOpacity
            style={ styles.container }
            onPress={ !disabled ? toggleDropdown : () => {} }
        >
            {
                icon &&
                <Icon
                    icon={ icon }
                    size={ styles.titleText.fontSize * 2 }
                    color={ theme.colors.white }
                />
            }
            <View>
                <Text style={ styles.titleText } numberOfLines={ 1 } >
                    { title ? title : placeholder }
                </Text>
                {
                    subtitle &&
                    <Text style={ styles.subtitleText } numberOfLines={ 1 } >
                        { subtitle }
                    </Text>
                }
            </View>
            <Icon
                icon={ isHorizontal ? ICON_NAMES.rightArrowHead : ICON_NAMES.downArrowHead }
                size={ styles.titleText.fontSize * 2 }
                color={ theme.colors.white }
                // style={ { marginLeft: -styles.titleText.fontSize + SEPARATOR_SIZES.lightSmall } }
            />
        </TouchableOpacity>
    )
}

export const InputPickerDropdownInfo: React.FC<PickerDropdownInfoProps> = ({
    toggleDropdown,
    icon,
    title,
    placeholder,
    error,
    isHorizontal,
    disabled
}) => {
    const [pickerError, setPickerError] = useState<string | undefined>();

    useEffect(() => {
        if(!disabled) setPickerError(undefined)
    }, [disabled]);

    return (
        <TouchableOpacity
            style={ styles.container }
            onPress={ !disabled ? toggleDropdown : () => { setPickerError("xd") } }
        >
            <View style={ GLOBAL_STYLE.formContainer }>
                <TextInput
                    value={ title }
                    isEditable={ false }
                    icon={ icon }
                    actionIcon={ isHorizontal ? ICON_NAMES.rightArrowHead : ICON_NAMES.downArrowHead }
                    placeholder={ placeholder }
                    error={ error || pickerError }
                    isPickerHeader
                />
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        gap: SEPARATOR_SIZES.lightSmall
    },
    titleText: {
        ...GLOBAL_STYLE.containerTitleText,
        fontSize: GLOBAL_STYLE.containerTitleText.fontSize * 0.7,
        letterSpacing: GLOBAL_STYLE.containerTitleText.letterSpacing * 0.7,
        textAlign: "center"
    },
    subtitleText: {
        ...GLOBAL_STYLE.containerText,
        fontSize: GLOBAL_STYLE.containerText.fontSize * 0.8,
        letterSpacing: GLOBAL_STYLE.containerText.letterSpacing * 0.8,
        textAlign: "center"
    }
})