import React from "react";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { Colors } from "../../constants/colors/index.ts";
import getContrastingColor from "../../utils/colors/getContrastingColor.ts";
import { ColorValue, StyleProp, StyleSheet, View, ViewStyle } from "react-native";

interface AvatarSkeletonProps {
    avatarSize?: number
    color?: ColorValue
    backgroundColor?: ColorValue | string
    borderColor?: ColorValue | string
    style?: StyleProp<ViewStyle>
}

const AvatarSkeleton: React.FC<AvatarSkeletonProps> = ({
    avatarSize = hp(5),
    backgroundColor = Colors.black5,
    color = getContrastingColor(backgroundColor, Colors.white, Colors.black),
    borderColor,
    style
}) => {
    const BORDER_WIDTH = hp(1);
    const styles =
        useStyles(
            borderColor ? avatarSize + BORDER_WIDTH : avatarSize,
            color,
            backgroundColor,
            borderColor,
            borderColor ? BORDER_WIDTH : 0
        );

    return (
        <View
            style={ [styles.container, style] }
        />
    )
}

const useStyles = (
    avatarSize: number,
    color: ColorValue | string,
    backgroundColor: ColorValue | string,
    borderColor?: ColorValue | string,
    borderWidth?: number,
) => {
    return StyleSheet.create({
        container: {
            justifyContent: "center",
            alignItems: "center",
            width: avatarSize,
            height: avatarSize,
            backgroundColor: backgroundColor,
            borderRadius: avatarSize / 2,
            borderWidth,
            borderColor
        }
    });
}

export default AvatarSkeleton;