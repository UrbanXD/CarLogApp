import React from "react";
import { StyleSheet, TouchableOpacity, ViewStyle } from "react-native";
import Icon from "../Icon";
import { COLORS, FONT_SIZES, ICON_FONT_SIZE_SCALE, SEPARATOR_SIZES } from "../../constants/index.ts";
import { Color, ImageSource } from "../../types/index.ts";

interface IconButtonProps {
    icon: ImageSource
    iconSize?: number
    iconColor?: Color
    backgroundColor?: Color
    width?: number
    height?: number
    style?: ViewStyle
    inverse?: boolean
    disabled?: boolean
    onPress: () => void
}

export const IconButton: React.FC<IconButtonProps> = ({
    icon,
    iconSize = FONT_SIZES.p1 * ICON_FONT_SIZE_SCALE,
    iconColor = COLORS.black,
    backgroundColor = COLORS.fuelYellow,
    width = iconSize * 1.5,
    height = iconSize * 1.5,
    style,
    inverse = false,
    disabled = false,
    onPress
}) => {
    const styles = useButtonStyles(
        !inverse ? backgroundColor : iconColor,
        !inverse ? iconColor : backgroundColor,
        width,
        height
    );

    return (
        <TouchableOpacity
            onPress={ onPress }
            disabled={ disabled }
            style={ [styles.buttonContainer, style] }
        >
            <Icon
                icon={ icon }
                size={ iconSize }
                color={ styles.buttonContainer.color }
            />
        </TouchableOpacity>
    )
}

export const useButtonStyles = (
    primaryColor: Color,
    secondaryColor: Color,
    width: number,
    height: number,
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
            borderRadius: height / 2,
        }
    })

export default IconButton;