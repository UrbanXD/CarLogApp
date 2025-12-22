import React from "react";
import { StyleSheet, Text, TouchableOpacity, ViewStyle } from "react-native";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import getContrastingColor from "../../utils/colors/getContrastingColor";
import Button from "../Button/Button.ts";
import { COLORS, ICON_NAMES } from "../../constants/index.ts";
import { Color } from "../../types/index.ts";

interface AvatarTextProps {
    label: string;
    avatarSize?: number;
    color?: Color;
    backgroundColor?: Color;
    borderColor?: Color;
    style?: ViewStyle;
    onPress?: () => void;
    onPressBadge?: () => void;
}

const AvatarText: React.FC<AvatarTextProps> = ({
    label,
    avatarSize = hp(5),
    backgroundColor = COLORS.fuelYellow,
    color = getContrastingColor(backgroundColor, COLORS.white, COLORS.black),
    borderColor,
    style,
    onPress,
    onPressBadge
}) => {
    const BORDER_WIDTH = hp(1);
    const styles =
        useStyles(
            borderColor ? avatarSize + BORDER_WIDTH : avatarSize,
            label.length,
            color,
            backgroundColor,
            borderColor,
            borderColor ? BORDER_WIDTH : 0
        );

    return (
        <TouchableOpacity
            style={ [styles.container, style] }
            onPress={ onPress }
            disabled={ !onPress }
        >
            {
                onPressBadge &&
               <Button.Icon
                  icon={ ICON_NAMES.add }
                  iconSize={ avatarSize / 6 }
                  style={ styles.badge }
                  backgroundColor={ color }
                  iconColor={ backgroundColor }
                  onPress={ onPressBadge }
               />
            }
            <Text
                style={ styles.labelText }
                numberOfLines={ 1 }
            >
                { label }
            </Text>
        </TouchableOpacity>
    );
};

const useStyles = (
    avatarSize: number,
    labelLength: number,
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
        },
        badge: {
            position: "absolute",
            width: avatarSize / 5,
            height: avatarSize / 5,
            right: 0,
            bottom: avatarSize / 20,
            zIndex: 1,
            elevation: 2.5,
            shadowColor: COLORS.gray2
        },
        labelText: {
            fontFamily: "Gilroy-Medium",
            fontSize: avatarSize / (labelLength > 1 ? labelLength : labelLength + 0.5),
            color: color,
            textAlign: "center"
        }
    });
};

export default AvatarText;