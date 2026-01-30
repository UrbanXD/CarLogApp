import React from "react";
import { StyleSheet, Text } from "react-native";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import getContrastingColor from "../../utils/colors/getContrastingColor";
import Button from "../Button/Button.ts";
import { COLORS, ICON_NAMES } from "../../constants";
import { ViewStyle } from "../../types";
import { DebouncedPressable } from "../DebouncedPressable.tsx";

type AvatarTextProps = {
    label: string;
    avatarSize?: number;
    color?: string;
    backgroundColor?: string | null;
    borderColor?: string;
    style?: ViewStyle;
    onPress?: () => void;
    onPressBadge?: () => void;
}

function AvatarText({
    label,
    avatarSize,
    backgroundColor,
    color,
    borderColor,
    style,
    onPress,
    onPressBadge
}: AvatarTextProps) {
    const size = avatarSize ?? hp(5);
    const background = backgroundColor ?? COLORS.fuelYellow;
    const secondaryColor = getContrastingColor(background, COLORS.white, COLORS.black);
    const BORDER_WIDTH = hp(1);
    const styles =
        useStyles(
            borderColor ? size + BORDER_WIDTH : size,
            label.length,
            secondaryColor,
            background,
            borderColor,
            borderColor ? BORDER_WIDTH : 0
        );

    return (
        <DebouncedPressable
            style={ [styles.container, style] }
            onPress={ onPress }
            disabled={ !onPress }
            debounceMs={ 1000 }
        >
            {
                onPressBadge &&
               <Button.Icon
                  icon={ ICON_NAMES.add }
                  iconSize={ size / 6 }
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
        </DebouncedPressable>
    );
}

const useStyles = (
    avatarSize: number,
    labelLength: number,
    color: string,
    backgroundColor: string,
    borderColor?: string,
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