import React from "react";
import { ColorValue, ImageSourcePropType, StyleProp, StyleSheet, TouchableOpacity, ViewStyle } from "react-native";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { theme } from "../../constants/theme";
import Icon from "../Icon";
import { FONT_SIZES, ICON_FONT_SIZE_SCALE, SEPARATOR_SIZES } from "../../constants/constants";

interface IconButtonProps {
    icon: ImageSourcePropType | string
    iconSize?: number
    iconColor?: ColorValue
    backgroundColor?: ColorValue
    width?: number
    height?: number
    style?: StyleProp<ViewStyle>
    inverse?: boolean
    disabled?: boolean
    onPress: () => void
}

export const IconButton: React.FC<IconButtonProps> = ({
    icon,
    iconSize = FONT_SIZES.p1 * ICON_FONT_SIZE_SCALE,
    iconColor = theme.colors.black,
    backgroundColor = theme.colors.fuelYellow,
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
    primaryColor: ColorValue,
    secondaryColor: ColorValue,
    width: number | undefined ,
    height: number,
) =>
    StyleSheet.create({
        buttonContainer: {
            flexDirection: "row",
            alignSelf: "center",
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: width ? 0 : SEPARATOR_SIZES.small,
            width: width ?? "100%",
            height: height,
            backgroundColor: primaryColor,
            color: secondaryColor,
            borderRadius: height / 2,
        }
    })

export default IconButton;