import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { ICON_NAMES } from "../../constants/index.ts";
import Button from "../Button/Button.ts";
import Image from "../Image.tsx";
import { Color, ImageSource, ViewStyle } from "../../types/index.ts";

interface AvatarImageProps {
    path: string;
    avatarSize?: number;
    borderColor?: Color;
    style?: ViewStyle;
    onPress?: () => void;
    badgeIcon?: ImageSource;
    onPressBadge?: () => void;
}

const AvatarImage: React.FC<AvatarImageProps> = ({
    path,
    avatarSize = hp(5),
    borderColor,
    style,
    onPress,
    onPressBadge
}) => {
    const BORDER_WIDTH = hp(1);
    const styles =
        useStyles(
            borderColor ? avatarSize + BORDER_WIDTH : avatarSize,
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
                  icon={ ICON_NAMES.swap }
                  iconSize={ avatarSize / 6 }
                  style={ styles.badge }
                  onPress={ onPressBadge }
               />
            }
            <Image
                path={ path }
                alt={ ICON_NAMES.user }
                imageStyle={ styles.image }
            />
        </TouchableOpacity>
    );
};

const useStyles = (
    avatarSize: number,
    borderColor?: Color,
    borderWidth?: number
) => {
    return StyleSheet.create({
        container: {
            width: avatarSize,
            height: avatarSize
        },
        image: {
            width: avatarSize,
            height: avatarSize,
            resizeMode: "stretch",
            borderRadius: avatarSize / 2,
            borderWidth,
            borderColor
        },
        badge: {
            position: "absolute",
            width: avatarSize / 5,
            height: avatarSize / 5,
            right: avatarSize / 12,
            bottom: avatarSize / 20,
            zIndex: 1
        }
    });
};

export default AvatarImage;