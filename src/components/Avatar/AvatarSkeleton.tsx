import React from "react";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { COLORS } from "../../constants/index.ts";
import getContrastingColor from "../../utils/colors/getContrastingColor.ts";
import { StyleSheet, View, ViewStyle } from "react-native";
import { Color } from "../../types/index.ts";

interface AvatarSkeletonProps {
    avatarSize?: number;
    color?: Color;
    backgroundColor?: Color;
    borderColor?: Color;
    style?: ViewStyle;
}

const AvatarSkeleton: React.FC<AvatarSkeletonProps> = ({
    avatarSize = hp(5),
    backgroundColor = COLORS.black5,
    color = getContrastingColor(backgroundColor, COLORS.white, COLORS.black),
    borderColor,
    style
}) => {
    const BORDER_WIDTH = hp(1);
    const styles = useStyles(
        borderColor ? avatarSize + BORDER_WIDTH : avatarSize,
        color,
        backgroundColor,
        borderColor,
        borderColor ? BORDER_WIDTH : 0
    );

    return (
        <View style={ [styles.container, style] }/>
    );
};

const useStyles = (
    avatarSize: number,
    color: Color,
    backgroundColor: Color,
    borderColor?: Color,
    borderWidth?: number
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
};

export default AvatarSkeleton;