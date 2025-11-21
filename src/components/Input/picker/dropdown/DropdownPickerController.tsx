import React from "react";
import { Pressable, StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";
import { PickerItemType } from "../PickerItem.tsx";
import { useAlert } from "../../../../ui/alert/hooks/useAlert.ts";
import { PickerDisabledToast } from "../../../../ui/alert/presets/toast/index.ts";
import { ICON_NAMES, SEPARATOR_SIZES } from "../../../../constants/index.ts";
import { formTheme } from "../../../../ui/form/constants/theme.ts";
import Icon from "../../../Icon.tsx";
import { IntelligentMarquee } from "../../../marquee/IntelligentMarquee.tsx";
import { useTranslation } from "react-i18next";

export type DropdownPickerControllerProps = {
    selectedItem: PickerItemType | null
    /** Callback when dropdown toggled */
    toggleDropdown: () => void
    /** The main icon shown in the controller input field */
    icon?: string
    /** Placeholder text displayed in the controller when no item is selected */
    inputPlaceholder?: string
    /** When true, the controller style change */
    error?: boolean
    /** When true, the dropdown is disabled and cannot be opened */
    disabled?: boolean
    /** Message shown in a toast when trying to open a disabled dropdown */
    disabledText?: string
    /** Hide controller background and paddings */
    hiddenBackground?: boolean
    /** Controller container style */
    containerStyle?: ViewStyle
    /** Controller display text style */
    textInputStyle?: TextStyle
}

const DropdownPickerController: React.FC<DropdownPickerControllerProps> = ({
    selectedItem,
    toggleDropdown,
    icon,
    inputPlaceholder,
    error,
    disabled,
    disabledText,
    hiddenBackground,
    containerStyle,
    textInputStyle
}) => {
    const { t } = useTranslation();
    const { openToast } = useAlert();

    const onPress = () => {
        if(disabled) return openToast(PickerDisabledToast.warning(disabledText));

        toggleDropdown();
    };

    return (
        <Pressable
            onPress={ onPress }
            style={ [
                styles.container,
                !hiddenBackground && styles.backgroundContainer,
                error && styles.errorFormFieldContainer,
                containerStyle
            ] }
            pointerEvents={ "box-only" }
        >
            {
                icon &&
               <View style={ styles.formFieldIconContainer }>
                  <Icon
                     icon={ icon }
                     size={ formTheme.iconSize }
                     color={ textInputStyle?.color ?? formTheme.iconColor }
                  />
               </View>
            }
            <View style={ styles.textContainer }>
                {
                    selectedItem
                    ?
                    <>
                        <IntelligentMarquee
                            speed={ 0.65 }
                            delay={ 800 }
                            bounceDelay={ 800 }
                            spacing={ SEPARATOR_SIZES.lightSmall }
                        >
                            <Text style={ [styles.titleText, textInputStyle] } numberOfLines={ 1 }>
                                { selectedItem?.controllerTitle ?? selectedItem?.title ?? "" }
                            </Text>
                        </IntelligentMarquee>
                        {
                            selectedItem.subtitle &&
                           <IntelligentMarquee
                              speed={ 0.65 }
                              delay={ 800 }
                              bounceDelay={ 800 }
                              spacing={ SEPARATOR_SIZES.lightSmall }
                           >
                              <Text style={ styles.subtitleText } numberOfLines={ 1 }>
                                  { selectedItem.subtitle }
                              </Text>
                           </IntelligentMarquee>
                        }
                    </>
                    : <Text style={ [styles.titleText, styles.placeholderText] }>{ inputPlaceholder ?? t(
                        "form.picker.choose") }</Text>
                }
            </View>
            <View style={ styles.formFieldIconContainer }>
                <Icon
                    icon={ ICON_NAMES.downArrowHead }
                    size={ formTheme.iconSize }
                    color={ textInputStyle?.color ?? formTheme.iconColor }
                />
            </View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    container: {
        minHeight: formTheme.containerHeight,
        maxHeight: formTheme.containerHeight,
        flexDirection: "row",
        alignItems: "center",
        gap: SEPARATOR_SIZES.lightSmall / 2,
        overflow: "hidden"
    },
    backgroundContainer: {
        backgroundColor: formTheme.containerBackgroundColor,
        paddingHorizontal: formTheme.containerPaddingHorizontal,
        borderRadius: formTheme.borderRadius,
        borderWidth: 1,
        borderColor: formTheme.borderColor
    },
    errorFormFieldContainer: {
        borderColor: formTheme.errorColor
    },
    formFieldIconContainer: {
        alignItems: "center"
    },
    textContainer: {
        flexGrow: 1,
        flexShrink: 1,
        minWidth: 15,
        gap: SEPARATOR_SIZES.lightSmall / 2,
        justifyContent: "center"
    },
    titleText: {
        color: formTheme.valueTextColor,
        fontSize: formTheme.valueTextFontSize,
        lineHeight: formTheme.valueTextFontSize
    },
    subtitleText: {
        color: formTheme.placeHolderColor,
        fontSize: formTheme.valueTextFontSize * 0.85,
        lineHeight: formTheme.valueTextFontSize * 0.85
    },
    placeholderText: {
        color: formTheme.placeHolderColor
    }
});

export default DropdownPickerController;