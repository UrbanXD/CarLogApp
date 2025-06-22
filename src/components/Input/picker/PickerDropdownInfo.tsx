import React from "react";
import { COLORS, GLOBAL_STYLE, ICON_NAMES, SEPARATOR_SIZES } from "../../../constants/index.ts";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Icon from "../../Icon.tsx";
import { PickerDisabledToast } from "../../../ui/alert/presets/toast/index.ts";
import { useAlert } from "../../../ui/alert/hooks/useAlert.ts";
import Input from "../Input.ts";

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
    disabledText
}) => {
    const { openToast } = useAlert();

    const openWarning = () =>
        openToast(PickerDisabledToast.warning(disabledText));

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
                  color={ COLORS.white }
               />
            }
            <View>
                <Text style={ styles.titleText } numberOfLines={ 1 }>
                    { title ? title : placeholder }
                </Text>
                {
                    subtitle &&
                   <Text style={ styles.subtitleText } numberOfLines={ 1 }>
                       { subtitle }
                   </Text>
                }
            </View>
            <Icon
                icon={ isHorizontal ? ICON_NAMES.rightArrowHead : ICON_NAMES.downArrowHead }
                size={ styles.titleText.fontSize * 2 }
                color={ COLORS.white }
                // style={ { marginLeft: -styles.titleText.fontSize + SEPARATOR_SIZES.lightSmall } }
            />
        </TouchableOpacity>
    );
};

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
    const { openToast } = useAlert();

    const openWarning = () =>
        openToast(PickerDisabledToast.warning(disabledText));

    return (
        <TouchableOpacity
            style={ styles.container }
            onPress={ !disabled ? toggleDropdown : openWarning }
        >
            <View style={ GLOBAL_STYLE.formContainer }>
                <Input.Text
                    value={ title }
                    placeholder={ placeholder }
                    icon={ icon }
                    actionIcon={ isHorizontal ? ICON_NAMES.rightArrowHead : ICON_NAMES.downArrowHead }
                    isEditable={ false }
                    // error />
                />
            </View>
        </TouchableOpacity>
    );
};

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
});