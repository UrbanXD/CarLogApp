import React, { useMemo } from "react";
import { StyleSheet, TouchableOpacity, ViewStyle } from "react-native";
import Icon from "../Icon";
import { COLORS, FONT_SIZES, ICON_FONT_SIZE_SCALE, SEPARATOR_SIZES } from "../../constants/index.ts";
import { Color, ImageSource } from "../../types/index.ts";
import { debounce } from "es-toolkit";

interface IconButtonProps {
    icon: ImageSource;
    iconSize?: number;
    iconColor?: Color;
    backgroundColor?: Color;
    width?: number;
    height?: number;
    style?: ViewStyle;
    inverse?: boolean;
    disabled?: boolean;
    debounceMs?: number;
    onPress: () => void;
}

export const IconButton: React.FC<IconButtonProps> = ({
    icon,
    iconSize = FONT_SIZES.p1 * ICON_FONT_SIZE_SCALE,
    iconColor = COLORS.black,
    backgroundColor = COLORS.fuelYellow,
    width = FONT_SIZES.h3 * ICON_FONT_SIZE_SCALE + SEPARATOR_SIZES.lightSmall / 2,
    height = FONT_SIZES.h3 * ICON_FONT_SIZE_SCALE + SEPARATOR_SIZES.lightSmall / 2,
    style,
    inverse = false,
    disabled = false,
    debounceMs = 350,
    onPress
}) => {
    const styles = useButtonStyles(
        !inverse ? backgroundColor : iconColor,
        !inverse ? iconColor : backgroundColor,
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
};

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