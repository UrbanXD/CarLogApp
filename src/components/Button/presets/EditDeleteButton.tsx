import { StyleSheet, ViewStyle } from "react-native";
import { COLORS, DEFAULT_SEPARATOR, FONT_SIZES, ICON_NAMES, SEPARATOR_SIZES } from "../../../constants/index.ts";
import Button from "../Button.ts";
import React from "react";
import { DeleteButton } from "./DeleteButton.tsx";
import { useTranslation } from "react-i18next";

type EditDeleteButton = {
    deleteIcon?: string
    editText?: string
    onDeletePress?: () => void
    onEditPress?: () => void
    buttonContainerStyle?: ViewStyle
    deleteButtonStyle?: ViewStyle
    editButtonStyle?: ViewStyle
}

export function EditDeleteButton({
    deleteIcon = ICON_NAMES.trashCan,
    editText,
    onDeletePress,
    onEditPress,
    buttonContainerStyle,
    deleteButtonStyle,
    editButtonStyle
}: EditDeleteButton) {
    const { t } = useTranslation();

    return (
        <Button.Row style={ [styles.buttonContainer, buttonContainerStyle] }>
            {
                onDeletePress &&
               <DeleteButton
                  icon={ deleteIcon }
                  onPress={ onDeletePress }
                  style={ deleteButtonStyle }
               />
            }
            {
                onEditPress &&
               <Button.Text
                  text={ editText ?? t("form_button.edit") }
                  fontSize={ FONT_SIZES.p1 }
                  onPress={ onEditPress }
                  style={ [styles.editButton, editButtonStyle] }
               />
            }
        </Button.Row>
    );
}

const styles = StyleSheet.create({
    buttonContainer: {
        position: "absolute",
        bottom: 0,
        paddingTop: SEPARATOR_SIZES.small,
        paddingBottom: SEPARATOR_SIZES.lightSmall,
        justifyContent: "space-between",
        paddingHorizontal: DEFAULT_SEPARATOR,
        backgroundColor: COLORS.black2
    },
    editButton: {
        flex: 1
    }
});