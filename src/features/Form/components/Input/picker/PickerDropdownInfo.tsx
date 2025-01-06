import React, { useEffect, useState } from "react";
import { GLOBAL_STYLE, ICON_NAMES, SEPARATOR_SIZES } from "../../../../Shared/constants/constants";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import TextInput from "../text/TextInput";
import { theme } from "../../../../Shared/constants/theme";
import Icon from "../../../../Shared/components/Icon";
import {useAlert} from "../../../../Alert/context/AlertProvider";
import pickerDisabledToast from "../../../../Alert/layouts/toast/pickerDisabledToast";

interface PickerDropdownInfoProps {
    toggleDropdown?: () => void
    icon?: string
    title?: string
    subtitle?: string
    placeholder?: string
    error?: string
    isHorizontal: boolean
    disabled: boolean,
    disabledText?: string
}

export const PickerDropdownInfo: React.FC<PickerDropdownInfoProps> = ({
    toggleDropdown,
    icon,
    title,
    subtitle,
    placeholder,
    isHorizontal,
    disabled,
    disabledText,
}) => {
    const { addToast } = useAlert();

    const openWarning = () =>
        addToast(pickerDisabledToast.warning(disabledText));

    return (
        <TouchableOpacity
            style={ styles.container }
            onPress={ !disabled ? toggleDropdown : openWarning }
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
    disabled,
    disabledText
}) => {
    const { addToast } = useAlert();

    const openWarning = () =>
        addToast({
            type: "warning",
            body: disabledText,
            duration: 200
        });

    return (
        <TouchableOpacity
            style={ styles.container }
            onPress={ !disabled ? toggleDropdown : openWarning }
        >
            <View style={ GLOBAL_STYLE.formContainer }>
                <TextInput
                    value={ title }
                    isEditable={ false }
                    icon={ icon }
                    actionIcon={ isHorizontal ? ICON_NAMES.rightArrowHead : ICON_NAMES.downArrowHead }
                    placeholder={ placeholder }
                    error={ error }
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