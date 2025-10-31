import React from "react";
import { Pressable, StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";
import { PickerItemType } from "../PickerItem.tsx";
import { useAlert } from "../../../../ui/alert/hooks/useAlert.ts";
import { PickerDisabledToast } from "../../../../ui/alert/presets/toast/index.ts";
import { ICON_NAMES, SEPARATOR_SIZES } from "../../../../constants/index.ts";
import { formTheme } from "../../../../ui/form/constants/theme.ts";
import Icon from "../../../Icon.tsx";

export type DropdownPickerControllerProps = {
    selectedItem: PickerItemType | null
    /** Callback when dropdown toggled */
    toggleDropdown: () => void
    /** The main icon shown in the controller input field */
    icon?: string
    /** Placeholder text displayed in the controller when no item is selected */
    inputPlaceholder?: string
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
    inputPlaceholder = "Válasszon a listából",
    disabled,
    disabledText,
    hiddenBackground,
    containerStyle,
    textInputStyle
}) => {
    const { openToast } = useAlert();

    const onPress = () => {
        if(disabled) return openToast(PickerDisabledToast.warning(disabledText));

        toggleDropdown();
    };

    return (
        <Pressable
            onPress={ onPress }
            style={ [styles.container, !hiddenBackground && styles.backgroundContainer, containerStyle] }
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
                        <Text style={ [styles.titleText, textInputStyle] } numberOfLines={ 1 }>
                            { selectedItem?.controllerTitle ?? selectedItem?.title ?? "" }
                        </Text>
                        {
                            selectedItem.subtitle &&
                           <Text style={ styles.subtitleText } numberOfLines={ 1 }>
                               { selectedItem.subtitle }
                           </Text>
                        }
                    </>
                    : <Text style={ [styles.titleText, styles.placeholderText] }>{ inputPlaceholder }</Text>
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
        // width: formTheme.iconSize,
        alignItems: "center"
    },
    textContainer: {
        flexGrow: 1,
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