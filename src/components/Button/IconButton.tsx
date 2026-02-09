import React, { useMemo } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import Icon from "../Icon";
import { COLORS, FONT_SIZES, ICON_FONT_SIZE_SCALE, SEPARATOR_SIZES } from "../../constants/index.ts";
import { Color, ImageSource, ViewStyle } from "../../types/index.ts";
import { debounce } from "es-toolkit";

type IconButtonProps = {
    icon: ImageSource
    iconSize?: number
    iconColor?: Color | null
    backgroundColor?: Color | null
    width?: number
    height?: number
    style?: ViewStyle
    inverse?: boolean
    disabled?: boolean
    debounceMs?: number
    onPress: () => void
}

export function IconButton({
    icon,
    iconSize = FONT_SIZES.p2 * ICON_FONT_SIZE_SCALE,
    iconColor,
    backgroundColor,
    width = FONT_SIZES.h3 * ICON_FONT_SIZE_SCALE + SEPARATOR_SIZES.lightSmall,
    height = FONT_SIZES.h3 * ICON_FONT_SIZE_SCALE + SEPARATOR_SIZES.lightSmall,
    style,
    inverse = false,
    disabled = false,
    debounceMs = 350,
    onPress
}: IconButtonProps) {
    const primaryColor = backgroundColor ?? COLORS.fuelYellow;
    const secondaryColor = iconColor ?? COLORS.black;

    const styles = useButtonStyles(
        !inverse ? primaryColor : secondaryColor,
        !inverse ? secondaryColor : primaryColor,
        width,
        height
    );

    const debouncedPress = useMemo(() => debounce(onPress, debounceMs), [onPress, debounceMs]);

    return (
        <TouchableOpacity
            onPress={ debouncedPress }
            disabled={ disabled }
            style={ [styles.buttonContainer, style] }
        >
            <Icon
                icon={ icon }
                size={ iconSize }
                color={ styles.buttonContainer.color }
            />
        </TouchableOpacity>
    );
}

export const useButtonStyles = (
    primaryColor: Color,
    secondaryColor: Color,
    width: number,
    height: number
) =>
    StyleSheet.create({
        buttonContainer: {
            alignSelf: "center",
            justifyContent: "center",
            alignItems: "center",
            width: width,
            height: height,
            backgroundColor: primaryColor,
            color: secondaryColor,
            borderRadius: height / 2
        }
    });

export default IconButton;