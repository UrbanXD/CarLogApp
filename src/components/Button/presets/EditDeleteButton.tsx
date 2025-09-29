import { StyleSheet, ViewStyle } from "react-native";
import {
    COLORS,
    DEFAULT_SEPARATOR,
    FONT_SIZES,
    ICON_FONT_SIZE_SCALE,
    ICON_NAMES,
    SEPARATOR_SIZES
} from "../../../constants/index.ts";
import Button from "../Button.ts";
import React from "react";

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
    editText = "Módosítás",
    onDeletePress,
    onEditPress,
    buttonContainerStyle,
    deleteButtonStyle,
    editButtonStyle
}: EditDeleteButton) {
    return (
        <Button.Row style={ [styles.buttonContainer, buttonContainerStyle] }>
            {
                onDeletePress &&
               <Button.Icon
                  icon={ deleteIcon }
                  iconSize={ FONT_SIZES.p2 * ICON_FONT_SIZE_SCALE }
                  backgroundColor={ COLORS.googleRed }
                  iconColor={ COLORS.black }
                  height={ FONT_SIZES.p2 * ICON_FONT_SIZE_SCALE + 2 * SEPARATOR_SIZES.lightSmall }
                  width={ FONT_SIZES.p2 * ICON_FONT_SIZE_SCALE + 2 * SEPARATOR_SIZES.lightSmall }
                  onPress={ onDeletePress }
                  style={ deleteButtonStyle }
               />
            }
            {
                onEditPress &&
               <Button.Text
                  text={ editText }
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