import React from "react";
import { ColorValue, View, Text, StyleSheet, useWindowDimensions, TouchableOpacity } from "react-native";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { theme } from "../../../constants/theme";
import getContrastingColor from "../../../utils/colors/getContrastingColor";

interface AvatarTextProps {
    label: string
    avatarSize?: number
    color?: ColorValue
    backgroundColor?: ColorValue | string
    onPress?: () => void
}

const AvatarText: React.FC<AvatarTextProps> = ({
    label,
    avatarSize = hp(5),
    backgroundColor = theme.colors.fuelYellow,
    color = getContrastingColor(backgroundColor, theme.colors.white, theme.colors.black),
    onPress,
}) => {
    const { fontScale } = useWindowDimensions();

    const styles = useStyles(avatarSize, color, backgroundColor, fontScale);

    return (
        <TouchableOpacity
            style={ styles.container }
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

const useStyles = (avatarSize: number, color: ColorValue | string, backgroundColor: ColorValue | string, fontScale: number) => {
    return StyleSheet.create({
        container: {
            justifyContent: "center",
            alignItems: "center",
            width: avatarSize,
            height: avatarSize,
            backgroundColor: backgroundColor,
            borderRadius: avatarSize / 2,
        },
        labelText: {
            fontSize: avatarSize / 2,
            color: color,
            lineHeight: avatarSize / fontScale,
            textAlign: 'center',
            textAlignVertical: 'center',
        }
    })
}

export default AvatarText;