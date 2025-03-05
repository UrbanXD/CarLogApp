import React from "react";
import { TouchableOpacity, StyleSheet, ViewStyle, StyleProp, ColorValue, ImageSourcePropType } from "react-native";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { ICON_NAMES } from "../../constants/constants.ts";
import Button from "../Button/Button.ts";
import Image from "../Image.tsx";

interface AvatarImageProps {
    source: ImageSourcePropType | string
    avatarSize?: number
    borderColor?: ColorValue | string
    style?: StyleProp<ViewStyle>
    onPress?: () => void
    badgeIcon?: string | ImageSourcePropType
    onPressBadge?: () => void
}

const AvatarImage: React.FC<AvatarImageProps> = ({
    source,
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
            borderColor ? BORDER_WIDTH : undefined
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
                    icon={ ICON_NAMES.addImage }
                    iconSize={ avatarSize / 6 }
                    style={ styles.badge }
                    onPress={ onPressBadge }
                />
            }
            <Image
                source={ source }
                alt={ ICON_NAMES.user }
                imageStyle={ styles.image }
            />
        </TouchableOpacity>
    )
}

const useStyles = (
    avatarSize: number,
    borderColor?: ColorValue | string,
    borderWidth?: number
) => {
    return StyleSheet.create({
        container: {
            width: avatarSize,
            height: avatarSize,
        },
        image: {
            width: avatarSize,
            height: avatarSize,
            resizeMode: "cover",
            borderRadius: avatarSize / 2,
            borderWidth,
            borderColor,
        },
        badge: {
            position: "absolute",
            right: avatarSize / 12,
            bottom: avatarSize / 20,
            zIndex: 1,
        }
    })
}

export default AvatarImage;