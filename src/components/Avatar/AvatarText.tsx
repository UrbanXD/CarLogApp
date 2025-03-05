import React from "react";
import { ColorValue, Text, StyleSheet, useWindowDimensions, TouchableOpacity, ViewStyle, StyleProp } from "react-native";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { theme } from "../../constants/theme";
import getContrastingColor from "../../utils/colors/getContrastingColor";

interface AvatarTextProps {
    label: string
    avatarSize?: number
    color?: ColorValue
    backgroundColor?: ColorValue | string
    borderColor?: ColorValue | string
    style?: StyleProp<ViewStyle>
    onPress?: () => void
}

const AvatarText: React.FC<AvatarTextProps> = ({
    label,
    avatarSize = hp(5),
    backgroundColor = theme.colors.fuelYellow,
    color = getContrastingColor(backgroundColor, theme.colors.white, theme.colors.black),
    borderColor,
    style,
    onPress,
}) => {
    const BORDER_WIDTH = hp(1);

    const styles =
        useStyles(
            borderColor ? avatarSize + BORDER_WIDTH : avatarSize,
            label.length,
            color,
            backgroundColor,
            borderColor,
            borderColor ? BORDER_WIDTH : undefined
        );

    return (
        <TouchableOpacity
            style={ [styles.container, style] }
            onPress={ onPress }
            disabled={ !onPress }
        >
            <Text
                style={ styles.labelText }
                numberOfLines={ 1 }
            >
                { label }
            </Text>
        </TouchableOpacity>
    )
}

const useStyles = (
    avatarSize: number,
    labelLength: number,
    color: ColorValue | string,
    backgroundColor: ColorValue | string,
    borderColor?: ColorValue | string,
    borderWidth?: number,
) => {
    return StyleSheet.create({
        container: {
            alignSelf: "center",
            justifyContent: "center",
            alignItems: "center",
            width: avatarSize,
            height: avatarSize,
            backgroundColor: backgroundColor,
            borderRadius: avatarSize / 2,
            borderWidth,
            borderColor,
        },
        labelText: {
            fontFamily: "Gilroy-Medium",
            fontSize: avatarSize / ( labelLength > 1 ? labelLength : labelLength + 0.5),
            color: color,
            lineHeight: avatarSize,
            textAlign: "center",
            textAlignVertical: "center",
        }
    })
}

export default AvatarText;