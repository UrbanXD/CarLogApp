import { COLORS, FONT_SIZES, ICON_FONT_SIZE_SCALE, ICON_NAMES, SEPARATOR_SIZES } from "../../../constants/index.ts";
import Button from "../Button.ts";
import React from "react";
import { ViewStyle } from "react-native";

export type DeleteButtonProps = {
    icon?: string
    onPress: () => void
    style?: ViewStyle
}

export function DeleteButton({ icon = ICON_NAMES.trashCan, onPress, style }: DeleteButtonProps) {
    return (
        <Button.Icon
            icon={ icon }
            iconSize={ FONT_SIZES.p2 * ICON_FONT_SIZE_SCALE }
            backgroundColor={ COLORS.googleRed }
            iconColor={ COLORS.black }
            height={ FONT_SIZES.p2 * ICON_FONT_SIZE_SCALE + 2 * SEPARATOR_SIZES.lightSmall }
            width={ FONT_SIZES.p2 * ICON_FONT_SIZE_SCALE + 2 * SEPARATOR_SIZES.lightSmall }
            onPress={ onPress }
            style={ style }
        />
    );
}